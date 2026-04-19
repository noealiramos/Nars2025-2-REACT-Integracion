# MAX SCORE ITERATION 3

## 0. LOG COMPLETO DE EJECUCION

Se entra en Iteración 3 con alcance limitado a extras visibles y funcionales:

- segundo CRUD admin visible para categorías
- modelo adicional integrado al frontend: wishlist

Confirmación de backend real disponible antes de implementar:

- Categorías:
  - `GET /categories`
  - `GET /categories/:id`
  - `POST /categories`
  - `PUT /categories/:id`
  - `DELETE /categories/:id`
  - evidencia: `ecommerce-api-Nars/src/routes/categoryRoutes.js:35`
- Wishlist:
  - `GET /wishlist`
  - `POST /wishlist/add`
  - `GET /wishlist/check/:productId`
  - `DELETE /wishlist/remove/:productId`
  - `POST /wishlist/move-to-cart`
  - `DELETE /wishlist/clear`
  - evidencia: `ecommerce-api-Nars/src/routes/wishListRoutes.js:17`

Archivos que probablemente se iban a modificar/crear:

- `ecommerce-app-Nars/src/App.jsx`
- `ecommerce-app-Nars/src/components/organisms/SiteHeader.jsx`
- `ecommerce-app-Nars/src/api/categoryApi.js`
- `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx` solo para enlazar mejor con categorías si hacía falta
- `ecommerce-app-Nars/src/pages/AdminCategoriesPage.jsx` nuevo
- `ecommerce-app-Nars/src/pages/AdminCategoriesPage.css` nuevo
- `ecommerce-app-Nars/src/api/wishlistApi.js` nuevo
- `ecommerce-app-Nars/src/services/wishlistService.js` nuevo
- `ecommerce-app-Nars/src/pages/WishlistPage.jsx` nuevo
- `ecommerce-app-Nars/src/pages/WishlistPage.css` nuevo
- `ecommerce-app-Nars/src/components/molecules/ProductCard.jsx` para botón de wishlist
- tests de páginas nuevas si hacía falta soporte a `npm test`

Impacto esperado antes de implementar:

- Se agrega una ruta admin real `/admin/categories`, protegida con `AdminRoute`.
- Se agrega una ruta real `/wishlist`, protegida para usuario autenticado.
- Se usa backend real para categorías y wishlist; no se usa `localStorage` para wishlist.
- No se cambian contratos existentes de carrito, checkout, auth ni órdenes.

Riesgos de ruptura y mitigación definidos antes de implementar:

- Riesgo: romper header/rutas existentes.
  - mitigación: agregar enlaces nuevos sin alterar los existentes.
- Riesgo: shapes de respuesta heterogéneos de categorías/wishlist.
  - mitigación: adaptar en API/service frontend antes de renderizar.
- Riesgo: romper Cypress actual por cambios visuales en catálogo.
  - mitigación: no tocar `data-testid` existentes de carrito ni flujos de compra.
- Riesgo: añadir demasiada lógica.
  - mitigación: MVP simple: listar/crear/editar/eliminar categorías y listar/agregar/quitar wishlist; extras opcionales solo si salen seguros.

Implementación realizada:

- Se extendió `categoryApi` con `getById`, `create`, `update` y `remove`.
- Se creó `wishlistApi` con endpoints reales del backend.
- Se creó `wishlistService` con normalización real de datos del backend.
- Se creó `AdminCategoriesPage` con CRUD real de categorías.
- Se creó `WishlistPage` con listado, eliminación, limpiar y mover a carrito.
- Se integraron rutas nuevas:
  - `/admin/categories`
  - `/wishlist`
- Se actualizó `SiteHeader` para exponer:
  - `Admin categorías`
  - `Wishlist`
- Se actualizó `ProductCard` para agregar acción real `Wishlist` usando backend.
- Se ajustaron tests de `ProductCard` y `SiteHeader` para soportar las nuevas integraciones.

Validaciones ejecutadas:

### `npm test`

```text
> ramdi-jewelry-ecommerce-css@1.0.0 test
> vitest run


 RUN  v4.1.1 D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-app-Nars


 Test Files  12 passed (12)
      Tests  65 passed (65)
   Start at  00:47:38
   Duration  20.20s (transform 6.66s, setup 6.41s, import 17.64s, tests 23.29s, environment 44.18s)
```

### `npm run build`

```text
> ramdi-jewelry-ecommerce-css@1.0.0 build
> vite build

vite v6.4.1 building for production...
transforming...
✓ 204 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                             0.50 kB │ gzip:  0.33 kB
dist/assets/ProfilePage-T72OpfHe.css        0.80 kB │ gzip:  0.40 kB
dist/assets/ProductDetailPage-BUzZyFVF.css  0.93 kB │ gzip:  0.44 kB
dist/assets/HomePage-D61setUH.css           2.19 kB │ gzip:  0.77 kB
dist/assets/CheckoutPage-CfYwGph3.css       2.21 kB │ gzip:  0.79 kB
dist/assets/index-C9bH9JH-.css              23.88 kB │ gzip:  5.10 kB
dist/assets/productService-Dq0jwBW3.js      0.86 kB │ gzip:  0.37 kB
dist/assets/ProductDetailPage-DIZ7cqpp.js   2.07 kB │ gzip:  0.90 kB
dist/assets/ProfilePage-DBrLIVBC.js         2.48 kB │ gzip:  1.07 kB
dist/assets/HomePage-IuDu4XFs.js            3.22 kB │ gzip:  1.43 kB
dist/assets/CheckoutPage-CI2Cc4ZA.js        11.29 kB │ gzip:  3.69 kB
dist/assets/index-ACuvngAq.js               304.80 kB │ gzip: 96.24 kB
✓ built in 6.49s
```

