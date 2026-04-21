# Cypress Cleanup

## 1. Encabezado
- Fecha y hora exacta: 2026-04-19 13:49
- Objetivo: retirar la compatibilidad temporal de `allowCypressEnv: true`, dejar `allowCypressEnv: false` si era viable, y mantener la suite completa de Cypress pasando sin reducir cobertura.
- Contexto de partida: FASE 3 dejo la validacion E2E real en `33/33` passing, pero con una observacion tecnica pendiente por el uso de `Cypress.env('apiUrl')` y `allowCypressEnv: true`.

## 2. Diagnostico inicial
- `Cypress.env('apiUrl')` seguia usandose en `ecommerce-app-Nars/cypress/support/commands.js` y `ecommerce-app-Nars/cypress/e2e/auth.cy.js`.
- `allowCypressEnv: true` seguia activo en `ecommerce-app-Nars/cypress.config.mjs` solo para sostener esa compatibilidad.
- Riesgo de dejarlo asi: Cypress ya lo reporta como una configuracion insegura y futura candidata a remocion.
- Riesgo funcional: si se quitaba sin reemplazo estable, podia repetirse la regresion vista en la validacion E2E anterior.

## 3. Estrategia elegida
- Opciones consideradas:
- Opcion A: mantener `Cypress.env('apiUrl')` y justificar `allowCypressEnv: true`. Se descarta por no limpiar configuracion.
- Opcion B: migrar a `cy.env()` o `Cypress.expose()`. Se considera mas alineada a futuro, pero implica refactor mas amplio de comandos/specs y arriesga estabilidad inmediata.
- Opcion C: mover `apiUrl` a una clave de configuracion accesible via `Cypress.config('apiUrl')` y restaurar `allowCypressEnv: false`. Se elige por ser el cambio mas pequeno, estable y mantenible con la version actual.
- Opcion final elegida: Opcion C.
- Justificacion tecnica: `apiUrl` es configuracion publica de ejecucion E2E, no un secreto; por tanto encaja mejor como configuracion de Cypress que como lectura via `Cypress.env()`. Esto elimina la compatibilidad temporal y mantiene acceso sincronico en helpers/specs sin reescribir flujos de pruebas.

## 4. Cambios aplicados

### Archivo 1
- Ruta completa: `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\cypress.config.mjs`
- Antes: `allowCypressEnv: true` y `apiUrl` anidada en `e2e.env`.
- Despues: `allowCypressEnv: false` y `apiUrl` definida como clave de configuracion en el nivel superior del config exportado.
- Motivo: exponer `apiUrl` como configuracion limpia y accesible mediante `Cypress.config('apiUrl')`.
- Riesgo: bajo; afecta solo infraestructura de ejecucion E2E.

### Archivo 2
- Ruta completa: `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\cypress\support\commands.js`
- Antes: `const getApiUrl = () => Cypress.env('apiUrl')`.
- Despues: `const getApiUrl = () => Cypress.config('apiUrl')`.
- Motivo: retirar dependencia de `Cypress.env()` sin cambiar cobertura ni logica de los comandos.
- Riesgo: bajo.

### Archivo 3
- Ruta completa: `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\cypress\e2e\auth.cy.js`
- Antes: `const getApiUrl = () => Cypress.env('apiUrl')`.
- Despues: `const getApiUrl = () => Cypress.config('apiUrl')`.
- Motivo: alinear la spec auth con la nueva fuente de verdad de configuracion.
- Riesgo: bajo.

## 5. Output de Terminal
- El output completo de terminal se preservo sin resumir en los siguientes archivos generados durante la ejecucion:
- `docs/archive/bitacora/2026-04-19_13-49_cleanup_search.log`
- `docs/archive/bitacora/2026-04-19_13-49_cleanup_validation.log`
- `docs/archive/bitacora/2026-04-19_13-49_cleanup_backend.log`
- `docs/archive/bitacora/2026-04-19_13-49_cleanup_frontend.log`
- `docs/archive/bitacora/2026-04-19_13-49_cleanup_cypress.log`

### Busqueda de referencias
- Ver `docs/archive/bitacora/2026-04-19_13-49_cleanup_search.log`

### Validaciones previas y representativas
- Ver `docs/archive/bitacora/2026-04-19_13-49_cleanup_validation.log`

### Arranque backend
- Ver `docs/archive/bitacora/2026-04-19_13-49_cleanup_backend.log`

### Arranque frontend
- Ver `docs/archive/bitacora/2026-04-19_13-49_cleanup_frontend.log`

### Corrida Cypress completa final
- Ver `docs/archive/bitacora/2026-04-19_13-49_cleanup_cypress.log`

## 6. Validacion funcional
- Resultado de la corrida final: OK.
- Numero de specs: `13`.
- Numero de tests: `33`.
- Evidencia de que no hubo mocks: se ejecuto `npx cypress run` contra backend real `http://localhost:3001` y frontend real `http://localhost:5173`; no se agregaron mocks, stubs ni fixtures, y no se modificaron specs para reducir cobertura.
- Evidencia de que no se toco logica de negocio: todos los cambios quedaron limitados a `ecommerce-app-Nars/cypress.config.mjs`, `ecommerce-app-Nars/cypress/support/commands.js` y `ecommerce-app-Nars/cypress/e2e/auth.cy.js`.

## 7. Riesgos detectados
- Tecnicos: persiste un warning no bloqueante de Cypress al intentar mover a papelera screenshots previas de `responsiveEvidence.cy.js`.
- De mantenimiento: la nueva estrategia depende de que `apiUrl` siga expuesta como clave de configuracion top-level; es clara, pero debe conservarse consistente si cambia la version de Cypress.
- De compatibilidad: no se detectan incompatibilidades actuales; la corrida real completa confirmo compatibilidad con la version instalada (`15.13.0`).

## 8. Resultado final
- Clasificacion final: Cypress clean OK
- Cierre tecnico exitoso: se dejo `allowCypressEnv: false` y la suite completa mantuvo `33/33` passing.
- Evidencia principal: `docs/archive/bitacora/2026-04-19_13-49_cleanup_cypress.log` y esta bitacora.
