Trabaja en modo ingeniero senior, disciplinado y orientado a causa raíz.

Tenemos un error en Cypress que debes analizar, planear y corregir siguiendo un flujo obligatorio de 3 fases:
DIAGNÓSTICO → PLAN → EJECUCIÓN → VALIDACIÓN

=====================================
CONTEXTO DEL ERROR
=====================================

Spec:
cypress/e2e/goldenPath.cy.js

Error:
cy.request() failed trying to load:
http://127.0.0.1:3000/api/auth/register

Error de red:
connect ECONNREFUSED 127.0.0.1:3000

El error ocurre en el "before all", por lo que toda la suite se detiene.

=====================================
OBJETIVO
=====================================

1. Encontrar la causa raíz real (no síntomas).
2. Proponer un plan claro y mínimo.
3. Ejecutar la corrección.
4. Validar con evidencia real.
5. Entregar resumen final técnico.

=====================================
REGLAS OBLIGATORIAS
=====================================

- NO hagas cambios primero.
- PRIMERO inspecciona el proyecto.
- DESPUÉS presenta un plan claro.
- SOLO después ejecuta cambios.
- TODO debe basarse en archivos reales del repo (no suposiciones).
- Prioriza solución mínima, correcta y reproducible.

=====================================
FASE 1 – DIAGNÓSTICO (OBLIGATORIA)
=====================================

Investiga y responde:

1. ¿El backend está corriendo realmente?
2. ¿En qué puerto escucha el backend? (3000, 3001 u otro)
3. ¿Cypress a qué URL está apuntando?
4. ¿Está hardcodeado 127.0.0.1:3000 en algún lado?
5. ¿Qué dicen estos archivos?
   - cypress.config.*
   - cypress/support/commands.*
   - .env
   - .env.local
   - .env.test
   - src/api/apiClient.*
   - package.json scripts
6. ¿Existe desalineación entre:
   - frontend (Vite)
   - backend (Express)
   - Cypress
7. ¿El test requiere backend real pero no está levantado?
8. ¿Existe script tipo start-test-server o equivalente?

SALIDA ESPERADA:
- causa raíz probable (clara y concreta)
- evidencia (archivos/líneas/config detectada)
- impacto técnico

=====================================
FASE 2 – PLAN (ANTES DE CAMBIOS)
=====================================

Define un plan paso a paso, por ejemplo:

- validar backend
- corregir puerto/baseURL
- ajustar .env o Cypress config
- modificar commands si es necesario
- asegurar arranque correcto del entorno de pruebas

El plan debe ser:
- breve
- ordenado
- accionable
- sin ambigüedades

=====================================
FASE 3 – EJECUCIÓN
=====================================

Aplica el plan:

- modifica SOLO lo necesario
- muestra exactamente:
  - archivos modificados
  - qué cambió (diff o explicación clara)
- si requiere scripts de arranque, ajústalos
- si el problema es que el backend no estaba levantado:
  - corrige flujo (documenta o automatiza)

=====================================
FASE 4 – VALIDACIÓN
=====================================

- ejecuta pruebas relevantes
- muestra resultado real (pass/fail)
- si falla:
  - explica exactamente por qué
  - qué faltaría corregir

=====================================
ENTREGABLE FINAL
=====================================

Entrega en este formato:

1. CAUSA RAÍZ
2. EVIDENCIA
3. CAMBIOS REALIZADOS
4. ARCHIVOS AFECTADOS
5. COMANDOS EJECUTADOS
6. RESULTADO DE PRUEBAS
7. ESTATUS FINAL (FIXED / PARTIAL / BLOCKED)
8. SIGUIENTES PASOS (si aplica)

=====================================
PISTA IMPORTANTE
=====================================

Alta probabilidad de:
- backend no levantado
- puerto incorrecto (3000 vs 3001)
- desalineación entre .env y Cypress
- dependencia de infraestructura no inicializada

Valida esto PRIMERO antes de cualquier otra cosa.

Al terminar, documenta la respuesta / resultado, de modo que me muestren en la terminal, así como: D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\docs\ResultadosPROMPT26.04.02.12.08
npt link
