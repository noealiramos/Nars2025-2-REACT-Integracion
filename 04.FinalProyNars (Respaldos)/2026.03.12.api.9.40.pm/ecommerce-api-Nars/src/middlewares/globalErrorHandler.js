import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import logger from './logger.js';

const setupGlobalErrorHandlers = () => {
  // Capturar errores no manejados
  process.on('uncaughtException', (error) => {
    logger.error({
      message: 'UNCAUGHT EXCEPTION',
      error: error.message,
      stack: error.stack
    });
    // In production, the process should exit to avoid undefined state
    console.error('CRITICAL: Uncaught exception. Exiting...');
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