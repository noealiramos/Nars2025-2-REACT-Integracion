import './config/env.js';
import env from './config/env.js';

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';

import routes from './routes/index.js';
import swaggerSpec from './config/swagger.js';
import requestId from './middlewares/requestId.js';
import logger, { requestLogger } from './middlewares/logger.js';
import errorHandler from './middlewares/errorHandler.js';
import { logRateLimit } from './middlewares/securityLogger.js';

const app = express();

app.use(helmet());

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
  credentials: true,
};
app.use(cors(corsOptions));

const isNonProduction = env.NODE_ENV !== 'production';
const globalLimit = isNonProduction ? 1000 : 100;
const authLimit = isNonProduction ? 100 : 10;

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: globalLimit,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logRateLimit(req, res);
    res.status(options.statusCode).send(options.message);
  },
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: authLimit,
  message: { message: 'Too many auth attempts, please try again later' },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logRateLimit(req, res);
    res.status(options.statusCode).send(options.message);
  },
});

app.use('/api', globalLimiter);
app.use('/api/auth', authLimiter);

app.use(express.json());

app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.query) mongoSanitize.sanitize(req.query);
  if (req.params) mongoSanitize.sanitize(req.params);
  next();
});

app.use(requestId);
app.use(requestLogger);

app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    message: 'Ecommerce API Jewelry running',
    database: dbStatus,
    time: new Date().toISOString(),
    requestId: req.requestId,
  });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    error: 'Route not found',
    method: req.method,
    url: req.originalUrl,
  });
});

app.use(errorHandler);

export default app;
