La rúbrica oficial se encuentra en:
\opencode\rubrica-evaluacion.pdf

Debes leer ese archivo completo antes de iniciar la evaluación.
No debes asumir criterios fuera de ese documento.
Debes evaluar exactamente contra ese archivo.

Actúa como un equipo de alto rendimiento compuesto por:
- Auditor técnico senior full stack
- Arquitecto React + Node
- QA Lead (unit + E2E)
- Release Manager


OBJETIVO PRINCIPAL
Evaluar mi proyecto e-commerce full stack (React + Node/Express + MongoDB) contra la rúbrica oficial y llevarlo a su máxima calificación posible mediante:
1) evaluación honesta basada en evidencia
2) identificación de brechas reales
3) plan de remediación
4) ejecución guiada de mejoras críticas

REGLAS CRÍTICAS (NO NEGOCIABLES)
- NO inventar
- NO asumir
- NO omitir ningún criterio
- NO suavizar errores
- NO regalar puntos
- TODO debe tener evidencia (archivo, ruta, código o comportamiento)
- Si no se puede verificar → marcar como NO VERIFICABLE
- Si algo está a medias → PARCIAL
- Si no existe → NO CUMPLE

==================================================
FASE 0 — DESCUBRIMIENTO PROFUNDO DEL PROYECTO
==================================================

Antes de evaluar:
1. Mapear todo el repositorio
2. Identificar:
   - frontend (React)
   - backend (Node/Express)
   - configuración (.env, scripts)
   - tests (unit + E2E)
   - endpoints
   - contextos, hooks, interceptores
   - rutas protegidas
   - integración real FE-BE
3. Detectar:
   - dependencias clave
   - uso de axios / react-query
   - manejo de JWT
   - estado global
   - flujo checkout completo

NO GENERES LA EVALUACIÓN AÚN.
Primero entiende el proyecto.

==================================================
FASE 1 — EVALUACIÓN COMPLETA (RÚBRICA)
==================================================

Evalúa TODOS los criterios sin omitir ninguno:

BLOQUE 1: Consumo backend, flujo, despliegue  
BLOQUE 2: Auth, productos, carrito, checkout, usuario  
BLOQUE 3: Context, React Query, interceptores, rutas protegidas, hooks, forms, lazy, loading/error  
BLOQUE 4: Responsive, unit tests, E2E  
BLOQUE 5: Administración + CRUD + modelo adicional  

Para CADA criterio debes entregar:
- puntaje máximo
- puntaje obtenido
- estatus (Cumple / Parcial / No cumple / No verificable)
- evidencia concreta
- explicación técnica clara

==================================================
FASE 2 — MATRIZ DE EVALUACIÓN
==================================================

Construye una tabla completa con:
ID | Criterio | Máximo | Obtenido | Estatus | Evidencia | Observaciones

SIN OMITIR NINGUNO.

==================================================
FASE 3 — PUNTAJE REAL
==================================================

Entrega:
- total obtenido
- total posible
- porcentaje
- interpretación REAL:
  - nivel (alto / medio / riesgo)
  - probabilidad de perder puntos
  - percepción del evaluador

==================================================
FASE 4 — ANÁLISIS DE BRECHA (CRÍTICO)
==================================================

Lista TODO lo que falta para alcanzar la máxima calificación.

Clasifica en:
- 🔴 CRÍTICO (rompe evaluación)
- 🟠 IMPORTANTE (reduce puntos)
- 🟡 MEJORA (optimiza)

Para cada item:
- qué falta
- dónde está el problema
- impacto en calificación

==================================================
FASE 5 — PLAN DE ATAQUE (ESTRATÉGICO)
==================================================

Genera plan optimizado para máximo puntaje en mínimo tiempo:

Ordenado por:
1. impacto en puntos
2. facilidad de implementación

Formato:
- tarea
- prioridad
- dificultad (baja/media/alta)
- tiempo estimado
- impacto en puntos

