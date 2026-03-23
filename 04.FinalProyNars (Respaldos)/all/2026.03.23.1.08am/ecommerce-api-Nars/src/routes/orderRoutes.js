import express from 'express';
import ownerOrAdmin from '../middlewares/ownerOrAdmin.js';

import {
  getOrders,
  getOrderById,
  getOrdersByUser,
  createOrder,
  updateOrder,
  cancelOrder,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
  checkoutFromCart,              //  importar checkout
} from '../controllers/orderController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/isAdminMiddleware.js';
import validate from '../middlewares/validation.js';
import { body, param, query } from 'express-validator';

import Order from '../models/order.js';

const router = express.Router();

// Obtener todas las órdenes (admin)
router.get(
  '/orders',
  authMiddleware,
  isAdmin,
  [
    query('status').optional().isIn(['pending','processing','shipped','delivered','cancelled']),
    query('paymentStatus').optional().isIn(['pending','paid','failed','refunded']),
    query('sort').optional().isIn(['createdAt','status','paymentStatus']),
    query('order').optional().isIn(['asc','desc']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  getOrders
);

// Obtener órdenes por usuario (owner o admin)
router.get(
  '/orders/user/:userId',
  authMiddleware,
  ownerOrAdmin('userId'),   // solo el dueño o admin
  [
    param('userId').isMongoId().withMessage('Invalid user id'),
    query('status').optional().isIn(['pending','processing','shipped','delivered','cancelled']),
    query('paymentStatus').optional().isIn(['pending','paid','failed','refunded']),
    query('sort').optional().isIn(['createdAt','status','paymentStatus']),
    query('order').optional().isIn(['asc','desc']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  getOrdersByUser
);

// Obtener orden por ID (owner o admin)
router.get(
  '/orders/:id',
  authMiddleware,
  [ param('id').isMongoId().withMessage('Invalid order id') ],
  validate,
  ownerOrAdmin({ model: Order }),
  getOrderById
);

// Crear nueva orden (admin o usuario — products[] explícito)
router.post(
  '/orders',
  authMiddleware,
  [
    body('user').optional().isMongoId().withMessage('Invalid user id'),
    body('products').isArray({ min: 1 }).withMessage('products must be a non-empty array'),
    body('products.*.productId').isMongoId().withMessage('productId is required'),
    body('products.*.quantity').isInt({ min: 1 }).withMessage('quantity >= 1'),
    body('shippingAddress').isMongoId().withMessage('shippingAddress is required'),
    body('paymentMethod').isMongoId().withMessage('paymentMethod is required'),
    body('shippingCost').optional().isFloat({ min: 0 }),
  ],
  validate,
  createOrder
);

// Checkout desde carrito del usuario autenticado
router.post(
  '/orders/checkout',
  authMiddleware,
  [
    body('shippingAddress').isMongoId().withMessage('shippingAddress is required'),
    body('paymentMethod').isMongoId().withMessage('paymentMethod is required'),
    body('shippingCost').optional().isFloat({ min: 0 }),
  ],
  validate,
  checkoutFromCart
);

// Cancelar orden (admin)
router.patch(
  '/orders/:id/cancel',
  authMiddleware,
  isAdmin,
  [ param('id').isMongoId().withMessage('Invalid order id') ],
  validate,
  cancelOrder
);

// Actualizar estado (admin)
router.patch(
  '/orders/:id/status',
  authMiddleware,
  isAdmin,
  [
    param('id').isMongoId().withMessage('Invalid order id'),
    body('status').isIn(['pending','processing','shipped','delivered','cancelled']),
  ],
  validate,
  updateOrderStatus
);

// Actualizar estado de pago (admin)
router.patch(
  '/orders/:id/payment-status',
  authMiddleware,
  isAdmin,
  [
    param('id').isMongoId().withMessage('Invalid order id'),
    body('paymentStatus').isIn(['pending','paid','failed','refunded']),
  ],
  validate,
  updatePaymentStatus
);

// Actualizar orden completa (admin)
router.put(
  '/orders/:id',
  authMiddleware,
  isAdmin,
  [
    param('id').isMongoId().withMessage('Invalid order id'),
    body('status').optional().isIn(['pending','processing','shipped','delivered','cancelled']),
    body('paymentStatus').optional().isIn(['pending','paid','failed','refunded']),
    body('shippingCost').optional().isFloat({ min: 0 }),
  ],
  validate,
  updateOrder
);

// Eliminar orden (solo si está cancelada) (admin)
router.delete(
  '/orders/:id',
  authMiddleware,
  isAdmin,
  [ param('id').isMongoId().withMessage('Invalid order id') ],
  validate,
  deleteOrder
);

export default router;
