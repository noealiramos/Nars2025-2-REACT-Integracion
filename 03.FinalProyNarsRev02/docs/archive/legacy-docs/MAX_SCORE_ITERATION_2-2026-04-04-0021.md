# MAX SCORE ITERATION 2

## 0. LOG COMPLETO DE EJECUCION

Se retoma la Iteración 2 con alcance limitado a arquitectura React mínima y segura.

Estado al retomar:

- Ya se había auditado el alcance de Iteración 2.
- Ya se había instalado `@tanstack/react-query`.
- Faltaba implementar:
  - `UIContext` con `useReducer`
  - `QueryClientProvider`
  - migración a `useQuery` en `HomePage`, `OrdersPage` y `AdminProductsPage`
  - ajuste de tests para `AdminProductsPage`
  - validaciones finales y documentación

Archivos previstos para modificar en Iteración 2:

- `ecommerce-app-Nars/package.json`
- `ecommerce-app-Nars/src/App.jsx`
- `ecommerce-app-Nars/src/contexts/UIContext.jsx`
- `ecommerce-app-Nars/src/lib/queryClient.js`
- `ecommerce-app-Nars/src/pages/HomePage.jsx`
- `ecommerce-app-Nars/src/pages/OrdersPage.jsx`
- `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx`
- `ecommerce-app-Nars/src/pages/__tests__/AdminProductsPage.test.jsx` si hacía falta ajustar providers de React Query

Impacto esperado:

- `UIContext` agregaría un tercer contexto real con `useReducer`, estado global de loading y mensajes UI, sin tocar contratos de backend.
- React Query se integraría de forma mínima y segura solo para lecturas en `HomePage`, `OrdersPage` y `AdminProductsPage`.
- Axios seguiría siendo la base de consumo; no se cambiarían endpoints ni payloads.
- No se migrarían mutations a `useMutation`; las escrituras seguirían funcionando con la lógica actual para minimizar riesgo.

Cómo evitar romper la app:

- La migración a React Query sería solo en GETs visibles y ya estables.
- Se mantendrían los servicios/APIs actuales, usándolos como adaptadores.
- `AdminProductsPage` conservaría sus mutations actuales y solo refrescaría queries después de crear/editar/eliminar.
- Se integraría `QueryClientProvider` en `App.jsx` sin alterar el árbol de rutas.
- Se validaría inmediatamente con `npm run dev`, navegación real, `npm test` y `npm run build`.

Instalación ejecutada:

### `npm install @tanstack/react-query`

```text
added 2 packages, and audited 326 packages in 6s

71 packages are looking for funding
  run `npm fund` for details

6 high severity vulnerabilities

To address all issues, run:
  npm audit fix

Run `npm audit` for details.
```

Implementación realizada:

- Se creó `src/contexts/UIContext.jsx` con `useReducer` real.
- Se creó `src/lib/queryClient.js`.
- Se integró `QueryClientProvider`, `UIProvider` y `GlobalUIFeedback` en `App.jsx`.
- Se migró `HomePage` a `useQuery`.
- Se migró `OrdersPage` a `useQuery`.
- Se migró `AdminProductsPage` a `useQuery` para lecturas y a `invalidateQueries` para refresco seguro tras mutations existentes.
- Se ajustó `AdminProductsPage.test.jsx` para envolver el componente con `QueryClientProvider` y `UIProvider`.

Primera validación ejecutada:

### `npm test`

```text
> ramdi-jewelry-ecommerce-css@1.0.0 test
> vitest run


 RUN  v4.1.1 D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-app-Nars


 Test Files  12 passed (12)
      Tests  62 passed (62)
   Start at  00:18:30
   Duration  18.00s (transform 2.31s, setup 4.93s, import 11.34s, tests 21.14s, environment 39.47s)
```

### `npm run build`

```text
> ramdi-jewelry-ecommerce-css@1.0.0 build
> vite build

vite v6.4.1 building for production...
transforming...
✓ 198 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                             0.50 kB │ gzip:  0.33 kB
dist/assets/ProfilePage-T72OpfHe.css        0.80 kB │ gzip:  0.40 kB
dist/assets/ProductDetailPage-BUzZyFVF.css  0.93 kB │ gzip:  0.44 kB
dist/assets/HomePage-D61setUH.css           2.19 kB │ gzip:  0.77 kB
dist/assets/CheckoutPage-CfYwGph3.css       2.21 kB │ gzip:  0.79 kB
dist/assets/index-CdnAoEEY.css             21.73 kB │ gzip:  4.85 kB
dist/assets/productService-Dpqq3f8g.js      0.86 kB │ gzip:  0.37 kB
dist/assets/ProductDetailPage-a9IKD9Yc.js   2.06 kB │ gzip:  0.90 kB
dist/assets/ProfilePage-5gA8lPPr.js         2.48 kB │ gzip:  1.07 kB
dist/assets/HomePage-BuLy5LDF.js            2.75 kB │ gzip:  1.27 kB
dist/assets/CheckoutPage-B-scrzI-.js       11.29 kB │ gzip:  3.69 kB
dist/assets/index-hMvShE8f.js             294.55 kB │ gzip: 94.44 kB
✓ built in 4.70s
```

