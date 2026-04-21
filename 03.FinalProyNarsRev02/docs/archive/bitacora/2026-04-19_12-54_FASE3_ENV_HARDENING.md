# FASE 3 ENV HARDENING

## 1. Encabezado
- Fecha y hora exacta de ejecucion: 2026-04-19 12:54
- Fase: FASE 3
- Objetivo: centralizar configuracion de URLs y variables de entorno, conservar un fallback controlado en frontend, preparar `.env.example` y endurecer configuracion sin romper el entorno actual.

## 2. Diagnostico inicial

### Estado actual del manejo de variables
- El frontend usaba `VITE_API_URL` pero mantenia un fallback hardcodeado en `src/api/apiClient.js` apuntando a `http://localhost:3000/api`.
- Cypress duplicaba la URL de API en `cypress/support/commands.js` y `cypress/e2e/auth.cy.js`.
- Cypress fijaba `baseUrl` en `cypress.config.js`.
- El script `scripts/start-test-dev.mjs` volvia a hardcodear la API de pruebas.
- Backend Swagger y el log de arranque dependian de `localhost` fijo en archivos distintos.
- No existian `ecommerce-api-Nars/.env.example` ni `ecommerce-app-Nars/.env.example`.

### Problemas detectados
- Duplicacion de URLs entre frontend runtime, Cypress y scripts.
- Inconsistencia de puertos entre `3000`, `3001` y `5173`.
- Ausencia de plantilla base para despliegue seguro.
- Riesgo de deriva de configuracion entre desarrollo, pruebas y produccion.

## 3. Plan de implementacion

### Pasos
1. Crear una fuente central de URLs del frontend con fallback controlado.
2. Hacer que Cypress consuma URLs desde configuracion central/env en vez de literales repetidos.
3. Parametrizar backend para `PUBLIC_API_URL` y reutilizarla en Swagger y logging.
4. Crear `.env.example` para backend y frontend.
5. Actualizar README base para reflejar las nuevas variables.
6. Validar que frontend y backend sigan estables.

### Archivos a modificar
- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\src\config\runtimeUrls.mjs`
- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\src\api\apiClient.js`
- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\cypress\support\commands.js`
- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\cypress\e2e\auth.cy.js`
- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\cypress.config.mjs`
- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\scripts\start-test-dev.mjs`
- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-api-Nars\src\config\env.js`
- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-api-Nars\src\config\swagger.js`
- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-api-Nars\server.js`
- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-api-Nars\.env.example`
- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\.env.example`
- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\README.md`
- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\README.md`

### Justificacion tecnica
- Se centralizan defaults locales en un unico modulo para evitar divergencias.
- Se conserva fallback en frontend, pero alineado al puerto real de desarrollo (`3001`).
- Se mantiene compatibilidad con desarrollo local y pruebas actuales.
- Se separa claramente configuracion sensible de referencias seguras para despliegue.

## 4. Cambios realizados (DETALLADO)

### Archivo 1
- Ruta completa: `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\src\config\runtimeUrls.mjs`
- Antes: no existia una fuente central para URLs de frontend/Cypress.
- Despues: se creo un modulo con `DEFAULT_API_URL`, `DEFAULT_FRONTEND_URL`, `resolveApiUrl`, `resolveFrontendUrl` y `getRuntimeApiUrl`.
- Explicacion clara del cambio: ahora el fallback controlado vive en un solo archivo y no duplicado en varios puntos del frontend.

### Archivo 2
- Ruta completa: `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\src\api\apiClient.js`
- Antes: `const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";`
- Despues: `const API_URL = getRuntimeApiUrl();`
- Explicacion clara del cambio: el cliente HTTP sigue teniendo fallback, pero ya no decide localmente la URL ni usa el puerto inconsistente `3000`.

### Archivo 3
- Ruta completa: `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\cypress\support\commands.js`
- Antes: definia `API_URL` y `AUTH_TEST_API_URL` hardcodeadas a `http://localhost:3001/api`.
- Despues: usa `const getApiUrl = () => Cypress.env('apiUrl')`.
- Explicacion clara del cambio: todos los comandos de Cypress consumen la API desde la configuracion inyectada por `cypress.config.mjs`.

### Archivo 4
- Ruta completa: `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\cypress\e2e\auth.cy.js`
- Antes: definia `const API_URL = 'http://localhost:3001/api'`.
- Despues: usa `const getApiUrl = () => Cypress.env('apiUrl')`.
- Explicacion clara del cambio: la suite auth deja de acoplarse a una URL fija y usa la misma fuente de verdad de Cypress.

### Archivo 5
- Ruta completa: `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\cypress.config.mjs`
- Antes: existia `cypress.config.js` con `baseUrl: "http://localhost:5173"` hardcodeado y sin `env.apiUrl` centralizado.
- Despues: se migro a `cypress.config.mjs`, se importa `resolveApiUrl`/`resolveFrontendUrl`, se resuelve `baseUrl` desde `CYPRESS_BASE_URL` y `apiUrl` desde `CYPRESS_API_URL || VITE_API_URL`.
- Explicacion clara del cambio: Cypress ahora concentra su configuracion de URLs en un solo punto y reutiliza la logica de defaults del frontend.

### Archivo 6
- Ruta completa: `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\scripts\start-test-dev.mjs`
- Antes: `process.env.VITE_API_URL = 'http://localhost:3001/api';`
- Despues: `process.env.VITE_API_URL = resolveApiUrl(process.env.VITE_API_URL);`
- Explicacion clara del cambio: el script conserva un default local, pero respeta override externo y evita duplicacion literal fuera del modulo central.

### Archivo 7
- Ruta completa: `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-api-Nars\src\config\env.js`
- Antes: no existia `PUBLIC_API_URL` normalizada.
- Despues: se agrego `normalizeUrl()` y `PUBLIC_API_URL` con fallback controlado a `http://localhost:${process.env.PORT || 3000}`.
- Explicacion clara del cambio: backend centraliza su URL publica en la capa de configuracion y evita repetir composicion de URL en otros archivos.

