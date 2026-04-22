# Architecture

## Vision general

El proyecto esta dividido en dos aplicaciones independientes:

- `ecommerce-api-Nars`: API REST backend
- `ecommerce-app-Nars`: frontend SPA

Ambas se comunican por HTTP usando `VITE_API_URL` en frontend.

## Backend

### Capas principales

- `src/app.js`: composicion de Express sin side effects
- `server.js`: bootstrap de base de datos, seed controlado y arranque
- `src/routes/`: rutas por dominio
- `src/controllers/`: logica de negocio por recurso
- `src/models/`: modelos Mongoose
- `src/middlewares/`: auth, roles, validacion, logging, errores
- `src/utils/`: helpers como paginacion y seed de test

### Seguridad

- JWT access + refresh
- Helmet
- CORS whitelist
- rate limiting
- sanitizacion NoSQL

## Frontend

### Capas principales

- `src/api/`: clientes HTTP y llamadas por dominio
- `src/services/`: adaptacion/normalizacion de respuestas
- `src/contexts/`: auth, cart y UI state global
- `src/hooks/`: logica reutilizable
- `src/pages/`: vistas principales
- `src/components/`: componentes UI

### Estado y sesion

- `AuthContext` maneja login, logout y sesion activa
- `apiClient` intenta refresh ante `401`
- `CartContext` maneja carrito y persistencia local

## Testing

- Backend: unit + integration + security con Vitest/Supertest
- Frontend: unit/component con Vitest + Testing Library
- E2E: Cypress con flujo real end-to-end

## Despliegue objetivo

- Backend: Render
- MongoDB: Atlas
- Frontend: hosting estatico o Render
