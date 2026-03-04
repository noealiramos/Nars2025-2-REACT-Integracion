import mongoose from 'mongoose';
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



const router = express.Router();

// Solo permite modificar/eliminar un carrito si el usuario es el dueño o es admin
const ownerOrAdminByCartId = async (req, res, next) => {
  try {
    const authUserId = req.user?.id || req.user?.userId;
    const isAdminRole = req.user?.role === 'admin';
    const { id } = req.params;

    if (!authUserId) return res.status(401).json({ message: 'Unauthorized' });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid cart id' });
    }

    const cart = await Cart.findById(id).select('user').lean();
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    const isOwner = String(cart.user) === String(authUserId);
    if (!isOwner && !isAdminRole) {
      return res.status(403).json({ message: 'Forbidden: you can only modify your own cart' });
    }

    return next();
  } catch (e) {
    return next(e);
  }
};



// Permite ver el carrito solo si es el mismo usuario del token o si es admin
const allowSelfOrAdmin = (req, res, next) => {
  const authUserId = req.user?.id || req.user?.userId;
  const isAdminRole = req.user?.role === 'admin';
  const { userId } = req.params;

  if (!authUserId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (!isAdminRole && String(userId) !== String(authUserId)) {
    return res.status(403).json({ message: 'Forbidden: you can only access your own cart' });
  }
  return next();
};


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

// Obtener carrito por usuario (SIN userId en la ruta: el controller usa el token)
router.get(
  '/cart/user',
  authMiddleware,
  validate,
  getCartByUser
);

// Obtener carrito por usuario (CON userId explícito)
router.get(
  '/cart/user/:userId',
  authMiddleware,
  [param('userId').isMongoId().withMessage('Invalid user id')],
  validate,
  allowSelfOrAdmin,
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
  ownerOrAdminByCartId,   
  updateCart
);

// Eliminar carrito
router.delete(
  '/cart/:id',
  authMiddleware,
  [param('id').isMongoId().withMessage('Invalid cart id')],
  validate,
  ownerOrAdminByCartId,  
  deleteCart
);


export default router;