### Archivo 8
- Ruta completa: `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-api-Nars\src\config\swagger.js`
- Antes: `servers[0].url` era `'http://localhost:3000'`.
- Despues: `servers[0].url` usa `env.PUBLIC_API_URL`.
- Explicacion clara del cambio: Swagger ya no publica una URL fija y puede reflejar desarrollo, QA o produccion segun entorno.

### Archivo 9
- Ruta completa: `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-api-Nars\server.js`
- Antes: el log de arranque reportaba ``http://localhost:${PORT}``.
- Despues: el log reporta `env.PUBLIC_API_URL`.
- Explicacion clara del cambio: el log de arranque se alinea con la configuracion central del backend.

### Archivo 10
- Ruta completa: `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-api-Nars\.env.example`
- Antes: no existia.
- Despues: se creo plantilla segura con `PORT`, `PUBLIC_API_URL`, `MONGODB_URI`, `MONGODB_DB`, `JWT_SECRET`, `CORS_WHITELIST`, TTLs, banderas de test y variables Cloudinary vacias.
- Explicacion clara del cambio: backend ya tiene referencia reproducible sin exponer secretos reales.

### Archivo 11
- Ruta completa: `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\.env.example`
- Antes: no existia.
- Despues: se creo plantilla con `VITE_API_URL`, `CYPRESS_API_URL` y `CYPRESS_BASE_URL`.
- Explicacion clara del cambio: frontend y Cypress parten de una referencia explicita y alineada.

### Archivo 12
- Ruta completa: `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\README.md`
- Antes: listaba variables, pero no apuntaba a `.env.example` ni a `PUBLIC_API_URL`/variables de Cypress.
- Despues: se agrego referencia a `.env.example`, `PUBLIC_API_URL`, `CYPRESS_API_URL` y `CYPRESS_BASE_URL`.
- Explicacion clara del cambio: la documentacion raiz queda alineada con la nueva estrategia de configuracion.

### Archivo 13
- Ruta completa: `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\README.md`
- Antes: mencionaba solo `.env.local` y `VITE_API_URL`.
- Despues: indica usar `.env.example` como base y documenta variables de Cypress.
- Explicacion clara del cambio: se aclara el flujo recomendado de configuracion sin tocar logica funcional.

## 5. Output de Terminal (OBLIGATORIO)

### Comando
```bash
powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd_HH-mm'"
```

### Output
```text
2026-04-19_12-54
```

### Comando
```bash
git status --short
```

### Output
```text
 M README.md
 M ecommerce-api-Nars/server.js
 M ecommerce-api-Nars/src/config/env.js
 M ecommerce-api-Nars/src/config/swagger.js
 M ecommerce-app-Nars/README.md
 D ecommerce-app-Nars/cypress.config.js
 M ecommerce-app-Nars/cypress/e2e/auth.cy.js
 M ecommerce-app-Nars/cypress/support/commands.js
 M ecommerce-app-Nars/scripts/start-test-dev.mjs
 M ecommerce-app-Nars/src/api/apiClient.js
?? docs/release/2026-04-19-1238-env-hardening.md
?? ecommerce-api-Nars/.env.example
?? ecommerce-app-Nars/.env.example
?? ecommerce-app-Nars/cypress.config.mjs
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/cart (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/checkout (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/home-catalog (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/login (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/orders (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/product-detail (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/profile (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/register (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/cart (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/checkout (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/home-catalog (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/login (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/orders (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/product-detail (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/profile (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/register (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/cart (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/checkout (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/home-catalog (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/login (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/orders (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/product-detail (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/profile (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/register (1).png"
?? ecommerce-app-Nars/src/config/
?? opencode/Prompt26.04.19.1238pm.md
?? opencode/Prompt26.04.19.1239pm.md
?? opencode/Prompt26.04.19.1253pm.md
```

### Comando
```bash
npm run build
```

### Output
```text
> ramdi-jewelry-ecommerce-css@1.0.0 build
> vite build

vite v6.4.1 building for production...
transforming...
✓ 209 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               0.50 kB │ gzip:  0.33 kB
dist/assets/ProductDetailPage-BUzZyFVF.css    0.93 kB │ gzip:  0.44 kB
dist/assets/ProfilePage-BZAau1d4.css          1.52 kB │ gzip:  0.63 kB
dist/assets/CheckoutPage-p8nTReRD.css         2.62 kB │ gzip:  0.89 kB
dist/assets/HomePage-Bpe02Ml7.css             3.45 kB │ gzip:  1.05 kB
dist/assets/index-CRuXre01.css               26.27 kB │ gzip:  5.41 kB
dist/assets/productService--Uc-pnBS.js        1.27 kB │ gzip:  0.55 kB
dist/assets/ProductDetailPage-cXiPwm5d.js     2.24 kB │ gzip:  0.94 kB
dist/assets/HomePage-B0-AIXxl.js              4.87 kB │ gzip:  1.89 kB
dist/assets/ProfilePage-HhMY2YWO.js           4.97 kB │ gzip:  1.87 kB
dist/assets/CheckoutPage-CWfi5CMt.js         16.69 kB │ gzip:  4.82 kB
dist/assets/index-BfB9o7Cy.js               316.12 kB │ gzip: 98.86 kB
✓ built in 6.72s
```

### Comando
```bash
npx vitest run
```

### Output
```text
RUN  v4.1.1 D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-app-Nars

Test Files  16 passed (16)
Tests       87 passed (87)
Start at    12:57:09
Duration    31.00s (transform 9.34s, setup 10.31s, import 28.54s, tests 45.68s, environment 74.54s)
```

### Comando
```bash
npx vitest run
```

