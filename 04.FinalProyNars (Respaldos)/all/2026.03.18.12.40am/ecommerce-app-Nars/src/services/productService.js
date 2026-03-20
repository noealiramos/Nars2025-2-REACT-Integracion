import { productApi } from "../api/productApi";

const mapProduct = (p) => ({
  ...p,
  id: p._id || p.id,
  image: Array.isArray(p.imagesUrl) ? p.imagesUrl[0] : (p.imagesUrl || p.image),
});

export const fetchProducts = async (params = {}) => {
  try {
    const data = await productApi.getAll(params);
    const products = Array.isArray(data) ? data : data.items || data.products || [];
    return products.map(mapProduct);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const data = await productApi.getById(id);
    return mapProduct(data);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const data = await productApi.getByCategory(categoryId);
    const products = Array.isArray(data) ? data : data.items || data.products || [];
    return products.map(mapProduct);
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    throw error;
  }
};

export const searchProducts = async (query) => {
  try {
    const data = await productApi.search(query);
    const products = Array.isArray(data) ? data : data.items || data.products || [];
    return products.map(mapProduct);
  } catch (error) {
    console.error(`Error searching products for query ${query}:`, error);
    throw error;
  }
};