import express from 'express';
import { body } from 'express-validator';
import validate from '../middlewares/validation.js';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', [
  body('displayName')
    .notEmpty().withMessage('displayName is required')
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

router.post('/login', [
  body('email')
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('password is required')
], validate, login);

export default router;
