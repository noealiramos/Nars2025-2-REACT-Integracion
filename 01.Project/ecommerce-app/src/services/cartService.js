import { http } from './http';

// Obtener el carrito del usuario autenticado
export const getCart = async () => {
  try {
    const response = await http.get('cart');
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    throw error;
  }
};

// Agregar producto al carrito
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await http.post('cart/add', { productId, quantity });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error.message);
    throw error;
  }
};

// Actualizar cantidad de un producto en el carrito
export const updateCartItem = async (productId, quantity) => {
  try {
    const response = await http.put('cart/update', { productId, quantity });
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error.message);
    throw error;
  }
};

// Eliminar producto del carrito
export const removeFromCart = async (productId) => {
  try {
    const response = await http.delete(`cart/remove/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error.message);
    throw error;
  }
};

// Limpiar todo el carrito
export const clearCart = async () => {
  try {
    const response = await http.delete('cart/clear');
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error.message);
    throw error;
  }
};
