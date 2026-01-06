import { http } from './http';

// Obtener reseñas de un producto
export const getProductReviews = async (productId, page = 1, limit = 10) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    
    const response = await http.get(`reviews/product/${productId}?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product reviews:', error.message);
    throw error;
  }
};

// Obtener reseñas del usuario autenticado
export const getMyReviews = async (page = 1, limit = 10) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    
    const response = await http.get(`reviews/my-reviews?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching my reviews:', error.message);
    throw error;
  }
};

// Crear una nueva reseña
export const createReview = async (productId, rating, comment) => {
  try {
    const response = await http.post('reviews', {
      productId,
      rating,
      comment
    });
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error.message);
    throw error;
  }
};

// Actualizar una reseña
export const updateReview = async (reviewId, rating, comment) => {
  try {
    const response = await http.put(`reviews/${reviewId}`, {
      rating,
      comment
    });
    return response.data;
  } catch (error) {
    console.error('Error updating review:', error.message);
    throw error;
  }
};

// Eliminar una reseña
export const deleteReview = async (reviewId) => {
  try {
    await http.delete(`reviews/${reviewId}`);
    return true;
  } catch (error) {
    console.error('Error deleting review:', error.message);
    throw error;
  }
};
