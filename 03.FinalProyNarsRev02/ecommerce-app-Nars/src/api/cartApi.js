import { apiClient } from "./apiClient";

export const cartApi = {
  getCurrent: async () => {
    const response = await apiClient.get("/cart/user");
    return response.data?.data || response.data;
  },
  addProduct: async (productId, quantity = 1) => {
    const response = await apiClient.post("/cart/add-product", {
      productId,
      quantity,
    });
    return response.data?.data || response.data;
  },
  update: async (cartId, products) => {
    const response = await apiClient.put(`/cart/${cartId}`, { products });
    return response.data?.data || response.data;
  },
  remove: async (cartId) => {
    const response = await apiClient.delete(`/cart/${cartId}`);
    return response.data?.data || response.data;
  },
};
