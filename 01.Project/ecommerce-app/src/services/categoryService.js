import { http } from './http';

export const fetchCategories = async () => {
  try {
    const response = await http.get('categories');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    throw error;
  }
};

export const searchCategories = async ({
  q = '',
  parentCategory,
  sort,
  order,
  page = 1,
  limit = 10
} = {}) => {
  try {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (parentCategory) params.append('parentCategory', parentCategory);
    if (sort) params.append('sort', sort);
    if (order) params.append('order', order);
    params.append('page', page);
    params.append('limit', limit);
    
    const response = await http.get(`categories/search?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error searching categories:', error.message);
    throw error;
  }
};

export const getCategoryById = async (categoryId) => {
  try {
    const response = await http.get(`categories/${categoryId}`);
    return response.data || null;
  } catch (error) {
    console.error('Error fetching category by id:', error.message);
    throw error;
  }
};

// Obtener todas las categorías hijas de una categoría padre
export const getChildCategories = async (parentCategoryId) => {
  try {
    const response = await http.get(`categories/search?parentCategory=${parentCategoryId}`);
    return response.data.categories || [];
  } catch (error) {
    console.error('Error fetching child categories:', error.message);
    throw error;
  }
};

// Obtener categorías principales (sin padre)
export const getParentCategories = async () => {
  try {
    const response = await http.get('categories/search?parentCategory=null');
    return response.data.categories || [];
  } catch (error) {
    console.error('Error fetching parent categories:', error.message);
    throw error;
  }
};

// Funciones de administración (requieren rol admin)
export const createCategory = async (categoryData) => {
  try {
    const response = await http.post('categories', categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error.message);
    throw error;
  }
};

export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await http.put(`categories/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error.message);
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    await http.delete(`categories/${categoryId}`);
    return true;
  } catch (error) {
    console.error('Error deleting category:', error.message);
    throw error;
  }
};
