# Backend integration root cause and plan

## Objetivo

Diagnosticar con precision por que fallan varias suites de integracion del backend y proponer una correccion tecnica limpia antes de implementar cambios.

## Resumen tecnico corto

La causa raiz no es el seed por si solo, sino el acoplamiento entre:

- `server.js` con side effects al importar;
- el seeding `seedTestCatalog()` ejecutado en top-level durante import de `server.js`;
- tests de integracion que mockean modelos Mongoose parciales o automockeados;
- importacion de `app` desde `../../server.js` dentro de esas suites.

Cuando los tests importan `server.js`, tambien disparan:

1. `dbConnection()`
2. `Category.init()` y `Product.init()`
3. `seedTestCatalog()`
4. `app.listen(...)` si `START_SERVER=true`

Ese bootstrap ocurre usando modelos mockeados, no modelos reales de Mongoose. Como esos mocks no implementan todos los metodos que el seed usa (`countDocuments`, `insertMany`, `findOne().select()`), el import falla antes de que la suite siquiera registre tests ejecutables.

## Evidencia exacta

### Archivos revisados

- `ecommerce-api-Nars/src/utils/seedTestCatalog.js`
- `ecommerce-api-Nars/server.js`
- `ecommerce-api-Nars/.env.test`
- `ecommerce-api-Nars/tests/integration/auth.test.js`
- `ecommerce-api-Nars/tests/integration/cart_orders.test.js`
- `ecommerce-api-Nars/tests/integration/catalog.test.js`
- `ecommerce-api-Nars/tests/integration/resilience.test.js`
- `ecommerce-api-Nars/tests/integration/users.test.js`

### `seedTestCatalog.js`

```js
const existingProducts = await Product.countDocuments();
let category = await Category.findOne({ name: TEST_CATEGORY.name }).select('_id');
const insertedProducts = await Product.insertMany(productsToInsert);
```

El seed exige metodos reales de modelo/consulta de Mongoose:

- `Product.countDocuments`
- `Category.findOne(...).select(...)`
- `Product.insertMany`

### `server.js`

```js
await dbConnection();
await Promise.all([Category.init(), Product.init()]);

if (env.NODE_ENV === 'test') {
  const seedResult = await seedTestCatalog();
  logger.info({ message: 'Test catalog seed status', ...seedResult });
}

if (env.NODE_ENV !== 'test' || env.START_SERVER) {
  app.listen(PORT, () => {
    logger.info({ message: 'Server started', url: `http://localhost:${PORT}`, environment: env.NODE_ENV });
  });
}
```

Conclusion:

- importar `server.js` ya ejecuta bootstrap, seed y potencialmente `listen`.
- `server.js` mezcla definicion de app con side effects de arranque.

### `.env.test`

```env
ENABLE_TEST_AUTH_TOOLS=true
START_SERVER=true
```

`START_SERVER=true` hace que incluso en `NODE_ENV=test` el import de `server.js` intente levantar servidor.

### Mocks incompatibles en suites fallidas

#### `tests/integration/auth.test.js`

```js
vi.mock('../../src/models/category.js', () => ({
    default: { init: vi.fn().mockResolvedValue(null) }
}));
vi.mock('../../src/models/product.js', () => ({
    default: { init: vi.fn().mockResolvedValue(null), find: vi.fn() }
}));
```

Problema:

- el mock de `Product` no expone `countDocuments` ni `insertMany`;
- el mock de `Category` no expone `findOne`.

#### `tests/integration/users.test.js`

```js
vi.mock('../../src/models/category.js', () => ({
    default: { init: vi.fn().mockResolvedValue(null) }
}));
vi.mock('../../src/models/product.js', () => ({
    default: { init: vi.fn().mockResolvedValue(null), find: vi.fn() }
}));
```

Mismo problema que `auth.test.js`.

#### `tests/integration/cart_orders.test.js`

```js
vi.mock('../../src/models/product.js', () => ({
    default: {
        init: vi.fn().mockResolvedValue(null),
        find: vi.fn(),
        findOneAndUpdate: vi.fn(),
        updateOne: vi.fn()
    }
}));
vi.mock('../../src/models/category.js', () => ({
    default: { init: vi.fn().mockResolvedValue(null) }
}));
```

Problema:

- sigue faltando `Product.countDocuments`, `Product.insertMany` y `Category.findOne`.

#### `tests/integration/catalog.test.js`

```js
vi.mock('../../src/models/product.js');
vi.mock('../../src/models/category.js');
```

Problema:

- automock de Vitest crea mocks vacios para metodos usados por el test,
- pero `seedTestCatalog()` espera una cadena real `Category.findOne(...).select(...)`.
- por eso aparece:
  - `TypeError: Cannot read properties of undefined (reading 'select')`

#### `tests/integration/resilience.test.js`

```js
const MockProduct = {
    init: vi.fn().mockResolvedValue({}),
    find: vi.fn(),
    create: vi.fn(),
    findById: vi.fn(),
    countDocuments: vi.fn()
};
```

Problema:

- este mock si tiene `countDocuments`, pero no `insertMany`.
- por eso falla con:
  - `TypeError: Product.insertMany is not a function`

## Output relevante de terminal

### Suite backend completa fallida

```text
> ecommerce-api@1.0.0 test
> vitest

Failed Suites 5

FAIL tests/integration/auth.test.js
TypeError: __vite_ssr_import_2__.default.countDocuments is not a function
❯ seedTestCatalog src/utils/seedTestCatalog.js:38:42
❯ server.js:36:43
❯ tests/integration/auth.test.js:3:1