### Output
```text
RUN  v4.0.18 D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars

stdout | tests/security.test.js
[dotenv@17.2.1] injecting env (12) from .env -- tip: 📡 version env with Radar: https://dotenvx.com/radar
[dotenv@17.2.1] injecting env (9) from .env.test -- tip: ⚙️  enable debug logging with { debug: true }

stdout | tests/integration/resilience.test.js
[dotenv@17.2.1] injecting env (12) from .env -- tip: 📡 auto-backup env with Radar: https://dotenvx.com/radar
[dotenv@17.2.1] injecting env (9) from .env.test -- tip: 🔐 prevent committing .env to code: https://dotenvx.com/precommit

stdout | tests/integration/auth.test.js
[dotenv@17.2.1] injecting env (12) from .env -- tip: 🔐 prevent committing .env to code: https://dotenvx.com/precommit
[dotenv@17.2.1] injecting env (9) from .env.test -- tip: ⚙️  specify custom .env file path with { path: '/custom/path/.env' }

stdout | tests/integration/catalog.test.js
[dotenv@17.2.1] injecting env (12) from .env -- tip: 📡 version env with Radar: https://dotenvx.com/radar
[dotenv@17.2.1] injecting env (9) from .env.test -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com

stdout | tests/integration/users.test.js
[dotenv@17.2.1] injecting env (12) from .env -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com
[dotenv@17.2.1] injecting env (9) from .env.test -- tip: 📡 auto-backup env with Radar: https://dotenvx.com/radar

✓ tests/integration/cartRoutes.test.js (4 tests) 247ms
stdout | tests/integration/cart_orders.test.js
[dotenv@17.2.1] injecting env (12) from .env -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
[dotenv@17.2.1] injecting env (9) from .env.test -- tip: 📡 version env with Radar: https://dotenvx.com/radar

stdout | tests/integration/users.test.js > User Integration Tests (RBAC) > GET /api/users > debe retornar 401 si no hay token
[2026-04-19 12:57:21] ecommerce-api info: HTTP Request {"method":"GET","url":"/api/users","status":401,"duration":"20ms","requestId":"e4029844-180d-4140-8ee9-6f5c9fe84fa6"}

stdout | tests/integration/resilience.test.js > Resilience & Error Handling Integration > debe retornar 500 y un JSON estructurado ante un error inesperado
[2026-04-19 12:57:21] ecommerce-api error: Simulated Database Crash {"stack":"Error: Simulated Database Crash\n    at Object.<anonymous> (D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/tests/integration/resilience.test.js:25:19)\n    at Object.Mock (file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/spy/dist/index.js:285:34)\n    at getProducts (D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/src/controllers/productController.js:35:15)\n    at Layer.handleRequest (D:\\MyDocuments\\2025.Inadaptados\\Nars2025-2-REACT-Integracion\\03.FinalProyNarsRev02\\ecommerce-api-Nars\\node_modules\\router\\lib\\layer.js:152:17)\n    at next (D:\\MyDocuments\\2025.Inadaptados\\Nars2025-2-REACT-Integracion\\03.FinalProyNarsRev02\\ecommerce-api-Nars\\node_modules\\router\\lib\\route.js:157:13)\n    at validate (D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/src/middlewares/validation.js:8:3)\n    at Layer.handleRequest (D:\\MyDocuments\\2025.Inadaptados\\Nars2025-2-REACT-Integracion\\03.FinalProyNarsRev02\\ecommerce-api-Nars\\node_modules\\router\\lib\\layer.js:152:17)\n    at next (D:\\MyDocuments\\2025.Inadaptados\\Nars2025-2-REACT-Integracion\\03.FinalProyNarsRev02\\ecommerce-api-Nars\\node_modules\\router\\lib\\route.js:157:13)\n    at middleware (D:\\MyDocuments\\2025.Inadaptados\\Nars2025-2-REACT-Integracion\\03.FinalProyNarsRev02\\ecommerce-api-Nars\\node_modules\\express-validator\\lib\\middlewares\\check.js:16:13)\n    at processTicksAndRejections (node:internal/process/task_queues:105:5)","requestId":"3882f283-6783-4ba1-a997-9a3667e5f8d3","status":500,"method":"GET","url":"/api/products"}

stdout | tests/integration/resilience.test.js > Resilience & Error Handling Integration > debe retornar 500 y un JSON estructurado ante un error inesperado
[2026-04-19 12:57:21] ecommerce-api info: HTTP Request {"method":"GET","url":"/api/products","status":500,"duration":"43ms","requestId":"3882f283-6783-4ba1-a997-9a3667e5f8d3"}

stdout | tests/integration/users.test.js > User Integration Tests (RBAC) > GET /api/users > debe retornar 403 si el usuario no es admin
[2026-04-19 12:57:21] ecommerce-api info: HTTP Request {"method":"GET","url":"/api/users","status":403,"duration":"8ms","requestId":"573bdf77-92d0-4422-bc00-e49781033a73"}

stdout | tests/integration/users.test.js > User Integration Tests (RBAC) > GET /api/users > debe permitir el acceso si el usuario es admin
[2026-04-19 12:57:21] ecommerce-api info: HTTP Request {"method":"GET","url":"/api/users","status":200,"duration":"11ms","requestId":"8956c747-2deb-4753-b510-998c05792c48"}

stdout | tests/integration/users.test.js > User Integration Tests (RBAC) > GET /api/users/me > debe retornar el perfil propio con token valido
[2026-04-19 12:57:21] ecommerce-api info: HTTP Request {"method":"GET","url":"/api/users/me","status":200,"duration":"4ms","requestId":"ddcafda2-5312-4201-bbf4-7d1c467b0020"}

✓ tests/integration/users.test.js (4 tests) 291ms
stdout | tests/integration/resilience.test.js > Resilience & Error Handling Integration > debe mantener consistencia en errores 404
[2026-04-19 12:57:21] ecommerce-api info: HTTP Request {"method":"GET","url":"/api/invalid-route-12345","status":404,"duration":"4ms","requestId":"8d096c49-2cd1-4c30-bd68-4e723aeb49ed"}

stdout | tests/integration/auth.test.js > Auth Integration Tests > POST /api/auth/register > debe validar errores de express-validator (email invalido)
[2026-04-19 12:57:21] ecommerce-api info: HTTP Request {"method":"POST","url":"/api/auth/register","status":422,"duration":"76ms","requestId":"7fb2bace-2976-4ac3-ab6f-8d3648a47677"}

stdout | tests/integration/catalog.test.js > Catalog & Health Integration Tests > GET /api/products (Public Catalog) > debe listar productos con filtros publicos
[2026-04-19 12:57:21] ecommerce-api info: HTTP Request {"method":"GET","url":"/api/products","status":200,"duration":"27ms","requestId":"92b322b7-524f-4bac-bc73-f679b138a834"}

stdout | tests/security.test.js > Security Verification Tests
[2026-04-19 12:57:21] ecommerce-api info: MongoDB is connected {"database":"ecommerce-db-jewelry"}

stdout | tests/integration/resilience.test.js > Resilience & Error Handling Integration > debe reportar el estado de la base de datos en el health check
[2026-04-19 12:57:21] ecommerce-api info: HTTP Request {"method":"GET","url":"/","status":200,"duration":"1ms","requestId":"dbcd26bb-05d8-48c5-bea1-646bcfdfc17c"}

stdout | tests/integration/catalog.test.js > Catalog & Health Integration Tests > GET /api/products (Public Catalog) > debe filtrar por diseño Simple
[2026-04-19 12:57:21] ecommerce-api info: HTTP Request {"method":"GET","url":"/api/products?design=Simple","status":200,"duration":"17ms","requestId":"8f1c7fff-3e24-4c31-abd0-aad52362b780"}

stdout | tests/integration/catalog.test.js > Catalog & Health Integration Tests > Health Check > debe estar saludable en el root
[2026-04-19 12:57:22] ecommerce-api info: HTTP Request {"method":"GET","url":"/","status":200,"duration":"2ms","requestId":"09967cbd-d00d-46df-9d79-d7d8f4165680"}

✓ tests/integration/resilience.test.js (3 tests) 325ms
stdout | tests/security.test.js > Security Verification Tests
[2026-04-19 12:57:22] ecommerce-api info: Test catalog seed status {"seeded":false,"reason":"products-exist","count":21}

✓ tests/integration/catalog.test.js (3 tests) 401ms
✓ debe listar productos con filtros publicos 331ms
stdout | tests/security.test.js > Security Verification Tests > CORS Configuration > should allow requests from whitelisted origins
[2026-04-19 12:57:22] ecommerce-api info: HTTP Request {"method":"GET","url":"/","status":200,"duration":"7ms","requestId":"c7e272cd-a890-46ce-83cf-91d47780e776"}

stdout | tests/security.test.js > Security Verification Tests > CORS Configuration > should block requests from non-whitelisted origins
[2026-04-19 12:57:22] ecommerce-api error: Not allowed by CORS {"stack":"Error: Not allowed by CORS\n    at origin (D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/src/app.js:30:16)\n    at D:\\MyDocuments\\2025.Inadaptados\\Nars2025-2-REACT-Integracion\\03.FinalProyNarsRev02\\ecommerce-api-Nars\\node_modules\\cors\\lib\\index.js:219:13\n    at optionsCallback (D:\\MyDocuments\\2025.Inadaptados\\Nars2025-2-REACT-Integracion\\03.FinalProyNarsRev02\\ecommerce-api-Nars\\node_modules\\cors\\lib\\index.js:199:9)\n    at corsMiddleware (D:\\MyDocuments\\2025.Inadaptados\\Nars2025-2-REACT-Integracion\\03.FinalProyNarsRev02\\ecommerce-api-Nars\\node_modules\\cors\\lib\\index.js:204:7)\n    at Layer.handleRequest (D:\\MyDocuments\\2025.Inadaptados\\Nars2025-2-REACT-Integracion\\03.FinalProyNarsRev02\\ecommerce-api-Nars\\node_modules\\router\\lib\\layer.js:152:17)\n    at trimPrefix (D:\\MyDocuments\\2025.Inadaptados\\Nars2025-2-REACT-Integracion\\03.FinalProyNarsRev02\\ecommerce-api-Nars\\node_modules\\router\\index.js:342:13)\n    at D:\\MyDocuments\\2025.Inadaptados\\Nars2025-2-REACT-Integracion\\03.FinalProyNarsRev02\\ecommerce-api-Nars\\node_modules\\router\\index.js:297:9\n    at processParams (D:\\MyDocuments\\2025.Inadaptados\\Nars2025-2-REACT-Integracion\\03.FinalProyNarsRev02\\ecommerce-api-Nars\\node_modules\\router\\index.js:582:12)\n    at next (D:\\MyDocuments\\2025.Inadaptados\\Nars2025-2-REACT-Integracion\\03.FinalProyNarsRev02\\ecommerce-api-Nars\\node_modules\\router\\index.js:291:5)\n    at internalNext (file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/helmet/index.mjs:527:6)","requestId":"-","status":500,"method":"GET","url":"/"}

stdout | tests/integration/auth.test.js > Auth Integration Tests > POST /api/auth/register > debe registrar exitosamente si los datos son validos
[2026-04-19 12:57:22] ecommerce-api info: HTTP Request {"method":"POST","url":"/api/auth/register","status":201,"duration":"347ms","requestId":"14925a3b-15d1-4c91-a799-96c19f38a0d1"}

stdout | tests/security.test.js > Security Verification Tests > Rate Limiting > should allow standard amount of requests
[2026-04-19 12:57:22] ecommerce-api info: HTTP Request {"method":"GET","url":"/","status":200,"duration":"4ms","requestId":"90582bce-6149-419d-aedc-1409cd6c8b10"}

stdout | tests/integration/auth.test.js > Auth Integration Tests > POST /api/auth/login > debe fallar si faltan campos requeridos
[2026-04-19 12:57:22] ecommerce-api info: HTTP Request {"method":"POST","url":"/api/auth/login","status":422,"duration":"3ms","requestId":"343890c8-3c86-4572-9b26-8c898b115443"}

stdout | tests/security.test.js > Security Verification Tests > Rate Limiting > should include rate limit headers
[2026-04-19 12:57:22] ecommerce-api info: HTTP Request {"method":"GET","url":"/api/health","status":200,"duration":"7ms","requestId":"a8d744f7-26a3-49a0-bacd-c5d21b7cc5fd"}

stdout | tests/security.test.js > Security Verification Tests > NoSQL Injection Prevention (Regex) > should treat object queries as strings in product search
[2026-04-19 12:57:22] ecommerce-api info: HTTP Request {"method":"GET","url":"/api/products/search?q%5B%24gt%5D=","status":200,"duration":"11ms","requestId":"b536d5ad-0703-40d2-b3aa-38cab7434168"}

stdout | tests/security.test.js > Security Verification Tests > NoSQL Injection Prevention (Regex) > should treat object queries as strings in user search
[2026-04-19 12:57:22] ecommerce-api info: HTTP Request {"method":"GET","url":"/api/users/search?q%5B%24gt%5D=","status":401,"duration":"2ms","requestId":"91d39473-4127-478f-ac36-a8a12985bb9a"}

stdout | tests/security.test.js > Security Verification Tests > Health Check Sanitization > should not leak detailed database error messages
[2026-04-19 12:57:22] ecommerce-api info: HTTP Request {"method":"GET","url":"/api/health","status":200,"duration":"76ms","requestId":"68680032-6a06-48aa-8857-edb697f4ac41"}

✓ tests/security.test.js (7 tests) 613ms
stdout | tests/integration/auth.test.js > Auth Integration Tests > POST /api/auth/login > debe loguear exitosamente con datos validos
[2026-04-19 12:57:22] ecommerce-api info: HTTP Request {"method":"POST","url":"/api/auth/login","status":200,"duration":"88ms","requestId":"544c74fb-4991-48b5-8ad3-d0b87db710f8"}

stdout | tests/integration/auth.test.js > Auth Integration Tests > POST /api/auth/logout > debe retornar 200 al cerrar sesión correctamente
[2026-04-19 12:57:22] ecommerce-api info: HTTP Request {"method":"POST","url":"/api/auth/logout","status":200,"duration":"2ms","requestId":"6195d029-7ca2-4bf9-89a2-962e07acd8a3"}

✓ tests/integration/auth.test.js (5 tests) 918ms
✓ debe validar errores de express-validator (email invalido) 324ms
✓ debe registrar exitosamente si los datos son validos 365ms
stdout | tests/integration/cart_orders.test.js > Cart & Order Integration Tests > POST /api/cart/add-product > debe permitir añadir productos al carrito mediante la API
[2026-04-19 12:57:22] ecommerce-api info: HTTP Request {"method":"POST","url":"/api/cart/add-product","status":200,"duration":"50ms","requestId":"c93750ca-967f-41b2-973a-02fb5043cdca"}

stdout | tests/integration/cart_orders.test.js > Cart & Order Integration Tests > POST /api/orders/checkout > debe completar el flujo de checkout exitosamente
[2026-04-19 12:57:22] ecommerce-api info: HTTP Request {"method":"POST","url":"/api/orders/checkout","status":201,"duration":"8ms","requestId":"50973e3c-742d-41af-8965-1ebf4286e7cf"}

stdout | tests/integration/cart_orders.test.js > Cart & Order Integration Tests > GET /api/orders/:id (Owner Security) > debe retornar 403 si un usuario intenta ver una orden de otro
[2026-04-19 12:57:23] ecommerce-api info: HTTP Request {"method":"GET","url":"/api/orders/65d100000000000000000005","status":403,"duration":"6ms","requestId":"d28bceae-a879-441d-bfc7-475180384afa"}

✓ tests/integration/cart_orders.test.js (3 tests) 401ms
✓ debe permitir añadir productos al carrito mediante la API 315ms
stdout | tests/unit/controllers/authController.test.js
[dotenv@17.2.1] injecting env (12) from .env -- tip: 🔐 prevent building .env in docker: https://dotenvx.com/prebuild
[dotenv@17.2.1] injecting env (9) from .env.test -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com

✓ tests/unit/controllers/orderController.test.js (10 tests) 231ms
✓ tests/unit/controllers/cartController.test.js (12 tests) 81ms
✓ tests/unit/controllers/reviewController.test.js (13 tests) 86ms
✓ tests/unit/controllers/wishListController.test.js (9 tests) 77ms
stdout | tests/unit/controllers/paymentMethodController.test.js > paymentMethodController > createPaymentMethod > debe manejar ValidationError del esquema (400)
[2026-04-19 12:57:27] ecommerce-api error: Payment method controller error: createPaymentMethod {"errorName":"ValidationError","error":"Missing fields"}

stdout | tests/unit/controllers/paymentMethodController.test.js > paymentMethodController > updatePaymentMethod > debe manejar colisión de default (409)
[2026-04-19 12:57:27] ecommerce-api error: Payment method controller error: updatePaymentMethod {"code":11000}

✓ tests/unit/controllers/paymentMethodController.test.js (12 tests) 109ms
stdout | tests/unit/controllers/authController.test.js > authController > login > debe retornar 400 si las credenciales son invalidas (user not found)
[2026-04-19 12:57:27] ecommerce-api warn: Security Event: Login Failed {"email":"wrong@example.com","reason":"User not found"}

stdout | tests/unit/controllers/authController.test.js > authController > login > debe retornar 403 si el usuario esta desactivado
[2026-04-19 12:57:27] ecommerce-api warn: Security Event: Login Failed {"email":"inactive@example.com","reason":"User deactivated"}

✓ tests/unit/controllers/authController.test.js (7 tests) 86ms
✓ tests/unit/controllers/notificationController.test.js (8 tests) 50ms
stdout | tests/unit/middlewares/errorHandler.test.js > errorHandler middleware > debe enviar 500 y stack trace en desarrollo si no hay status en error
[2026-04-19 12:57:28] ecommerce-api error: Test Error {"stack":"stack trace","requestId":"-","status":500}

stdout | tests/unit/middlewares/errorHandler.test.js > errorHandler middleware > debe enviar status personalizado si el error lo tiene
[2026-04-19 12:57:28] ecommerce-api error: Not Found {"stack":"Error: Not Found\n    at D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/tests/unit/middlewares/errorHandler.test.js:29:21\n    at file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:145:11\n    at file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:915:26\n    at file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:1243:20\n    at new Promise (<anonymous>)\n    at runWithTimeout (file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:1209:10)\n    at file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:1653:37\n    at Traces.$ (file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/vitest/dist/chunks/traces.CCmnQaNT.js:142:27)\n    at trace (file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/vitest/dist/chunks/test.B8ej_ZHS.js:239:21)\n    at runTest (file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:1653:12)","requestId":"-","status":404}

stdout | tests/unit/middlewares/errorHandler.test.js > errorHandler middleware > debe ocultar stack trace y mostrar mensaje genérico en producción (500)
[2026-04-19 12:57:28] ecommerce-api error: Deep Internal Secret {"stack":"Error: Deep Internal Secret\n    at D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/tests/unit/middlewares/errorHandler.test.js:39:21\n    at file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:145:11\n    at file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:915:26\n    at file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:1243:20\n    at new Promise (<anonymous>)\n    at runWithTimeout (file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:1209:10)\n    at file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:1653:37\n    at Traces.$ (file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/vitest/dist/chunks/traces.CCmnQaNT.js:142:27)\n    at trace (file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/vitest/dist/chunks/test.B8ej_ZHS.js:239:21)\n    at runTest (file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:1653:12)","requestId":"-","status":500}

stdout | tests/unit/middlewares/errorHandler.test.js > errorHandler middleware > debe mantener el mensaje original en producción si el status no es 500
[2026-04-19 12:57:28] ecommerce-api error: Validation Failed {"stack":"Error: Validation Failed\n    at D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/tests/unit/middlewares/errorHandler.test.js:52:21\n    at file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:145:11\n    at file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:915:26\n    at file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:1243:20\n    at new Promise (<anonymous>)\n    at runWithTimeout (file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:1209:10)\n    at file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:1653:37\n    at Traces.$ (file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/vitest/dist/chunks/traces.CCmnQaNT.js:142:27)\n    at trace (file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/vitest/dist/chunks/test.B8ej_ZHS.js:239:21)\n    at runTest (file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:1653:12)","requestId":"-","status":400}

stdout | tests/unit/middlewares/errorHandler.test.js > errorHandler middleware > no debe enviar respuesta si res.headersSent es true
[2026-04-19 12:57:28] ecommerce-api error: Already Sent {"stack":"Error: Already Sent\n    at D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/tests/unit/middlewares/errorHandler.test.js:66:21\n    at file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:145:11\n    at file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:915:26\n    at file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:1243:20\n    at new Promise (<anonymous>)\n    at runWithTimeout (file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:1209:10)\n    at file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:1653:37\n    at Traces.$ (file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/vitest/dist/chunks/traces.CCmnQaNT.js:142:27)\n    at trace (file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/vitest/dist/chunks/test.B8ej_ZHS.js:239:21)\n    at runTest (file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars/node_modules/@vitest/runner/dist/index.js:1653:12)","requestId":"-","status":500}

✓ tests/unit/middlewares/errorHandler.test.js (5 tests) 48ms
CRITICAL: Uncaught exception. Exiting...
✓ tests/unit/middlewares/globalErrorHandler.test.js (3 tests) 26ms
✓ tests/unit/controllers/userController.test.js (7 tests) 74ms
✓ tests/unit/middlewares/authMiddleware.test.js (6 tests) 22ms
✓ tests/unit/controllers/productController.test.js (7 tests) 24ms
✓ tests/unit/middlewares/isAdminMiddleware.test.js (3 tests) 13ms
✓ tests/unit/controllers/categoryController.test.js (8 tests) 78ms
✓ tests/unit/controllers/shippingAddressController.test.js (8 tests) 50ms
✓ tests/unit/middlewares/ownerOrAdminByCartId.test.js (6 tests) 64ms
✓ tests/unit/middlewares/validation.test.js (2 tests) 13ms
✓ tests/unit/utils/paymentExpiry.test.js (3 tests) 10ms
✓ tests/unit/middlewares/ownerOrAdmin.test.js (4 tests) 15ms
✓ tests/unit/controllers/catalogController.test.js (1 test) 22ms

Test Files  27 passed (27)
Tests       163 passed (163)
Start at    12:57:09
Duration    24.20s (transform 6.57s, setup 1.90s, import 103.25s, tests 4.38s, environment 12ms)
```

