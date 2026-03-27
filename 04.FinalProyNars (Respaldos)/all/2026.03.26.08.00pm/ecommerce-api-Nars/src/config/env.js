import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
if (nodeEnv) {
    dotenv.config({ path: `.env.${nodeEnv}`, override: true });
}

/**
 * Validates that all required environment variables are present.
 * Throws an error if any are missing.
 */
const requiredEnvVars = [
    'MONGODB_URI',
    'MONGODB_DB',
    'JWT_SECRET',
    'CORS_WHITELIST'
];

const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingVars.length > 0) {
    console.error(`❌ CRITICAL ERROR: Missing required environment variables: ${missingVars.join(', ')}`);
    console.error('Please check your .env file or environment configuration.');
    process.exit(1);
}

export const env = {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB,
    JWT_SECRET: process.env.JWT_SECRET,
    CORS_WHITELIST: process.env.CORS_WHITELIST.split(','),
    PORT: process.env.PORT || 3000,
    NODE_ENV: nodeEnv,
    ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL || '15m',
    REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL || '7d',
    ENABLE_TEST_AUTH_TOOLS: process.env.ENABLE_TEST_AUTH_TOOLS === 'true',
    START_SERVER: process.env.START_SERVER === 'true'
};

export default env;
