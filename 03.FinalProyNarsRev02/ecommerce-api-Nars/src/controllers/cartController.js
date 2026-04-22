import Cart from '../models/cart.js';
import { getPagination, buildMeta } from '../utils/pagination.js';

// GET: todos los carritos (admin) con paginación
async function getCarts(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req, 20);

    const [total, items] = await Promise.all([
      Cart.countDocuments({}),
      Cart.find({})
        .populate('user', 'displayName email _id')
        .populate('products.product', 'name price stock _id imagesUrl image')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return res.json({ data: items, meta: buildMeta({ page, limit, total }) });
  } catch (error) {
    return next(error);
  }
}

// GET: carrito por ID (admin)
async function getCartById(req, res, next) {
  try {
    const id = req.params.id;
    const cart = await Cart.findById(id)
      .populate('user', 'displayName email _id')
      .populate('products.product', 'name price stock _id imagesUrl image')
      .lean();

    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
    return res.json({ data: cart });
  } catch (error) {
    return next(error);
  }
}


// GET: carrito por usuario (self o admin)
async function getCartByUser(req, res, next) {
  try {
    const authUserId = req.user?.id || req.user?.userId;
    const userId = req.params.userId || authUserId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let cart = await Cart.findOne({ user: userId })
      .populate('user', 'displayName email _id')
      .populate('products.product', 'name price stock _id imagesUrl image')
      .lean();

    // Si no existe, devuelve estructura vacía (no filtramos existencia)
    if (!cart) cart = { user: userId, products: [], createdAt: null, updatedAt: null };

    return res.json({ data: cart });
  } catch (error) {
    return next(error);
  }
}




// POST: crear carrito completo (admin o uso puntual)
async function createCart(req, res, next) {
  try {
    const { user, products } = req.body;

    if (!user || !Array.isArray(products)) {
      return res.status(400).json({ error: 'User and products array are required' });
    }
    for (const item of products) {
      if (!item.product || !item.quantity || item.quantity < 1) {
        return res.status(400).json({ error: 'Each product needs product and quantity >= 1' });
      }
    }

    const created = await Cart.create({ user, products });
    const out = await Cart.findById(created._id)
      .populate('user', 'displayName email _id')
      .populate('products.product', 'name price stock _id imagesUrl image')
      .lean();

    return res.status(201).json({ data: out });
  } catch (error) {
    // unicidad de user (índice unique)
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'User already has a cart' });
    }
    return next(error);
  }
}

// PUT: reemplazar productos del carrito
async function updateCart(req, res, next) {
  try {
    const { id } = req.params;
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'products must be an array' });
    }
    for (const item of products) {
      if (!item.product || !item.quantity || item.quantity < 1) {
        return res.status(400).json({ error: 'Each product needs product and quantity >= 1' });
      }
    }

    const updated = await Cart.findByIdAndUpdate(
      id,
      { $set: { products } },
      { new: true }
    )
      .populate('user', 'displayName email _id')
      .populate('products.product', 'name price stock _id imagesUrl image');

    if (!updated) return res.status(404).json({ message: 'Carrito no encontrado' });
    return res.status(200).json({ data: updated });
  } catch (error) {
    return next(error);
  }
}

// DELETE: elimina carrito por ID
async function deleteCart(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await Cart.findByIdAndDelete(id).lean();

    if (!deleted) return res.status(404).json({ message: 'Carrito no encontrado' });
    return res.status(200).json({ message: 'Carrito eliminado correctamente' });
  } catch (error) {
    return next(error);
  }
}

// POST: agrega/incrementa un producto (ATÓMICO) usando el usuario autenticado
async function addProductToCart(req, res, next) {
  try {
    const authUserId = req.user?.id || req.user?.userId;
    const { productId, quantity = 1 } = req.body;
    const qty = parseInt(quantity, 10);

    if (!authUserId || !productId || !Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ error: 'Valid token, productId and quantity >= 1 are required' });
    }

    // upsert del carrito
    await Cart.updateOne(
      { user: authUserId },
      { $setOnInsert: { user: authUserId, products: [] } },
      { upsert: true }
    );

    // intenta incrementar si ya existe el producto
    const incRes = await Cart.findOneAndUpdate(
      { user: authUserId, 'products.product': productId },
      { $inc: { 'products.$.quantity': qty } },
      { new: true }
    )
      .populate('user', 'displayName email _id')
      .populate('products.product', 'name price stock _id imagesUrl image');

    if (incRes) return res.json({ data: incRes });

    // si no estaba, empuja el nuevo producto
    const pushRes = await Cart.findOneAndUpdate(
      { user: authUserId },
      { $push: { products: { product: productId, quantity: qty } } },
      { new: true }
    )
      .populate('user', 'displayName email _id')
      .populate('products.product', 'name price stock _id imagesUrl image');

    return res.json({ data: pushRes });
  } catch (error) {
    return next(error);
  }
}

export {
  getCarts,
  getCartById,
  getCartByUser,
  createCart,
  updateCart,
  deleteCart,
  addProductToCart,
};
