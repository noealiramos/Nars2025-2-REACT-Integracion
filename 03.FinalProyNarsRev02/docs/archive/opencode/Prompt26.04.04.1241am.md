Entra en modo MAX SCORE EXECUTION - ITERATION 3 (EXTRAS VISIBLES).

OBJETIVO:
cerrar los últimos criterios funcionales de la rúbrica mediante implementación REAL, mínima y segura de:

1) segundo CRUD admin visible (categorías)
2) modelo adicional integrado al frontend (wishlist)

IMPORTANTE:
La Iteración 2 ya quedó verificada en:
- `docs/POST_EXECUTION_VERIFICATION-2026-04-04-0035.md`

Por lo tanto:
- NO rehacer Iteración 2
- NO volver a auditar Iteración 2
- NO abrir refactors grandes
- avanzar SOLO con Iteración 3

==================================================
REGLAS CRITICAS
==================================================

- NO romper Cypress
- NO romper build
- NO romper rutas existentes
- NO romper integración backend/frontend
- NO hacer overengineering
- implementar MVP funcional y defendible

==================================================
ALCANCE OBLIGATORIO
==================================================

## A) SEGUNDO CRUD ADMIN VISIBLE: CATEGORIAS

Usar endpoints existentes reales del backend.

Debes implementar o completar:

- listar categorías
- crear categoría
- editar categoría
- eliminar categoría

Debe existir una ruta real:

- `/admin/categories`

Debe quedar protegida con `AdminRoute`.

La UI puede ser simple, pero funcional y demostrable.

==================================================

## B) MODELO ADICIONAL FRONTEND: WISHLIST

Usar endpoints backend reales ya existentes para wishlist.

Debes confirmar primero cuáles existen realmente y usar SOLO los reales.

Objetivo mínimo obligatorio:

- botón o acción para agregar producto a wishlist
- página `/wishlist`
- listar productos guardados
- eliminar producto de wishlist

Opcional SOLO si ya existe backend y no añade riesgo:
- limpiar wishlist
- mover a carrito

No inventar endpoints.
No simular wishlist en localStorage si la rúbrica pide integración real.

==================================================
ANTES DE IMPLEMENTAR
==================================================

1) revisar backend y confirmar endpoints reales disponibles para:
   - categorías
   - wishlist

2) listar archivos a modificar

3) explicar impacto esperado

4) explicar riesgos de ruptura y mitigación

==================================================
VALIDACIONES OBLIGATORIAS
==================================================

Al terminar, validar como mínimo:

- `npm test`
- `npm run build`

Y además ejecutar sanity funcional real con Cypress sobre:

- `npx cypress run --spec "cypress/e2e/goldenPath.cy.js,cypress/e2e/orders.cy.js"`

Si agregas rutas/admin/wishlist con suficiente madurez, puedes añadir validación manual documentada.

==================================================
ENTREGABLE OBLIGATORIO
==================================================

Generar un único archivo:

- `docs/MAX_SCORE_ITERATION_3-YYYY-MM-DD-HHmm.md`

Con estas secciones EXACTAS:

# MAX SCORE ITERATION 3

## 0. LOG COMPLETO DE EJECUCION
(TODO lo mostrado en terminal, en orden)

## 1. Objetivo

## 2. Confirmacion de backend disponible
- endpoints reales de categorias
- endpoints reales de wishlist

## 3. Cambios realizados

## 4. Archivos modificados

## 5. Validaciones
- npm test
- npm run build
- sanity Cypress

## 6. Resultado de Iteracion 3

## 7. Conclusión operativa

==================================================
REGLA DE TRAZABILIDAD
==================================================

TODO lo que muestres en terminal debe quedar reflejado también en el .md.

No puede haber conclusiones en terminal que no estén documentadas.

==================================================
FORMATO FINAL EN TERMINAL
==================================================

1) RESULTADO:
- PASS / FAIL

2) ARCHIVO GENERADO:
- ruta completa del .md

3) CAMBIOS:
- lista breve

4) SIGUIENTE PASO:
- una línea

NO avanzar automáticamente a la siguiente iteración.

EJECUTA SOLO ITERACION 3.