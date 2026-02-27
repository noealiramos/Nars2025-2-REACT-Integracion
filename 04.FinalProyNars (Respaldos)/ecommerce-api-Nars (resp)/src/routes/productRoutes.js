import express from 'express';
import {
  getProducts,
  getProductById,
  getProductByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} from '../controllers/productController.js'; // <-- ../
import authMiddleware from '../middlewares/authMiddleware.js'; // <-- ../
import isAdmin from '../middlewares/isAdminMiddleware.js';    // <-- ../
import validate from '../middlewares/validation.js';          // <-- ../
import { query, param, body } from 'express-validator';
import { MATERIALS, DESIGNS, STONES } from '../config/catalog.js';

const router = express.Router();

// LIST con filtros
router.get('/products', [
  query('material').optional().isIn(MATERIALS),
  query('design').optional().isIn(DESIGNS),
  query('stone').optional().isIn(STONES),
  query('order').optional().isIn(['asc', 'desc']),
], validate, getProducts);

router.get('/products/search', [
  query('q').optional().isString().trim(),
  query('category').optional().isMongoId().withMessage('category must be a valid MongoDB ObjectId'),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('inStock').optional().isBoolean().withMessage('inStock must be boolean'),
  query('sort').optional().isIn(['name','price','createdAt']),
  query('order').optional().isIn(['asc','desc']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
], validate, searchProducts);

router.get('/products/category/:idCategory', [
  param('idCategory').isMongoId().withMessage('Category ID must be a valid MongoDB ObjectId'),
], validate, getProductByCategory);

// DETALLE
router.get('/products/:id', [
  param('id').isMongoId().withMessage('Product ID must be a valid MongoDB ObjectId'),
], validate, getProductById);

// CREAR
router.post('/products', [
  authMiddleware, isAdmin,
  body('material').isIn(MATERIALS),
  body('design').isIn(DESIGNS),
  body('stone').optional().isIn(STONES),
], validate, createProduct);


router.put('/products/:id', [
  authMiddleware, isAdmin,
  param('id').isMongoId(),
  body('material').optional().isIn(MATERIALS),
  body('design').optional().isIn(DESIGNS),
  body('stone').optional().isIn(STONES),
], validate, updateProduct);

router.delete('/products/:id', [
  authMiddleware, isAdmin,
  param('id').isMongoId(),
], validate, deleteProduct);

// BÚSQUEDA existente
router.get('/products/search', searchProducts);

export default router;
