# FASE 3 - E2E Validation

## 1. Encabezado
- Fecha y hora exacta: 2026-04-19 13:22
- Fase: FASE 3 - E2E Validation
- Objetivo: validar en una corrida E2E real post FASE 3 que backend, frontend y Cypress sigan funcionando de punta a punta sin mocks ni stubs.

## 2. Estado inicial detectado
- Backend: script esperado `npm run start:test` en `ecommerce-api-Nars`, arranca con `NODE_ENV=test`, `START_SERVER=true` y `PORT=3001`.
- Frontend: script esperado `npm run dev:test` en `ecommerce-app-Nars`, arranca Vite en puerto `5173` y resuelve `VITE_API_URL` desde configuracion central.
- Configuracion Cypress: `ecommerce-app-Nars/cypress.config.mjs` resuelve `baseUrl` desde `CYPRESS_BASE_URL` y `apiUrl` desde `CYPRESS_API_URL || VITE_API_URL`.
- Variables utilizadas: backend `PORT=3001`, `NODE_ENV=test`, `START_SERVER=true`; frontend/Cypress `VITE_API_URL`, `CYPRESS_API_URL`, `CYPRESS_BASE_URL` con defaults locales controlados.
- Puertos detectados: backend `3001`, frontend `5173`.

## 3. Plan de validacion
- Levantar backend en modo test contra servicios reales.
- Levantar frontend en modo test contra el backend real.
- Ejecutar una corrida real de Cypress.
- Usar la suite completa (`npx cypress run`) para cubrir login, catalogo, detalle, carrito, checkout y ordenes; es mas representativa que una sola spec aislada.
- Si falla algo, diagnosticar primero configuracion, puertos/URLs, datos de prueba, sincronizacion o regresion de FASE 3 antes de considerar correcciones.

### Suites o specs previstas
- Corrida completa de `ecommerce-app-Nars/cypress/e2e/*.js`

### Criterios de exito
- Backend levanta correctamente.
- Frontend levanta correctamente.
- Cypress conecta contra ambos.
- Hay interaccion real de UI y flujo critico principal funcional.
- No se usan mocks, stubs ni fixtures que oculten errores reales.

## 4. Ejecucion real
- Backend levantado con `npm run start:test` en `http://localhost:3001`.
- Frontend levantado con `npm run dev:test` en `http://localhost:5173`.
- Se validaron ambos servicios con una comprobacion real por HTTP antes de Cypress.
- Se ejecuto una primera corrida completa de `npx cypress run` sobre las 13 specs de `ecommerce-app-Nars/cypress/e2e/*.js`.
- La corrida 1 fallo por una regresion de configuracion introducida en FASE 3: `Cypress.env('apiUrl')` ya no era accesible con `allowCypressEnv: false`.
- Se aplico una correccion exploratoria limitada (`Cypress.config('env').apiUrl`), se rerrejecuto la suite completa y se confirmo que esa fuente devolvia `undefined` en el runner.
- Se aplico la correccion segura final: restaurar `Cypress.env('apiUrl')` en la suite afectada y habilitar temporalmente `allowCypressEnv: true` en `ecommerce-app-Nars/cypress.config.mjs` para compatibilidad con la suite actual.
- Se ejecuto una tercera corrida completa real de `npx cypress run`; el resultado final fue `33/33` pruebas passing sin mocks ni stubs.
- Al finalizar, se detuvieron ambos servicios en background.

## 5. Output de Terminal
- El output completo y sin resumir de la validacion se preservo verbatim en estos archivos generados durante la ejecucion:
- `docs/bitacora/2026-04-19_13-22_backend_start.log`
- `docs/bitacora/2026-04-19_13-22_frontend_start.log`
- `docs/bitacora/2026-04-19_13-22_cypress_run.log`
- `docs/bitacora/2026-04-19_13-22_cypress_run_rerun.log`
- `docs/bitacora/2026-04-19_13-22_cypress_run_final.log`

### Estado/health check previo a Cypress

```text
[api]
status=200
{"status":"ok","service":"ecommerce-api-jewelry","time":"2026-04-19T19:23:52.142Z","mongo":{"state":1,"stateText":"connected"},"requestId":"08f9bb53-d00f-4f03-a55b-7abbbfdf4c92"}
[app]
status=200
<!doctype html>
<html lang="es" data-theme="dark">
  <head>
    <script type="module">import { injectIntoGlobalHook } from "/@react-refresh";
injectIntoGlobalHook(window);
window.$RefreshReg$ = () => 
```

### Resumen fiel de salidas clave

