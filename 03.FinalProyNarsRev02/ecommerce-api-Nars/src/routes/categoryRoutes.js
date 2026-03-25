import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategory
} from '../controllers/categoryController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/isAdminMiddleware.js';
import validate from '../middlewares/validation.js';

const router = express.Router();

const categoryIdValidation = [
  param('id').isMongoId().withMessage('Invalid category id')
];

const categoryWriteValidation = [
  body('name').notEmpty().withMessage('name is required').isLength({ min: 2, max: 100 }).withMessage('name must be between 2 and 100 characters').trim(),
  body('description').notEmpty().withMessage('description is required').isLength({ min: 3, max: 500 }).withMessage('description must be between 3 and 500 characters').trim(),
  body('parentCategory').optional({ values: 'null' }).isMongoId().withMessage('parentCategory must be a valid MongoId'),
  body('imageURL').optional({ values: 'null' }).isURL().withMessage('imageURL must be a valid URL').trim(),
];

const categorySearchValidation = [
  query('parentCategory').optional().isMongoId().withMessage('parentCategory must be a valid MongoId'),
  query('sort').optional().isIn(['name', 'createdAt']).withMessage('sort must be name or createdAt'),
  query('order').optional().isIn(['asc', 'desc']).withMessage('order must be asc or desc'),
];

router.get('/categories/search', categorySearchValidation, validate, searchCategory);
router.get('/categories', categorySearchValidation, validate, getCategories);
router.get('/categories/:id', categoryIdValidation, validate, getCategoryById);
router.post('/categories', authMiddleware, isAdmin, categoryWriteValidation, validate, createCategory);
router.put('/categories/:id', authMiddleware, isAdmin, categoryIdValidation, categoryWriteValidation, validate, updateCategory);
router.delete('/categories/:id', authMiddleware, isAdmin, categoryIdValidation, validate, deleteCategory);

export default router;
