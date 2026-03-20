import { productApi } from "../api/productApi";
import { logger } from "../utils/logger";

const mapProduct = (p) => ({
  ...p,
  id: p._id || p.id,
  image: Array.isArray(p.imagesUrl) ? p.imagesUrl[0] : (p.imagesUrl || p.image),
});

const mapProductCollection = (data) => {
  const products = Array.isArray(data?.products) ? data.products : [];

  return {
    ...data,
    products: products.map(mapProduct),
  };
};

export const fetchProducts = async (params = {}) => {
  try {
    const data = await productApi.getAll(params);
    return mapProductCollection(data).products;
  } catch (error) {
    logger.error("productService", "Failed to fetch products", error.response?.data || error.message);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const data = await productApi.getById(id);
    return mapProduct(data);
  } catch (error) {
    logger.error("productService", `Failed to fetch product ${id}`, error.response?.data || error.message);
    throw error;
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const data = await productApi.getByCategory(categoryId);
    return mapProductCollection(data).products;
  } catch (error) {
    logger.error("productService", `Failed to fetch category products ${categoryId}`, error.response?.data || error.message);
    throw error;
  }
};

export const searchProducts = async (query) => {
  try {
    const data = await productApi.search(query);
    return mapProductCollection(data).products;
  } catch (error) {
    logger.error("productService", `Failed to search products for ${query}`, error.response?.data || error.message);
    throw error;
  }
};
