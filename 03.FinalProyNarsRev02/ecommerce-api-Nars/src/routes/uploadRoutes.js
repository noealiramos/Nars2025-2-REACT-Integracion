import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/isAdminMiddleware.js';
import { uploadSingleImage } from '../middlewares/uploadMiddleware.js';
import { uploadImage } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/upload', authMiddleware, isAdmin, uploadSingleImage, uploadImage);

export default router;
