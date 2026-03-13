import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Formato personalizado para logs legibles en consola
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
    return `[${timestamp}] ${service} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
  })
);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'ecommerce-api' },
  transports: [
    // Logs de Errores Críticos
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error'
    }),
    // Logs de Seguridad (Login fallido, IDOR, etc)
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/security.log'),
      level: 'warn' // Usamos warn como base para eventos de seguridad no críticos pero audibles
    }),
    // Logs Combinados
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/combined.log')
    }),
  ],
});

// En desarrollo, imprimir también a consola con formato legible
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

export default logger;
