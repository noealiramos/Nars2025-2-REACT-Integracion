import logger from './logger.js';

const errorHandler = (err, req, res, next) => {
  const rid = req.requestId || '-';
  const status = res.statusCode || 500;

  // Registro del error usando Winston
  logger.error({
    message: err.message,
    stack: err.stack,
    requestId: rid,
    status: status,
    method: req.method,
    url: req.url,
  });

  // No enviar respuesta si ya se envió
  if (!res.headersSent) {
    const statusCode = err.status || err.statusCode || 500;
    const isProduction = process.env.NODE_ENV === 'production';

    res.status(statusCode).json({
      status: 'error',
      message: isProduction && statusCode === 500 ? 'Internal Server Error' : err.message,
      ...(isProduction ? {} : { stack: err.stack })
    });
  }
};

export default errorHandler;