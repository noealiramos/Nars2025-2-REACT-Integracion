import Order from '../models/order.js';
import Product from '../models/product.js';
import ShippingAddress from '../models/shippingAddress.js';
import PaymentMethod from '../models/paymentMethod.js';
import Cart from '../models/cart.js';                 // necesario para checkout desde carrito

import { getPagination } from '../utils/pagination.js';

// GET paginado de todas las órdenes (admin)
async function getOrders(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req, 10);

    // Filtros opcionales por query: ?status=pending&paymentStatus=paid
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

    // Ordenamiento opcional: ?sort=createdAt|status|paymentStatus&order=asc|desc
    const sortField = req.query.sort || 'status';
    const sortOrder = (req.query.order || 'asc').toLowerCase() === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    const [orders, totalResults] = await Promise.all([
      Order.find(filter)
        .populate('user')
        .populate('products.productId')
        .populate('shippingAddress')
        .populate('paymentMethod')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalResults / limit);

    return res.status(200).json({
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    });
  } catch (error) {
    return next(error);
  }
}

// GET orden por ID (owner o admin)
async function getOrderById(req, res, next) {
  try {
    const id = req.params.id;
    const order = await Order.findById(id)
      .populate('user')
      .populate('products.productId')
      .populate('shippingAddress')
      .populate('paymentMethod')
      .lean();

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    const authUserId = req.user?.id || req.user?.userId;
    const isAdmin = req.user?.role === 'admin';
    const sameUser = String(order.user) === String(authUserId);
    if (!isAdmin && !sameUser) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(order);
  } catch (error) {
    return next(error);
  }
}

