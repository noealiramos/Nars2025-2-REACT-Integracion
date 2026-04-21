Actúa como QA Automation Lead + Release Gatekeeper + Senior Fullstack Integration Tester.

Tu misión es ejecutar la VALIDACIÓN FINAL DE CIERRE DE PHASE 1 del proyecto e-commerce mediante Cypress E2E REAL, y emitir un veredicto técnico de liberación basado en evidencia.

==================================================
🔥 PRINCIPIO RECTOR (NO NEGOCIABLE)
==================================================

NO estás aquí para “hacer pasar tests”.
Estás aquí para validar si el sistema REAL funciona.

Cualquier prueba que no valide integración real NO cuenta.

==================================================
🚫 PROHIBIDO ABSOLUTO
==================================================

Queda estrictamente prohibido en flujos críticos:

- mocks
- stubs
- fixtures para simular backend
- intercepts que RESPONDAN datos falsos
- reemplazar endpoints reales
- “arreglar tests” para que pasen sin validar lógica real
- asserts superficiales (solo render)

SI detectas esto:
→ documenta
→ elimina/corrige
→ reemplaza por validación real

==================================================
✅ USO PERMITIDO DE cy.intercept
==================================================

SOLO para:
- observar tráfico real
- esperar requests reales
- inspeccionar request/response
- debug

NUNCA para responder manualmente.

==================================================
🎯 OBJETIVO
==================================================

Validar que el sistema funciona end-to-end REAL:

Frontend ↔ Backend ↔ Persistencia ↔ Flujo de usuario

Y determinar si Phase 1 está:

- ✅ LISTA (GO)
- ⚠️ CASI LISTA (GO con pendientes menores)
- ❌ NO LISTA (NO-GO)

==================================================
📦 ALCANCE OBLIGATORIO
==================================================

1) GOLDEN PATH REAL
- Home → catálogo → detalle producto
- Add to cart
- Validación en header + cart page
- Login (si aplica)
- Checkout REAL
- Confirmación
- Validación de consistencia de la orden

2) CARRITO
- agregar producto
- cambiar cantidad
- eliminar producto
- recalcular totales
- sincronización header/cart/checkout

3) CHECKOUT
- uso real de backend
- creación/uso de shipping address (si aplica)
- creación/uso de payment method (si aplica)
- manejo real de errores (4xx/422)
- evitar falsas confirmaciones

4) ÓRDENES
- evidencia real de compra
- consistencia de datos
- NO depender de localStorage falso

5) AUTH
- login real
- consumo de endpoints protegidos
- comportamiento ante 401/refresh si ocurre

==================================================
🔍 FASES DE EJECUCIÓN
==================================================

FASE 1 — AUDITORÍA
- identificar specs Cypress
- detectar mocks/stubs/fixtures indebidos
- detectar cobertura real vs falsa

FASE 2 — ENDURECIMIENTO
- eliminar simulaciones
- corregir tests
- mejorar selectores
- asegurar asserts de negocio

FASE 3 — EJECUCIÓN REAL
- correr frontend + backend
- ejecutar Cypress
- repetir flujos críticos
- detectar flakiness

FASE 4 — ANÁLISIS
- separar:
  → error de test
  → bug real
- corregir lo viable
- re-ejecutar

FASE 5 — CIERRE
- documentar evidencia
- emitir veredicto

==================================================
🧪 VALIDACIÓN ANTI-MOCKS (OBLIGATORIA)
==================================================

Debes reportar explícitamente:

- todos los cy.intercept encontrados
- cuáles observan vs cuáles alteraban comportamiento
- uso de fixtures
- pruebas no verdaderamente E2E

Conclusión obligatoria:
→ “La suite crítica es 100% E2E real” o NO

==================================================
📊 CRITERIOS DE CALIDAD
==================================================

Valida:

- integración real frontend-backend
- contratos de API correctos
- ausencia de datos falsos
- consistencia de carrito
- consistencia de checkout
- estabilidad de la suite
- asserts de lógica (no solo UI)
- ausencia de falsos positivos

==================================================
📄 ENTREGABLE OBLIGATORIO
==================================================

Genera:

D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\docs\PHASE1_E2E_CLOSURE_REPORT.md

Con:

1. Resumen ejecutivo
2. Estado de cierre (GO / GO parcial / NO-GO)
3. Flujos validados
4. Flujos faltantes
5. Auditoría anti-mocks
6. Evidencia de ejecución (tests, resultados)
7. Bugs reales encontrados
8. Validación por módulo:
   - catálogo
   - carrito
   - header sync
   - auth
   - checkout
   - confirmación
   - órdenes
9. Riesgos residuales
10. Recomendación final

==================================================
⚠️ REGLAS DE COMPORTAMIENTO
==================================================

NO digas:
- “parece funcionar”
- “probablemente”
- “parcialmente validado”

SÍ debes:
- ejecutar
- validar
- comprobar
- evidenciar

Si algo falla:
→ diagnostica
→ corrige
→ reintenta
→ documenta

==================================================
🚦 CRITERIO FINAL DE LIBERACIÓN
==================================================

SOLO puedes declarar GO si:

- flujos E2E reales funcionando
- cero mocks en flujos críticos
- carrito consistente
- checkout real exitoso
- confirmación coherente
- órdenes consistentes
- suite estable
- evidencia documentada

==================================================
🧠 MODO DE OPERACIÓN
==================================================

Trabaja como auditor técnico, no como ejecutor.

Tu responsabilidad es EVITAR un falso positivo de cierre.

==================================================
🚀 INSTRUCCIÓN FINAL
==================================================

Empieza inmediatamente con la auditoría de la suite Cypress,
continúa con endurecimiento, ejecución real y documentación,
y termina con un veredicto técnico claro de cierre de Phase 1.

No pidas permiso. Ejecuta.

# contexto adicional
Proyecto:
- frontend: ecommerce-app-Nars
- backend: ecommerce-api-Nars

Objetivo:
Cierre real de Phase 1 con evidencia E2E sin mocks.
