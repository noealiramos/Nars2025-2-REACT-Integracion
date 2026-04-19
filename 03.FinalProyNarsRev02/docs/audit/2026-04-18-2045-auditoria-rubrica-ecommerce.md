# Auditoria rubrica ecommerce

## 1. Resumen ejecutivo

- Nivel estimado del proyecto: `84/100`
- Estado general: solido a nivel funcional y de integracion, con buen alcance para un proyecto bootcamp/full stack academico.
- Veredicto: `listo con ajustes` para presentacion.
- Fortaleza principal: flujo de negocio real `login -> catalogo -> carrito -> checkout -> ordenes` validado en integracion real y Cypress.
- Debilidad principal: preparacion de produccion y calidad academica documental por debajo del nivel funcional alcanzado.

## 2. Evaluacion por criterio

| Criterio | Estado | Evidencia | Riesgo |
|---|---|---|---|
| Arquitectura y estructura | Parcial | Monorepo separado `ecommerce-api-Nars` / `ecommerce-app-Nars`; backend organizado en `config/controllers/middlewares/models/routes/utils/validators`; frontend organizado en `api/components/contexts/hooks/pages/services/utils` | Medio: backend no usa capa `services` consistente y mezcla logica de negocio en controllers |
| Backend API | Cumple | CRUD y endpoints visibles en `src/routes/index.js`, rutas modulares para auth, users, products, cart, orders, categories, payment, shipping, wishlist, reviews; paginacion confirmada en productos, categorias, ordenes | Medio: respuestas API no son totalmente consistentes entre modulos (`data/meta` vs `items/pagination` vs objetos planos) |
| Autenticacion y seguridad | Parcial | JWT access + refresh, refresh endpoint, route guards, `helmet`, `cors`, `express-rate-limit`, sanitizacion NoSQL, roles `isAdmin` y `ownerOrAdmin` | Alto: secretos reales en `.env` versionado y `ENABLE_TEST_AUTH_TOOLS=true` |
| Frontend | Cumple | React Router, Query Client, Auth/Cart/UI Contexts, estados loading/error visibles en varias paginas, formularios funcionales y manejo de errores en login/checkout | Medio: UX/documentacion no totalmente pulidas; hay variaciones de patron entre modulos |
| Integracion front-back | Cumple | `VITE_API_URL=http://localhost:3001/api`; smoke real por API + Cypress golden path sin mocks | Bajo |
| Funcionalidad de negocio | Cumple | Catalogo, detalle, busqueda, carrito, checkout, ordenes operativos y validados | Bajo |
| Testing / QA | Parcial | Suite amplia de Cypress, pruebas Vitest frontend y backend presentes, golden path funcional exitoso | Medio: no se ejecuto suite completa; hay warning de Cypress y cobertura no cuantificada |
| Documentacion | Parcial | Frontend tiene README; backend expone Swagger en `/api/docs`; multiples documentos en `docs/specs`, `docs/qa`, `docs/fixes` | Medio-Alto: no hay README backend, no hay README raiz, frontend README esta desactualizado respecto a puerto/API |
| Despliegue / preparacion | Parcial | Variables de entorno existen, frontend usa URL configurable, health check API disponible | Alto: CORS amarrado a localhost, secretos expuestos, modo test habilitado, documentacion de despliegue insuficiente |

## 3. Hallazgos criticos

1. Secretos sensibles versionados en `ecommerce-api-Nars/.env`
- Evidencia: `JWT_SECRET`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` estan en texto plano.
- Impacto academico/profesional: fuerte penalizacion por seguridad y malas practicas de despliegue.

2. Herramientas de prueba habilitadas en configuracion activa
- Evidencia: `ENABLE_TEST_AUTH_TOOLS=true` y `START_SERVER=true` en `ecommerce-api-Nars/.env`.
- Impacto: riesgo de exponer rutas auxiliares de prueba en entornos no controlados.

3. Documentacion principal incompleta y desalineada
- Evidencia: no existe README raiz ni README backend; `ecommerce-app-Nars/README.md` sigue apuntando a `http://localhost:3000` mientras el entorno validado usa `3001`.
- Impacto: baja puntos en documentacion e instalacion; complica evaluacion por profesor o jurado.

