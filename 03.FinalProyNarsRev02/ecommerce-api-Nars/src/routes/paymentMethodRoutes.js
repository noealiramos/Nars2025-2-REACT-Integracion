import express from 'express';
import ownerOrAdmin from '../middlewares/ownerOrAdmin.js';

import {
  getPaymentMethods,
  getPaymentMethodById,
  getPaymentMethodsByUser,
  createPaymentMethod,
  updatePaymentMethod,
  setDefaultPaymentMethod,
  deactivatePaymentMethod,   //  mantenemos soft delete
  // deletePaymentMethod,    // quitar este import (no existe en controller)
  getDefaultPaymentMethod,
} from '../controllers/paymentMethodController.js';
import isAdmin from '../middlewares/isAdminMiddleware.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { body, param } from 'express-validator';
import validate from '../middlewares/validation.js';

import PaymentMethod from '../models/paymentMethod.js';

const router = express.Router();
const paymentTypes = ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'];

const idParamValidation = [
  param('id').isMongoId().withMessage('Invalid payment method id')
];

const createPaymentMethodValidation = [
  body('user').optional().isMongoId().withMessage('user must be a valid MongoId'),
  body('type').notEmpty().withMessage('type is required').isIn(paymentTypes).withMessage('Invalid payment method type'),
  body('paypalEmail').optional().isEmail().withMessage('paypalEmail must be a valid email').normalizeEmail(),
  body('bankName').optional().isString().withMessage('bankName must be a string').trim(),
  body('accountNumber').optional().isString().withMessage('accountNumber must be a string').trim(),
  body('brand').optional().isString().withMessage('brand must be a string').trim(),
  body('last4').optional().isLength({ min: 4, max: 4 }).withMessage('last4 must contain 4 characters').isString().withMessage('last4 must be a string').trim(),
  body('cardHolderName').optional().isString().withMessage('cardHolderName must be a string').trim(),
  body('expiryDate').optional().matches(/^(0[1-9]|1[0-2])\/\d{2}$/).withMessage('expiryDate must be in MM/YY format'),
  body('isDefault').optional().isBoolean().withMessage('isDefault must be boolean'),
  body('active').optional().isBoolean().withMessage('active must be boolean'),
];

const updatePaymentMethodValidation = [
  body('user').optional().isMongoId().withMessage('user must be a valid MongoId'),
  body('type').optional().isIn(paymentTypes).withMessage('Invalid payment method type'),
  body('paypalEmail').optional().isEmail().withMessage('paypalEmail must be a valid email').normalizeEmail(),
  body('bankName').optional().isString().withMessage('bankName must be a string').trim(),
  body('accountNumber').optional().isString().withMessage('accountNumber must be a string').trim(),
  body('brand').optional().isString().withMessage('brand must be a string').trim(),
  body('last4').optional().isString().withMessage('last4 must be a string').isLength({ min: 4, max: 4 }).withMessage('last4 must contain 4 characters').trim(),
  body('cardHolderName').optional().isString().withMessage('cardHolderName must be a string').trim(),
  body('expiryDate').optional().matches(/^(0[1-9]|1[0-2])\/\d{2}$/).withMessage('expiryDate must be in MM/YY format'),
  body('isDefault').optional().isBoolean().withMessage('isDefault must be boolean'),
  body('active').optional().isBoolean().withMessage('active must be boolean'),
];

// Obtener todos los métodos de pago activos (admin)
router.get('/payment-methods', authMiddleware, isAdmin, getPaymentMethods);

// Obtener método de pago predeterminado de un usuario
router.get(
  '/payment-methods/default/:userId',
  authMiddleware,
  ownerOrAdmin('userId'),
  [param('userId').isMongoId().withMessage('Invalid user id')],
  validate,
  getDefaultPaymentMethod
);

// Obtener métodos de pago de un usuario
router.get(
  '/payment-methods/user/:userId',
  authMiddleware,
  ownerOrAdmin('userId'),
  [param('userId').isMongoId().withMessage('Invalid user id')],
  validate,
  getPaymentMethodsByUser
);

// Obtener método de pago por ID
router.get(
  '/payment-methods/:id',
  authMiddleware,
  idParamValidation,
  validate,
  ownerOrAdmin({ model: PaymentMethod }),
  getPaymentMethodById
);

// Crear nuevo método de pago
router.post('/payment-methods', authMiddleware, createPaymentMethodValidation, validate, createPaymentMethod);


// Actualización parcial explícita (opcional)
router.patch(
  '/payment-methods/:id',
  authMiddleware,
  idParamValidation,
  updatePaymentMethodValidation,
  validate,
  ownerOrAdmin({ model: PaymentMethod }),
  updatePaymentMethod
);

// Establecer método de pago como predeterminado
router.patch(
  '/payment-methods/:id/set-default',
  authMiddleware,
  idParamValidation,
  validate,
  ownerOrAdmin({ model: PaymentMethod }),
  setDefaultPaymentMethod
);

// Desactivar método de pago (soft delete explícito)
router.patch(
  '/payment-methods/:id/deactivate',
  authMiddleware,
  idParamValidation,
  validate,
  ownerOrAdmin({ model: PaymentMethod }),
  deactivatePaymentMethod
);

// Actualizar método de pago
router.put(
  '/payment-methods/:id',
  authMiddleware,
  idParamValidation,
  validate,
  ownerOrAdmin({ model: PaymentMethod }),
  updatePaymentMethod
);

// DELETE que realiza **soft delete** reusando el mismo handler
router.delete(
  '/payment-methods/:id',
  authMiddleware,
  idParamValidation,
  validate,
  ownerOrAdmin({ model: PaymentMethod }),
  deactivatePaymentMethod
);

export default router;
