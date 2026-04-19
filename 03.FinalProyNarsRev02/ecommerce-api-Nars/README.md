# ecommerce-api-Nars

API REST del ecommerce Ramdi Jewelry.

## Stack

- Node.js
- Express 5
- Mongoose
- JWT
- Helmet
- CORS
- express-rate-limit
- express-validator
- Swagger
- Vitest + Supertest

## Ejecucion local

```bash
npm install
npm start
```

Servidor por defecto en `http://localhost:3001`.

### Modo test server

```bash
npm run start:test
```

## Scripts

```bash
npm run dev
npm start
npm run start:test
npm test
npm run test:coverage
npm run lint
```

## Variables de entorno

Variables principales:

- `PORT`
- `MONGODB_URI`
- `MONGODB_DB`
- `JWT_SECRET`
- `CORS_WHITELIST`
- `ACCESS_TOKEN_TTL`
- `REFRESH_TOKEN_TTL`
- `ENABLE_TEST_AUTH_TOOLS`
- `START_SERVER`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Endpoints principales

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### Users

- `GET /api/users/me`
- `GET /api/users`
- `GET /api/users/search`

### Products

- `GET /api/products`
- `GET /api/products/search`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Cart / Orders

- `GET /api/cart/user`
- `POST /api/cart/add-product`
- `POST /api/orders`
- `POST /api/orders/checkout`
- `GET /api/orders/user/:userId`
- `GET /api/orders/:id`

### Categories

- `GET /api/categories`
- `GET /api/categories/search`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### Otros

- `GET /api/health`
- `GET /api/docs`
- `POST /api/upload`

## Documentacion API

- Swagger UI: `http://localhost:3001/api/docs`

## Testing

```bash
npm test
```

La suite incluye unit, integration y security tests.

## Notas de despliegue

- separar `app` de `server` ya esta resuelto para testing limpio
- en produccion se deben sacar secretos del repositorio
- `ENABLE_TEST_AUTH_TOOLS` debe ir en `false`
- `START_SERVER` debe ajustarse segun entorno
