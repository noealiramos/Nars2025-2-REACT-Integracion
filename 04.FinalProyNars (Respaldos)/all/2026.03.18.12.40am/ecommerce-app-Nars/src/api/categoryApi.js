import { apiClient } from "./apiClient";

export const categoryApi = {
  getAll: async () => {
    const response = await apiClient.get("/categories");
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },
};
