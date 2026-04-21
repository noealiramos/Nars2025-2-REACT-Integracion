Actúa como Senior Backend Engineer + Test Engineer + QA Lead, experto en Node.js, Express, MongoDB, Mongoose y Vitest.

CONTEXTO:
Proyecto backend: `ecommerce-api-Nars`

SITUACIÓN ACTUAL:
La suite completa backend NO pasa. Los unit tests y security tests sí pasan, pero fallan varias suites de integración.

FALLAS REALES DETECTADAS:
- `tests/integration/auth.test.js`
- `tests/integration/cart_orders.test.js`
- `tests/integration/catalog.test.js`
- `tests/integration/resilience.test.js`
- `tests/integration/users.test.js`

ERRORES OBSERVADOS:
- `TypeError: Product.countDocuments is not a function`
- `TypeError: Product.insertMany is not a function`
- `TypeError: Cannot read properties of undefined (reading 'select')`

ORIGEN APARENTE:
- `src/utils/seedTestCatalog.js`
- arranque al importar `server.js`
- posible conflicto entre mocks / imports / modelo real de Mongoose / bootstrapping del servidor en contexto de integración

OBJETIVO:
Corregir BIEN la infraestructura de pruebas de integración backend para que la suite completa backend pase, manteniendo la lógica actual del sistema y sin introducir hacks frágiles.

IMPORTANTE:
NO quiero una solución tramposa de “desactivar el seed y ya”.
NO quiero apagar pruebas.
NO quiero comentar tests.
QUIERO una corrección técnica real y limpia.

---

## REGLAS OBLIGATORIAS

1. Trabajar por fases: diagnóstico → plan → implementación → validación.
2. NO modificar comportamiento de negocio si no es estrictamente necesario.
3. NO romper unit tests ni security tests que ya pasan.
4. Si el problema está en mocks o bootstrap, arreglarlo desde raíz.
5. Si `server.js` mezcla responsabilidades de arranque y side effects de test, refactorizar con criterio mínimo.
6. TODO output de terminal debe incluirse en el documento final.
7. Documento con fecha y hora obligatorio.
8. Si hay varias opciones de arreglo, elegir la más mantenible.
9. NO ocultar fallas: si algo queda pendiente, documentarlo claramente.

---

## FASE 1 — DIAGNÓSTICO DE RAÍZ

Revisar con detalle:

1. `src/utils/seedTestCatalog.js`
2. `server.js`
3. setup de entorno test (`.env.test`, `src/config/env.js`, scripts de arranque)
4. suites que fallan:
   - `tests/integration/auth.test.js`
   - `tests/integration/cart_orders.test.js`
   - `tests/integration/catalog.test.js`
   - `tests/integration/resilience.test.js`
   - `tests/integration/users.test.js`
5. si hay:
   - mocks globales o parciales
   - importaciones tempranas de modelos
   - side effects al importar `server.js`
   - dependencias cíclicas
   - diferencias entre modelo real Mongoose vs objeto mockeado

Debes responder:
- causa raíz exacta
- por qué `countDocuments`, `insertMany` o `select` no existen en ese contexto
- si el problema viene de mocks, orden de imports, seeding acoplado o bootstrap del server

ENTREGABLE:
Resumen técnico corto + evidencia exacta.

NO IMPLEMENTAR TODAVÍA.

---

## FASE 2 — PLAN DE CORRECCIÓN

Diseñar la mejor solución técnica.

Opciones posibles a evaluar (sin casarte con ninguna si no conviene):
- separar app de server bootstrap
- aislar seed de catálogo del import de `server.js`
- mover seeding a setup explícito de tests
- corregir mocks parciales incompatibles
- usar modelos reales en integración y mocks solo en unit
- evitar side effects de arranque durante import
- introducir guardas limpias por entorno SOLO si son técnicamente correctas

El plan debe indicar:
1. archivos a tocar
2. cambio exacto en cada uno
3. por qué esa solución es la correcta
4. riesgos
5. cómo validar que no se rompió lo demás

NO IMPLEMENTAR SIN CONFIRMACIÓN.

---

## FASE 3 — IMPLEMENTACIÓN

Una vez aprobado:

1. aplicar la corrección mínima pero sólida
2. mantener separación clara entre:
   - app
   - server bootstrap
   - seeding
   - tests
3. evitar hacks temporales
4. respetar buenas prácticas de testing de integración

---

## FASE 4 — VALIDACIÓN OBLIGATORIA

Después de implementar, ejecutar:

1. suite completa backend:
```bash
npm test