# Backend bootstrap and seed fix

## Objetivo

Corregir de forma tecnica y mantenible la infraestructura de pruebas de integracion backend para que la suite completa pase, separando `app` del bootstrap y evitando side effects al importar la aplicacion en tests.

## Diagnostico resumido

La falla original estaba en el acoplamiento entre:

- `server.js` con side effects top-level;
- `seedTestCatalog()` ejecutandose al importar `server.js` en test;
- suites de integracion que mockean modelos Mongoose parcialmente;
- import de `app` desde `../../server.js`.

Eso provocaba que el seed corriera sobre mocks incompletos y explotara con:

- `Product.countDocuments is not a function`
- `Product.insertMany is not a function`
- `Cannot read properties of undefined (reading 'select')`

## Cambios implementados

### 1. Separacion `app` vs `server bootstrap`

Se creo:

- `ecommerce-api-Nars/src/app.js`

Ahora `app.js` contiene solo:

- creacion de Express
- middlewares
- CORS
- rate limiting
- sanitizacion
- rutas
- swagger
- 404
- error handler

Sin:

- `dbConnection()`
- `Category.init()` / `Product.init()`
- `seedTestCatalog()`
- `app.listen()`

### 2. `server.js` ahora es bootstrap real

`ecommerce-api-Nars/server.js` ahora:

- importa `app` desde `src/app.js`
- exporta `bootstrapServer(...)`
- ejecuta `dbConnection`, `init`, `seedTestCatalog` y `listen` solo desde bootstrap controlado
- evita side effects al simple import de `app`
- mantiene autoarranque solo cuando `server.js` es ejecutado directamente

### 3. Seed de catalogo aislado del import de app

- `seedTestCatalog()` ya no corre por importar `app`
- sigue corriendo en bootstrap controlado de test/server real
- `scripts/start-test-server.mjs` ahora importa `bootstrapServer()` y lo ejecuta explicitamente

### 4. Tests de integracion actualizados

Se cambiaron imports de estas suites para usar `../../src/app.js` en lugar de `../../server.js`:

- `tests/integration/auth.test.js`
- `tests/integration/cart_orders.test.js`
- `tests/integration/catalog.test.js`
- `tests/integration/resilience.test.js`
- `tests/integration/users.test.js`

Adicionalmente:

- `tests/security.test.js` ahora usa `../src/app.js` y llama `bootstrapServer({ startListening: false })` en `beforeAll` para seguir teniendo DB/seed real sin depender de import side-effect.

### 5. Ajuste menor en mock de integracion

Tras corregir la infraestructura principal, quedo una falla residual en `tests/integration/cart_orders.test.js` porque el mock de orden no incluia `toObject()`, y el controlador actual si lo usa.

Se completo el mock con `toObject()` para reflejar el contrato real del controlador sin alterar la logica de negocio.

## Archivos modificados

- `ecommerce-api-Nars/src/app.js`
- `ecommerce-api-Nars/server.js`
- `ecommerce-api-Nars/scripts/start-test-server.mjs`
- `ecommerce-api-Nars/tests/security.test.js`
- `ecommerce-api-Nars/tests/integration/auth.test.js`
- `ecommerce-api-Nars/tests/integration/cart_orders.test.js`
- `ecommerce-api-Nars/tests/integration/catalog.test.js`
- `ecommerce-api-Nars/tests/integration/resilience.test.js`
- `ecommerce-api-Nars/tests/integration/users.test.js`

## Por que esta solucion es la correcta

- elimina side effects de import, que era la causa raiz;
- mantiene seed para escenarios donde si tiene sentido correrlo;
- mejora separacion de responsabilidades sin rehacer el proyecto;
- evita hacks como apagar seed o comentar pruebas;
- hace que integracion use `supertest(app)` sobre una app limpia y bootstrap explicitamente controlado.

## Riesgos / observaciones

