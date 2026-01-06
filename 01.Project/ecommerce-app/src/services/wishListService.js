import { http } from './http';

// Obtener la lista de deseos del usuario autenticado
export const getWishList = async () => {
  try {
    const response = await http.get('wishlist');
    return response.data;
  } catch (error) {
    console.error('Error fetching wishlist:', error.message);
    throw error;
  }
};

// Agregar producto a la lista de deseos
export const addToWishList = async (productId) => {
  try {
    const response = await http.post('wishlist/add', { productId });
    return response.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error.message);
    throw error;
  }
};

// Eliminar producto de la lista de deseos
export const removeFromWishList = async (productId) => {
  try {
    const response = await http.delete(`wishlist/remove/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from wishlist:', error.message);
    throw error;
  }
};

// Limpiar toda la lista de deseos
export const clearWishList = async () => {
  try {
    const response = await http.delete('wishlist/clear');
    return response.data;
  } catch (error) {
    console.error('Error clearing wishlist:', error.message);
    throw error;
  }
};

// Verificar si un producto está en la lista de deseos
export const isInWishList = async (productId) => {
  try {
    const wishlist = await getWishList();
    return wishlist.products.some(item => item.product._id === productId);
  } catch (error) {
    console.error('Error checking wishlist:', error.message);
    return false;
  }
};
