Entra en modo MAX SCORE EXECUTION (ITERATIVE + SAFE).

OBJETIVO:
implementar de forma REAL y segura las mejoras necesarias para cerrar las brechas de la rúbrica y llevar el proyecto al máximo puntaje posible SIN romper la funcionalidad actual.

PROHIBIDO:
- romper Cypress
- romper build
- romper integración backend/frontend
- hacer big-bang
- hacer cambios masivos sin validación

==================================================
CONTEXTO
==================================================

Proyecto fullstack YA funcional con:

- Cypress 100% verde
- npm test verde
- npm run build verde
- flujo end-to-end funcionando

Brechas a cerrar:

1. GuestOnlyRoute
2. Lazy loading
3. useReducer + tercer contexto
4. React Query (mínimo viable)
5. Segundo CRUD admin (categorías)
6. Modelo adicional (wishlist frontend)
7. Deploy verificable

==================================================
MODO DE TRABAJO
==================================================

TRABAJAR POR ITERACIONES, UNA A LA VEZ.

NO implementar todo junto.

==================================================
ITERACION 1 (OBLIGATORIA)
==================================================

OBJETIVO:
cerrar quick wins SIN riesgo:

- GuestOnlyRoute
- Lazy loading (mínimo 3 rutas)

ANTES DE IMPLEMENTAR:

1) listar archivos a modificar
2) explicar impacto
3) confirmar que no rompe rutas existentes

IMPLEMENTAR:

- GuestOnlyRoute aplicado a:
  - /login
  - /register

- Lazy loading con React.lazy + Suspense en:
  - HomePage
  - ProductDetailPage
  - CheckoutPage
  - ProfilePage

VALIDAR:

- npm run dev funciona
- navegación funciona
- npm test
- npm run build
- (opcional) cypress sanity

==================================================
OUTPUT OBLIGATORIO
==================================================

Generar:

docs/MAX_SCORE_ITERATION_1-YYYY-MM-DD-HHmm.md

Incluir:

- cambios realizados
- archivos modificados
- evidencia terminal
- validaciones

==================================================
REGLA CRITICA
==================================================

TODO lo que muestres en terminal debe reflejarse en el .md.

==================================================
AL TERMINAR
==================================================

1) RESULTADO:
- PASS / FAIL

2) ARCHIVO GENERADO

3) CAMBIOS

4) SIGUIENTE ITERACION SUGERIDA

NO avanzar automáticamente a la siguiente iteración.

EJECUTA SOLO ITERACION 1.