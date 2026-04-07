import { wishlistApi } from "../api/wishlistApi";

const normalizeWishlistProduct = (entry = {}) => {
  const product = entry.product || entry.productId || {};

  return {
    id: product._id || product.id,
    name: product.name || "Producto",
    price: Number(product.price || 0),
    stock: Number(product.stock || 0),
    image: Array.isArray(product.imagesUrl) ? product.imagesUrl[0] || "" : product.imagesUrl || product.image || "",
    category: product.category,
  };
};

const normalizeWishlist = (data = {}) => {
  const wishList = data.wishList || data.wishlist || {};
  const products = Array.isArray(wishList.products) ? wishList.products.map(normalizeWishlistProduct) : [];

  return {
    id: wishList._id || wishList.id || null,
    count: data.count ?? products.length,
    products,
  };
};

export const getWishlist = async () => normalizeWishlist(await wishlistApi.get());

export const addProductToWishlist = async (productId) => normalizeWishlist(await wishlistApi.add(productId));

export const removeProductFromWishlist = async (productId) => normalizeWishlist(await wishlistApi.remove(productId));

export const clearWishlist = async () => normalizeWishlist(await wishlistApi.clear());

export const moveWishlistProductToCart = async (productId) => normalizeWishlist(await wishlistApi.moveToCart(productId));

export const checkWishlistProduct = async (productId) => {
  const data = await wishlistApi.check(productId);
  return Boolean(data?.inWishList);
};
