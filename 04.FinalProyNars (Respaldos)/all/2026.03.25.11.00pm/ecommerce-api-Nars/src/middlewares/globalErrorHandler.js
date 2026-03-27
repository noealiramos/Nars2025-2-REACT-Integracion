import logger from './logger.js';

const setupGlobalErrorHandlers = () => {
  // Capturar errores no manejados
  process.on('uncaughtException', (error) => {
    logger.error({
      message: 'UNCAUGHT EXCEPTION',
      error: error.message,
      stack: error.stack
    });
    process.stderr.write('CRITICAL: Uncaught exception. Exiting...\n');
    process.exit(1);
  });

  // Capturar promesas rechazadas no manejadas
  process.on('unhandledRejection', (reason, promise) => {
    logger.error({
      message: 'UNHANDLED REJECTION',
      reason: reason,
      promise: promise
    });
  });
};

export default setupGlobalErrorHandlers;
