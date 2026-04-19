import swaggerJSDoc from 'swagger-jsdoc';
import env from './env.js';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Jewelry E-commerce API (Nars)',
    version: '1.2.0',
    description: 'Documentación técnica de la API para plataforma de joyería con Node.js, Express 5 y MongoDB.',
  },
  servers: [
    {
      url: env.PUBLIC_API_URL,
      description: env.NODE_ENV === 'production' ? 'Entorno configurado' : 'Entorno activo',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d1' },
          displayName: { type: 'string', example: 'Juan Perez' },
          email: { type: 'string', format: 'email', example: 'juan@example.com' },
          role: { type: 'string', enum: ['admin', 'customer', 'guest'], example: 'customer' },
          active: { type: 'boolean', example: true },
        },
      },
      Product: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', example: 'Anillo de Oro 18k' },
          description: { type: 'string', example: 'Anillo elegante con diamante central.' },
          price: { type: 'number', example: 1200.50 },
          stock: { type: 'integer', example: 15 },
          category: { type: 'string' },
          material: { type: 'string', example: 'Gold' },
          design: { type: 'string', example: 'Classic' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Acceso denegado' },
          error: { type: 'string', example: 'Unauthorized' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Login successful' },
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
          user: { $ref: '#/components/schemas/User' },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