### `npm run dev` + verificación HTTP de navegación base

```text
http://127.0.0.1:5173
200
<!doctype html>
<html lang="es" data-theme="dark">
  <head>
    <script type="mo
http://127.0.0.1:5173/login
200
<!doctype html>
<html lang="es" data-theme="dark">
  <head>
    <script type="mo
http://127.0.0.1:5173/profile
200
<!doctype html>
<html lang="es" data-theme="dark">
  <head>
    <script type="mo
```

Sanity Cypress ejecutada inicialmente:

### `npx cypress run --spec "cypress/e2e/goldenPath.cy.js,cypress/e2e/orders.cy.js"`

```text

====================================================================================================

  (Run Starting)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Cypress:        15.13.0                                                                        │
  │ Browser:        Electron 138 (headless)                                                        │
  │ Node Version:   v22.15.0 (C:\Program Files\nodejs\node.exe)                                    │
  │ Specs:          2 found (goldenPath.cy.js, orders.cy.js)                                       │
  │ Searched:       D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsR │
  │                 ev02\ecommerce-app-Nars\cypress\e2e\goldenPath.cy.js, D:\MyDocuments\2025.Inad │
  │                 aptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\ │
  │                 cypress\e2e\orders.cy.js                                                       │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘


────────────────────────────────────────────────────────────────────────────────────────────────────

  Running:  goldenPath.cy.js                                                                (1 of 2)


  Golden Path - Login to Orders
    1) E2E-PH3-004: completa Login -> Producto -> Carrito -> Checkout -> Confirmacion -> Orders sin mocks


  0 passing (11s)
  1 failing

  1) Golden Path - Login to Orders
       E2E-PH3-004: completa Login -> Producto -> Carrito -> Checkout -> Confirmacion -> Orders sin mocks:
     ReferenceError: The following error originated from your application code, not from Cypress.

  > loading is not defined

When Cypress detects uncaught errors originating from your application it will automatically fail the current test.

...

  Running:  orders.cy.js                                                                    (2 of 2)


  Orders Feature - API Real
    1) ASOS-001: Usuario autenticado puede ver sus órdenes
    2) ASOS-002: Usuario puede ver el detalle de una orden
    3) ASOS-003: Maneja correctamente la lista vacía


  0 passing (10s)
  3 failing

  1) Orders Feature - API Real
       ASOS-001: Usuario autenticado puede ver sus órdenes:
     ReferenceError: The following error originated from your application code, not from Cypress.

  > loading is not defined

...

  2) Orders Feature - API Real
       ASOS-002: Usuario puede ver el detalle de una orden:
     ReferenceError: The following error originated from your application code, not from Cypress.

  > loading is not defined

...

  3) Orders Feature - API Real
       ASOS-003: Maneja correctamente la lista vacía:
     ReferenceError: The following error originated from your application code, not from Cypress.

  > loading is not defined

...

    ✖  2 of 2 failed (100%)                     00:20        4        -        4        -        -
```

Diagnóstico real posterior a la falla:

- La migración de `OrdersPage` a React Query dejó una referencia vieja a `loading`.
- Eso rompió navegación real en `/orders` y por rebote fallaron `goldenPath.cy.js` y `orders.cy.js`.
- La causa raíz no fue React Query en sí, sino una variable residual del refactor incremental.
- Se aplicó un ajuste mínimo: reemplazar la referencia restante `loading` por `isLoading` en `OrdersPage.jsx`, y se revalidó.

Revalidación ejecutada tras el fix mínimo:

### `npx cypress run --spec "cypress/e2e/goldenPath.cy.js,cypress/e2e/orders.cy.js"`

```text

====================================================================================================

  (Run Starting)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Cypress:        15.13.0                                                                        │
  │ Browser:        Electron 138 (headless)                                                        │
  │ Node Version:   v22.15.0 (C:\Program Files\nodejs\node.exe)                                    │
  │ Specs:          2 found (goldenPath.cy.js, orders.cy.js)                                       │
  │ Searched:       D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsR │
  │                 ev02\ecommerce-app-Nars\cypress\e2e\goldenPath.cy.js, D:\MyDocuments\2025.Inad │
  │                 aptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\ │
  │                 cypress\e2e\orders.cy.js                                                       │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘


────────────────────────────────────────────────────────────────────────────────────────────────────

  Running:  goldenPath.cy.js                                                                (1 of 2)


  Golden Path - Login to Orders
    √ E2E-PH3-004: completa Login -> Producto -> Carrito -> Checkout -> Confirmacion -> Orders sin mocks (10386ms)


  1 passing (11s)


────────────────────────────────────────────────────────────────────────────────────────────────────

  Running:  orders.cy.js                                                                    (2 of 2)


  Orders Feature - API Real
    √ ASOS-001: Usuario autenticado puede ver sus órdenes (5510ms)
    √ ASOS-002: Usuario puede ver el detalle de una orden (1006ms)
    √ ASOS-003: Maneja correctamente la lista vacía (2622ms)


  3 passing (9s)


====================================================================================================

  (Run Finished)


       Spec                                              Tests  Passing  Failing  Pending  Skipped
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ ✔  goldenPath.cy.js                         00:10        1        1        -        -        - │
  ├────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ ✔  orders.cy.js                             00:09        3        3        -        -        - │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
    ✔  All specs passed!                        00:19        4        4        -        -        -
```

