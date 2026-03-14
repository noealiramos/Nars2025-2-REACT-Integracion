import paymentMethods from "../data/paymentMethods";

export const fetchPaymentMethodsByUser = async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return paymentMethods.filter((p) => p.userId === userId && p.active);
};