### Comando
```bash
rg -n "http://localhost|127\.0\.0\.1" "ecommerce-app-Nars/src" "ecommerce-app-Nars/cypress" "ecommerce-app-Nars/scripts" "ecommerce-api-Nars/src" "ecommerce-api-Nars/server.js"
```

### Output
```text
/usr/bin/bash: line 1: rg: command not found
```

### Comando
```bash
npx cypress info
```

### Output
```text
Displaying Cypress info...

Detected 2 browsers installed:

1. Chrome
  - Name: chrome
  - Channel: stable
  - Version: 122.0.6261.129
  - Executable: C:\Program Files\Google\Chrome\Application\chrome.exe
  - Profile: C:\Users\ALI\AppData\Roaming\Cypress\cy\production\browsers\chrome-stable

2. Edge
  - Name: edge
  - Channel: stable
  - Version: 147.0.3912.72
  - Executable: C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe

Note: to run these browsers, pass <name>:<channel> to the '--browser' field

Examples:
- cypress run --browser chrome
- cypress run --browser edge

Learn More: https://on.cypress.io/launching-browsers

Proxy Settings: none detected
Environment Variables: none detected

Application Data: C:\Users\ALI\AppData\Roaming\cypress\cy\development
Browser Profiles: C:\Users\ALI\AppData\Roaming\cypress\cy\development\browsers
Binary Caches: C:\Users\ALI\AppData\Local\Cypress\Cache

Cypress Version: 15.13.0 (stable)
System Platform: win32 (Microsoft Windows 10 Home Single Language - 10.0.19045)
System Memory: 17 GB free 5.57 GB
```

