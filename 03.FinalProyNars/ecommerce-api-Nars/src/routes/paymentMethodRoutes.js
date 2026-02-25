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

const router = express.Router();

// Obtener todos los métodos de pago activos (admin)
router.get('/payment-methods', authMiddleware, isAdmin, getPaymentMethods);

// Obtener método de pago predeterminado de un usuario
router.get(
  '/payment-methods/default/:userId',
  authMiddleware,
  ownerOrAdmin('userId'),
  getDefaultPaymentMethod
);

// Obtener métodos de pago de un usuario
router.get(
  '/payment-methods/user/:userId',
  authMiddleware,
  ownerOrAdmin('userId'),
  getPaymentMethodsByUser
);

// Obtener método de pago por ID
router.get('/payment-methods/:id', authMiddleware, getPaymentMethodById);

// Crear nuevo método de pago
router.post('/payment-methods', authMiddleware, createPaymentMethod);


// Actualización parcial explícita (opcional)
router.patch('/payment-methods/:id', authMiddleware, updatePaymentMethod);

// Establecer método de pago como predeterminado
router.patch('/payment-methods/:id/set-default', authMiddleware, setDefaultPaymentMethod);

// Desactivar método de pago (soft delete explícito)
router.patch('/payment-methods/:id/deactivate', authMiddleware, deactivatePaymentMethod);

// Actualizar método de pago
router.put('/payment-methods/:id', authMiddleware, updatePaymentMethod);

// DELETE que realiza **soft delete** reusando el mismo handler
router.delete('/payment-methods/:id', authMiddleware, deactivatePaymentMethod);

export default router;