FAIL tests/integration/cart_orders.test.js
TypeError: __vite_ssr_import_2__.default.countDocuments is not a function
❯ seedTestCatalog src/utils/seedTestCatalog.js:38:42
❯ server.js:36:43
❯ tests/integration/cart_orders.test.js:3:1

FAIL tests/integration/catalog.test.js
TypeError: Cannot read properties of undefined (reading 'select')
❯ seedTestCatalog src/utils/seedTestCatalog.js:43:70
❯ server.js:36:22
❯ tests/integration/catalog.test.js:3:1

FAIL tests/integration/resilience.test.js
TypeError: __vite_ssr_import_2__.default.insertMany is not a function
❯ seedTestCatalog src/utils/seedTestCatalog.js:54:42
❯ server.js:36:22
❯ tests/integration/resilience.test.js:3:1

FAIL tests/integration/users.test.js
TypeError: __vite_ssr_import_2__.default.countDocuments is not a function
❯ seedTestCatalog src/utils/seedTestCatalog.js:38:42
❯ server.js:36:43
❯ tests/integration/users.test.js:3:1
```

## Causa raiz exacta

La causa raiz es:

1. `server.js` tiene side effects de bootstrap al importarse;
2. ese bootstrap ejecuta `seedTestCatalog()` en entorno test;
3. las suites de integracion importan `app` desde `server.js`;
4. esas mismas suites mockean modelos Mongoose de forma parcial o total;
5. el seed intenta usar metodos reales de modelos/queries que en ese contexto fueron reemplazados por mocks incompatibles.

En resumen:

- el problema viene de `mocks + orden de imports + seeding acoplado al bootstrap de server.js`.
- no es un fallo del negocio ni del seed aislado.
- tampoco es una dependencia ciclica evidente; es un problema de arquitectura de arranque para testing.

## Por que no existen `countDocuments`, `insertMany` o `select` en ese contexto

- `countDocuments` e `insertMany` no existen porque el objeto `Product` fue mockeado manualmente con solo algunos metodos (`find`, `findOneAndUpdate`, etc.).
- `select` no existe porque `Category.findOne(...)` en automock/manual mock no devuelve una query chain real de Mongoose.
- esas ausencias solo aparecen porque el seed corre demasiado pronto, durante el import de `server.js`, antes de que el test controle realmente el escenario que quiere probar.

## Plan de correccion propuesto

### Solucion recomendada

Separar claramente:

- construccion de `app`
- bootstrap del proceso (`dbConnection`, `init`, `seed`, `listen`)

La opcion mas mantenible es:

1. crear una funcion o modulo de bootstrap explicito;
2. dejar `app` exportable sin side effects al import;
3. ejecutar seed de catalogo desde bootstrap test/arranque, no desde la mera importacion de `app`.

### Archivos a tocar

1. `ecommerce-api-Nars/server.js`
2. posible nuevo archivo, por ejemplo:
   - `ecommerce-api-Nars/src/app.js`
   - o `ecommerce-api-Nars/src/bootstrap/createApp.js`
3. `ecommerce-api-Nars/scripts/start-test-server.mjs`
4. potencialmente algunos tests de integracion si dependen de importar `server.js` en vez de `app`

### Cambio exacto en cada uno

#### 1. `src/app.js` o equivalente nuevo

- mover aqui la construccion de Express:
  - `express()`
  - `helmet`, `cors`, rate limiting, middlewares, rutas, 404, error handler
- exportar solo `app`
- sin `dbConnection()`, sin `Category.init()`, sin `Product.init()`, sin `seedTestCatalog()`, sin `listen()`.

#### 2. `server.js`

- convertirlo en bootstrap real:
  - importar `app`
  - conectar DB
  - init de modelos
  - ejecutar `seedTestCatalog()` solo en bootstrap de test o arranque controlado
  - levantar `listen()`

#### 3. `scripts/start-test-server.mjs`

- usarlo como punto de entrada correcto para servidor de test real;
- aqui o en bootstrap asociado ejecutar el seed cuando corresponda.

#### 4. tests de integracion

- importar `app` desacoplada, no `server.js`.
- asi conservan sus mocks de rutas/controladores sin disparar bootstrap ni seed.

### Por que esta solucion es la correcta

- elimina side effects en import, que es la raiz del problema.
- mantiene integracion limpia: los tests de integracion por HTTP usan `supertest(app)` sin abrir puerto ni seed inesperado.
- preserva el seed para escenarios donde si es correcto usarlo: servidor real en test/E2E.
- no desactiva pruebas ni apaga funcionalidades.
- mejora mantenibilidad y separacion `app` vs `server bootstrap`.

### Riesgos

- bajo-medio: mover bootstrap puede afectar scripts de arranque si no se actualizan consistentemente.
- bajo: algunos tests pueden depender implicitamente de side effects actuales y necesitar ajustar su import.
- bajo: smoke/E2E podria requerir verificar que el seed siga ocurriendo al levantar backend con `start:test`.

### Como validar que no se rompio lo demas

1. correr `npm test` completo en backend.
2. verificar que unit tests y security tests sigan verdes.
3. verificar que las 5 suites de integracion fallidas se recuperen.
4. correr smoke funcional backend o golden path E2E para comprobar que el seed sigue disponible en arranque real de test.

## Estado

- Diagnostico completado.
- Plan tecnico listo.
- No se implemento ningun cambio todavia.
