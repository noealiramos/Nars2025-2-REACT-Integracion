# Ramdi Jewelry Ecommerce

Proyecto full stack de ecommerce para joyeria con frontend en React/Vite y backend en Node.js/Express/MongoDB.

## Estructura

- `ecommerce-app-Nars`: frontend web
- `ecommerce-api-Nars`: API REST backend
- `docs/`: auditorias, QA, fixes y documentacion de entrega

## Stack

- Frontend: React 18, Vite, React Router, React Query, Axios, Cypress, Vitest
- Backend: Express 5, Mongoose, JWT, Helmet, CORS, rate limiting, Swagger, Vitest, Supertest
- Base de datos: MongoDB

## Funcionalidades

- catalogo publico con busqueda y paginacion
- autenticacion con access token + refresh token
- carrito persistente
- checkout con direcciones y metodos de pago
- confirmacion e historial de ordenes
- panel admin para productos y categorias
- pruebas unitarias, integracion y E2E

## Requisitos

- Node.js 18+
- MongoDB local o MongoDB Atlas

## Ejecucion local

### 1. Backend

```bash
cd ecommerce-api-Nars
npm install
npm start
```

API esperada en `http://localhost:3001`.

### 2. Frontend

```bash
cd ecommerce-app-Nars
npm install
npm run dev
```

App esperada en `http://localhost:5173`.

## Variables de entorno

### Backend

Variables principales:

- Copiar desde `ecommerce-api-Nars/.env.example`

- `PORT`
- `PUBLIC_API_URL`
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

### Frontend

- Copiar desde `ecommerce-app-Nars/.env.example`
- `VITE_API_URL`
- `CYPRESS_API_URL`
- `CYPRESS_BASE_URL`

Ejemplo local:

```bash
VITE_API_URL=http://localhost:3001/api
```

## Pruebas

### Backend

```bash
cd ecommerce-api-Nars
npm test
```

### Frontend

```bash
cd ecommerce-app-Nars
npm test
```

### E2E Cypress

Con backend y frontend levantados:

```bash
cd ecommerce-app-Nars
npx cypress run
```

## Despliegue sugerido

- Backend: Render
- Base de datos: MongoDB Atlas
- Frontend: Vercel, Netlify o Render Static Site

Para produccion:

- desactivar `ENABLE_TEST_AUTH_TOOLS`
- ajustar `CORS_WHITELIST`
- usar secretos reales fuera del repositorio
- apuntar `VITE_API_URL` al backend desplegado

## Documentacion clave

- `docs/README.md`
- `docs/architecture.md`
- `docs/endpoints.md`
- `docs/qa/`
- `docs/audit/`
- `docs/fixes/`
