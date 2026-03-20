import { apiClient } from "./apiClient";

export const orderApi = {
  getAll: async (params = {}) => {
    const response = await apiClient.get("/orders", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  getByUser: async (userId, params = {}) => {
    const response = await apiClient.get(`/orders/user/${userId}`, { params });
    return response.data;
  },

  create: async (orderData) => {
    const response = await apiClient.post("/orders", orderData);
    return response.data;
  },

  checkout: async (checkoutData) => {
    const response = await apiClient.post("/orders/checkout", checkoutData);
    return response.data;
  },
};
