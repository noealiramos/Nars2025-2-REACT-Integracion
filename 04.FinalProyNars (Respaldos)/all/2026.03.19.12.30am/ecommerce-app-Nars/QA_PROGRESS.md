# QA Progress

## Estado por fase

- Auth: ✅
- Checkout: ✅
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

## Evidencia de pruebas

- `npm run build` en `ecommerce-app-Nars`: OK
- `npx cypress run --spec cypress/e2e/orders.cy.js`: 3/3 OK
- Casos cubiertos en `cypress/e2e/orders.cy.js`:
  - ASOS-001 usuario autenticado ve sus ordenes
  - ASOS-002 usuario ve detalle de una orden
  - ASOS-003 lista vacia sin crashes

## Notas QA

- Las pruebas usan API real, sin mocks.
- Los selectores nuevos usan `data-cy`.
- Se mantuvo `cy.session` para reutilizar login y bajar ruido de red/rate limit.
