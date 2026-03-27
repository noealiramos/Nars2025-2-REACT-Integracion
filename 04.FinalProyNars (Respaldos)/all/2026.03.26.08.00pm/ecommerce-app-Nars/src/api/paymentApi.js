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
};
