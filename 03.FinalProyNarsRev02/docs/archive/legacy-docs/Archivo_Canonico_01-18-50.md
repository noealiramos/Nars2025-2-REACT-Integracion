# ALIGNMENT REPORT - 2026-03-31 01:14:10

## 1. Contexto
Alinear el comportamiento entre DEV (`3000`) y TEST (`3001`) para asegurar consistencia de rutas, respuestas y flujo minimo de ecommerce, especialmente despues del fix del 404 en `GET /api/products`.

## 2. Auditoría comparativa DEV vs TEST
- rutas disponibles:
  - `GET /api/products` existe en ambos via `ecommerce-api-Nars/src/routes/productRoutes.js`
  - `POST /api/cart` existe en ambos via `ecommerce-api-Nars/src/routes/cartRoutes.js`
  - `POST /api/orders` existe en ambos via `ecommerce-api-Nars/src/routes/orderRoutes.js`
  - `POST /api/auth/test/revoke-refresh-tokens` existe solo como herramienta de test, pero ahora queda correctamente aislada bajo `/auth/test` en `ecommerce-api-Nars/src/routes/testAuthRoutes.js`
- middlewares activos:
  - `helmet`, `cors`, `rateLimit`, `requestId`, `requestLogger`, sanitizacion global y `errorHandler` activos en ambos desde `ecommerce-api-Nars/server.js`
  - `authMiddleware` protege `POST /api/cart` y `POST /api/orders` en ambos
- diferencias detectadas:
  - `.env` usa `PORT=3000`, TTL auth normal y `ENABLE_TEST_AUTH_TOOLS=false`
  - `.env.test` usa `PORT=3001`, TTL corto y `ENABLE_TEST_AUTH_TOOLS=true`
  - `ecommerce-app-Nars/.env.local` apunta a `http://localhost:3000/api`
  - `ecommerce-app-Nars/.env.test.local` apunta a `http://localhost:3001/api`

## 3. Inconsistencias encontradas
- La inconsistencia funcional previa era que en DEV un middleware de `testAuthRoutes` interceptaba rutas ajenas a `/auth/test` y devolvia `404`.
- Tras el fix, `GET /api/products?limit=1` devuelve `200` tanto en DEV como en TEST con la misma estructura: `page`, `limit`, `total`, `items`, `pagination`.
- `POST /api/cart` y `POST /api/orders` devuelven `401 {"message":"Unauthorized: missing Bearer token"}` en ambos entornos cuando se prueban sin autenticacion.
- No se detectaron diferencias activas de prefijo `/api` ni de estructura de respuesta en los endpoints comparados.
- Se mantiene una diferencia de intencion, no de inconsistencia: el flujo real del frontend para agregar items usa `POST /api/cart/add-product`, mientras que `POST /api/cart` es una ruta protegida para creacion de carrito.

## 4. Ajustes aplicados
- cambios realizados:
  - se mantuvo el fix en `ecommerce-api-Nars/src/routes/testAuthRoutes.js`, restringiendo el guard a `router.use('/auth/test', ...)`
  - se actualizo `docs/PHASE2_PROGRESS.md`
  - se actualizo `docs/PHASE_2_4_PROGRESS.md`
- motivo de cada ajuste:
  - aislar las rutas de test para que DEV y TEST expongan el mismo catalogo publico
  - remover la limitacion documental ya resuelta sobre `GET /api/products` en puerto `3000`
  - dejar evidencia consolidada de alineacion y smoke passing

## 5. Validación funcional (smoke)
Flujo validado:
- home -> productos
- detalle de producto
- add to cart
- checkout reuse basico

Resultados:
- requests comparadas por HTTP:
  - DEV `GET /api/products?limit=1` -> `200`
  - TEST `GET /api/products?limit=1` -> `200`
  - DEV `POST /api/cart` -> `401`
  - TEST `POST /api/cart` -> `401`
  - DEV `POST /api/orders` -> `401`
  - TEST `POST /api/orders` -> `401`
- smoke UI/backend en DEV normal:
  - `npx cypress run --spec cypress/e2e/goldenPath.cy.js` -> `1/1 passing`
  - `npx cypress run --spec cypress/e2e/checkoutReuse.cy.js` -> `5/5 passing`
- comportamiento UI/backend:
  - home carga productos sin 404
  - detalle de producto responde correctamente
  - add to cart funciona
  - checkout reuse completa ordenes y fallback manual en DEV normal sin errores de routing

## 6. Estado final
- ALIGNED

---

## NEXT STEP (AUTO-GENERATED PROMPT C)

```md
OBJETIVO:
Cerrar la consolidacion final de Phase 2 dejando evidencia documental limpia, validacion reproducible y chequeo de regresion minima sobre los cambios de alineacion DEV/TEST.

IMPORTANTE:
- Trabaja evidence-first
- NO preguntes al usuario
- NO cambies contratos API
- NO introduzcas mocks
- Finaliza con reporte markdown y estado final

FORMATO DE SALIDA OBLIGATORIO:

# CONSOLIDATION REPORT - {YYYY-MM-DD HH:mm:ss}

## 1. Contexto
## 2. Auditoría documental
## 3. Regresiones verificadas
## 4. Ajustes aplicados
## 5. Validación final
## 6. Estado final
- CLOSED / PARTIAL

---

TAREAS:
1. Auditar documentación de Phase 2 relacionada con:
   - `docs/PHASE2_PROGRESS.md`
   - `docs/PHASE_2_4_PROGRESS.md`
   - `docs/specs/2026-03-30-feature-checkout-reuse-hardening.md`

2. Verificar consistencia entre:
   - estado reportado
   - tests realmente ejecutados
   - rutas reales backend/frontend

3. Ejecutar una regresion minima backend/frontend:
   - `GET /api/products?limit=1`
   - `npx cypress run --spec cypress/e2e/goldenPath.cy.js`
   - `npx cypress run --spec cypress/e2e/checkoutReuse.cy.js`

4. Si todo sigue verde:
   - dejar documentado que la alineacion DEV/TEST queda cerrada
   - registrar el fix tecnico de `testAuthRoutes` como decision de mantenimiento

5. Si algo falla:
   - documentar la regresion exacta
   - aplicar fix minimo
   - revalidar

RESTRICCIONES:
- no rediseñar arquitectura
- no modificar contratos
- no ampliar alcance fuera de regresion y consolidacion

OUTPUT:
1) Markdown report
2) Siguiente prompt listo para ejecutar
3) NO texto adicional fuera de esas dos secciones
```
(este ya se pégo en chat gpt  y gener el promp C, pero hay que revisar el dev y test de la api)