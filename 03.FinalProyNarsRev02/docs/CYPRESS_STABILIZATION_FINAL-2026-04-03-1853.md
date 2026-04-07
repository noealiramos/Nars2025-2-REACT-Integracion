# CYPRESS STABILIZATION FINAL - 2026-04-03 1853

## 1. Resumen ejecutivo

Se ejecutó la estabilización final de Cypress con alcance controlado sobre los 4 specs originalmente fallando y el helper compartido de selección de producto.

- Los 4 specs objetivo quedaron en verde de forma individual.
- No se tocó backend.
- No se cambió lógica funcional del producto.
- No se usó `force: true` para saltar botones deshabilitados de producto.
- `npm test` y `npm run build` siguieron en verde.

Sin embargo, la corrida completa `npx cypress run` no quedó 100% verde porque apareció un fallo real en `cypress/e2e/checkoutErrors.cy.js`, un spec fuera del alcance permitido pero afectado por el mismo patrón de fragilidad de selección de producto.

Conclusión honesta:

- la estabilización de los 4 specs objetivo fue exitosa,
- pero no corresponde declarar éxito final completo según el criterio estricto del prompt, porque la suite total de Cypress no cerró totalmente en verde.

## 2. Specs fallando originalmente

Specs objetivo del prompt:

- `cypress/e2e/authLifecycle.cy.js`
- `cypress/e2e/checkoutReuse.cy.js`
- `cypress/e2e/criticalClosure.cy.js`
- `cypress/e2e/goldenPath.cy.js`

Patrones de falla reales identificados:

- selección frágil de producto agregable
- aserción demasiado rígida en `authLifecycle` esperando `200` cuando el sistema también puede devolver `304`

## 3. Causa raíz por spec

### `cypress/e2e/authLifecycle.cy.js`

- bloque frágil: la aserción final del flujo de renovación exigía que el último `GET /orders` terminara exactamente en `200`.
- causa raíz real: el sistema puede terminar correctamente en `200` o `304`, y `304` no implica bug funcional.
- cambio mínimo aplicado: se ajustó la aserción final para aceptar `200` o `304` sin eliminar la verificación crítica de que antes hubo `401` y luego una recuperación válida.

### `cypress/e2e/checkoutReuse.cy.js`

- bloque frágil: reutiliza `cy.addFirstProductToCartViaUi()` y además usaba `check({ force: true })` en radios/checkbox.
- causa raíz real: la fragilidad venía por selección ciega del primer producto agregable en helper compartido, además de checks innecesariamente forzados.
- cambio mínimo aplicado:
  - se endureció el helper compartido para elegir dinámicamente un CTA visible y no deshabilitado;
  - se removió `force: true` en radios/checkbox de este spec.

### `cypress/e2e/criticalClosure.cy.js`

- bloque frágil: dependía indirectamente del helper `cy.addFirstProductToCartViaUi()`.
- causa raíz real: si el primer CTA correspondía a producto agotado, el flujo se caía al intentar agregar al carrito.
- cambio mínimo aplicado: no se tocó el flujo del spec; bastó robustecer el helper compartido.

### `cypress/e2e/goldenPath.cy.js`

- bloque frágil: abría el primer detalle de producto y asumía que el CTA del detalle era agregable.
- causa raíz real: el primer producto visible podía estar agotado, por lo que el detalle heredaba un botón deshabilitado con texto `Agotado`.
- cambio mínimo aplicado:
  - se agregó helper para abrir el detalle del primer producto realmente agregable;
  - se endureció la aserción del detalle para exigir botón visible, no disabled y no `Agotado`.

## 4. Cambios aplicados

### Helper compartido

En `cypress/support/commands.js`:

- `cy.addFirstProductToCartViaUi()` ahora selecciona dinámicamente el primer CTA:
  - visible
  - no disabled
  - no `Agotado`
- se agregó `cy.openFirstAvailableProductDetailViaUi()` con el mismo criterio robusto.
- se quitó `force: true` del checkbox `input-save-default` en helper de checkout.

### `authLifecycle.cy.js`

- se ajustó la aserción final para aceptar recuperación válida con `200` o `304`.

### `checkoutReuse.cy.js`

- se removió `force: true` en:
  - `shipping-option-new`
  - `payment-option-new`
  - `input-save-default`

### `criticalClosure.cy.js`

- no necesitó cambio funcional directo; quedó estabilizado por la mejora del helper compartido.

### `goldenPath.cy.js`

- ya no abre el primer detalle ciegamente;
- usa helper de detalle disponible;
- endurece el CTA del detalle para validar que no esté deshabilitado ni agotado.

## 5. Archivos modificados

- `ecommerce-app-Nars/cypress/support/commands.js`
- `ecommerce-app-Nars/cypress/e2e/authLifecycle.cy.js`
- `ecommerce-app-Nars/cypress/e2e/checkoutReuse.cy.js`
- `ecommerce-app-Nars/cypress/e2e/goldenPath.cy.js`

Nota:

- `cypress/e2e/criticalClosure.cy.js` fue parte de la validación focal objetivo, pero no requirió edición directa porque su fragilidad quedó resuelta por el helper compartido.

## 6. Validacion focal

Se ejecutaron individualmente:

- `npx cypress run --spec "cypress/e2e/authLifecycle.cy.js"`
- `npx cypress run --spec "cypress/e2e/checkoutReuse.cy.js"`
- `npx cypress run --spec "cypress/e2e/criticalClosure.cy.js"`
- `npx cypress run --spec "cypress/e2e/goldenPath.cy.js"`

