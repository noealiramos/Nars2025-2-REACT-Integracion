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

const normalizeProductPagination = (data = {}) => {
  const pagination = data?.pagination || {};
  const totalResults = Number(pagination.totalResults ?? data?.total ?? 0);
  const totalPages = Number(pagination.totalPages ?? data?.pages ?? 1);
  const currentPage = Number(pagination.currentPage ?? data?.page ?? 1);

  return {
    currentPage: currentPage > 0 ? currentPage : 1,
    totalPages: totalPages > 0 ? totalPages : 1,
    totalResults,
    hasNext: Boolean(pagination.hasNext ?? currentPage < totalPages),
    hasPrev: Boolean(pagination.hasPrev ?? currentPage > 1),
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

export const fetchProductsPaginated = async (params = {}) => {
  try {
    const data = await productApi.getAll(params);
    const mapped = mapProductCollection(data);

    return {
      products: mapped.products,
      pagination: normalizeProductPagination(mapped),
    };
  } catch (error) {
    logger.error("productService", "Failed to fetch paginated products", error.response?.data || error.message);
    throw error;
  }
};

export const searchProductsPaginated = async (query, params = {}) => {
  try {
    const data = await productApi.search(query, params);
    const mapped = mapProductCollection(data);

    return {
      products: mapped.products,
      pagination: normalizeProductPagination(mapped),
    };
  } catch (error) {
    logger.error("productService", `Failed to fetch paginated search for ${query}`, error.response?.data || error.message);
    throw error;
  }
};
