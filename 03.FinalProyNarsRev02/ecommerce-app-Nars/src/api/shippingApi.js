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
  update: async (addressId, shippingData) => {
    const response = await apiClient.patch(`/shipping-addresses/${addressId}`, shippingData);
    return response.data?.address || response.data?.data || response.data;
  },
  setDefault: async (addressId) => {
    const response = await apiClient.patch(`/shipping-addresses/${addressId}/default`);
    return response.data?.address || response.data?.data || response.data;
  },
  remove: async (addressId) => {
    const response = await apiClient.delete(`/shipping-addresses/${addressId}`);
    return response.data;
  },
};
