import Cart from '../models/cart.js';

import express from 'express';
import { body, param } from 'express-validator';
import validate from '../middlewares/validation.js';
import {
  getCarts,
  getCartById,
  getCartByUser,
  createCart,
  updateCart,
  deleteCart,
  addProductToCart,
} from '../controllers/cartController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/isAdminMiddleware.js';




import ownerOrAdmin from '../middlewares/ownerOrAdmin.js';
import { securityLogger } from '../middlewares/securityLogger.js';

const router = express.Router();

// Obtener todos los carritos (admin)
router.get('/cart', authMiddleware, isAdmin, getCarts);

// Obtener carrito por ID (admin)
router.get(
  '/cart/:id',
  authMiddleware,
  isAdmin,
  [param('id').isMongoId().withMessage('Invalid cart id')],
  validate,
  getCartById
);

/**
 * @swagger
 * /api/cart/user:
 *   get:
 *     summary: Obtener el carrito del usuario actual
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito devuelto exitosamente
 *       401:
 *         description: No autorizado
 */
router.get(
  '/cart/user',
  authMiddleware,
  securityLogger('View Cart'),
  validate,
  getCartByUser
);

// Obtener carrito por usuario (CON userId explícito)
router.get(
  '/cart/user/:userId',
  authMiddleware,
  ownerOrAdmin('userId'),
  [param('userId').isMongoId().withMessage('Invalid user id')],
  validate,
  getCartByUser
);

// Crear nuevo carrito (admin o uso controlado)
router.post(
  '/cart',
  authMiddleware,
  isAdmin,
  [
    body('user').isMongoId().withMessage('user is required'),
    body('products').isArray().withMessage('products must be an array'),
    body('products.*.product').isMongoId().withMessage('product is required'),
    body('products.*.quantity').isInt({ min: 1 }).withMessage('quantity >= 1'),
  ],
  validate,
  createCart
);

// Agregar producto al carrito del usuario autenticado
router.post(
  '/cart/add-product',
  authMiddleware,
  [
    body('productId').isMongoId().withMessage('productId is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('quantity must be >= 1'),
  ],
  validate,
  addProductToCart
);

// Reemplazar productos del carrito por ID
router.put(
  '/cart/:id',
  authMiddleware,
  [
    param('id').isMongoId().withMessage('Invalid cart id'),
    body('products').isArray().withMessage('products must be an array'),
    body('products.*.product').isMongoId().withMessage('product is required'),
    body('products.*.quantity').isInt({ min: 1 }).withMessage('quantity >= 1'),
  ],
  validate,
  ownerOrAdmin({ model: Cart }),   
  updateCart
);

// Eliminar carrito
router.delete(
  '/cart/:id',
  authMiddleware,
  [param('id').isMongoId().withMessage('Invalid cart id')],
  validate,
  ownerOrAdmin({ model: Cart }),  
  deleteCart
);


export default router;
