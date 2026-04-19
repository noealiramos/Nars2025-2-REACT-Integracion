# UI fixes ecommerce 2026-04-18 0144

## Resumen ejecutivo

- Objetivo de la fase: corregir el IVA visible en la pagina final de compra sin rehacer backend ni arquitectura si no era necesario.
- Resultado: correccion aplicada solo en frontend, manteniendo la logica actual de calculo ya existente en carrito.
- Estado final: carrito y confirmation ahora usan la misma formula visible de subtotal + IVA + envio.

## Comandos ejecutados

| Comando | Salida relevante |
| --- | --- |
| `git status --short` | Worktree sucio antes de editar; habia cambios previos en `CheckoutPage.jsx`, `CheckoutPage.test.jsx` y varios modulos fuera de alcance. |
| `git diff --stat` | Confirmo cambios previos amplios en el monorepo; se trabajo solo sobre archivos de IVA visible en frontend y pruebas relacionadas. |
| `git diff -- <archivos IVA>` | Mostro que `ConfirmationPage.jsx` seguia intentando renderizar `order.iva` directo y que no existia todavia una correccion previa en confirmation. |
| `npm run test` | `13 passed`, `75 passed`, duracion `19.83s`. |
| `npm run build` | `208 modules transformed`, `built in 5.08s`. |
| `npx cypress run` | `13 specs`, `33 tests`: `25 passing`, `2 failing`, `6 skipped`. `cart.cy.js` y `goldenPath.cy.js` pasaron con nuevas assertions de IVA. |

## Salida relevante de terminal

### `npm run test`

```text
Test Files  13 passed (13)
Tests       75 passed (75)
Duration    19.83s
```

### `npm run build`

```text
vite v6.4.1 building for production...
208 modules transformed.
✓ built in 5.08s
```

### `npx cypress run`

```text
Specs: 13 found
Total: 33 tests
Passing: 25
Failing: 2
Skipped: 6

Falla 1:
authLifecycle.cy.js
expected 404 to equal 200
en /api/auth/test/revoke-refresh-tokens

Falla 2:
checkoutReuse.cy.js
before all hook esperando 201 y recibiendo undefined
durante bootstrap previo del spec
```

### Advertencias importantes de consola

```text
Warning: We failed to trash the existing run results.
This error will not affect or change the exit code.
```

- El warning corresponde a limpieza de screenshots previos de `responsiveEvidence.cy.js`.
- No afecto el resultado de las pruebas que si ejecutaron assertions del alcance de esta fase.

## Hallazgos de auditoria

### 1. Fuente actual del IVA en carrito

- `ecommerce-app-Nars/src/components/organisms/CartSummary.jsx` ya calculaba IVA como `subtotal * 0.16`.
- El `subtotal` en carrito viene de `CartContext.totalPrice`, que representa la suma de los productos sin IVA.
- El total visible en carrito ya era `subtotal + iva + shipping`.

### 2. Fuente actual del IVA en confirmation

- `ecommerce-app-Nars/src/pages/ConfirmationPage.jsx` intentaba mostrar `order.iva`.
- El payload final de orden usado por confirmation no traia `iva`.
- Confirmation reconstruia `subtotal` como `order.totalPrice - shippingCost`, pero no reconstruia IVA.
- Resultado: IVA se renderizaba como `0.00` por `formatMoney(undefined || 0)`.

### 3. Caso real confirmado

- Aplica el Caso D.
- Carrito calcula IVA solo en frontend.
- La orden final no entrega `iva` dedicado.
- Confirmation no recalculaba el valor faltante y por eso lo mostraba en `0.00`.

## Causa raiz encontrada

- El carrito y confirmation no compartian una misma capa de calculo visible.
- Carrito ya tenia la formula, pero confirmation dependia de un campo `order.iva` que no llegaba.
- El bug visible no era que el IVA no existiera conceptualmente, sino que la pantalla final no tenia una reconstruccion segura del dato.

## Decision tecnica tomada