Resultado real:

- `authLifecycle.cy.js`: verde, `2 passing`
- `checkoutReuse.cy.js`: verde, `5 passing`
- `criticalClosure.cy.js`: verde, `1 passing`
- `goldenPath.cy.js`: verde, `1 passing`

## 7. Validacion completa Cypress

Se ejecutó:

- `npx cypress run`

Resultado real:

- `10` specs en verde
- `1` spec fallando

Spec que falló en la corrida completa:

- `cypress/e2e/checkoutErrors.cy.js`

Causa raíz real de ese fallo:

- el spec hace click ciego sobre `cy.get('[data-testid^="add-to-cart-"]').first().click()`;
- el primer producto visible resultó agotado;
- Cypress falló correctamente porque el botón estaba deshabilitado y mostraba `Agotado`.

Importante:

- ese spec no estaba dentro del alcance permitido por el prompt;
- el fallo es del mismo tipo de fragilidad, pero aparece fuera del scope autorizado.

## 8. Validacion frontend (tests/build)

Se ejecutaron:

- `npm test`
- `npm run build`

Resultado real:

- `npm test`: verde, `12` archivos, `62` pruebas
- `npm run build`: verde

## 9. Riesgos y mitigaciones

### Riesgos mitigados

- fragilidad por seleccionar primer producto ciegamente
- falsos negativos por status `304` en flujo de auth lifecycle
- dependencia de clicks forzados innecesarios en radios/checkbox de checkout reuse

### Riesgo residual detectado

- hay otros specs fuera del alcance que comparten el mismo patrón de selección ciega de producto, como `checkoutErrors.cy.js`.

## 10. Decision final

Decision honesta:

- La estabilización de los 4 specs originalmente fallando fue exitosa.
- No se puede declarar éxito final completo del prompt porque `npx cypress run` no quedó totalmente verde.

Estado final:

- objetivo parcial cumplido: `sí`
- criterio de éxito global del prompt: `no cumplido todavía`

## 11. Evidencia REAL de terminal

### Validacion focal `authLifecycle.cy.js`

```text
Warning: We failed to trash the existing run results.

This error will not affect or change the exit code.

Error: Command failed: C:\Users\ALI\AppData\Local\Cypress\Cache\15.13.0\Cypress\resources\app\node_modules\trash\lib\windows-trash.exe D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\cypress\screenshots\checkoutReuse.cy.js

...

  Phase 2.1 - Auth Lifecycle Hardening
    √ renueva la sesion automaticamente tras expirar el access token (55550ms)
    √ cierra la sesion y redirige a login cuando el refresh ya fue revocado (48331ms)


  2 passing (2m)
```

### Validacion focal `checkoutReuse.cy.js`

```text
...

  Phase 2 Hardening - Checkout Reuse
    √ completa existing / existing sin recrear shipping ni payment (29013ms)
    √ completa new / existing creando solo shipping nuevo (6649ms)
    √ completa existing / new creando solo payment nuevo (5624ms)
    √ completa new / new creando ambos recursos antes de la orden (8332ms)
    √ permite fallback manual cuando falla la carga remota de shipping y payment (7997ms)


  5 passing (58s)
```

### Validacion focal `criticalClosure.cy.js`

```text
...

  Phase 1 Critical Closure - UI Real
    √ cierra el flujo critico con registro, carrito autenticado, checkout y ordenes via UI real (25980ms)


  1 passing (26s)
```

### Validacion focal `goldenPath.cy.js`

```text
...

  Golden Path - Login to Orders
    √ E2E-PH3-004: completa Login -> Producto -> Carrito -> Checkout -> Confirmacion -> Orders sin mocks (22166ms)


  1 passing (22s)
```

### Corrida completa `npx cypress run`

```text
...

  Running:  checkoutErrors.cy.js                                                           (4 of 11)


  Flujos Adversos - Checkout
    1) Debería manejar de forma segura un rechazo real del backend al confirmar datos inválidos


  0 passing (11s)
  1 failing

  1) Flujos Adversos - Checkout
       Debería manejar de forma segura un rechazo real del backend al confirmar datos inválidos:
     CypressError: Timed out retrying after 4050ms: `cy.click()` failed because this element is `disabled`:

`<button class="btn btn-primary" data-testid="add-to-cart-68a6bc1c5aceec4975c87ea5" data-cy="add-to-cart-68a6bc1c5aceec4975c87ea5" type="button" disabled="" aria-disabled="true">Agotado</button>`

...

    ✖  1 of 11 failed (9%)                      03:33       26       25        1        -        -
```

### `npm test`

```text
> ramdi-jewelry-ecommerce-css@1.0.0 test
> vitest run


 RUN  v4.1.1 D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-app-Nars


 Test Files  12 passed (12)
      Tests  62 passed (62)
   Start at  18:52:35
   Duration  18.75s (transform 2.67s, setup 7.64s, import 12.22s, tests 18.95s, environment 42.70s)
```

### `npm run build`

```text
> ramdi-jewelry-ecommerce-css@1.0.0 build
> vite build

vite v6.4.1 building for production...
transforming...
✓ 147 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                 0.50 kB │ gzip:  0.33 kB
dist/assets/index-DybAAZLU.css  27.85 kB │ gzip:  5.92 kB
dist/assets/index-DPtqtLat.js   270.01 kB │ gzip: 86.10 kB
✓ built in 3.99s
```