==================================================
FASE 6 — PLAN TÁCTICO POR ARCHIVO
==================================================

Para cada tarea crítica:

Indica:
- archivos exactos a modificar
- tipo de cambio (bugfix / feature / refactor)
- qué código agregar/modificar
- riesgo
- validación posterior

SI PUEDES:
propón snippets o pseudocódigo.

==================================================
FASE 7 — EJECUCIÓN GUIADA
==================================================

Selecciona los TOP 5 issues críticos y:

Para cada uno:
1. explica el problema
2. muestra cómo corregirlo
3. da pasos exactos
4. indica cómo probar que ya quedó

==================================================
FASE 8 — VALIDACIÓN FINAL
==================================================

Define checklist de verificación final:

- flujo completo funcionando
- login/register OK
- carrito OK
- checkout real
- rutas protegidas OK
- tests pasando
- deploy funcional

==================================================
FASE 9 — ALERTAS DE DEMO
==================================================

Lista TODO lo que puede fallar en la presentación:

- errores comunes
- endpoints rotos
- imágenes no cargando
- JWT expirando
- variables mal configuradas
- race conditions

==================================================
FASE 10 — VEREDICTO FINAL
==================================================

Responde de forma directa:

- ¿Está listo para entregar? (sí/no)
- Nivel real del proyecto
- Qué te puede bajar puntos
- Qué arreglarías HOY en 2-4 horas

==================================================
FASE 11 — REPORTE AUTOMÁTICO
==================================================

Genera archivo:

docs/AUDITORIA_FINAL_RUBRICA.md

Debe incluir TODO:
- resumen
- matriz
- puntaje
- brechas
- plan
- alertas
- veredicto

NO sobrescribir archivos existentes.

==================================================
MODO DE TRABAJO
==================================================

Trabaja en orden:
FASE 0 → FASE 1 → ... → FASE 11

NO saltes fases.
NO resumas.
NO simplifiques.
QUIERO UN ANÁLISIS PROFUNDO, TÉCNICO Y REAL.

Empieza ahora.

Nota: requiero documentar el resultado en \docs\ResultAuditoriaVsRubrica.md
- Todo lo que se imprima en terminal debe reflejarse también en dicho archivo. 

==================================================
SALIDA DE TERMINAL / RESUMEN DE EJECUCION AGREGADO
==================================================

Entregables generados:
- `docs/AUDITORIA_FINAL_RUBRICA.md`
- `docs/ResultAuditoriaVsRubrica.md`

Resultado real de auditoria:
- Base obligatoria: `61/110`
- Extra verificado: `4/20`
- Total: `65/130`
- Estado: `riesgo`
- Veredicto: `no` esta listo para entregar sin riesgo alto de perder puntos

Puntos criticos detectados:
- no hay `React Query`
- no hay `useReducer` ni tercer contexto
- no hay unit tests de `Login/Register`
- no hay `GuestOnly`, perfil FE ni panel admin FE
- no hay lazy loading
- add-to-cart no respeta `auth + stock`

Validaciones ejecutadas:

1. Frontend tests
```text
npm test

> ramdi-jewelry-ecommerce-css@1.0.0 test
> vitest run

Test Files  6 passed (6)
Tests       29 passed (29)
```

2. Backend integration tests seleccionados
```text
npm test -- tests/integration/auth.test.js tests/integration/cart_orders.test.js

FAIL tests/integration/auth.test.js
TypeError: Product.countDocuments is not a function

FAIL tests/integration/cart_orders.test.js
TypeError: Product.countDocuments is not a function

Test Files  2 failed (2)
```

3. Cypress auth
```text
npx cypress run --spec "cypress/e2e/auth.cy.js"

4 passing (11s)
All specs passed
```

4. Cypress carrito / checkout / ordenes
```text
npx cypress run --spec "cypress/e2e/cart.cy.js"

4 passing (17s)
All specs passed
```
