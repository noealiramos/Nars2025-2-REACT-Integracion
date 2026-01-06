import { http } from './http';

// Obtener todos los pedidos del usuario autenticado
export const getMyOrders = async (page = 1, limit = 10) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    
    const response = await http.get(`orders/my-orders?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching my orders:', error.message);
    throw error;
  }
};

// Obtener un pedido específico por ID
export const getOrderById = async (orderId) => {
  try {
    const response = await http.get(`orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error.message);
    throw error;
  }
};

// Crear un nuevo pedido
export const createOrder = async (orderData) => {
  try {
    const response = await http.post('orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error.message);
    throw error;
  }
};

// Cancelar un pedido
export const cancelOrder = async (orderId) => {
  try {
    const response = await http.patch(`orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Error canceling order:', error.message);
    throw error;
  }
};

// Funciones de administración (requieren rol admin)
export const getAllOrders = async ({
  page = 1,
  limit = 10,
  status,
  userId
} = {}) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (status) params.append('status', status);
    if (userId) params.append('userId', userId);
    
    const response = await http.get(`orders?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all orders:', error.message);
    throw error;
  }
};

// Actualizar estado de pedido (solo admin)
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await http.patch(`orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error.message);
    throw error;
  }
};
