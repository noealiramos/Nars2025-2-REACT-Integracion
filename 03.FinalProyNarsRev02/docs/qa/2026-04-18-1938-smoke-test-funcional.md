# Smoke test funcional

## 1. Objetivo de la revision

Validar rapidamente la estabilidad funcional actual del sistema full stack `ecommerce-app-Nars` + `ecommerce-api-Nars`, sin corregir codigo, para determinar si el proyecto esta listo para avanzar a auditoria, limpieza documental, revision vs rubrica y despliegue.

## 2. Alcance

Se validaron estos puntos:

- estado base del entorno;
- dependencias instaladas;
- arranque de backend;
- arranque de frontend;
- conexion front-back;
- carga de Home;
- listado y busqueda de productos;
- registro y login;
- agregar producto al carrito;
- ver carrito;
- checkout;
- creacion de orden;
- consulta de ordenes del usuario;
- navegacion base de rutas principales;
- smoke UI real con Cypress sobre flujo golden path.

## 3. Entorno validado

- Fecha/hora: `2026-04-18 19:38`
- Workspace: `03.FinalProyNarsRev02`
- Frontend: `ecommerce-app-Nars`
- Backend: `ecommerce-api-Nars`
- Backend URL: `http://localhost:3001`
- API URL: `http://localhost:3001/api`
- Frontend URL: `http://localhost:5173`
- Backend levantado en modo test mediante `npm run start:test`
- Frontend levantado con Vite mediante `npm run dev:test`

## 4. Comandos ejecutados

1. `git status --short`
2. `npm ls --depth=0` en backend
3. `npm ls --depth=0` en frontend
4. `npm run start:test` en backend (desacoplado)
5. `npm run dev:test` en frontend (desacoplado)
6. `fetch('http://localhost:3001/')`
7. `fetch('http://localhost:5173')`
8. `fetch` de rutas frontend principales (`/`, `/login`, `/register`, `/cart`, `/checkout`, `/orders`)
9. `npm run build` en frontend
10. script Node de smoke API end-to-end
11. `npx cypress run --spec cypress/e2e/goldenPath.cy.js`

## 5. Output COMPLETO de terminal

### `git status --short`

