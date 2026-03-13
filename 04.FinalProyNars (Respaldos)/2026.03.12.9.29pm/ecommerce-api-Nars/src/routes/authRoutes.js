import express from 'express';
import { body } from 'express-validator';
import validate from '../middlewares/validation.js';
import { register, login, refresh } from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [displayName, email, password]
 *             properties:
 *               displayName: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       409:
 *         description: Email ya registrado
 */
router.post('/register', [
  body('displayName')
    .notEmpty().withMessage('Display name is required')
    .isLength({ min: 2, max: 50 }).withMessage('displayName must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s]+$/).withMessage('displayName must contain only letters, numbers and spaces'),
  body('email')
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('password is required')
    .isLength({ min: 6 }).withMessage('password must be at least 6 characters long'),
  body('phone')
    .optional()
    .isLength({ max: 10 }).withMessage('phone must be at most 10 digits'),
  body('avatar')
    .optional()
    .isURL().withMessage('Avatar must be a valid URL')
], validate, register);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión y obtener tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login exitoso
 *       400:
 *         description: Credenciales inválidas
 */
router.post('/login', [
  body('email')
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('password is required')
], validate, login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Renovar Access Token con un Refresh Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Nuevo Access Token generado
 *       401:
 *         description: Refresh Token inválido o expirado
 */
router.post('/refresh', [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
], validate, refresh);

export default router;
