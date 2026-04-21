|Entra en modo MAX SCORE EXECUTION - ITERATION 2 (ARQUITECTURA REACT).

OBJETIVO:
cerrar dos brechas críticas de la rúbrica SIN romper el sistema existente:

1) useReducer + tercer contexto real
2) React Query (mínimo viable)

==================================================
REGLAS CRITICAS
==================================================

- NO romper Cypress
- NO romper integración backend
- NO rehacer toda la app
- NO hacer big-bang

IMPLEMENTACION PROGRESIVA Y SEGURA

==================================================
ALCANCE
==================================================

1) Crear un nuevo contexto real usando useReducer:

- archivo:
  src/contexts/UIContext.jsx

- debe manejar estado real (NO dummy):
  - loading global
  - mensajes (success/error)
  - modales o flags UI

- debe exponer:
  - state
  - dispatch

- debe integrarse en App.jsx

==================================================

2) Introducir React Query (TanStack Query):

- instalar e integrar QueryClientProvider

- migrar SOLO estas vistas:

  - HomePage (productos)
  - OrdersPage
  - AdminProductsPage

- usar:
  - useQuery para GET
  - NO migrar mutations aún si no es necesario

- mantener axios como base

==================================================

ANTES DE IMPLEMENTAR:

1) listar archivos a modificar
2) explicar impacto
3) explicar cómo evitar romper la app

==================================================

VALIDAR:

- npm run dev
- navegación real
- npm test
- npm run build

==================================================

OUTPUT

Generar:

docs/MAX_SCORE_ITERATION_2-YYYY-MM-DD-HHmm.md

Incluir:

- cambios
- archivos modificados
- evidencia terminal
- validaciones

==================================================

REGLA DE TRAZABILIDAD

TODO lo mostrado en terminal debe estar en el .md

==================================================

AL TERMINAR

1) RESULTADO:
- PASS / FAIL

2) ARCHIVO GENERADO

3) CAMBIOS

4) SIGUIENTE ITERACION

NO avanzar automáticamente.

EJECUTA SOLO ITERACION 2.