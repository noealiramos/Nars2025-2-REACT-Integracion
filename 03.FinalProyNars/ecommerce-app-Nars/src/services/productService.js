import { apiClient } from "./apiClient";

export const fetchProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const endpoint = `/products${query ? `?${query}` : ""}`;

  const response = await apiClient(endpoint);
  if (!response.success) {
    throw new Error(response.error || "Error al obtener productos");
  }
  return response.data;
};

export const getProductById = async (id) => {
  const response = await apiClient(`/products/${id}`);
  if (!response.success) {
    throw new Error(response.error || "Error al obtener producto");
  }
  return response.data;
};

export const getProductsByCategory = async (categoryId) => {
  const response = await apiClient(`/products?categoryId=${categoryId}`);
  if (!response.success) {
    throw new Error(response.error || "Error al obtener productos por categoría");
  }
  return response.data;
};