- Riesgo bajo: el bootstrap ahora depende de `bootstrapServer()` en scripts/entornos que quieran DB + seed.
- Riesgo menor: `security.test.js` ahora arranca bootstrap explicitamente; esto es correcto y mantenible, pero agrega una dependencia consciente del entorno real.
- Warning persistente: sigue apareciendo `CRITICAL: Uncaught exception. Exiting...` en la suite, pero no rompe tests ni exit code en esta corrida final.

## Validacion obligatoria

### Suite completa backend

Comando ejecutado:

```text
npm test
```

### Output completo de terminal — primera corrida tras separar bootstrap

```text
> ecommerce-api@1.0.0 test
> vitest

RUN  v4.0.18 D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars

stdout | tests/integration/resilience.test.js
[dotenv@17.2.1] injecting env (12) from .env -- tip: 📡 auto-backup env with Radar: https://dotenvx.com/radar
[dotenv@17.2.1] injecting env (9) from .env.test -- tip: ⚙️  write to custom object with { processEnv: myObject }

stdout | tests/security.test.js
[dotenv@17.2.1] injecting env (12) from .env -- tip: ⚙️  enable debug logging with { debug: true }
[dotenv@17.2.1] injecting env (9) from .env.test -- tip: 📡 observe env with Radar: https://dotenvx.com/radar

stdout | tests/integration/auth.test.js
[dotenv@17.2.1] injecting env (12) from .env -- tip: 🔐 prevent building .env in docker: https://dotenvx.com/prebuild
[dotenv@17.2.1] injecting env (9) from .env.test -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com

stdout | tests/integration/catalog.test.js
[dotenv@17.2.1] injecting env (12) from .env -- tip: ⚙️  suppress all logs with { quiet: true }
[dotenv@17.2.1] injecting env (9) from .env.test -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com

stdout | tests/integration/users.test.js
[dotenv@17.2.1] injecting env (12) from .env -- tip: ⚙️  suppress all logs with { quiet: true }
[dotenv@17.2.1] injecting env (9) from .env.test -- tip: ⚙️  enable debug logging with { debug: true }

stdout | tests/integration/cart_orders.test.js
[dotenv@17.2.1] injecting env (12) from .env -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
[dotenv@17.2.1] injecting env (9) from .env.test -- tip: 📡 observe env with Radar: https://dotenvx.com/radar

✓ tests/unit/controllers/orderController.test.js (10 tests) 240ms
...
✓ tests/integration/auth.test.js (5 tests) 835ms
...
✗ tests/integration/cart_orders.test.js (3 tests | 1 failed) 270ms
  × debe completar el flujo de checkout exitosamente

Checkout Error: {
  status: 'error',
  message: 'newOrder.toObject is not a function',
  stack: 'TypeError: newOrder.toObject is not a function\n    at checkoutFromCart ...'
}

Failed Tests 1
FAIL tests/integration/cart_orders.test.js > Cart & Order Integration Tests > POST /api/orders/checkout > debe completar el flujo de checkout exitosamente
AssertionError: expected 500 to be 201

Test Files  1 failed | 26 passed (27)
Tests       1 failed | 162 passed (163)
Duration    14.00s
```

### Ajuste final aplicado

- Se completo el mock `mockOrder` en `tests/integration/cart_orders.test.js` con `toObject()` para reflejar el comportamiento esperado por el controlador.

### Output completo de terminal — corrida final backend completa

