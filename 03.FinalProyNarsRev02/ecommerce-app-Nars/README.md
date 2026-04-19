# Ramdi Jewelry - Frontend E-commerce React

Aplicacion frontend del e-commerce de joyeria Ramdi Jewelry. Consume una API real para catalogo, autenticacion, checkout y ordenes, y mantiene estado de sesion y carrito en el navegador para mejorar la experiencia del usuario.

## Stack

- React 18 + Vite
- React Router DOM 6
- Axios
- Context API
- Cypress
- CSS modular por componente

## Requisitos

- Node.js 18+
- Backend `ecommerce-api-Nars` corriendo en `http://localhost:3001`
- Variable opcional `VITE_API_URL` si la API no usa `http://localhost:3001/api`

## Instalacion

```bash
npm install
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm start
```

## Variables de entorno

Usa `.env.example` como base. Crea un archivo `.env.local` si necesitas cambiar la URL del backend:

```bash
VITE_API_URL=http://localhost:3001/api
```

Para Cypress puedes sobreescribir estas variables desde el shell:

```bash
CYPRESS_API_URL=http://localhost:3001/api
CYPRESS_BASE_URL=http://localhost:5173
```

## Funcionalidades actuales

- Catalogo dinamico consumido desde la API
- Vista de detalle de producto
- Carrito persistido en `localStorage`
- Registro e inicio de sesion contra backend
- Manejo de `accessToken` y `refreshToken`
- Checkout protegido por autenticacion
- Confirmacion de compra
- Historial de ordenes y detalle por orden
- Manejo centralizado de errores de API

## Rutas principales

- `/` catalogo
- `/product/:id` detalle de producto
- `/cart` carrito
- `/checkout` checkout protegido
- `/confirmation` confirmacion de compra
- `/orders` historial de ordenes
- `/orders/:id` detalle de orden
- `/login` acceso
- `/register` registro

## Arquitectura

- `src/api` clientes HTTP y llamadas por dominio
- `src/services` logica de consumo y transformacion de datos
- `src/contexts/AuthContext.jsx` sesion del usuario
- `src/contexts/CartContext.jsx` estado del carrito
- `src/components` estructura Atomic Design
- `src/pages` vistas principales y protegidas

## Autenticacion

La autenticacion usa la API real. El frontend:

- guarda `accessToken`, `refreshToken` y datos del usuario en `localStorage`
- adjunta el token Bearer a las solicitudes protegidas
- intenta renovar sesion automaticamente ante respuestas `401`
- dispara un evento `auth-error` cuando la renovacion falla para limpiar la sesion

## Pruebas E2E

Los escenarios de Cypress estan en `cypress/e2e` e incluyen:

- flujo principal de compra
- autenticacion
- carrito
- ordenes
- validaciones de login y checkout

Para ejecutarlas, el frontend debe estar disponible en `http://localhost:5173` y el backend en `http://localhost:3001`.

## Estado actual

- `npm run build` genera el build de produccion correctamente
- Cypress esta configurado para pruebas E2E
- El proyecto ya no usa login simulado: la autenticacion esta integrada con backend
