import { http } from './http';

export const fetchProducts = async (page = 1, limit = 10) => {
  try {
    const response = await http.get(`products?page=${page}&limit=${limit}`);
    return response.data || { products: [], pagination: {} };
  } catch (error) {
    console.error('Error fetching products:', error.message);
    throw error;
  }
};

export const searchProducts = async ({
  q = "",
  category = "",
  minPrice,
  maxPrice,
  inStock,
  sort,
  order,
  page = 1,
  limit = 10,
} = {}) => {
  try {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (category) params.append('category', category);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (inStock !== undefined) params.append('inStock', inStock);
    if (sort) params.append('sort', sort);
    if (order) params.append('order', order);
    params.append('page', page);
    params.append('limit', limit);

    const response = await http.get(`products/search?${params}`);
    return response.data || { products: [], pagination: {} };
  } catch (error) {
    console.error('Error searching products:', error.message);
    throw error;
  }
};

export const getProductsByCategory = async (categoryId, page = 1, limit = 10) => {
  try {
    const response = await http.get(`products/category/${categoryId}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching products by category:', error.message);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await http.get(`products/${id}`);
    return response.data || null;
  } catch (error) {
    console.error('Error fetching product by id:', error.message);
    throw error;
  }
};
