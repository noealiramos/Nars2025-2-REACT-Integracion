import mongoose from 'mongoose';

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
    console.log('MongoDB is connected');
  } catch (error) {
    console.error('Mongo connection error:', error.message);
    process.exit(1);
  }
}
