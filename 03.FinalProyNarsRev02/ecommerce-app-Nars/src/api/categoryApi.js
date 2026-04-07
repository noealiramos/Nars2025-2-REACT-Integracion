import { apiClient } from "./apiClient";

export const categoryApi = {
  getAll: async (params = {}) => {
    const response = await apiClient.get("/categories", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  create: async (categoryData) => {
    const response = await apiClient.post("/categories", categoryData);
    return response.data;
  },

  update: async (id, categoryData) => {
    const response = await apiClient.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  remove: async (id) => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  },
};
