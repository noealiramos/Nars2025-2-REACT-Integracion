import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const errorHandler = (err, req, res, next) => {
  const logFilePath = path.join(__dirname, '../../logs/error.log');
  const dateTime = new Date();


  const rid = req.requestId || '-';
  const status = res.statusCode || 500;
  const logMessage = `${dateTime.toISOString()} | ${rid} | ${status} | ${req.method} ${req.url} | ${err.message} | ${err.stack}\n`;
  //const logMessage = `${dateTime.toISOString()} | ${req.method} ${req.url} | ${err.message} | ${err.stack}\n`;

  // Crear directorio si no existe
  const logDir = path.dirname(logFilePath);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  fs.appendFile(logFilePath, logMessage, (fsErr) => {
    if (fsErr) {
      console.error('Failed to write into log file:', fsErr);
    }
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