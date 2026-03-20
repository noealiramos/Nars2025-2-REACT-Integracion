import express from 'express';
import { body, param } from 'express-validator';
import validate from '../middlewares/validation.js';
import {
  createShippingAddress,
  getUserAddresses,
  getAddressById,
  getDefaultAddress,
  updateShippingAddress,
  setDefaultAddress,
  deleteShippingAddress
} from '../controllers/shippingAddressController.js';
import ownerOrAdmin from '../middlewares/ownerOrAdmin.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import ShippingAddress from '../models/shippingAddress.js';

const router = express.Router();

const addressIdValidation = [
  param('addressId').isMongoId().withMessage('Address ID must be a valid MongoDB ObjectId')
];

/* -----------------------------
 * Validaciones para POST/PUT (completas)
 * ----------------------------- */
const addressValidations = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .trim(),

  body('address')
    .notEmpty().withMessage('Address is required')
    .isLength({ min: 5, max: 200 }).withMessage('Address must be between 5 and 200 characters')
    .trim(),

  body('city')
    .notEmpty().withMessage('City is required')
    .isLength({ min: 2, max: 50 }).withMessage('City between 2-50 chars')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('City: letters and spaces only')
    .trim(),

  body('state')
    .notEmpty().withMessage('State is required')
    .isLength({ min: 2, max: 50 }).withMessage('State between 2-50 chars')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('State: letters and spaces only')
    .trim(),

  body('postalCode')
    .notEmpty().withMessage('Postal code is required')
    .isLength({ min: 4, max: 6 }).withMessage('Postal code 4-6 chars')
    .isNumeric().withMessage('Postal code: numbers only')
    .trim(),

  body('country')
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage('Country 2-50 chars')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('Country: letters and spaces only')
    .trim(),

  body('phone')
    .notEmpty().withMessage('Phone is required')
    .isLength({ min: 10, max: 15 }).withMessage('Phone 10-15 chars')
    .matches(/^[0-9+\-\s()]+$/).withMessage('Phone format error')
    .trim(),

  body('isDefault')
    .optional()
    .isBoolean().withMessage('isDefault: boolean required'),

  body('addressType')
    .optional()
    .isIn(['home', 'work', 'other']).withMessage('Address type: home, work, other')
];

/* -----------------------------
 * Validaciones para PATCH (opcionales)
 * ----------------------------- */
const patchValidations = [
  ...addressIdValidation,

  body('name').optional().isLength({ min: 2, max: 100 }).trim(),
  body('address').optional().isLength({ min: 5, max: 200 }).trim(),
  body('city').optional().isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).trim(),
  body('state').optional().isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).trim(),
  body('postalCode').optional().isLength({ min: 4, max: 6 })
    .isNumeric().trim(),
  body('country').optional().isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).trim(),
  body('phone').optional().isLength({ min: 10, max: 15 })
    .matches(/^[0-9+\-\s()]+$/).trim(),
  body('isDefault').optional().isBoolean(),
  body('addressType').optional().isIn(['home', 'work', 'other']),
];

/* -----------------------------
 * Rutas (orden: auth → validators → validate → ownerOrAdmin → controller)
 * ----------------------------- */

// Crear una nueva dirección (usuario autenticado)
router.post(
  '/',
  authMiddleware,
  addressValidations,
  validate,
  createShippingAddress
);

// Obtener todas las direcciones del usuario
router.get(
  '/',
  authMiddleware,
  getUserAddresses
);

// Obtener la dirección por defecto del usuario
router.get(
  '/default',
  authMiddleware,
  getDefaultAddress
);

// Obtener una dirección específica del usuario (por ID)
router.get(
  '/:addressId',
  authMiddleware,
  addressIdValidation,
  validate,
  ownerOrAdmin({ model: ShippingAddress, paramName: 'addressId' }),
  getAddressById
);

// Actualizar una dirección (PUT completo)
router.put(
  '/:addressId',
  authMiddleware,
  [
    ...addressIdValidation,
    ...addressValidations
  ],
  validate,
  ownerOrAdmin({ model: ShippingAddress, paramName: 'addressId' }),
  updateShippingAddress
);

// Actualización parcial (PATCH)
router.patch(
  '/:addressId',
  authMiddleware,
  patchValidations,
  validate,
  ownerOrAdmin({ model: ShippingAddress, paramName: 'addressId' }),
  updateShippingAddress
);

// Marcar una dirección como default
router.patch(
  '/:addressId/default',
  authMiddleware,
  addressIdValidation,
  validate,
  ownerOrAdmin({ model: ShippingAddress, paramName: 'addressId' }),
  setDefaultAddress
);

// Eliminar una dirección
router.delete(
  '/:addressId',
  authMiddleware,
  addressIdValidation,
  validate,
  ownerOrAdmin({ model: ShippingAddress, paramName: 'addressId' }),
  deleteShippingAddress
);

export default router;
