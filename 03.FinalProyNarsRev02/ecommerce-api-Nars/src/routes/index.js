import express from 'express';
import mongoose from 'mongoose';
import logger from '../middlewares/logger.js';

import authRoutes from './authRoutes.js';
import testAuthRoutes from './testAuthRoutes.js';
import cartRoutes from './cartRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import orderRoutes from './orderRoutes.js';
import paymentMethodRoutes from './paymentMethodRoutes.js';
import productRoutes from './productRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import shippingAddressRoutes from './shippingAddressRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import userRoutes from './userRoutes.js';
import wishListRoutes from './wishListRoutes.js';

import catalogRoutes from './catalogRoutes.js';

const router = express.Router();



/* ---- Con prefijo aquí (los módulos internos NO traen su base) ---- */
router.use('/auth', authRoutes);                // /api/auth/...
router.use(testAuthRoutes);
router.use('/users', userRoutes);               // /api/users/...
router.use('/shipping-addresses', shippingAddressRoutes); // /api/shipping-addresses/...
router.use(uploadRoutes);
router.use('/reviews', reviewRoutes);           // /api/reviews/...
router.use('/wishlist', wishListRoutes);        // /api/wishlist/...
router.use('/catalog', catalogRoutes);          // /api/catalog/...

/* ---- Sin prefijo aquí (los módulos internos YA traen su base) ---- */
router.use(cartRoutes);             // define /cart/...            -> /api/cart/...
router.use(categoryRoutes);         // define /categories/...      -> /api/categories/...
router.use(notificationRoutes);     // define /notifications/...   -> /api/notifications/...
router.use(orderRoutes);            // define /orders/...          -> /api/orders/...
router.use(paymentMethodRoutes);    // define /payment-methods/... -> /api/payment-methods/...
router.use(productRoutes);          // define /products/...        -> /api/products/...

/* ---- Health avanzado: comprueba API + conexión MongoDB ---- */
router.get('/health', async (req, res) => {
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized'
  };

  const conn = mongoose.connection;
  const mongoStatus = {
    state: conn.readyState,
    stateText: stateMap[conn.readyState] || 'unknown'
  };

  let mongoOk = false;
  try {
    if (conn.readyState === 1 && conn.db) {
      await conn.db.admin().command({ ping: 1 });
      mongoOk = true;
    }
  } catch (error) {
    logger.error({
      message: 'Health check Mongo ping failed',
      error: error.message,
      stack: error.stack,
      requestId: req.requestId || '-',
      method: req.method,
      url: req.originalUrl,
    });
    mongoStatus.error = 'Database connection error';
  }

  const overallStatus = mongoOk ? 'ok' : 'error';

  res.status(mongoOk ? 200 : 503).json({
    status: overallStatus,
    service: 'ecommerce-api-jewelry',
    time: new Date().toISOString(),
    mongo: mongoStatus,
    requestId: req.requestId
  });
});

export default router;
