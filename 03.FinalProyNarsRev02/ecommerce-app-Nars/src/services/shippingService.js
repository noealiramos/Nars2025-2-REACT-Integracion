import { shippingApi } from "../api/shippingApi";
import { logger } from "../utils/logger";

export const fetchShippingAddressesByUser = async (userId) => {
  if (!userId) return [];

  try {
    const data = await shippingApi.getByUser(userId);
    return Array.isArray(data) ? data : data.shippingAddresses || [];
  } catch (error) {
    logger.error("shippingService", "Failed to fetch shipping addresses", error.response?.data || error.message);
    throw error;
  }
};
