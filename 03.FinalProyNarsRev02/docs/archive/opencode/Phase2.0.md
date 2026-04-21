Actúa como Software Architect + Senior Backend Engineer + QA Lead.

Phase 1 ya fue cerrada con:

- GO con excepciones documentadas
- suite E2E UI real estable
- flujos críticos funcionando correctamente

Tu misión ahora es diseñar y comenzar la ejecución de **PHASE 2: HARDENING**.

==================================================
OBJETIVO
==================================================

Elevar el sistema de:
“funcional y probado”
a
“robusto, resiliente y listo para producción real”

==================================================
ALCANCE PHASE 2
==================================================

1. AUTH HARDENING (PRIORIDAD ALTA)

Diseñar e implementar:

- TTL configurable por entorno (dev/test/prod)
- estrategia para forzar expiración en entorno test
- validación automatizada de:
  - refresh exitoso
  - refresh fallido (token inválido/revocado)
  - persistencia de sesión tras refresh

Proponer:
- cambios en backend
- cambios en configuración
- nuevos specs Cypress

==================================================
2. CHECKOUT UX IMPROVEMENT

Diseñar e implementar:

- reuso de shipping address
- reuso de payment method
- selección de datos existentes
- opción de crear nuevos

Considerar:
- estructura de API existente
- cambios en frontend (React)
- impacto en estado global/contexto

==================================================
3. TESTING HARDENING

Diseñar:

- nueva suite de resiliencia:
  - auth lifecycle completo
  - session recovery
  - error handling avanzado
- separación de suites:
  - release gate
  - extended
- estrategia para CI

==================================================
4. ARQUITECTURA Y CONFIGURACIÓN

Definir:

- variables de entorno por stage
- manejo de secretos
- comportamiento distinto en test vs producción
- control de features por entorno si aplica

==================================================
ENTREGABLE
==================================================

Genera:

D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\opencode\PHASE2_HARDENING_PLAN.md

Debe incluir:

1. Arquitectura propuesta
2. Cambios requeridos backend
3. Cambios requeridos frontend
4. Estrategia de testing
5. Priorización clara (Alta / Media / Baja)
6. Riesgos técnicos
7. Roadmap de implementación

==================================================
CRITERIO
==================================================

No des soluciones genéricas.
Diseña en base al sistema actual real.
Prioriza soluciones simples, seguras y mantenibles.