```text
 M ecommerce-api-Nars/package.json
 M ecommerce-api-Nars/src/config/env.js
 M ecommerce-api-Nars/src/controllers/categoryController.js
 M ecommerce-api-Nars/src/controllers/orderController.js
 M ecommerce-api-Nars/src/models/category.js
 M ecommerce-api-Nars/src/models/order.js
 M ecommerce-api-Nars/src/routes/index.js
 M ecommerce-api-Nars/tests/unit/controllers/categoryController.test.js
 M ecommerce-api-Nars/tests/unit/controllers/orderController.test.js
 M ecommerce-app-Nars/cypress/e2e/cart.cy.js
 M ecommerce-app-Nars/cypress/e2e/checkoutReuse.cy.js
 M ecommerce-app-Nars/cypress/e2e/goldenPath.cy.js
 M ecommerce-app-Nars/cypress/e2e/orders.cy.js
 M ecommerce-app-Nars/src/api/apiClient.js
 M ecommerce-app-Nars/src/api/paymentApi.js
 M ecommerce-app-Nars/src/api/productApi.js
 M ecommerce-app-Nars/src/api/shippingApi.js
 M ecommerce-app-Nars/src/components/organisms/CartSummary.jsx
 M ecommerce-app-Nars/src/constants/orderConstants.js
 M ecommerce-app-Nars/src/hooks/useAdminCategories.js
 M ecommerce-app-Nars/src/index.css
 M ecommerce-app-Nars/src/pages/AdminCategoriesPage.css
 M ecommerce-app-Nars/src/pages/AdminCategoriesPage.jsx
 M ecommerce-app-Nars/src/pages/AdminProductsPage.css
 M ecommerce-app-Nars/src/pages/AdminProductsPage.jsx
 M ecommerce-app-Nars/src/pages/CheckoutPage.css
 M ecommerce-app-Nars/src/pages/CheckoutPage.jsx
 M ecommerce-app-Nars/src/pages/ConfirmationPage.jsx
 M ecommerce-app-Nars/src/pages/HomePage.css
 M ecommerce-app-Nars/src/pages/HomePage.jsx
 M ecommerce-app-Nars/src/pages/LoginPage.css
 M ecommerce-app-Nars/src/pages/LoginPage.jsx
 M ecommerce-app-Nars/src/pages/OrderDetailPage.jsx
 M ecommerce-app-Nars/src/pages/ProfilePage.css
 M ecommerce-app-Nars/src/pages/ProfilePage.jsx
 M ecommerce-app-Nars/src/pages/__tests__/AdminProductsPage.test.jsx
 M ecommerce-app-Nars/src/pages/__tests__/CartPage.test.jsx
 M ecommerce-app-Nars/src/pages/__tests__/CheckoutPage.test.jsx
 M ecommerce-app-Nars/src/pages/__tests__/LoginPage.test.jsx
 M ecommerce-app-Nars/src/pages/__tests__/ProfilePage.test.jsx
 M ecommerce-app-Nars/src/services/orderService.js
 M ecommerce-app-Nars/src/services/productService.js
 M ecommerce-app-Nars/src/services/userService.js
 M ecommerce-app-Nars/src/utils/formValidators.js
?? "Prompt Unificacion de Tareas.docx"
?? "Requerimientos a Corregir.docx"
?? docs/AUDITORIA_5_DUDAS_MASTER_PLAN_2026-04-12-0134.md
?? docs/AUDITORIA_AGAINST_RUBRIC_2026-04-08-0035.md
?? docs/MASTER_PLAN_EXECUTION_2026-04-12-0841.md
?? docs/fixes/
?? docs/specs/2026-04-16-ui-fixes-ecommerce.md
?? docs/specs/2026-04-18-17-20-home-paginacion-implementacion.md
?? docs/specs/2026-04-18-17-35-admin-paginacion-implementacion.md
?? docs/specs/2026-04-18-17-50-admin-categories-pagination-plan.md
?? docs/specs/2026-04-18-18-05-admin-categories-paginacion-implementacion.md
?? docs/specs/2026-04-18-18-25-admin-categories-imageurl-empty-plan.md
?? docs/specs/2026-04-18-18-32-admin-categories-imageurl-empty-implementation.md
?? docs/specs/2026-04-18-bugfix-order-total-consistency.md
?? docs/specs/2026-04-18-diagnostico-productos-home-vs-admin.md
?? docs/specs/2026-04-18-feature-iva-support.md
?? docs/specs/2026-04-18-hide-avatar-field-profile.md
?? docs/specs/2026-04-18-remove-visible-tax-from-purchase-flow.md
?? docs/specs/Fixes_-_ecommerce_2026-04-17-1855.md
?? docs/specs/ui-fixes-ecommerce_2026-04-17-2257.md
?? docs/specs/ui-fixes-ecommerce_2026-04-18-0110.md
?? docs/specs/ui-fixes-ecommerce_2026-04-18-0144.md
?? ecommerce-api-Nars/src/config/cloudinary.js
?? ecommerce-api-Nars/src/controllers/uploadController.js
?? ecommerce-api-Nars/src/middlewares/uploadMiddleware.js
?? ecommerce-api-Nars/src/routes/uploadRoutes.js
?? ecommerce-app-Nars/cypress/e2e/checkoutAddressModes.cy.js
?? ecommerce-app-Nars/cypress/screenshots/authLifecycle.cy.js/
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/cart (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/cart (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/cart (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/cart (5).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/cart (6).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/checkout (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/checkout (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/checkout (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/checkout (5).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/checkout (6).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/home-catalog (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/home-catalog (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/home-catalog (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/home-catalog (5).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/home-catalog (6).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/login (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/login (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/login (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/login (5).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/login (6).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/orders (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/orders (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/orders (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/orders (5).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/orders (6).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/product-detail (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/product-detail (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/product-detail (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/product-detail (5).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/product-detail (6).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/profile (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/profile (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/profile (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/profile (5).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/profile (6).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/register (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/register (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/register (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/register (5).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/register (6).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/cart (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/cart (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/cart (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/cart (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/cart (5).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/checkout (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/checkout (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/checkout (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/checkout (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/checkout (5).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/home-catalog (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/home-catalog (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/home-catalog (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/home-catalog (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/home-catalog (5).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/login (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/login (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/login (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/login (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/login (5).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/orders (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/orders (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/orders (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/orders (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/orders (5).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/product-detail (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/product-detail (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/product-detail (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/product-detail (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/product-detail (5).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/profile (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/profile (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/profile (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/profile (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/profile (5).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/register (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/register (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/register (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/register (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/register (5).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/cart (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/cart (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/cart (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/cart (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/cart (5).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/checkout (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/checkout (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/checkout (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/checkout (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/checkout (5).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/home-catalog (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/home-catalog (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/home-catalog (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/home-catalog (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/home-catalog (5).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/login (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/login (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/login (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/login (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/login (5).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/orders (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/orders (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/orders (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/orders (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/orders (5).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/product-detail (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/product-detail (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/product-detail (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/product-detail (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/product-detail (5).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/profile (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/profile (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/profile (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/profile (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/profile (5).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/register (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/register (2).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/register (3).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/register (4).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/register (5).png"
?? ecommerce-app-Nars/src/api/uploadApi.js
?? ecommerce-app-Nars/src/pages/__tests__/AdminCategoriesPage.test.jsx
?? ecommerce-app-Nars/src/pages/__tests__/ConfirmationPage.test.jsx
?? ecommerce-app-Nars/src/pages/__tests__/HomePage.test.jsx
?? ecommerce-app-Nars/src/pages/__tests__/OrderDetailPage.test.jsx
?? opencode/2026.04.15.Observaciones.docx
?? opencode/Prompt26.04.08.1223am.md
?? opencode/Prompt26.04.09.0147am.md
?? opencode/Prompt26.04.12.0134am.md
?? opencode/Prompt26.04.12.0800am.md
?? opencode/Prompt26.04.17.0203am.md
?? opencode/Prompt26.04.17.0629pm.md
?? opencode/Prompt26.04.17.1037pm.md
?? opencode/Prompt26.04.17.1045pm.md
?? opencode/Prompt26.04.18.0054am.md
?? opencode/Prompt26.04.18.0133am.md
?? opencode/Prompt26.04.18.0215am.md
?? opencode/Prompt26.04.18.0249pm.md
?? opencode/Prompt26.04.18.0329pm.md
?? opencode/Prompt26.04.18.0350pm.md
?? opencode/Prompt26.04.18.0432pm.md
?? opencode/Prompt26.04.18.0510pm.md
?? opencode/Prompt26.04.18.0525pm.md
?? opencode/Prompt26.04.18.0545pm.md
?? opencode/Prompt26.04.18.0600pm.md
?? opencode/Prompt26.04.18.0620pm.md
?? opencode/Prompt26.04.18.0627pm.md
?? opencode/Prompt26.04.18.0648pm.md
?? opencode/Prompt26.04.18.0650pm.md
?? opencode/Prompt26.04.18.0653pm.md
?? opencode/Prompt26.04.18.0727pm.md
?? "opencode/slides de soporte.pptx"
?? "opencode/slides de soporte2.pptx"
?? "opencode/slides de soporte3.pptx"
?? "opencode/slides de soporte4.pptx"
```

