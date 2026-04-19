# Endpoints

## Base URL local

- API: `http://localhost:3001/api`

## Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

## Users

- `GET /users/me`
- `GET /users`
- `GET /users/search`
- `PATCH /users/me`

## Products

- `GET /products`
- `GET /products/search`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

## Categories

- `GET /categories`
- `GET /categories/search`
- `GET /categories/:id`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`

## Cart

- `GET /cart/user`
- `POST /cart/add-product`
- `PUT /cart/:id`
- `DELETE /cart/:id`

## Orders

- `POST /orders`
- `POST /orders/checkout`
- `GET /orders/:id`
- `GET /orders/user/:userId`
- `PATCH /orders/:id/status`

## Shipping / Payment

- `GET /shipping-addresses`
- `POST /shipping-addresses`
- `PUT /shipping-addresses/:id`
- `DELETE /shipping-addresses/:id`
- `GET /payment-methods`
- `POST /payment-methods`
- `PUT /payment-methods/:id`
- `DELETE /payment-methods/:id`

## Otros

- `GET /health`
- `GET /docs`
- `POST /upload`

## Nota

La fuente de verdad completa para detalle de contratos es Swagger en `GET /api/docs`.