### Comando
```bash
powershell -NoProfile -Command "Get-ChildItem -Path 'ecommerce-app-Nars/src','ecommerce-app-Nars/cypress','ecommerce-app-Nars/scripts','ecommerce-api-Nars/src','ecommerce-api-Nars/server.js' -Recurse -File | Select-String -Pattern 'http://localhost|127\.0\.0\.1' | ForEach-Object { '{0}:{1}: {2}' -f $_.Path, $_.LineNumber, $_.Line.Trim() }"
```

### Output
```text
En línea: 1 Carácter: 268
+ ... /localhost|127\.0\.0\.1' | ForEach-Object { '{0}:{1}: {2}' -f /usr/bi ...
+                                                                  ~
Debe proporcionar una expresión de valor después del operador '-f'.
En línea: 1 Carácter: 270
+ ... ocalhost|127\.0\.0\.1' | ForEach-Object { '{0}:{1}: {2}' -f /usr/bin/ ...
+                                                                  ~
Debe proporcionar una expresión de valor después del operador '/'.
En línea: 1 Carácter: 270
+ ... 0\.1' | ForEach-Object { '{0}:{1}: {2}' -f /usr/bin/bash.Path, /usr/b ...
+                                                 ~~~~~~~~~~~~~~~~~
Token 'usr/bin/bash.Path' inesperado en la expresión o la instrucción.
En línea: 1 Carácter: 287
+ ... \.1' | ForEach-Object { '{0}:{1}: {2}' -f /usr/bin/bash.Path, /usr/bi ...
+                                                                 ~
Falta un argumento en la lista de parámetros.
En línea: 1 Carácter: 339
+ ... /bin/bash.Path, /usr/bin/bash.LineNumber, /usr/bin/bash.Line.Trim() }
+                                                                       ~
Se esperaba una expresión después de '('.
    + CategoryInfo          : ParserError: (:) [], ParentContainsErrorRecordException
    + FullyQualifiedErrorId : ExpectedValueExpression
```