4. Inconsistencia de contratos API
- Evidencia: productos responden `items/pagination`, carritos `data`, payment methods `data/meta`, checkout devuelve orden plana.
- Impacto: arquitectura menos consistente y mayor costo de mantenimiento.

5. Worktree excesivamente sucio antes de presentacion
- Evidencia: `git status --short` muestra docenas de archivos modificados y no versionados.
- Impacto: riesgo alto de demo, regresiones y confusion durante revision final.

## 4. Hallazgos menores

- Backend usa buena separacion por carpetas, pero la capa `services` no existe realmente pese a que la rubrica la menciona como deseable.
- En frontend hay buen manejo de sesion y refresh token, pero el patron de respuestas de servicios se adapta a contratos heterogeneos.
- El README frontend describe bien el proyecto, aunque esta desactualizado en puertos y variable de entorno.
- El hero/home y varios fixes muestran iteracion activa, pero el volumen de documentos dispersos sugiere necesidad de consolidacion para entrega final.
- El proyecto tiene buen nivel de QA para bootcamp por contar con Cypress real y tests unitarios representativos.

## 5. Riesgos para demo

1. `JWT` de acceso muy corto (`35s`) puede provocar expiracion visible durante navegacion larga o explicacion en vivo.
2. Worktree sucio puede introducir comportamiento no congelado o dificil de explicar si algo cambia antes de la presentacion.
3. Advertencia de Cypress al limpiar screenshots previos revela ruido operativo en el entorno de pruebas.
4. Credenciales reales expuestas son un riesgo serio si el repositorio se comparte o sube publico.
5. Falta de README backend / raiz puede afectar la percepcion de madurez del proyecto aunque funcionalmente ande bien.

## 6. Plan de accion priorizado

### TOP 5 cosas a corregir antes de presentar

1. Sacar secretos del repositorio y regenerarlos.
2. Desactivar `ENABLE_TEST_AUTH_TOOLS` fuera de pruebas y revisar `.env` de entrega.
3. Crear README raiz + README backend, y corregir puertos/API del README frontend.
4. Congelar/limpiar el estado del repositorio para la demo.
5. Unificar en lo posible la forma de respuesta de APIs criticas o documentar claramente sus diferencias.

## 7. Evidencia tecnica

### Archivos revisados

- `ecommerce-api-Nars/src/routes/index.js`
- `ecommerce-api-Nars/src/routes/authRoutes.js`
- `ecommerce-api-Nars/src/routes/cartRoutes.js`
- `ecommerce-api-Nars/src/routes/orderRoutes.js`
- `ecommerce-api-Nars/src/routes/productRoutes.js`
- `ecommerce-api-Nars/src/routes/paymentMethodRoutes.js`
- `ecommerce-api-Nars/src/routes/shippingAddressRoutes.js`
- `ecommerce-api-Nars/src/controllers/productController.js`
- `ecommerce-api-Nars/src/controllers/paymentMethodController.js`
- `ecommerce-api-Nars/src/controllers/shippingAddressController.js`
- `ecommerce-api-Nars/src/middlewares/authMiddleware.js`
- `ecommerce-api-Nars/src/middlewares/errorHandler.js`
- `ecommerce-api-Nars/src/middlewares/isAdminMiddleware.js`
- `ecommerce-api-Nars/src/middlewares/ownerOrAdmin.js`
- `ecommerce-api-Nars/src/config/env.js`
- `ecommerce-api-Nars/.env`
- `ecommerce-app-Nars/src/App.jsx`
- `ecommerce-app-Nars/src/contexts/AuthContext.jsx`
- `ecommerce-app-Nars/src/pages/LoginPage.jsx`
- `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`
- `ecommerce-app-Nars/src/api/apiClient.js`
- `ecommerce-app-Nars/README.md`
- `ecommerce-app-Nars/cypress/e2e/goldenPath.cy.js`
- `ecommerce-app-Nars/cypress.config.js`