### sanity Cypress

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
    √ E2E-PH3-004: completa Login -> Producto -> Carrito -> Checkout -> Confirmacion -> Orders sin mocks (11242ms)


  1 passing (11s)


────────────────────────────────────────────────────────────────────────────────────────────────────

  Running:  orders.cy.js                                                                    (2 of 2)


  Orders Feature - API Real
    √ ASOS-001: Usuario autenticado puede ver sus órdenes (5984ms)
    √ ASOS-002: Usuario puede ver el detalle de una orden (1149ms)
    √ ASOS-003: Maneja correctamente la lista vacía (2903ms)


  3 passing (10s)


====================================================================================================

  (Run Finished)


       Spec                                              Tests  Passing  Failing  Pending  Skipped
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ ✔  goldenPath.cy.js                         00:11        1        1        -        -        - │
  ├────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ ✔  orders.cy.js                             00:10        3        3        -        -        - │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
    ✔  All specs passed!                        00:21        4        4        -        -        -
```

### Timestamp de evidencia

```text
2026-04-04-0048
```

## 1. Objetivo

Cerrar los últimos criterios funcionales visibles de la rúbrica mediante implementación real, mínima y segura de:

- segundo CRUD admin visible (`/admin/categories`)
- modelo adicional integrado al frontend (`/wishlist`)

## 2. Confirmacion de backend disponible

- endpoints reales de categorías
  - `GET /categories`
  - `GET /categories/:id`
  - `POST /categories`
  - `PUT /categories/:id`
  - `DELETE /categories/:id`
  - evidencia: `ecommerce-api-Nars/src/routes/categoryRoutes.js`, `ecommerce-api-Nars/src/controllers/categoryController.js`

- endpoints reales de wishlist
  - `GET /wishlist`
  - `POST /wishlist/add`
  - `GET /wishlist/check/:productId`
  - `DELETE /wishlist/remove/:productId`
  - `POST /wishlist/move-to-cart`
  - `DELETE /wishlist/clear`
  - evidencia: `ecommerce-api-Nars/src/routes/wishListRoutes.js`, `ecommerce-api-Nars/src/controllers/wishListController.js`

## 3. Cambios realizados

- CRUD admin visible de categorías:
  - nueva ruta `/admin/categories`
  - nueva página `AdminCategoriesPage`
  - integración con backend real para listar, crear, editar y eliminar

- Wishlist integrada al frontend:
  - nueva ruta `/wishlist`
  - nueva página `WishlistPage`
  - nueva capa API/service para wishlist real
  - acción en `ProductCard` para agregar a wishlist
  - listado, quitar, limpiar y mover a carrito desde wishlist

- Navegación:
  - `SiteHeader` ahora expone `Admin categorías` para admin y `Wishlist` para usuarios autenticados

- Calidad:
  - se actualizaron tests de `ProductCard` y `SiteHeader` para reflejar las nuevas capacidades visibles

## 4. Archivos modificados

- `ecommerce-app-Nars/src/api/categoryApi.js`
- `ecommerce-app-Nars/src/api/wishlistApi.js`
- `ecommerce-app-Nars/src/services/wishlistService.js`
- `ecommerce-app-Nars/src/pages/AdminCategoriesPage.jsx`
- `ecommerce-app-Nars/src/pages/AdminCategoriesPage.css`
- `ecommerce-app-Nars/src/pages/WishlistPage.jsx`
- `ecommerce-app-Nars/src/pages/WishlistPage.css`
- `ecommerce-app-Nars/src/components/organisms/SiteHeader.jsx`
- `ecommerce-app-Nars/src/App.jsx`
- `ecommerce-app-Nars/src/components/molecules/ProductCard.jsx`
- `ecommerce-app-Nars/src/components/molecules/__tests__/ProductCard.test.jsx`
- `ecommerce-app-Nars/src/components/organisms/__tests__/SiteHeader.test.jsx`

## 5. Validaciones

- npm test
  - verde, `12` archivos y `65` pruebas

- npm run build
  - verde

- sanity Cypress
  - `goldenPath.cy.js` verde
  - `orders.cy.js` verde

## 6. Resultado de Iteracion 3

- Ya existe un segundo CRUD admin visible y defendible: categorías.
- Ya existe un modelo adicional real integrado al frontend: wishlist.
- No se rompieron rutas existentes.
- No se rompió build.
- No se rompió la sanity funcional principal de Cypress.

## 7. Conclusión operativa

La Iteración 3 quedó completada de forma segura y funcional.

- Se cerró el segundo CRUD admin visible con integración real al backend.
- Se cerró el modelo adicional integrado al frontend sin recurrir a `localStorage` ni endpoints inventados.
- El sistema sigue estable tras `npm test`, `npm run build` y sanity de Cypress.
- El siguiente paso natural sería una nueva auditoría final contra rúbrica para recalcular el puntaje real alcanzado.
