import products from "../data/products";

export const fetchProducts = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return products;
};

export const getProductById = async (id) => {
  const list = await fetchProducts();
  return list.find((p) => p.id === id);
};

export const getProductsByCategory = async (categoryId) => {
  const list = await fetchProducts();
  return list.filter((p) => p.categoryId === categoryId);
};