// GET paginado de órdenes por usuario
async function getOrdersByUser(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req, 10);
    const userId = req.params.userId;

    const filter = { user: userId };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

    const sortField = req.query.sort || 'status';
    const sortOrder = (req.query.order || 'asc').toLowerCase() === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    const [orders, totalResults] = await Promise.all([
      Order.find(filter)
        .populate('user')
        .populate('products.productId')
        .populate('shippingAddress')
        .populate('paymentMethod')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalResults / limit);

    return res.status(200).json({
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /orders
 * Crear orden tomando precios reales desde Product (ignora price del cliente).
 * products: [{ productId, quantity }]
 */
async function createOrder(req, res, next) {
  try {
    const {
      user: bodyUser,
      products,            // [{ productId, quantity }]
      shippingAddress,
      paymentMethod,
      shippingCost = 0
    } = req.body ?? {};

    const authUserId = req.user?.id || req.user?.userId;
    const isAdmin = req.user?.role === 'admin';
    const user = bodyUser || authUserId;

    if (bodyUser && !isAdmin && String(bodyUser) !== String(authUserId)) {
      return res.status(403).json({ error: 'Forbidden: cannot create order on behalf of another user' });
    }

    if (!user || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'User and products array are required' });
    }
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ error: 'Shipping address and payment method are required' });
    }

    // Validar pertenencia de shippingAddress y paymentMethod
    const [addrDoc, pmDoc] = await Promise.all([
      ShippingAddress.findById(shippingAddress).lean(),
      PaymentMethod.findById(paymentMethod).lean(),
    ]);
    if (!addrDoc) return res.status(404).json({ error: 'Shipping address not found' });
    if (!pmDoc) return res.status(404).json({ error: 'Payment method not found' });

    const sameUserAddr = String(addrDoc.user) === String(user);
    const sameUserPM = String(pmDoc.user) === String(user);
    if (!isAdmin && !sameUserAddr) {
      return res.status(403).json({ error: 'Forbidden: shippingAddress not owned by user' });
    }
    if (!isAdmin && !sameUserPM) {
      return res.status(403).json({ error: 'Forbidden: paymentMethod not owned by user' });
    }
    if (pmDoc.active === false) {
      return res.status(400).json({ error: 'Payment method is inactive' });
    }

    // Tomar precios desde Product
    const ids = [...new Set(products.map(p => String(p.productId)))];
    const productDocs = await Product.find({ _id: { $in: ids } }).lean();
    const map = new Map(productDocs.map(p => [String(p._id), p]));

    const normalizedItems = [];
    for (const item of products) {
      const p = map.get(String(item.productId));
      if (!p) return res.status(400).json({ error: `Product not found: ${item.productId}` });

      const qty = Number(item.quantity ?? 0);
      if (!Number.isFinite(qty) || qty < 1) {
        return res.status(400).json({ error: `Invalid quantity for product ${item.productId}` });
      }

      const unitPrice = Number(p.price ?? NaN);
      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        return res.status(400).json({ error: `Invalid product price in DB: ${item.productId}` });
      }

      normalizedItems.push({
        productId: p._id,
        quantity: qty,
        price: unitPrice,
      });
    }

    const shipping = Number(shippingCost);
    if (!Number.isFinite(shipping) || shipping < 0) {
      return res.status(400).json({ error: 'shippingCost must be a non-negative number' });
    }
    const subtotal = normalizedItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
    const totalPrice = subtotal + shipping;

    const newOrder = await Order.create({
      user,
      products: normalizedItems,
      shippingAddress,
      paymentMethod,
      shippingCost: shipping,
      totalPrice,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await newOrder.populate('user');
    await newOrder.populate('products.productId');
    await newOrder.populate('shippingAddress');
    await newOrder.populate('paymentMethod');

    return res.status(201).json(newOrder);
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /orders/checkout
 * Crea una orden usando el carrito del usuario autenticado.
 * - Valida pertenencia de shippingAddress y paymentMethod
 * - Toma precios desde Product
 * - Verifica y descuenta stock (con rollback simple si falla algún item)
 * - Vacía el carrito
 */
async function checkoutFromCart(req, res, next) {
  try {
    const authUserId = req.user?.id || req.user?.userId;
    const isAdmin = req.user?.role === 'admin';
    const { shippingAddress, paymentMethod, shippingCost = 0 } = req.body || {};

    if (!authUserId) return res.status(401).json({ error: 'Unauthorized' });
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ error: 'shippingAddress and paymentMethod are required' });
    }

    // Validar pertenencia de dirección y método de pago
    const [addrDoc, pmDoc] = await Promise.all([
      ShippingAddress.findById(shippingAddress).lean(),
      PaymentMethod.findById(paymentMethod).lean(),
    ]);
    if (!addrDoc) return res.status(404).json({ error: 'Shipping address not found' });
    if (!pmDoc) return res.status(404).json({ error: 'Payment method not found' });

    const sameUserAddr = String(addrDoc.user) === String(authUserId);
    const sameUserPM = String(pmDoc.user) === String(authUserId);
    if (!isAdmin && !sameUserAddr) {
      return res.status(403).json({ error: 'Forbidden: shippingAddress not owned by user' });
    }
    if (!isAdmin && !sameUserPM) {
      return res.status(403).json({ error: 'Forbidden: paymentMethod not owned by user' });
    }
    if (pmDoc.active === false) {
      return res.status(400).json({ error: 'Payment method is inactive' });
    }

    // Leer carrito
    const cart = await Cart.findOne({ user: authUserId }).lean();
    if (!cart || !Array.isArray(cart.products) || cart.products.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Cargar productos y validar
    const ids = [...new Set(cart.products.map(p => String(p.product)))];
    const productDocs = await Product.find({ _id: { $in: ids } }).lean();
    const map = new Map(productDocs.map(p => [String(p._id), p]));

    const normalizedItems = [];
    for (const item of cart.products) {
      const p = map.get(String(item.product));
      if (!p) return res.status(400).json({ error: `Product not found: ${item.product}` });

      const qty = Number(item.quantity ?? 0);
      if (!Number.isFinite(qty) || qty < 1) {
        return res.status(400).json({ error: `Invalid quantity for product ${item.product}` });
      }
      if (p.stock < qty) {
        return res.status(400).json({ error: `Insufficient stock for product ${p._id}` });
      }

      const unitPrice = Number(p.price ?? NaN);
      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        return res.status(400).json({ error: `Invalid product price in DB: ${p._id}` });
      }

      normalizedItems.push({
        productId: p._id,
        quantity: qty,
        price: unitPrice,
      });
    }

    const shipping = Number(shippingCost);
    if (!Number.isFinite(shipping) || shipping < 0) {
      return res.status(400).json({ error: 'shippingCost must be a non-negative number' });
    }
    const subtotal = normalizedItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
    const totalPrice = subtotal + shipping;

    // Descontar stock con control/rollback simple (sin transacciones)
    const decremented = [];
    for (const it of normalizedItems) {
      const updated = await Product.findOneAndUpdate(
        { _id: it.productId, stock: { $gte: it.quantity } },
        { $inc: { stock: -it.quantity } },
        { new: false }
      );
      if (!updated) {
        // rollback de lo decrementado previamente
        await Promise.all(
          decremented.map(s => Product.updateOne(
            { _id: s.productId },
            { $inc: { stock: s.quantity } }
          ))
        );
        return res.status(409).json({ error: `Insufficient stock for product ${it.productId}` });
      }
      decremented.push(it);
    }

    // Crear orden
    const newOrder = await Order.create({
      user: authUserId,
      products: normalizedItems,
      shippingAddress,
      paymentMethod,
      shippingCost: shipping,
      totalPrice,
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Vaciar carrito
    await Cart.updateOne({ user: authUserId }, { $set: { products: [] } });

    // Populate para respuesta
    await newOrder.populate('user');
    await newOrder.populate('products.productId');
    await newOrder.populate('shippingAddress');
    await newOrder.populate('paymentMethod');

    return res.status(201).json(newOrder);
  } catch (error) {
    return next(error);
  }
}

async function updateOrder(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const allowedFields = ['status', 'paymentStatus', 'shippingCost'];
    const filteredUpdate = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredUpdate[field] = updateData[field];
      }
    }

    if (filteredUpdate.shippingCost !== undefined) {
      const order = await Order.findById(id);
      if (order) {
        const subtotal = order.products.reduce((total, item) => total + (item.price * item.quantity), 0);
        filteredUpdate.totalPrice = subtotal + filteredUpdate.shippingCost;
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      filteredUpdate,
      { new: true }
    )
      .populate('user')
      .populate('products.productId')
      .populate('shippingAddress')
      .populate('paymentMethod');

    if (updatedOrder) {
      return res.status(200).json(updatedOrder);
    } else {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
  } catch (error) {
    return next(error);
  }
}