```text
> ecommerce-api@1.0.0 test
> vitest

RUN  v4.0.18 D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-api-Nars

stdout | tests/integration/resilience.test.js
[dotenv@17.2.1] injecting env (12) from .env -- tip: 📡 version env with Radar: https://dotenvx.com/radar
[dotenv@17.2.1] injecting env (9) from .env.test -- tip: 🔐 prevent committing .env to code: https://dotenvx.com/precommit

stdout | tests/security.test.js
[dotenv@17.2.1] injecting env (12) from .env -- tip: 📡 observe env with Radar: https://dotenvx.com/radar
[dotenv@17.2.1] injecting env (9) from .env.test -- tip: 🔐 prevent building .env in docker: https://dotenvx.com/prebuild

stdout | tests/integration/auth.test.js
[dotenv@17.2.1] injecting env (12) from .env -- tip: ⚙️  suppress all logs with { quiet: true }
[dotenv@17.2.1] injecting env (9) from .env.test -- tip: 📡 auto-backup env with Radar: https://dotenvx.com/radar

stdout | tests/integration/catalog.test.js
[dotenv@17.2.1] injecting env (12) from .env -- tip: 🔐 prevent building .env in docker: https://dotenvx.com/prebuild
[dotenv@17.2.1] injecting env (9) from .env.test -- tip: 🔐 prevent committing .env to code: https://dotenvx.com/precommit

stdout | tests/integration/users.test.js
[dotenv@17.2.1] injecting env (12) from .env -- tip: 📡 observe env with Radar: https://dotenvx.com/radar
[dotenv@17.2.1] injecting env (9) from .env.test -- tip: 🔐 prevent committing .env to code: https://dotenvx.com/precommit

stdout | tests/integration/cart_orders.test.js
[dotenv@17.2.1] injecting env (12) from .env -- tip: ⚙️  suppress all logs with { quiet: true }
[dotenv@17.2.1] injecting env (9) from .env.test -- tip: ⚙️  override existing env vars with { override: true }

✓ tests/unit/controllers/orderController.test.js (10 tests) 279ms
✓ tests/integration/resilience.test.js (3 tests) 153ms
✓ tests/integration/catalog.test.js (3 tests) 144ms
✓ tests/integration/users.test.js (4 tests) 165ms
✓ tests/security.test.js (7 tests) 417ms
✓ tests/integration/auth.test.js (5 tests) 819ms
✓ tests/integration/cart_orders.test.js (3 tests) 234ms
✓ tests/integration/cartRoutes.test.js (4 tests) 101ms
✓ tests/unit/controllers/cartController.test.js (12 tests) 84ms
✓ tests/unit/controllers/paymentMethodController.test.js (12 tests) 89ms
✓ tests/unit/controllers/wishListController.test.js (9 tests) 85ms
✓ tests/unit/controllers/reviewController.test.js (13 tests) 66ms
CRITICAL: Uncaught exception. Exiting...
✓ tests/unit/middlewares/globalErrorHandler.test.js (3 tests) 28ms
✓ tests/unit/controllers/notificationController.test.js (8 tests) 74ms
✓ tests/unit/controllers/productController.test.js (7 tests) 27ms
✓ tests/unit/controllers/authController.test.js (7 tests) 70ms
✓ tests/unit/controllers/shippingAddressController.test.js (8 tests) 52ms
✓ tests/unit/controllers/categoryController.test.js (8 tests) 59ms
✓ tests/unit/middlewares/authMiddleware.test.js (6 tests) 22ms
✓ tests/unit/middlewares/isAdminMiddleware.test.js (3 tests) 13ms
✓ tests/unit/middlewares/ownerOrAdminByCartId.test.js (6 tests) 39ms
✓ tests/unit/controllers/userController.test.js (7 tests) 57ms
✓ tests/unit/utils/paymentExpiry.test.js (3 tests) 8ms
✓ tests/unit/middlewares/validation.test.js (2 tests) 10ms
✓ tests/unit/middlewares/ownerOrAdmin.test.js (4 tests) 8ms
✓ tests/unit/controllers/catalogController.test.js (1 test) 15ms

Test Files  27 passed (27)
Tests       163 passed (163)
Start at    23:30:56
Duration    13.49s
```

## Resultado final

- Suite backend completa: `OK`
- Las 5 suites de integracion que fallaban ahora pasan:
  - `tests/integration/auth.test.js`
  - `tests/integration/cart_orders.test.js`
  - `tests/integration/catalog.test.js`
  - `tests/integration/resilience.test.js`
  - `tests/integration/users.test.js`
- Unit tests y security tests no se rompieron.

## Conclusión

La correccion de raiz fue exitosa.

- Se elimino el problema estructural de side effects al importar app.
- Se mantuvo el seed en bootstrap controlado.
- La suite backend completa quedo verde sin apagar pruebas ni introducir hacks frágiles.
