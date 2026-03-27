# BACKLOG CONSOLIDADO

## Alcance

Este backlog se construye exclusivamente con evidencia real en el codigo de:

- `ecommerce-app-Nars`
- `ecommerce-api-Nars`

No se utilizo documentacion previa como fuente de verdad. La prioridad fue lo observable en rutas, servicios, paginas y middlewares.

## SPECS (endpoints y contratos reales)

### Swagger

- Documentacion expuesta en `/api/docs` y `/api-docs`.
- Fuente Swagger: `swagger-jsdoc` con `apis: ['./src/routes/*.js']`.
- Evidencia: `ecommerce-api-Nars/server.js`, `ecommerce-api-Nars/src/config/swagger.js`.

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- Evidencia: `ecommerce-api-Nars/src/routes/authRoutes.js`.

### Products

- `GET /api/products` (filtros `material`, `design`, `stone`, `order`)
- `GET /api/products/search` (q, category, minPrice, maxPrice, inStock, sort, order, page, limit)
- `GET /api/products/category/:idCategory`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- Evidencia: `ecommerce-api-Nars/src/routes/productRoutes.js`, `ecommerce-api-Nars/src/validators/productValidator.js`, `ecommerce-api-Nars/src/config/catalog.js`.

### Categories

- `GET /api/categories/search`
- `GET /api/categories`
- `GET /api/categories/:id`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`
- Evidencia: `ecommerce-api-Nars/src/routes/categoryRoutes.js`.

### Cart

- `GET /api/cart`
- `GET /api/cart/:id`
- `GET /api/cart/user`
- `GET /api/cart/user/:userId`
- `POST /api/cart`
- `POST /api/cart/add-product`
- `PUT /api/cart/:id`
- `DELETE /api/cart/:id`
- Evidencia: `ecommerce-api-Nars/src/routes/cartRoutes.js`.

### Orders

- `GET /api/orders`
- `GET /api/orders/user/:userId`
- `GET /api/orders/:id`
- `POST /api/orders`
- `POST /api/orders/checkout`
- `PATCH /api/orders/:id/cancel`
- `PATCH /api/orders/:id/status`
- `PATCH /api/orders/:id/payment-status`
- `PUT /api/orders/:id`
- `DELETE /api/orders/:id`
- Evidencia: `ecommerce-api-Nars/src/routes/orderRoutes.js`.

### Payment Methods

- `GET /api/payment-methods`
- `GET /api/payment-methods/default/:userId`
- `GET /api/payment-methods/user/:userId`
- `GET /api/payment-methods/:id`
- `POST /api/payment-methods`
- `PATCH /api/payment-methods/:id`
- `PATCH /api/payment-methods/:id/set-default`
- `PATCH /api/payment-methods/:id/deactivate`
- `PUT /api/payment-methods/:id`
- `DELETE /api/payment-methods/:id`
- Evidencia: `ecommerce-api-Nars/src/routes/paymentMethodRoutes.js`.

### Shipping Addresses

- `POST /api/shipping-addresses`
- `GET /api/shipping-addresses`
- `GET /api/shipping-addresses/default`
- `GET /api/shipping-addresses/:addressId`
- `PUT /api/shipping-addresses/:addressId`
- `PATCH /api/shipping-addresses/:addressId`
- `PATCH /api/shipping-addresses/:addressId/default`
- `DELETE /api/shipping-addresses/:addressId`
- Evidencia: `ecommerce-api-Nars/src/routes/shippingAddressRoutes.js`.

### Users

- `GET /api/users/me`
- `PATCH /api/users/me`
- `PATCH /api/users/me/password`
- `PATCH /api/users/deactivate`
- `GET /api/users/search`
- `GET /api/users`
- `GET /api/users/:userId`
- `PATCH /api/users/:userId`
- `PATCH /api/users/:userId/toggle-status`
- `DELETE /api/users/:userId`
- Evidencia: `ecommerce-api-Nars/src/routes/userRoutes.js`.

### Reviews

- `POST /api/reviews/`
- `GET /api/reviews/product/:productId`
- `GET /api/reviews/my-reviews`
- `PUT /api/reviews/:reviewId`
- `DELETE /api/reviews/:reviewId`
- Evidencia: `ecommerce-api-Nars/src/routes/reviewRoutes.js`.

### Wishlist

- `GET /api/wishlist/`
- `POST /api/wishlist/add`
- `GET /api/wishlist/check/:productId`
- `DELETE /api/wishlist/remove/:productId`
- `POST /api/wishlist/move-to-cart`
- `DELETE /api/wishlist/clear`
- Evidencia: `ecommerce-api-Nars/src/routes/wishListRoutes.js`.

### Notifications

- `GET /api/notifications`
- `GET /api/notifications/unread/:userId`
- `GET /api/notifications/user/:userId`
- `GET /api/notifications/:id`
- `POST /api/notifications`
- `PATCH /api/notifications/:id/mark-read`
- `PATCH /api/notifications/user/:userId/mark-all-read`
- `PUT /api/notifications/:id`
- `DELETE /api/notifications/:id`
- Evidencia: `ecommerce-api-Nars/src/routes/notificationRoutes.js`.

### Catalog

- `GET /api/catalog/meta`
- Evidencia: `ecommerce-api-Nars/src/routes/catalogRoutes.js`.

### Health

- `GET /api/health`
- `GET /`
- Evidencia: `ecommerce-api-Nars/src/routes/index.js`, `ecommerce-api-Nars/server.js`.

## Matriz de integracion FE-BE

### Integraciones confirmadas

- Auth: FE `/auth/*` -> BE `/api/auth/*`.
  Evidencia: `ecommerce-app-Nars/src/api/authApi.js`, `ecommerce-api-Nars/src/routes/authRoutes.js`.
- Products: FE `/products`, `/products/search`, `/products/category/:id` -> BE OK.
  Evidencia: `ecommerce-app-Nars/src/api/productApi.js`, `ecommerce-api-Nars/src/routes/productRoutes.js`.
- Categories: FE `/categories` y `/categories/:id` -> BE OK.
  Evidencia: `ecommerce-app-Nars/src/api/categoryApi.js`, `ecommerce-api-Nars/src/routes/categoryRoutes.js`.
- Orders: FE `/orders`, `/orders/:id`, `/orders/user/:userId`, `/orders/checkout` -> BE OK.
  Evidencia: `ecommerce-app-Nars/src/api/orderApi.js`, `ecommerce-api-Nars/src/routes/orderRoutes.js`.
- Payment Methods: FE `/payment-methods`, `/payment-methods/user/:userId` -> BE OK.
  Evidencia: `ecommerce-app-Nars/src/api/paymentApi.js`, `ecommerce-api-Nars/src/routes/paymentMethodRoutes.js`.

### Desalineaciones detectadas

- Shipping: FE usa `GET /shipping-addresses/user/:userId`, BE no expone esa ruta.
  Evidencia: `ecommerce-app-Nars/src/api/shippingApi.js`, `ecommerce-api-Nars/src/routes/shippingAddressRoutes.js`.

## Inventario de uso de localStorage

### Keys definidos

- `cart`, `accessToken`, `refreshToken`, `authToken`, `userData`, `lastOrder`, `orders`.
- Evidencia: `ecommerce-app-Nars/src/utils/storageHelpers.js`.

### Uso por modulo

- Auth tokens y user: set/get/remove en `authService` y `apiClient`.
  Evidencia: `ecommerce-app-Nars/src/services/authService.js`, `ecommerce-app-Nars/src/api/apiClient.js`.
- Carrito: persistencia `cart` en `CartContext`.
  Evidencia: `ecommerce-app-Nars/src/contexts/CartContext.jsx`.
- Historial de ordenes: `appendOrderToHistory` guarda `orders` y `lastOrder`.
  Evidencia: `ecommerce-app-Nars/src/utils/storageHelpers.js`, `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`.
- E2E: Cypress setea tokens en localStorage.
  Evidencia: `ecommerce-app-Nars/cypress/support/commands.js`.

## Backlog priorizado

### P0

- Documentar TODOS los endpoints con Swagger (solo Auth y una ruta de Cart tienen `@swagger`).
  Evidencia: `ecommerce-api-Nars/src/routes/authRoutes.js`, `ecommerce-api-Nars/src/routes/cartRoutes.js`.
- Corregir contrato de shipping entre FE y BE.
  Evidencia: `ecommerce-app-Nars/src/api/shippingApi.js`, `ecommerce-api-Nars/src/routes/shippingAddressRoutes.js`.

### P1

- Completar `components.schemas` para Order, Cart, Category, ShippingAddress, PaymentMethod, Review, Wishlist, Notification.
  Evidencia: `ecommerce-api-Nars/src/config/swagger.js`.
- Normalizar respuestas BE o consolidar adaptadores FE (hoy hay mapeos defensivos).
  Evidencia: `ecommerce-app-Nars/src/api/productApi.js`, `ecommerce-app-Nars/src/api/paymentApi.js`, `ecommerce-app-Nars/src/api/shippingApi.js`.

### P2

- Documentar endpoints que no tienen consumo FE actual (wishlist, notifications, reviews, users admin, catalog).
  Evidencia: `ecommerce-api-Nars/src/routes/wishListRoutes.js`, `ecommerce-api-Nars/src/routes/notificationRoutes.js`, `ecommerce-api-Nars/src/routes/reviewRoutes.js`, `ecommerce-api-Nars/src/routes/userRoutes.js`, `ecommerce-api-Nars/src/routes/catalogRoutes.js`.

## Hallazgos criticos

- Swagger incompleto para la mayoria de endpoints (riesgo de falta de contrato y pruebas).
  Evidencia: `ecommerce-api-Nars/src/config/swagger.js`, `ecommerce-api-Nars/src/routes/authRoutes.js`, `ecommerce-api-Nars/src/routes/cartRoutes.js`.
- Contrato roto de shipping en FE (endpoint inexistente en BE).
  Evidencia: `ecommerce-app-Nars/src/api/shippingApi.js`, `ecommerce-api-Nars/src/routes/shippingAddressRoutes.js`.
- Tokens en localStorage (riesgo XSS si hay inyeccion de script).
  Evidencia: `ecommerce-app-Nars/src/services/authService.js`, `ecommerce-app-Nars/src/api/apiClient.js`.