async function cancelOrder(req, res, next) {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    if (order.status === 'delivered' || order.status === 'cancelled') {
      return res.status(400).json({
        message: 'Cannot cancel order with status: ' + order.status
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        status: 'cancelled',
        paymentStatus: order.paymentStatus === 'paid' ? 'refunded' : 'failed'
      },
      { new: true }
    )
      .populate('user')
      .populate('products.productId')
      .populate('shippingAddress')
      .populate('paymentMethod');

    res.status(200).json(updatedOrder);
  } catch (error) {
    return next(error);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Valid statuses: ' + validStatuses.join(', ')
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate('user')
      .populate('products.productId')
      .populate('shippingAddress')
      .populate('paymentMethod');

    if (updatedOrder) {
      return res.status(200).json(updatedOrder);
    } else {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
  } catch (error) {
    return next(error);
  }
}

async function updatePaymentStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        error: 'Invalid payment status. Valid statuses: ' + validPaymentStatuses.join(', ')
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true }
    )
      .populate('user')
      .populate('products.productId')
      .populate('shippingAddress')
      .populate('paymentMethod');

    if (updatedOrder) {
      return res.status(200).json(updatedOrder);
    } else {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
  } catch (error) {
    return next(error);
  }
}

async function deleteOrder(req, res, next) {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    if (order.status !== 'cancelled') {
      return res.status(400).json({
        message: 'Solo se pueden eliminar órdenes canceladas'
      });
    }

    await Order.findByIdAndDelete(id);
    return res.status(200).json({
      status: 'success',
      message: 'Orden eliminada correctamente'
    });
  } catch (error) {
    return next(error);
  }
}

export {
  getOrders,
  getOrderById,
  getOrdersByUser,
  createOrder,
  updateOrder,
  cancelOrder,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
  checkoutFromCart,  // 👈 nuevo export
};
