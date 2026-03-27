# Orders Feature

## Descripcion funcional

El usuario autenticado puede abrir `Mis ordenes`, revisar su historial y entrar al detalle de una compra individual. Si todavia no tiene compras, la interfaz muestra un estado vacio claro y accionable en lugar de una pantalla rota.

## Endpoints usados

- `POST /api/auth/login`
- `GET /api/orders/user/:userId`
- `GET /api/orders/:id`
- `POST /api/shipping-addresses`
- `POST /api/payment-methods`
- `POST /api/orders`
- `POST /api/auth/refresh`

## Decisiones tecnicas

1. Se implemento `src/services/orderService.js` para desacoplar el shape del backend del render React.
2. Se protegieron `/orders` y `/orders/:id` con `PrivateRoute`.
3. Se agregaron selectores `data-cy` en la nueva UI para pruebas E2E robustas.
4. Se reutilizo login con `cy.session` y seed real por API para evitar tests flaky.
5. Se endurecio `src/api/apiClient.js` para compatibilidad con JWT + refresh token y mejor trazabilidad de errores.
