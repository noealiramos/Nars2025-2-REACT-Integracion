import { paymentApi } from "../api/paymentApi";

export const fetchPaymentMethodsByUser = async (userId) => {
  try {
    const data = await paymentApi.getByUser(userId);
    return Array.isArray(data) ? data : data.paymentMethods || [];
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return [];
  }
};