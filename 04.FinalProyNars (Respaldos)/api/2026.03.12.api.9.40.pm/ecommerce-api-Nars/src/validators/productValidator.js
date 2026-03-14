import { body, query, param } from 'express-validator';
import { MATERIALS, DESIGNS, STONES } from '../config/catalog.js';

export const productListValidator = [
    query('material').optional().isIn(MATERIALS).withMessage(`Material must be one of: ${MATERIALS.join(', ')}`),
    query('design').optional().isIn(DESIGNS).withMessage(`Design must be one of: ${DESIGNS.join(', ')}`),
    query('stone').optional().isIn(STONES).withMessage(`Stone must be one of: ${STONES.join(', ')}`),
    query('order').optional().isIn(['asc', 'desc']).withMessage('Order must be asc or desc'),
];

export const productSearchValidator = [
    query('q').optional().isString().trim(),
    query('category').optional().isMongoId().withMessage('category must be a valid MongoDB ObjectId'),
    query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be a positive number'),
    query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be a positive number'),
    query('inStock').optional().isBoolean().withMessage('inStock must be boolean'),
    query('sort').optional().isIn(['name', 'price', 'createdAt']).withMessage('Invalid sort field'),
    query('order').optional().isIn(['asc', 'desc']).withMessage('Order must be asc or desc'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be at least 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

export const productCategoryValidator = [
    param('idCategory').isMongoId().withMessage('Category ID must be a valid MongoDB ObjectId'),
];

export const productIdParamValidator = [
    param('id').isMongoId().withMessage('Product ID must be a valid MongoDB ObjectId'),
];

export const productCreateValidator = [
    body('material').isIn(MATERIALS).withMessage(`Material is required and must be one of: ${MATERIALS.join(', ')}`),
    body('design').isIn(DESIGNS).withMessage(`Design is required and must be one of: ${DESIGNS.join(', ')}`),
    body('stone').optional().isIn(STONES).withMessage(`Stone must be one of: ${STONES.join(', ')}`),
];

export const productUpdateValidator = [
    param('id').isMongoId().withMessage('Invalid Product ID'),
    body('material').optional().isIn(MATERIALS).withMessage(`Material must be one of: ${MATERIALS.join(', ')}`),
    body('design').optional().isIn(DESIGNS).withMessage(`Design must be one of: ${DESIGNS.join(', ')}`),
    body('stone').optional().isIn(STONES).withMessage(`Stone must be one of: ${STONES.join(', ')}`),
];
