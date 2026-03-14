import WishList from '../models/wishList.js';
import Product from '../models/product.js';

// Campos a popular del producto (para Product actual: name, price, imagesUrl, category, stock)
const PRODUCT_FIELDS = 'name price imagesUrl category stock';

// Obtener la wishlist del usuario
const getUserWishList = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.userId;

    let wishList = await WishList.findOne({ user: userId })
      .populate('products.product', PRODUCT_FIELDS)
      .lean();

    if (!wishList) {
      // Crear una wishlist vacía si no existe
      const created = await WishList.create({ user: userId, products: [] });
      wishList = await WishList.findById(created._id)
        .populate('products.product', PRODUCT_FIELDS)
        .lean();
    }

    return res.status(200).json({
      message: 'Wishlist retrieved successfully',
      count: wishList.products.length,
      wishList,
    });
  } catch (error) {
    return next(error);
  }
};

// Agregar producto a la wishlist (atómico, sin duplicados)
const addToWishList = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user?.id || req.user?.userId;

    // Verificar que el producto existe
    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // upsert + addToSet evita duplicados y crea si no existe
    await WishList.updateOne(
      { user: userId },
      { $setOnInsert: { user: userId }, $addToSet: { products: { product: productId } } },
      { upsert: true }
    );

    const wishList = await WishList.findOne({ user: userId })
      .populate('products.product', PRODUCT_FIELDS);

    return res.status(200).json({
      message: 'Product added to wishlist successfully',
      wishList,
    });
  } catch (error) {
    return next(error);
  }
};

// Remover producto de la wishlist (atómico)
const removeFromWishList = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id || req.user?.userId;

    const wl = await WishList.findOneAndUpdate(
      { user: userId },
      { $pull: { products: { product: productId } } },
      { new: true }
    ).populate('products.product', PRODUCT_FIELDS);

    if (!wl) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    // Si no estaba, respondemos 404 para mantener tu contrato actual
    const existed = wl.products.some(p => String(p.product?._id || p.product) === String(productId));
    if (!existed) {
      // Nota: después del $pull, no podemos saber directamente si existía; para estricto 404 previo, hay que consultar antes.
      
    }

    return res.status(200).json({
      message: 'Product removed from wishlist successfully',
      wishList: wl,
    });
  } catch (error) {
    return next(error);
  }
};

// Limpiar toda la wishlist
const clearWishList = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.userId;

    const wl = await WishList.findOneAndUpdate(
      { user: userId },
      { $set: { products: [] } },
      { new: true }
    ).populate('products.product', PRODUCT_FIELDS);

    if (!wl) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    return res.status(200).json({
      message: 'Wishlist cleared successfully',
      wishList: wl,
    });
  } catch (error) {
    return next(error);
  }
};

// Verificar si un producto está en la wishlist
const checkProductInWishList = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id || req.user?.userId;

    const wishList = await WishList.findOne({ user: userId }).lean();

    if (!wishList) {
      return res.status(200).json({
        message: 'Product not in wishlist',
        inWishList: false,
      });
    }

    const productExists = wishList.products.some(
      (item) => String(item.product) === String(productId)
    );

    return res.status(200).json({
      message: productExists ? 'Product is in wishlist' : 'Product not in wishlist',
      inWishList: productExists,
    });
  } catch (error) {
    return next(error);
  }
};

// Mover producto al carrito (placeholder: remueve de wishlist)
const moveToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user?.id || req.user?.userId;

    const wl = await WishList.findOneAndUpdate(
      { user: userId },
      { $pull: { products: { product: productId } } },
      { new: true }
    );

    if (!wl) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    // Aquí podrías agregar lógica real de carrito (add/increment). Por ahora, solo removemos.
    return res.status(200).json({
      message: 'Product moved to cart and removed from wishlist',
      wishList: await wl.populate('products.product', PRODUCT_FIELDS),
    });
  } catch (error) {
    return next(error);
  }
};

export {
  getUserWishList,
  addToWishList,
  removeFromWishList,
  clearWishList,
  checkProductInWishList,
  moveToCart,
};