```text
Corrida 1 Cypress:
- fallo en auth.cy.js, cart.cy.js, goldenPath.cy.js, orders.cy.js, productAccess.cy.js, profile.cy.js, responsiveEvidence.cy.js y parte de authLifecycle.cy.js
- error dominante: `Cypress.env()` does not work when `allowCypressEnv` is set to `false`

Corrida 2 Cypress:
- algunas specs siguieron pasando, pero persistio la falla en 8/13 specs
- error dominante: `TypeError: Cannot read properties of undefined (reading 'apiUrl')`

Corrida 3 Cypress:
- all specs passed
- total final: 33 tests passing en 13 specs, duracion aproximada 04:40
```

## 6. Hallazgos
- Backend y frontend reales levantaron correctamente en los puertos esperados (`3001` y `5173`).
- El flujo real de login, catalogo, detalle de producto, carrito, checkout, confirmacion, ordenes, profile y evidencia responsive quedo validado en la corrida final.
- La falla real detectada no fue de negocio ni de integracion API/UI; fue una regresion de configuracion Cypress posterior a FASE 3.
- Causa raiz confirmada: la suite seguia consumiendo `Cypress.env('apiUrl')` mientras `ecommerce-app-Nars/cypress.config.mjs` quedo con `allowCypressEnv: false`.
- La correccion intermedia con `Cypress.config('env').apiUrl` no fue valida en runtime del runner y devolvio `undefined`.
- Cypress emitio dos warnings no bloqueantes: uno por `allowCypressEnv: true` en la corrida final y otro por no poder mover a papelera resultados previos de screenshots; ninguno altero el exit code final.

## 7. Correcciones aplicadas
- Se aplicaron correcciones seguras y limitadas a configuracion/pruebas, sin tocar logica de negocio.

### Archivo 1
- Ruta completa: `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\cypress\support\commands.js`
- Antes: `const getApiUrl = () => Cypress.env('apiUrl')`, luego intento intermedio con `Cypress.config('env').apiUrl`.
- Despues: `const getApiUrl = () => Cypress.env('apiUrl')`.
- Motivo del cambio: restaurar la lectura funcional de `apiUrl` usada por custom commands.
- Riesgo del cambio: bajo; solo afecta infraestructura de pruebas.

### Archivo 2
- Ruta completa: `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\cypress\e2e\auth.cy.js`
- Antes: `const getApiUrl = () => Cypress.env('apiUrl')`, luego intento intermedio con `Cypress.config('env').apiUrl`.
- Despues: `const getApiUrl = () => Cypress.env('apiUrl')`.
- Motivo del cambio: alinear la spec auth con la fuente funcional de configuracion del runner.
- Riesgo del cambio: bajo.

### Archivo 3
- Ruta completa: `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\cypress.config.mjs`
- Antes: `allowCypressEnv: false`
- Despues: `allowCypressEnv: true`
- Motivo del cambio: mantener compatibilidad temporal con la suite real existente y validar E2E sin reescribir specs durante esta fase.
- Riesgo del cambio: bajo a medio; Cypress advierte que esta opcion debe migrarse en una fase posterior.

## 8. Validacion posterior
- Backend OK en `http://localhost:3001`.
- Frontend OK en `http://localhost:5173`.
- Corrida final de Cypress OK con `33/33` pruebas passing.
- Specs OK en corrida final: `auth.cy.js`, `authLifecycle.cy.js`, `cart.cy.js`, `checkoutAddressModes.cy.js`, `checkoutErrors.cy.js`, `checkoutReuse.cy.js`, `criticalClosure.cy.js`, `goldenPath.cy.js`, `loginErrors.cy.js`, `orders.cy.js`, `productAccess.cy.js`, `profile.cy.js`, `responsiveEvidence.cy.js`.
- Pendiente tecnico: migrar la suite desde `Cypress.env()` hacia una alternativa compatible con `allowCypressEnv: false` para retirar el warning de Cypress.

## 9. Riesgos detectados
- Tecnicos: `allowCypressEnv: true` es una solucion temporal de compatibilidad para la suite actual y Cypress la marca como insegura/deprecable a futuro.
- De integracion: no se detectaron fallas bloqueantes de integracion frontend-backend tras la correccion final.
- De despliegue: el ajuste afecta solo la infraestructura de pruebas Cypress, no el runtime productivo.
- Operativos: quedaron nuevas screenshots no rastreadas generadas por `responsiveEvidence.cy.js` y por corridas fallidas previas.

## 10. Resultado final
- Clasificacion final: E2E OK con observaciones
- Suite que paso: corrida completa real de `npx cypress run` sobre 13 specs.
- Total final: `33/33` tests passing.
- Servicios usados: backend real `http://localhost:3001` y frontend real `http://localhost:5173`.
- Evidencia de OK: `docs/bitacora/2026-04-19_13-22_backend_start.log`, `docs/bitacora/2026-04-19_13-22_frontend_start.log`, `docs/bitacora/2026-04-19_13-22_cypress_run.log`, `docs/bitacora/2026-04-19_13-22_cypress_run_rerun.log` y `docs/bitacora/2026-04-19_13-22_cypress_run_final.log`.
