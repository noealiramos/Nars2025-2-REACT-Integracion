import { shippingApi } from "../api/shippingApi";

export const fetchShippingAddressesByUser = async (userId) => {
  try {
    const data = await shippingApi.getByUser(userId);
    return Array.isArray(data) ? data : data.shippingAddresses || [];
  } catch (error) {
    console.error("Error fetching shipping addresses:", error);
    return [];
  }
};