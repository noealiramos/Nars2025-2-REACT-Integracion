Actúa como QA Automation Lead + Release Gate Closer + Senior Cypress Engineer.

Ya existe un PHASE 1 E2E Closure Report con resultado:
- 14/14 tests passing
- sin mocks/stubs/fakes en suite crítica
- bugs reales ya corregidos
- estado actual: GO parcial / CASI LISTA

Tu misión ahora NO es rehacer toda la auditoría, sino ejecutar una ITERACIÓN FINAL DE CIERRE DE BRECHAS para convertir el resultado actual en GO pleno, si técnicamente es posible.

==================================================
OBJETIVO
==================================================

Cerrar exclusivamente las brechas que impiden declarar:

**GO pleno / suite crítica 100% E2E UI real**

==================================================
BRECHAS YA IDENTIFICADAS
==================================================

1. Existen escenarios que usan helpers por API real:
- loginByApi
- createOrderForUser
- ensureUser

2. Falta cobertura E2E UI pura para:
- refresh token / recuperación tras 401
- carrito autenticado tras reload completo
- reuso de shipping address o payment method existente, si aplica al flujo real

3. Existe warning de configuración:
- allowCypressEnv

==================================================
REGLA CRÍTICA
==================================================

Sigue prohibido:
- mocks
- stubs
- fixtures para simular backend
- intercepts que respondan manualmente
- falsos positivos

cy.intercept solo puede observar tráfico real.

==================================================
TAREA
==================================================

FASE 1
Audita únicamente los specs/helpers que todavía usan:
- loginByApi
- createOrderForUser
- ensureUser

Determina:
- cuáles deben convertirse a UI pura
- cuáles pueden quedarse como apoyo secundario pero fuera de la suite crítica de cierre

FASE 2
Refactoriza la suite crítica para que los flujos de cierre sean UI-driven:
- registro/login vía UI cuando corresponda
- creación de orden vía UI cuando corresponda
- preparación de estado sin siembra artificial si es viable

FASE 3
Agrega o endurece specs dedicados para:
- 401 + refresh token real, si el flujo actual realmente lo soporta
- carrito autenticado después de reload
- reuso de datos existentes en checkout, si la funcionalidad existe realmente

FASE 4
Corrige warning/configuración de Cypress si está dentro del alcance razonable.

FASE 5
Ejecuta la suite final real y determina si ahora sí se puede declarar:
- GO
o
- GO parcial
o
- NO-GO

==================================================
ENTREGABLES
==================================================

1. genera:
-D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\docs\PHASE1_E2E_CLOSURE_REPORT_V2.md

2. Incluye obligatoriamente:
- qué helpers por API fueron eliminados de la suite crítica
- qué cobertura pasó a UI pura
- qué brechas no se pudieron cerrar y por qué
- resultado final de ejecución
- veredicto final:
  - GO
  - GO parcial
  - NO-GO

3. Conclusión obligatoria:
- “La suite crítica es 100% E2E UI real: SÍ/NO”

==================================================
CRITERIO
==================================================

No rehagas trabajo ya validado.
Enfócate solo en cerrar las brechas restantes con precisión técnica.
Si una brecha no puede cerrarse sin inventar funcionalidad, dilo claramente.