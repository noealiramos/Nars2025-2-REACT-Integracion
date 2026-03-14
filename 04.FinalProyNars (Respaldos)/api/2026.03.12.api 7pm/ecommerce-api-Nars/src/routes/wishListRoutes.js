import express from 'express';
import { body, param } from 'express-validator';
import validate from '../middlewares/validation.js';
import {
  getUserWishList,
  addToWishList,
  removeFromWishList,
  clearWishList,
  checkProductInWishList,
  moveToCart
} from '../controllers/wishListController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Obtener la wishlist del usuario
router.get('/', authMiddleware, getUserWishList);

// Agregar producto a la wishlist
router.post('/add',
  authMiddleware,
  [
    body('productId')
      .notEmpty().withMessage('Product ID is required')
      .isMongoId().withMessage('Product ID must be a valid MongoDB ObjectId'),
  ],
  validate,
  addToWishList
);

// Verificar si un producto está en la wishlist
router.get('/check/:productId',
  authMiddleware,
  [
    param('productId').isMongoId().withMessage('Product ID must be a valid MongoDB ObjectId'),
  ],
  validate,
  checkProductInWishList
);

// Remover producto de la wishlist
router.delete('/remove/:productId',
  authMiddleware,
  [
    param('productId').isMongoId().withMessage('Product ID must be a valid MongoDB ObjectId'),
  ],
  validate,
  removeFromWishList
);

// Mover producto al carrito
router.post('/move-to-cart',
  authMiddleware,
  [
    body('productId')
      .notEmpty().withMessage('Product ID is required')
      .isMongoId().withMessage('Product ID must be a valid MongoDB ObjectId'),
  ],
  validate,
  moveToCart
);

// Limpiar toda la wishlist
router.delete('/clear', authMiddleware, clearWishList);

export default router;