### `npm ls --depth=0` backend

```text
ecommerce-api@1.0.0 D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-api-Nars
├── @vitest/coverage-v8@4.0.18
├── @vitest/ui@4.0.18
├── bcrypt@6.0.0
├── cloudinary@2.9.0
├── cors@2.8.5
├── dotenv@17.2.1
├── eslint@10.0.2
├── express-mongo-sanitize@2.2.0
├── express-rate-limit@8.3.1
├── express-validator@7.3.1
├── express@5.1.0
├── helmet@8.1.0
├── jsonwebtoken@9.0.2
├── mongodb-memory-server@11.0.1
├── mongoose@8.17.0
├── multer@2.1.1
├── nodemon@3.1.10
├── supertest@7.2.2
├── swagger-jsdoc@6.2.8
├── swagger-ui-express@5.0.1
├── vitest@4.0.18
└── winston@3.19.0
```

### `npm ls --depth=0` frontend

```text
ramdi-jewelry-ecommerce-css@1.0.0 D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars
├── @tanstack/react-query@5.96.2
├── @testing-library/jest-dom@6.9.1
├── @testing-library/react@16.3.2
├── @testing-library/user-event@14.6.1
├── @vitejs/plugin-react@4.7.0
├── axios@1.13.6
├── cypress@15.13.0
├── jsdom@26.1.0
├── react-dom@18.3.1
├── react-router-dom@6.30.2
├── react@18.3.1
├── vite@6.4.1
└── vitest@4.1.1
```

