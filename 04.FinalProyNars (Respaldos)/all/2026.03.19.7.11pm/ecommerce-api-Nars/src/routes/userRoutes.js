import express from 'express';
import { body, param, query } from 'express-validator';
import validate from '../middlewares/validation.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/isAdminMiddleware.js';

import {
  getUserProfile,
  getAllUsers,
  getUserById,
  updateUserProfile,
  changePassword,
  updateUser,
  deactivateUser,
  toggleUserStatus,
  deleteUser,
  searchUser,
} from '../controllers/userController.js';

const router = express.Router();

// ---------------------
// RUTAS ESPECÍFICAS PRIMERO
// ---------------------

// Perfil del usuario autenticado
router.get('/me', authMiddleware, getUserProfile);

// Actualizar perfil propio
router.patch('/me',
  authMiddleware,
  [
    body('displayName').optional().isLength({ min: 2, max: 50 }),
    body('phone').optional().isLength({ max: 10 }),
    body('avatar').optional().isURL().withMessage('avatar must be a valid URL'),
  ],
  validate,
  updateUserProfile
);

// Cambiar contraseña propia
router.patch('/me/password',
  authMiddleware,
  [
    body('currentPassword').notEmpty().withMessage('currentPassword is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('newPassword must be at least 6 chars'),
  ],
  validate,
  changePassword
);

// ⚠️ Desactivar cuenta propia (SOFT) — DEBE IR ANTES de cualquier '/:userId'
router.patch('/deactivate', authMiddleware, deactivateUser);

// Búsqueda rápida (admin)
router.get('/search',
  authMiddleware,
  isAdmin,
  [ query('q').notEmpty().withMessage('q is required') ],
  validate,
  searchUser
);

// Listado (admin) con filtros y paginación
router.get('/',
  authMiddleware,
  isAdmin,
  [
    query('active').optional().isBoolean().withMessage('active must be boolean'),
    query('role').optional().isIn(['admin', 'customer', 'guest']).withMessage('Invalid role'),
    query('q').optional().isString().trim(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  getAllUsers
);

// ---------------------
// RUTAS CON :userId AL FINAL
// ---------------------

// Detalle por id (admin)
router.get('/:userId',
  authMiddleware,
  isAdmin,
  [ param('userId').isMongoId().withMessage('Invalid userId') ],
  validate,
  getUserById
);

// Actualizar un usuario (admin)
router.patch('/:userId',
  authMiddleware,
  isAdmin,
  [
    param('userId').isMongoId().withMessage('Invalid userId'),
    body('displayName').optional().isLength({ min: 2, max: 50 }),
    body('email').optional().isEmail().normalizeEmail(),
    body('phone').optional().isLength({ max: 10 }),
    body('role').optional().isIn(['admin', 'customer', 'guest']),
    body('active').optional().isBoolean(),
    body('avatar').optional().isURL().withMessage('avatar must be a valid URL'),
  ],
  validate,
  updateUser
);

// Toggle activo/inactivo (admin)
router.patch('/:userId/toggle-status',
  authMiddleware,
  isAdmin,
  [ param('userId').isMongoId().withMessage('Invalid userId') ],
  validate,
  toggleUserStatus
);

// Eliminar usuario (admin)
router.delete('/:userId',
  authMiddleware,
  isAdmin,
  [ param('userId').isMongoId().withMessage('Invalid userId') ],
  validate,
  deleteUser
);

export default router;