### Comando
```bash
python -c "from pathlib import Path; import re; targets=[Path('ecommerce-app-Nars/src'),Path('ecommerce-app-Nars/cypress'),Path('ecommerce-app-Nars/scripts'),Path('ecommerce-api-Nars/src'),Path('ecommerce-api-Nars/server.js')]; pattern=re.compile(r'http://localhost|127\\.0\\.0\\.1'); files=[]; [files.extend([p for p in t.rglob('*') if p.is_file()]) if t.is_dir() else files.append(t) for t in targets]; matches=[]; [matches.extend([f'{p}:{i}: {line.strip()}' for i,line in enumerate(p.read_text(encoding=\"utf-8\", errors=\"ignore\").splitlines(),1) if pattern.search(line)]) for p in files]; print('\n'.join(matches) if matches else 'NO_MATCHES')"
```

### Output
```text
no se encontró Python; ejecutar sin argumentos para instalar desde el Microsoft Store o deshabilitar este acceso directo desde Configuración > Aplicaciones > Configuración avanzada de aplicaciones > Alias de ejecución de aplicaciones.
```

### Comando
```bash
node -e "const fs=require('fs'); const path=require('path'); const targets=['ecommerce-app-Nars/src','ecommerce-app-Nars/cypress','ecommerce-app-Nars/scripts','ecommerce-api-Nars/src','ecommerce-api-Nars/server.js']; const pattern=/http:\/\/localhost|127\.0\.0\.1/; const files=[]; const walk=(p)=>{ const stat=fs.statSync(p); if(stat.isDirectory()){ for(const entry of fs.readdirSync(p)){ walk(path.join(p, entry)); } } else { files.push(p); } }; for(const target of targets){ walk(target); } const matches=[]; for(const file of files){ const lines=fs.readFileSync(file,'utf8').split(/\r?\n/); lines.forEach((line,index)=>{ if(pattern.test(line)){ matches.push(`${file}:${index+1}: ${line.trim()}`); } }); } console.log(matches.length ? matches.join('\n') : 'NO_MATCHES');"
```

