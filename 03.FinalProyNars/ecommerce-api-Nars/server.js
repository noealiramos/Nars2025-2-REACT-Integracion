import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import dbConnection from './src/config/database.js';
import setupGlobalErrorHandlers from './src/middlewares/globalErrorHandler.js';
import requestId from './src/middlewares/requestId.js';
import logger from './src/middlewares/logger.js';
import errorHandler from './src/middlewares/errorHandler.js';
import routes from './src/routes/index.js';

//  Rutas correctas a tus modelos (minúsculas y dentro de src/models)
import Category from './src/models/category.js';
import Product from './src/models/product.js';

// Handlers globales de proceso (uncaughtException/rejection, etc.)
setupGlobalErrorHandlers();

// Conexión a Mongo (una sola vez)
await dbConnection();

// Fuerza createCollection() + índices sin insertar documentos
await Promise.all([Category.init(), Product.init()]);

const app = express();

// Middlewares base
app.use(helmet());
app.use(cors());
app.use(express.json());

// Observabilidad
app.use(requestId);
app.use(logger);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Ecommerce API Jewelry running',
    docsBase: '/api',
    time: new Date().toISOString(),
    requestId: req.id,
  });
});

// Montar rutas en /api
app.use('/api', routes);

// 404
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    error: 'Route not found',
    method: req.method,
    url: req.originalUrl,
  });
});

// Error handler al final
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
