import { apiClient } from "./apiClient";

export const wishlistApi = {
  get: async () => {
    const response = await apiClient.get("/wishlist");
    return response.data;
  },

  add: async (productId) => {
    const response = await apiClient.post("/wishlist/add", { productId });
    return response.data;
  },

  remove: async (productId) => {
    const response = await apiClient.delete(`/wishlist/remove/${productId}`);
    return response.data;
  },

  clear: async () => {
    const response = await apiClient.delete("/wishlist/clear");
    return response.data;
  },

  moveToCart: async (productId) => {
    const response = await apiClient.post("/wishlist/move-to-cart", { productId });
    return response.data;
  },

  check: async (productId) => {
    const response = await apiClient.get(`/wishlist/check/${productId}`);
    return response.data;
  },
};
