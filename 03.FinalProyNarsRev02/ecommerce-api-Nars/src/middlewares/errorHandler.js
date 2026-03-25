import logger from './logger.js';

const errorHandler = (err, req, res, next) => {
  const rid = req.requestId || '-';
  const statusCode = err.status || err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);

  // Registro del error usando Winston
  logger.error({
    message: err.message,
    stack: err.stack,
    requestId: rid,
    status: statusCode,
    method: req.method,
    url: req.url,
  });

  // No enviar respuesta si ya se envió
  if (res.headersSent) {
    return next(err);
  }

  const isProduction = process.env.NODE_ENV === 'production';

  return res.status(statusCode).json({
    status: 'error',
    message: isProduction && statusCode === 500 ? 'Internal Server Error' : err.message,
    ...(isProduction ? {} : { stack: err.stack })
  });
};

export default errorHandler;
