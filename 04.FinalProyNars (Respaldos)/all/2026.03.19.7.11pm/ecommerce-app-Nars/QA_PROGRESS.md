# QA Progress

## Estado por fase

- Auth: ✅
- Cart: ✅
- Checkout: ✅
- Confirmation: ✅
- Orders: ✅

## Bugs detectados y corregidos

1. `apiClient` no manejaba de forma robusta errores 401 + refresh token.
   - Se agregó refresh centralizado, limpieza de sesion y logs estructurados.
2. `shippingApi` y `paymentApi` asumian respuestas planas.
   - Se corrigio el unwrap de `address` y `data` para compatibilidad con la API real.
3. No existia UI de historial/detalle de ordenes.
   - Se implementaron `/orders` y `/orders/:id` con proteccion por autenticacion.
4. El frontend dependia de `console.*` dispersos.
   - Se reemplazaron por `src/utils/logger.js` para debugging consistente.
5. Los tests de ordenes podian volverse flaky por login repetido y cache 304.
   - Se reutilizo login con `cy.session`, seed real por API y asserts tolerantes a `200/304`.
6. `ConfirmationPage` rompia el render al intentar mostrar una direccion como objeto.
   - Se normalizo la direccion y el metodo de pago antes de renderizarlos.
7. `CheckoutPage` no exponia de forma consistente errores reales del backend.
   - Se agrego parsing de `error`, `message` y `errors[]` para pruebas adversas reales.
8. Los comandos Cypress fallaban por `429` en ciclos largos.
   - Se agregaron reintentos con espera dinamica sobre `Retry-After`.

## Evidencia de pruebas

- `npx cypress run` en `ecommerce-app-Nars`: 14/14 OK
- Casos cubiertos por spec:
  - `auth.cy.js`: 4/4
  - `cart.cy.js`: 4/4
  - `checkoutErrors.cy.js`: 1/1
  - `goldenPath.cy.js`: 1/1
  - `loginErrors.cy.js`: 1/1
  - `orders.cy.js`: 3/3

## Notas QA

- Las pruebas usan API real, sin mocks en los flujos estabilizados.
- Se mantuvo `cy.session` para reutilizar login y bajar ruido de red/rate limit.
- Se reforzo el backend local para no bloquear la automatizacion por throttling agresivo en no produccion.