- Corregir solo frontend.
- No tocar backend ni contratos API porque la auditoria no mostro necesidad indispensable para esta fase.
- Reutilizar la formula actual del carrito en un helper comun para evitar duplicacion blanda y mantener consistencia visual.
- Calcular `subtotal`, `iva` y `total` visibles en confirmation desde los items cuando el payload no trae `iva`.

## Archivos revisados

- `ecommerce-app-Nars/src/components/organisms/CartSummary.jsx`
- `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`
- `ecommerce-app-Nars/src/pages/ConfirmationPage.jsx`
- `ecommerce-app-Nars/src/constants/orderConstants.js`
- `ecommerce-app-Nars/src/services/orderService.js`
- `ecommerce-app-Nars/src/pages/CartPage.jsx`
- `ecommerce-app-Nars/src/pages/OrderDetailPage.jsx`
- `ecommerce-app-Nars/src/pages/__tests__/CartPage.test.jsx`
- `ecommerce-app-Nars/cypress/e2e/cart.cy.js`
- `ecommerce-app-Nars/cypress/e2e/goldenPath.cy.js`

## Archivos modificados

- `ecommerce-app-Nars/src/constants/orderConstants.js`
- `ecommerce-app-Nars/src/components/organisms/CartSummary.jsx`
- `ecommerce-app-Nars/src/pages/ConfirmationPage.jsx`
- `ecommerce-app-Nars/src/pages/__tests__/CartPage.test.jsx`
- `ecommerce-app-Nars/src/pages/__tests__/ConfirmationPage.test.jsx`
- `ecommerce-app-Nars/cypress/e2e/cart.cy.js`
- `ecommerce-app-Nars/cypress/e2e/goldenPath.cy.js`
- `docs/specs/2026-04-16-ui-fixes-ecommerce.md`
- `docs/specs/ui-fixes-ecommerce_2026-04-18-0144.md`

## Implementacion aplicada

- Se agregaron helpers en `orderConstants.js` para `TAX_RATE`, `calculateTaxAmount(...)` y `calculateOrderDisplayTotal(...)`.
- `CartSummary.jsx` ahora usa esos helpers, sin cambiar la logica existente del carrito.
- `ConfirmationPage.jsx` ahora normaliza items, calcula subtotal desde items si hace falta, calcula IVA cuando el payload no lo trae y arma el total visible con la misma formula del carrito.
- Se agrego prueba unitaria nueva para confirmation verificando que IVA ya no queda en `0.00` cuando el backend no lo envia.
- Se reforzaron pruebas unitarias y E2E del flujo para comprobar IVA visible tanto en carrito como en confirmation.

## Riesgos detectados

- El backend sigue sin persistir un campo dedicado de IVA en la orden.
- `OrdersPage` y `OrderDetailPage` siguen usando `totalPrice` del backend sin una capa de IVA visible; no se tocaron porque quedaron fuera del alcance solicitado.
- El worktree ya venia sucio en varios archivos, por lo que la fase se aplico encima del estado actual sin revertir trabajo ajeno.
- La suite completa de Cypress sigue teniendo fallas previas/ajenas en auth lifecycle y checkout reuse.

## Validaciones manuales

- Carrito: mantiene subtotal, IVA, envio y total visibles.
- Checkout: el flujo principal sigue navegando y creando orden sin romperse.
- Confirmation: ya muestra IVA distinto de `0.00` cuando el backend no lo envia.
- Consistencia: confirmation muestra la misma estructura visible de subtotal + IVA + envio + total que el carrito.
- No se modifico backend ni se duplicaron endpoints.

## Resultados de tests

- Vitest: verde total (`75/75`).
- Build: verde total.
- Cypress `cart.cy.js`: verde con assertions nuevas de IVA visible.
- Cypress `goldenPath.cy.js`: verde con assertions nuevas de IVA visible en confirmation.
- Cypress full run: ejecutado y documentado; las fallas restantes no pertenecen al alcance directo de esta correccion.

## Estado final

- IVA visible corregido en confirmation.
- Carrito sigue mostrando IVA correctamente.
- La causa raiz fue una reconstruccion incompleta en frontend, no la ausencia del calculo en carrito.
- No fue necesario cambiar backend para resolver esta fase.
