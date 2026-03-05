import express from 'express';
import {
  getProducts,
  getProductById,
  getProductByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} from '../controllers/productController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/isAdminMiddleware.js';
import validate from '../middlewares/validation.js';
import {
  productListValidator,
  productSearchValidator,
  productCategoryValidator,
  productIdParamValidator,
  productCreateValidator,
  productUpdateValidator
} from '../validators/productValidator.js';

const router = express.Router();

// LIST con filtros
router.get('/products', productListValidator, validate, getProducts);

router.get('/products/search', productSearchValidator, validate, searchProducts);

router.get('/products/category/:idCategory', productCategoryValidator, validate, getProductByCategory);

// DETALLE
router.get('/products/:id', productIdParamValidator, validate, getProductById);

// CREAR
router.post('/products',
  authMiddleware,
  isAdmin,
  productCreateValidator,
  validate,
  createProduct
);

// ACTUALIZAR
router.put('/products/:id',
  authMiddleware,
  isAdmin,
  productUpdateValidator,
  validate,
  updateProduct
);

// ELIMINAR
router.delete('/products/:id',
  authMiddleware,
  isAdmin,
  [productIdParamValidator],
  validate,
  deleteProduct
);

export default router;
