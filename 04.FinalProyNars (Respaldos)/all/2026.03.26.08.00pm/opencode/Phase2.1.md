Actúa como Senior Backend Engineer + QA Automation Architect.

Actualmente Phase 2 está en progreso con:

- TTL configurable implementado
- suite E2E estable (16/16 passing)
- infraestructura lista para testear auth lifecycle

Tu misión es cerrar completamente el AUTH HARDENING.

==================================================
OBJETIVO
==================================================

Implementar validación determinística del lifecycle de sesión:

- access token expiration
- refresh automático exitoso
- refresh fallido (token inválido/revocado)

==================================================
TAREA 1 — CONFIGURACIÓN DE TEST
==================================================

Crear entorno `.env.test`:

- ACCESS_TOKEN_TTL corto (30-60s)
- REFRESH_TOKEN_TTL corto pero mayor

Asegurar:
- no afecta dev ni prod
- backend lee correctamente config por entorno

==================================================
TAREA 2 — TESTS CYPRESS
==================================================

Crear specs E2E reales:

1. refresh success
- login por UI
- esperar expiración real
- ejecutar acción protegida
- validar:
  - 401 interceptado internamente
  - refresh ejecutado
  - retry exitoso
  - sesión continua

2. refresh failure
- invalidar refresh token (flujo real o controlado en test)
- ejecutar acción protegida
- validar:
  - fallo de refresh
  - logout automático
  - redirect a login

==================================================
TAREA 3 — ROBUSTEZ
==================================================

Asegurar:

- no uso de mocks
- no manipulación manual de tokens en frontend
- flujo completamente real controlado por entorno test

==================================================
ENTREGABLE
==================================================

Actualizar:

D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\docs\PHASE2_PROGRESS.md

Incluyendo:

- configuración `.env.test`
- nuevos tests creados
- resultados de ejecución
- validación del lifecycle auth completo

==================================================
CRITERIO
==================================================

El sistema debe ser capaz de demostrar:

- manejo correcto de expiración
- recuperación automática de sesión
- fallback seguro cuando refresh falla

Sin hacks ni simulaciones.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        