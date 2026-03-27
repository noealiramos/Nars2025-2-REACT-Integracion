import mongoose from 'mongoose';
import logger from '../middlewares/logger.js';

export default async function dbConnection() {
  try {
    const { MONGODB_URI, MONGODB_DB } = process.env;
    if (!MONGODB_URI || !MONGODB_DB) {
      throw new Error('Missing MONGODB_URI or MONGODB_DB in .env');
    }

    // Materializa colecciones/índices al iniciar modelos (sin seed)
    mongoose.set('autoCreate', true);
    mongoose.set('autoIndex', process.env.NODE_ENV !== 'production');

    await mongoose.connect(`${MONGODB_URI}/${MONGODB_DB}`);
    logger.info({ message: 'MongoDB is connected', database: MONGODB_DB });
  } catch (error) {
    logger.error({
      message: 'Mongo connection error',
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
}