### Verificacion backend root

```text
backend_status=200
{"status":"ok","message":"Ecommerce API Jewelry running","database":"connected","time":"2026-04-19T01:31:28.292Z","requestId":"034742c4-2402-40ba-b135-a3621eacc8e0"}
```

### Verificacion frontend root

```text
frontend_status=200
<!doctype html>
<html lang="es" data-theme="dark">
  <head>
    <script type="module">import { injectIntoGlobalHook } from "/@react-refresh";
injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;</script>

    <script type="module" src="/@vite/clie
```

### Verificacion de rutas frontend principales

```text
/ -> 200 text/html
/login -> 200 text/html
/register -> 200 text/html
/cart -> 200 text/html
/checkout -> 200 text/html
/orders -> 200 text/html
```

### Build frontend

```text
> ramdi-jewelry-ecommerce-css@1.0.0 build
> vite build

vite v6.4.1 building for production...
transforming...
✓ 208 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                             0.50 kB │ gzip:  0.33 kB
dist/assets/ProductDetailPage-BUzZyFVF.css  0.93 kB │ gzip:  0.44 kB
dist/assets/ProfilePage-BZAau1d4.css        1.52 kB │ gzip:  0.63 kB
dist/assets/CheckoutPage-p8nTReRD.css       2.62 kB │ gzip:  0.89 kB
dist/assets/HomePage-Bpe02Ml7.css           3.45 kB │ gzip:  1.05 kB
dist/assets/index-CRuXre01.css              26.27 kB │ gzip:  5.41 kB
dist/assets/productService-Dwgv6Fzq.js      1.27 kB │ gzip:  0.55 kB
dist/assets/ProductDetailPage-C1EhQ6l5.js   2.24 kB │ gzip:  0.94 kB
dist/assets/HomePage-BxH9y2dH.js            4.87 kB │ gzip:  1.89 kB
dist/assets/ProfilePage-Bw4szLGx.js         4.97 kB │ gzip:  1.87 kB
dist/assets/CheckoutPage-CJP5fXfp.js        16.69 kB │ gzip:  4.82 kB
dist/assets/index-DhixBe4b.js               316.06 kB │ gzip: 98.84 kB
✓ built in 3.42s
```

### Smoke API end-to-end