### Output
```text
/usr/bin/bash: line 1: ${line.trim()}: bad substitution
NO_MATCHES
```

### Comando
```bash
node -e "import('./cypress.config.mjs').then((module) => { console.log(JSON.stringify(module.default.e2e, null, 2)); }).catch((error) => { console.error(error); process.exit(1); });"
```

### Output
```text
(node:30580) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-app-Nars/src/config/runtimeUrls.js is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
{
  "baseUrl": "http://localhost:5173",
  "env": {
    "apiUrl": "http://localhost:3001/api"
  },
  "viewportWidth": 1280,
  "viewportHeight": 720,
  "video": false,
  "screenshotOnRunFailure": true
}
```

### Comando
```bash
npm run build
```

### Output
```text
> ramdi-jewelry-ecommerce-css@1.0.0 build
> vite build

vite v6.4.1 building for production...
transforming...
✓ 209 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               0.50 kB │ gzip:  0.33 kB
dist/assets/ProductDetailPage-BUzZyFVF.css    0.93 kB │ gzip:  0.44 kB
dist/assets/ProfilePage-BZAau1d4.css          1.52 kB │ gzip:  0.63 kB
dist/assets/CheckoutPage-p8nTReRD.css         2.62 kB │ gzip:  0.89 kB
dist/assets/HomePage-Bpe02Ml7.css             3.45 kB │ gzip:  1.05 kB
dist/assets/index-CRuXre01.css               26.27 kB │ gzip:  5.41 kB
dist/assets/productService--Uc-pnBS.js        1.27 kB │ gzip:  0.55 kB
dist/assets/ProductDetailPage-cXiPwm5d.js     2.24 kB │ gzip:  0.94 kB
dist/assets/HomePage-B0-AIXxl.js              4.87 kB │ gzip:  1.89 kB
dist/assets/ProfilePage-HhMY2YWO.js           4.97 kB │ gzip:  1.87 kB
dist/assets/CheckoutPage-CWfi5CMt.js         16.69 kB │ gzip:  4.82 kB
dist/assets/index-BfB9o7Cy.js               316.12 kB │ gzip: 98.86 kB
✓ built in 3.77s
```