### Comandos ejecutados

- `git status --short`
- `npm ls --depth=0` en backend
- `npm ls --depth=0` en frontend
- `node -e "fetch('http://localhost:3001/api/health')..."`
- `npx cypress run --spec cypress/e2e/goldenPath.cy.js`
- `npm test -- tests/unit/controllers/categoryController.test.js tests/unit/controllers/orderController.test.js`
- `npm test -- src/pages/__tests__/HomePage.test.jsx src/pages/__tests__/AdminCategoriesPage.test.jsx src/pages/__tests__/CheckoutPage.test.jsx`
- intentos fallidos con `npm test -- --runInBand` en backend y frontend

### Outputs relevantes

#### `git status --short`

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
?? ... multiples archivos docs/opencode/screenshots no rastreados ...
```

#### `npm ls --depth=0` backend

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

#### `npm ls --depth=0` frontend

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

#### `fetch('http://localhost:3001/api/health')`

```text
health_status=200
{"status":"ok","service":"ecommerce-api-jewelry","time":"2026-04-19T02:34:48.085Z","mongo":{"state":1,"stateText":"connected"},"requestId":"16deb5eb-6879-4001-b9eb-dd689c842c20"}
```

#### Backend README glob

```text
No files found
```

#### Intento fallido de suite completa backend

```text
> ecommerce-api@1.0.0 test
> vitest --runInBand

CACError: Unknown option `--runInBand`
Node.js v22.15.0
```

#### Intento fallido de suite completa frontend

```text
> ramdi-jewelry-ecommerce-css@1.0.0 test
> vitest run --runInBand

CACError: Unknown option `--runInBand`
Node.js v22.15.0
```

#### Tests backend representativos

```text
> ecommerce-api@1.0.0 test
> vitest tests/unit/controllers/categoryController.test.js tests/unit/controllers/orderController.test.js

RUN  v4.0.18 D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars

✓ tests/unit/controllers/categoryController.test.js (8 tests) 49ms
✓ tests/unit/controllers/orderController.test.js (10 tests) 208ms

Test Files  2 passed (2)
Tests       18 passed (18)
Duration    4.28s
```

#### Tests frontend representativos

```text
> ramdi-jewelry-ecommerce-css@1.0.0 test
> vitest run src/pages/__tests__/HomePage.test.jsx src/pages/__tests__/AdminCategoriesPage.test.jsx src/pages/__tests__/CheckoutPage.test.jsx

RUN  v4.1.1 D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-app-Nars

Test Files  3 passed (3)
Tests       25 passed (25)
Duration    18.26s
```

#### Cypress golden path

```text
Warning: We failed to trash the existing run results.

This error will not affect or change the exit code.

Error: Command failed: C:\Users\ALI\AppData\Local\Cypress\Cache\15.13.0\Cypress\resources\app\node_modules\trash\lib\windows-trash.exe D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\cypress\screenshots\responsiveEvidence.cy.js

  Running:  goldenPath.cy.js
  Golden Path - Login to Orders
    √ E2E-PH3-004: completa Login -> Producto -> Carrito -> Checkout -> Confirmacion -> Orders sin mocks (11553ms)

  1 passing (12s)
  All specs passed!
```

## 8. Valoracion final como profesor

- El proyecto muestra un nivel funcional superior al promedio de bootcamp, especialmente por tener:
  - integracion real;
  - checkout operativo;
  - ordenes;
  - JWT con refresh;
  - rate limiting;
  - Cypress de flujo completo.
- La nota baja de un 90+ a un rango medio-80 por cuestiones de madurez academica/profesional:
  - seguridad de secretos;
  - documentacion incompleta/desactualizada;
  - inconsistencias de arquitectura/contratos;
  - preparacion de despliegue todavia parcial.