```text
### REGISTER request
{
  "displayName": "Smoke QA",
  "email": "smoke-1776562403167@mail.com",
  "password": "Password123!"
}

### REGISTER response
{
  "status": 201,
  "body": {
    "message": "User registered successfully",
    "user": {
      "id": "69e430e325c7533da349908e",
      "displayName": "Smoke QA",
      "email": "smoke-1776562403167@mail.com",
      "role": "customer",
      "active": true
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

### LOGIN response
{
  "status": 200,
  "body": {
    "message": "Login successful",
    "user": {
      "id": "69e430e325c7533da349908e",
      "displayName": "Smoke QA",
      "email": "smoke-1776562403167@mail.com",
      "role": "customer",
      "active": true
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

### PRODUCT LIST response
{
  "status": 200,
  "total": 21,
  "items": 10,
  "firstNames": [
    "Anillo de plata grabado Laser",
    "Anillo de resina arcoiris",
    "Anillo latón con turquesa"
  ]
}

### PRODUCT SEARCH response
{
  "status": 200,
  "total": 4,
  "items": 4,
  "firstNames": [
    "Anillo simple de plata",
    "Anillo de resina arcoiris",
    "Anillo de plata grabado Laser"
  ]
}

### ADD TO CART response
{
  "status": 200,
  "products": 1
}

### GET CART response
{
  "status": 200,
  "products": 1
}

### CREATE ADDRESS response
{
  "status": 201,
  "addressId": "69e430e325c7533da34990a6",
  "body": {
    "message": "Shipping address created successfully",
    "address": {
      "user": "69e430e325c7533da349908e",
      "name": "Smoke QA",
      "address": "Av Reforma 123",
      "city": "Ciudad de Mexico",
      "state": "CDMX",
      "postalCode": "11000",
      "country": "México",
      "phone": "5512345678",
      "isDefault": true,
      "addressType": "home",
      "_id": "69e430e325c7533da34990a6",
      "createdAt": "2026-04-19T01:33:23.923Z",
      "updatedAt": "2026-04-19T01:33:23.923Z",
      "__v": 0
    }
  }
}

### CREATE PAYMENT response
{
  "status": 201,
  "paymentId": "69e430e325c7533da34990a9",
  "body": {
    "data": {
      "user": "69e430e325c7533da349908e",
      "type": "credit_card",
      "cardHolderName": "Smoke QA",
      "expiryDate": "12/29",
      "brand": "Visa",
      "last4": "1111",
      "isDefault": true,
      "active": true,
      "_id": "69e430e325c7533da34990a9",
      "createdAt": "2026-04-19T01:33:23.936Z",
      "updatedAt": "2026-04-19T01:33:23.936Z",
      "__v": 0
    }
  }
}

### CHECKOUT response
{
  "status": 201,
  "orderId": "69e430e325c7533da34990b0",
  "body": {
    "subtotal": 820,
    "taxAmount": 0,
    "shippingCost": 99,
    "totalPrice": 919,
    "status": "pending",
    "paymentStatus": "pending",
    "_id": "69e430e325c7533da34990b0"
  }
}

### USER ORDERS response
{
  "status": 200,
  "count": 1,
  "orderIds": [
    "69e430e325c7533da34990b0"
  ]
}

### REFRESH response
{
  "status": 200,
  "body": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

### LOGOUT response
{
  "status": 200,
  "body": {
    "message": "Logged out successfully"
  }
}
```

### Cypress golden path

```text
Warning: We failed to trash the existing run results.

This error will not affect or change the exit code.

Error: Command failed: C:\Users\ALI\AppData\Local\Cypress\Cache\15.13.0\Cypress\resources\app\node_modules\trash\lib\windows-trash.exe D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\cypress\screenshots\responsiveEvidence.cy.js

====================================================================================================

  (Run Starting)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Cypress:        15.13.0                                                                        │
  │ Browser:        Electron 138 (headless)                                                        │
  │ Node Version:   v22.15.0 (C:\Program Files\nodejs\node.exe)                                    │
  │ Specs:          1 found (goldenPath.cy.js)                                                     │
  │ Searched:       D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsR │
  │                 ev02\ecommerce-app-Nars\cypress\e2e\goldenPath.cy.js                           │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘


────────────────────────────────────────────────────────────────────────────────────────────────────

  Running:  goldenPath.cy.js                                                                (1 of 1)


  Golden Path - Login to Orders
    √ E2E-PH3-004: completa Login -> Producto -> Carrito -> Checkout -> Confirmacion -> Orders sin mocks (11553ms)


  1 passing (12s)


  (Results)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Tests:        1                                                                                │
  │ Passing:      1                                                                                │
  │ Failing:      0                                                                                │
  │ Pending:      0                                                                                │
  │ Skipped:      0                                                                                │
  │ Screenshots:  0                                                                                │
  │ Video:        false                                                                            │
  │ Duration:     11 seconds                                                                       │
  │ Spec Ran:     goldenPath.cy.js                                                                 │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘


====================================================================================================

  (Run Finished)


       Spec                                              Tests  Passing  Failing  Pending  Skipped
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ ✔  goldenPath.cy.js                         00:11        1        1        -        -        - │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
    ✔  All specs passed!                        00:11        1        1        -        -        -
```