Revalidación final después del fix mínimo:

### `npm test`

```text
> ramdi-jewelry-ecommerce-css@1.0.0 test
> vitest run


 RUN  v4.1.1 D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-app-Nars


 Test Files  12 passed (12)
      Tests  62 passed (62)
   Start at  00:20:22
   Duration  19.83s (transform 3.79s, setup 6.16s, import 15.23s, tests 23.40s, environment 41.26s)
```

### `npm run build`

```text
> ramdi-jewelry-ecommerce-css@1.0.0 build
> vite build

vite v6.4.1 building for production...
transforming...
✓ 198 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                             0.50 kB │ gzip:  0.33 kB
dist/assets/ProfilePage-T72OpfHe.css        0.80 kB │ gzip:  0.40 kB
dist/assets/ProductDetailPage-BUzZyFVF.css  0.93 kB │ gzip:  0.44 kB
dist/assets/HomePage-D61setUH.css           2.19 kB │ gzip:  0.77 kB
dist/assets/CheckoutPage-CfYwGph3.css       2.21 kB │ gzip:  0.79 kB
dist/assets/index-CdnAoEEY.css             21.73 kB │ gzip:  4.85 kB
dist/assets/productService-Det36t3C.js      0.86 kB │ gzip:  0.37 kB
dist/assets/ProductDetailPage-B_z9js7V.js   2.06 kB │ gzip:  0.90 kB
dist/assets/ProfilePage-Bx78d8Fd.js         2.48 kB │ gzip:  1.07 kB
dist/assets/HomePage-BlTB_wz9.js            2.75 kB │ gzip:  1.27 kB
dist/assets/CheckoutPage-ChKIXdZl.js        11.29 kB │ gzip:  3.69 kB
dist/assets/index-Mw_9GFAv.js              294.54 kB │ gzip: 94.43 kB
✓ built in 5.19s
```

### Timestamp final de evidencia

```text
2026-04-04-0021
```

## 1. Objetivo

Cerrar dos brechas críticas de la rúbrica sin romper el sistema existente:

- `III.1 Context API + useReducer`
- `III.2 React Query`

Concretamente:

- crear un tercer contexto real con `useReducer`
- integrar React Query en lecturas clave (`HomePage`, `OrdersPage`, `AdminProductsPage`)

## 2. Cambios realizados

- Se agregó `UIContext` real con `useReducer` en `ecommerce-app-Nars/src/contexts/UIContext.jsx`.
- Se agregó `queryClient` en `ecommerce-app-Nars/src/lib/queryClient.js`.
- `App.jsx` ahora integra `QueryClientProvider`, `UIProvider` y `GlobalUIFeedback`.
- `HomePage.jsx` migró de `useEffect + useState` a `useQuery`.
- `OrdersPage.jsx` migró de `useEffect + useState` a `useQuery`.
- `AdminProductsPage.jsx` migró sus GETs a `useQuery` y usa invalidación segura de queries tras sus escrituras ya existentes.
- `AdminProductsPage.test.jsx` se adaptó a los nuevos providers.

## 3. Archivos modificados

- `ecommerce-app-Nars/package.json`
- `ecommerce-app-Nars/package-lock.json`
- `ecommerce-app-Nars/src/App.jsx`
- `ecommerce-app-Nars/src/contexts/UIContext.jsx`
- `ecommerce-app-Nars/src/lib/queryClient.js`
- `ecommerce-app-Nars/src/pages/HomePage.jsx`
- `ecommerce-app-Nars/src/pages/OrdersPage.jsx`
- `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx`
- `ecommerce-app-Nars/src/pages/__tests__/AdminProductsPage.test.jsx`

## 4. Validaciones

### `npm run dev`

- El servidor levantó correctamente.
- Se verificó respuesta HTTP real para:
  - `/`
  - `/login`
  - `/profile`

### Navegación real

- Se ejecutó sanity con Cypress sobre:
  - `goldenPath.cy.js`
  - `orders.cy.js`
- Hubo una falla real inicial por referencia residual a `loading` en `OrdersPage.jsx`.
- Se corrigió con ajuste mínimo y ambos specs quedaron en verde.

### `npm test`

- Verde.

### `npm run build`

- Verde.

## 5. Resultado de Iteración 2

- `UIContext` ya existe como tercer contexto real con `useReducer`.
- React Query ya está integrado y usado de forma mínima viable en 3 vistas reales.
- No se reescribieron mutations.
- No se tocaron contratos de backend.
- El sistema quedó estable tras el fix mínimo en `OrdersPage`.

## 6. Conclusión operativa

- Iteración 2 quedó cerrada de forma segura.
- El proyecto ganó evidencia real para dos criterios técnicos importantes de la rúbrica.
- El siguiente paso natural sería Iteración 3 enfocada en extras visibles: segundo CRUD admin y modelo adicional frontend.
