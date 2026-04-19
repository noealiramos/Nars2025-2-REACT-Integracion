# Pre-implementacion detallada MP-03

## MP-03

### 1. Alcance exacto

Se va a atacar:

- endurecer la logica `auth + stock` para agregar al carrito desde catalogo y detalle
- cerrar la brecha funcional visible de producto agotado / usuario no autenticado
- reforzar cobertura sobre ese comportamiento con unit/component y E2E real minimo
- validar que el flujo actual de auth, cart y checkout siga estable

No se va a tocar:

- backend
- contratos de `auth`, `cart`, `checkout`
- migracion a `/orders/checkout`
- `useReducer`, `React Query`, lazy loading, admin, GuestOnly, MP-04+
- cambios visuales grandes o refactors no relacionados

### 2. Riesgos potenciales

Tecnicos:

- condicionar mal el boton puede bloquear compra legitima
- diferencias entre `product.id` y `product._id`
- stock `undefined` podria tratarse incorrectamente como agotado

De regresion:

- romper E2E existentes que agregan productos al carrito
- desalinear catalogo vs detalle con reglas distintas
- afectar badge/carrito por impedir acciones donde antes si ocurrian

De contratos:

- bajo, porque no se cambian endpoints ni payloads
- el riesgo real esta en la logica frontend previa al consumo

### 3. Archivos a modificar o crear

Existentes:

- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\src\components\molecules\ProductCard.jsx`
- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\src\pages\ProductDetailPage.jsx`
- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\src\components\organisms\__tests__\SiteHeader.test.jsx` solo si se requiere soporte indirecto de estado auth visible
- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\cypress\e2e\cart.cy.js` o crear spec mas focalizado
- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\src\pages\__tests__\ProductDetailPage.test.jsx` si no existe
- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\src\components\molecules\__tests__\ProductCard.test.jsx` nuevo probable

Nuevo probable:

- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\src\components\molecules\__tests__\ProductCard.test.jsx`
- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\cypress\e2e\productAccess.cy.js` si conviene separar el E2E de los specs actuales
- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\docs\Resultado_MP-03-YYYY-MM-DD-HHMM.md` unico archivo documental final

### 4. Estrategia tecnica

- `ProductCard.jsx`
  - problema: hoy permite agregar al carrito sin validar autenticacion o stock
  - cambio: deshabilitar u ocultar accion segun `isAuthenticated` y `stock > 0`
  - si no se hace: se mantiene la brecha directa de rubrica y se sostienen flujos incoherentes

- `ProductDetailPage.jsx`
  - problema: la vista detalle no replica reglas de acceso/stock
  - cambio: aplicar la misma regla que en grid para evitar inconsistencias
  - si no se hace: el usuario puede saltarse la restriccion entrando al detalle

- tests unit/component
  - problema: no hay red de seguridad especifica para esta regla
  - cambio: cubrir autenticado/no autenticado/con stock/sin stock
  - si no se hace: alto riesgo de regresion silenciosa

- E2E real minimo
  - problema: falta validacion integrada del comportamiento visible
  - cambio: validar usuario autenticado puede agregar; no autenticado no puede; producto agotado no permite accion si existe dato utilizable
  - si no se hace: la regla podria verse correcta en unit tests pero fallar en UI real

### 5. Estrategia de validacion

Tests unitarios:

- `ProductCard`
  - autenticado + stock disponible => accion habilitada
  - no autenticado => accion no disponible o bloqueada
  - stock 0 => accion no disponible o bloqueada
- `ProductDetailPage`
  - renderiza CTA correcto segun auth/stock
  - no ejecuta `addItem` cuando la regla no se cumple

E2E exactos:

- escenario 1: usuario autenticado
  - login real por UI
  - entrar a home
  - verificar que existe al menos un producto agregable
  - agregar al carrito
  - validar badge/carrito
- escenario 2: usuario no autenticado
  - visitar home limpio
  - validar que el CTA restringido no permite agregar directamente o redirige/controla segun implementacion definida
  - confirmar que el carrito no cambia
- escenario 3: producto sin stock, solo si el catalogo real de test lo expone de forma estable
  - validar ausencia/bloqueo del CTA

Como validar que no se rompe nada:

- `npm test`
- E2E focal de MP-03
- E2E ya existente de auth/cart relevantes
- `npm run build`

### 6. Plan de ejecucion paso a paso

1. inspeccionar y definir regla exacta visible para CTA en `ProductCard`
   - checkpoint: `npm test`, `npm run build`
2. replicar la misma regla en `ProductDetailPage`
   - checkpoint: `npm test`, `npm run build`
3. agregar/ajustar tests unit/component para grid y detalle
   - checkpoint: `npm test`, `npm run build`
4. agregar E2E minimo focal de acceso/agregado
   - checkpoint: correr spec E2E nuevo + `npm test` + `npm run build`
5. correr E2E existente de carrito/auth para no romper flujo previo
   - checkpoint: confirmar verde completo
6. documentar todo en un unico archivo final
   - checkpoint final: evidencia consolidada y decision

## MP-03-EXEC

```text
Ejecuta MP-03 exactamente con este plan y no te salgas del alcance.

Objetivo:
Endurecer la logica frontend de acceso/agregado al carrito segun autenticacion y stock, manteniendo compatibilidad total con auth, cart y checkout ya validados.

Reglas estrictas:
1. No modificar backend.
2. No cambiar contratos de auth, cart ni checkout.
3. No hacer big-bang.
4. No avanzar a MP-04 ni otras fases.
5. Generar UN SOLO archivo de documentacion:
   docs/Resultado_MP-03-YYYY-MM-DD-HHMM.md

Alcance exacto:
- Ajustar `src/components/molecules/ProductCard.jsx`
- Ajustar `src/pages/ProductDetailPage.jsx`
- Agregar/ajustar tests unit/component necesarios
- Agregar E2E minimo real para validar:
  a) autenticado puede agregar
  b) no autenticado no puede agregar o queda bloqueado segun la regla visible
  c) si el dataset lo permite de forma estable, producto sin stock no permite accion

No tocar:
- backend
- checkout flow
- orderApi
- cartApi
- useReducer
- React Query
- lazy loading
- admin
- GuestOnly

Orden exacto:
1. Implementar cambio minimo en `ProductCard.jsx`
2. Ejecutar:
   - npm test
   - npm run build
3. Implementar cambio minimo en `ProductDetailPage.jsx`
4. Ejecutar:
   - npm test
   - npm run build
5. Agregar/ajustar tests unit/component
6. Ejecutar:
   - npm test
   - npm run build
7. Agregar E2E focal
8. Ejecutar:
   - npx cypress run --spec "cypress/e2e/productAccess.cy.js"
     o el spec equivalente que hayas creado
   - npm test
   - npm run build
9. Ejecutar ademas E2E de regresion relevantes:
   - npx cypress run --spec "cypress/e2e/auth.cy.js"
   - npx cypress run --spec "cypress/e2e/cart.cy.js"
10. Documentar todo en un unico archivo:
   docs/Resultado_MP-03-YYYY-MM-DD-HHMM.md

En cada paso reporta:
- archivos modificados
- impacto en contratos auth/cart/checkout
- resultado real de tests
- resultado real de E2E
- resultado real de build
- si aparece error, detenerse y explicar causa raiz antes de continuar

El archivo final debe incluir:
1) Resumen ejecutivo
2) Alcance
3) Archivos modificados
4) Implementacion
5) Validacion completa
6) Contratos
7) Riesgos
8) Evidencia REAL de terminal
9) Decision final

Detente completamente al terminar.
```