## 6. Resultado por flujo probado

- Home: OK
  - frontend responde `200` y el golden path navega a `/` tras login.
- Listado de productos: OK
  - API devuelve `21` productos totales y la UI carga productos sin mocks.
- Busqueda de productos: OK
  - API `products/search?q=anillo` devuelve `4` resultados.
- Registro: OK
  - `POST /auth/register` responde `201`.
- Login: OK
  - `POST /auth/login` responde `200`.
- Agregar producto al carrito: OK
  - `POST /cart/add-product` responde `200`.
- Ver carrito: OK
  - `GET /cart/user` responde `200`.
- Checkout: OK
  - flujo completo validado por API y Cypress.
- Creacion de orden: OK
  - `POST /orders/checkout` responde `201`.
- Consulta de ordenes del usuario: OK
  - `GET /orders/user/:userId` responde `200` y devuelve la orden creada.
- Navegacion basica: OK
  - `/`, `/login`, `/register`, `/cart`, `/checkout`, `/orders` responden `200` desde Vite.
- Conexion front-back: OK
  - frontend resuelve contra `VITE_API_URL=http://localhost:3001/api` y el golden path opera sin mocks sobre API real.

## 7. Evidencia de errores o hallazgos

### OK funcional

- Backend levanta y conecta a Mongo.
- Frontend levanta en Vite.
- Build frontend exitoso.
- Flujo integrado principal de negocio paso de extremo a extremo.
- Cypress golden path paso completo sin fallas funcionales.

### Hallazgos

- El workspace ya estaba muy sucio antes de esta fase (`git status --short` con muchos cambios y artefactos); no se modifico codigo para este smoke, pero esto aumenta riesgo de integracion futura.
- El smoke UI existente cubre login -> producto -> carrito -> checkout -> confirmacion -> ordenes, lo cual agrega confianza alta para demo.

### Bloqueos

- No hubo bloqueos funcionales para completar el smoke principal.

### Errores no bloqueantes

- Cypress mostro esta advertencia no bloqueante:
  - fallo al limpiar resultados previos en `cypress/screenshots/responsiveEvidence.cy.js`
  - no cambio exit code
  - no afecto el resultado del smoke

### Riesgos para demo/presentacion

- Riesgo medio por worktree sucio: hay muchos cambios locales y archivos no versionados, lo que puede introducir comportamientos no auditados si no se congela el estado antes de demo/despliegue.
- Riesgo bajo por evidencia de UI manual incompleta: aunque el golden path Cypress fue exitoso, no se hizo una pasada manual exhaustiva por todas las pantallas secundarias.
- Riesgo bajo por TTL corto de access token (`35s` en `.env`), aunque el refresh flow tambien respondio OK en esta validacion.

## 8. Riesgos detectados

- `worktree` con muchos cambios sin consolidar.
- posible ruido de artefactos Cypress previos.
- no se validaron en esta fase dashboards admin completos, wishlist ni flujos de error avanzados.

## 9. Conclusion ejecutiva

- Estado: listo con observaciones

Motivo:

- Los flujos esenciales del ecommerce estan funcionalmente operativos hoy.
- La integracion front + back responde bien.
- Existe evidencia automatizada de smoke real en navegador headless.
- No se observaron fallos bloqueantes en Home, catalogo, auth, carrito, checkout u ordenes.
- Sin embargo, antes de auditoria final/demo/despliegue conviene ordenar el estado del repositorio y revisar el conjunto de cambios pendientes.