### Comando
```bash
npx vitest run
```

### Output
```text
RUN  v4.1.1 D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-app-Nars

Test Files  16 passed (16)
Tests       87 passed (87)
Start at    12:59:09
Duration    19.32s (transform 2.43s, setup 6.62s, import 14.09s, tests 27.68s, environment 39.00s)
```

### Comando
```bash
node -e "import('./cypress.config.mjs').then((module) => { console.log(JSON.stringify(module.default.e2e, null, 2)); }).catch((error) => { console.error(error); process.exit(1); });"
```

### Output
```text
{
  "baseUrl": "http://localhost:5173",
  "env": {
    "apiUrl": "http://localhost:3001/api"
  },
  "viewportWidth": 1280,
  "viewportHeight": 720,
  "video": false,
  "screenshotOnRunFailure": true
}
```

### Comando
```bash
node -e "const fs=require('fs'); const path=require('path'); const targets=['ecommerce-app-Nars/src','ecommerce-app-Nars/cypress','ecommerce-app-Nars/scripts','ecommerce-api-Nars/src','ecommerce-api-Nars/server.js']; const pattern=/http:\/\/localhost|127\.0\.0\.1/; const files=[]; const walk=(p)=>{ const stat=fs.statSync(p); if(stat.isDirectory()){ for(const entry of fs.readdirSync(p)){ walk(path.join(p, entry)); } } else { files.push(p); } }; for(const target of targets){ walk(target); } const matches=[]; for(const file of files){ const lines=fs.readFileSync(file,'utf8').split(/\r?\n/); lines.forEach((line,index)=>{ if(pattern.test(line)){ matches.push(file + ':' + (index+1) + ': ' + line.trim()); } }); } console.log(matches.length ? matches.join('\n') : 'NO_MATCHES');"
```

### Output
```text
ecommerce-app-Nars\src\config\runtimeUrls.mjs:1: export const DEFAULT_API_URL = "http://localhost:3001/api";
ecommerce-app-Nars\src\config\runtimeUrls.mjs:2: export const DEFAULT_FRONTEND_URL = "http://localhost:5173";
ecommerce-api-Nars\src\config\env.js:40: PUBLIC_API_URL: normalizeUrl(process.env.PUBLIC_API_URL || `http://localhost:${process.env.PORT || 3000}`),
```

### Comando
```bash
git status --short
```

### Output
```text
 M README.md
 M ecommerce-api-Nars/server.js
 M ecommerce-api-Nars/src/config/env.js
 M ecommerce-api-Nars/src/config/swagger.js
 M ecommerce-app-Nars/README.md
 D ecommerce-app-Nars/cypress.config.js
 M ecommerce-app-Nars/cypress/e2e/auth.cy.js
 M ecommerce-app-Nars/cypress/support/commands.js
 M ecommerce-app-Nars/scripts/start-test-dev.mjs
 M ecommerce-app-Nars/src/api/apiClient.js
?? docs/release/2026-04-19-1238-env-hardening.md
?? ecommerce-api-Nars/.env.example
?? ecommerce-app-Nars/.env.example
?? ecommerce-app-Nars/cypress.config.mjs
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/cart (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/checkout (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/home-catalog (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/login (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/orders (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/product-detail (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/profile (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/desktop-1440x900/register (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/cart (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/checkout (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/home-catalog (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/login (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/orders (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/product-detail (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/profile (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/mobile-375x812/register (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/cart (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/checkout (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/home-catalog (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/login (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/orders (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/product-detail (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/profile (1).png"
?? "ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/responsive-closeout/tablet-768x1024/register (1).png"
?? ecommerce-app-Nars/src/config/
?? opencode/Prompt26.04.19.1238pm.md
?? opencode/Prompt26.04.19.1239pm.md
?? opencode/Prompt26.04.19.1253pm.md
```

## 6. Validaciones realizadas
- Backend levanta su configuracion con `PUBLIC_API_URL` centralizada; la suite backend paso completa (`163/163`).
- Frontend consume `VITE_API_URL` a traves de `getRuntimeApiUrl()` y mantiene fallback controlado; `npm run build` paso dos veces.
- Las URLs ya no estan hardcodeadas en los puntos duplicados de runtime/Cypress; las coincidencias restantes de localhost quedaron solo en el modulo central de defaults y en el fallback controlado de backend.
- Cypress mantiene configuracion cargable; `npx cypress info` funciono y la carga de `cypress.config.mjs` mostro `baseUrl` y `apiUrl` resueltos correctamente.
- No se modifico logica de negocio.

## 7. Riesgos detectados
- No se ejecuto una corrida E2E completa de Cypress contra backend/frontend vivos; la configuracion quedo validada por carga de config, pero el smoke funcional E2E queda pendiente.
- `cypress.config.js` pasa a `cypress.config.mjs`; si algun script externo referencia el nombre anterior, debera ajustarse.
- Persisten archivos no rastreados en `cypress/screenshots`; no fueron tocados.
- En el backend sigue existiendo el secreto real en `.env`; esta fase no lo rota porque seria un cambio operativo fuera del alcance.

## 8. Resultado final
- Estado del sistema despues de FASE 3: configuracion mas centralizada, con plantillas `.env.example`, URLs alineadas y fallback local controlado conservado.
- Nivel de estabilidad: alto para desarrollo y pruebas unitarias/integracion; medio-alto para E2E hasta ejecutar una corrida completa de Cypress con servicios levantados.
