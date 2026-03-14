import './src/config/env.js';
import env from './src/config/env.js';

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';

import dbConnection from './src/config/database.js';
import setupGlobalErrorHandlers from './src/middlewares/globalErrorHandler.js';
import requestId from './src/middlewares/requestId.js';
import mongoSanitize from 'express-mongo-sanitize';
import routes from './src/routes/index.js';

// Swagger
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/config/swagger.js';
import logger, { requestLogger } from './src/middlewares/logger.js';
import { logRateLimit } from './src/middlewares/securityLogger.js';

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

// --- Configuración de Seguridad ---

// 1. Helmet para headers de seguridad
app.use(helmet());

// 2. CORS con Whitelist
const whitelist = env.CORS_WHITELIST;

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
};
app.use(cors(corsOptions));

// 3. Limitación de tasa (Rate Limiting)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 100, // Límite de 100 peticiones por ventana
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logRateLimit(req, res);
    res.status(options.statusCode).send(options.message);
  }
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto para pruebas o 1 hora sugerida
  limit: 10,
  message: { message: 'Too many auth attempts, please try again later' },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logRateLimit(req, res);
    res.status(options.statusCode).send(options.message);
  }
});

// Aplicar limitadores
app.use('/api', globalLimiter);
app.use('/api/auth', authLimiter);

// Parseo de JSON
app.use(express.json());

// 4. Protección contra NoSQL Injection (Global)
// Se usa sanitización in-place para evitar problemas con getters en Express 5
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.query) mongoSanitize.sanitize(req.query);
  if (req.params) mongoSanitize.sanitize(req.params);
  next();
});

// Observabilidad
app.use(requestId);
app.use(requestLogger);

import mongoose from 'mongoose';

// Ruta de bienvenida + Health Check
app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    message: 'Ecommerce API Jewelry running',
    database: dbStatus,
    time: new Date().toISOString(),
    requestId: req.id,
  });
});

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Alias solicitado por producción

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

import errorHandler from './src/middlewares/errorHandler.js';

// Error handler al final
app.use(errorHandler);

const PORT = env.PORT;
if (env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} in ${env.NODE_ENV} mode`);
  });
}

export default app;
