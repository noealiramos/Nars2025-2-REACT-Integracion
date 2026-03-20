import shippingAddresses from "../data/shippingAddresses";

export const fetchShippingAddressesByUser = async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return shippingAddresses.filter((a) => a.userId === userId);
};