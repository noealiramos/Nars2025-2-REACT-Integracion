import { apiClient } from "./apiClient";

export const productApi = {
  getAll: async (params = {}) => {
    const response = await apiClient.get("/products", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  getByCategory: async (categoryId) => {
    const response = await apiClient.get(`/products/category/${categoryId}`);
    return response.data;
  },

  search: async (query) => {
    const response = await apiClient.get("/products/search", {
      params: { q: query },
    });
    return response.data;
  },
};
