import { orderApi } from "../api/orderApi";

const normalizeOrderItem = (item = {}) => {
  const product = item.productId || {};
  const quantity = Number(item.quantity || 0);
  const unitPrice = Number(item.price || 0);

  return {
    id: product._id || product.id || item.productId || `${item.price}-${quantity}`,
    productId: product._id || product.id || item.productId,
    name: product.name || "Producto",
    image: Array.isArray(product.imagesUrl) ? product.imagesUrl[0] : product.imagesUrl || product.image || "",
    quantity,
    price: unitPrice,
    subtotal: unitPrice * quantity,
  };
};

const normalizeOrder = (order = {}) => {
  const items = Array.isArray(order.products) ? order.products.map(normalizeOrderItem) : [];
  const subtotal = Number(order.subtotal || 0);
  const taxAmount = Number(order.taxAmount || 0);
  const shippingCost = Number(order.shippingCost || 0);
  const totalPrice = Number(order.totalPrice || 0);

  return {
    ...order,
    id: order._id || order.id,
    items,
    createdAt: order.createdAt || null,
    subtotal,
    taxAmount,
    shippingCost,
    totalPrice,
    itemCount: items.reduce((acc, item) => acc + item.quantity, 0),
    shippingAddressLabel: order.shippingAddress
      ? [
          order.shippingAddress.name,
          order.shippingAddress.address,
          order.shippingAddress.city,
          order.shippingAddress.state,
          order.shippingAddress.postalCode,
        ]
          .filter(Boolean)
          .join(", ")
      : "Sin dirección registrada",
    paymentMethodLabel: order.paymentMethod
      ? [order.paymentMethod.brand, order.paymentMethod.last4 ? `**** ${order.paymentMethod.last4}` : ""]
          .filter(Boolean)
          .join(" ")
      : "Método no disponible",
  };
};

const normalizePagination = (pagination = {}) => {
  const totalResults = Number(pagination.totalResults || pagination.total || 0);
  const totalPages = Number(pagination.totalPages || 0);

  return {
    currentPage: Number(pagination.currentPage || 1),
    totalPages: totalPages > 0 ? totalPages : 1,
    totalResults,
    hasNext: Boolean(pagination.hasNext),
    hasPrev: Boolean(pagination.hasPrev),
  };
};

export const getOrdersByUser = async (userId, params = {}) => {
  const data = await orderApi.getByUser(userId, params);

  return {
    orders: Array.isArray(data?.orders) ? data.orders.map(normalizeOrder) : [],
    pagination: normalizePagination(data?.pagination),
  };
};

export const getOrderDetail = async (id) => {
  const data = await orderApi.getById(id);
  return normalizeOrder(data);
};
