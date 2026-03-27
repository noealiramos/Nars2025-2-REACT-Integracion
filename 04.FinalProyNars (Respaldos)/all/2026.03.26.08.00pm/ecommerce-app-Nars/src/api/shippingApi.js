import { apiClient } from "./apiClient";

export const shippingApi = {
  getByUser: async () => {
    const response = await apiClient.get('/shipping-addresses');
    return response.data?.addresses || response.data?.data || response.data;
  },
  create: async (shippingData) => {
    const response = await apiClient.post("/shipping-addresses", shippingData);
    return response.data?.address || response.data?.data || response.data;
  },
};
