import { apiClient } from "./apiClient";

export const paymentApi = {
  getByUser: async (userId) => {
    const response = await apiClient.get(`/payment-methods/user/${userId}`);
    return response.data?.data || response.data?.paymentMethods || response.data;
  },
  create: async (paymentData) => {
    const response = await apiClient.post("/payment-methods", paymentData);
    return response.data?.data || response.data;
  },
  update: async (paymentMethodId, paymentData) => {
    const response = await apiClient.patch(`/payment-methods/${paymentMethodId}`, paymentData);
    return response.data?.data || response.data;
  },
  setDefault: async (paymentMethodId) => {
    const response = await apiClient.patch(`/payment-methods/${paymentMethodId}/set-default`);
    return response.data?.data || response.data;
  },
  remove: async (paymentMethodId) => {
    const response = await apiClient.delete(`/payment-methods/${paymentMethodId}`);
    return response.data?.data || response.data;
  },
};
