import { paymentApi } from "../api/paymentApi";
import { logger } from "../utils/logger";

export const fetchPaymentMethodsByUser = async (userId) => {
  if (!userId) return [];

  try {
    const data = await paymentApi.getByUser(userId);
    return Array.isArray(data) ? data : data.paymentMethods || [];
  } catch (error) {
    logger.error("paymentService", "Failed to fetch payment methods", error.response?.data || error.message);
    throw error;
  }
};
