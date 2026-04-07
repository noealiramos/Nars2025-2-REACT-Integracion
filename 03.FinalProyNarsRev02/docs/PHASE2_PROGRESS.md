# PHASE 2 Progress

## Phase 2.1 - Auth Hardening

### Configuracion `.env.test`

Se agrego `ecommerce-api-Nars/.env.test` con configuracion aislada para pruebas de lifecycle auth:

- `PORT=3001`
- `ACCESS_TOKEN_TTL=35s`
- `REFRESH_TOKEN_TTL=2m`
- `ENABLE_TEST_AUTH_TOOLS=true`
- `START_SERVER=true`

Adicionalmente:

- `ecommerce-api-Nars/src/config/env.js` ahora carga `.env.<NODE_ENV>` sin afectar `dev` ni `prod`
- `ecommerce-api-Nars/server.js` permite levantar servidor en `test` solo cuando `START_SERVER=true`
- `ecommerce-api-Nars/scripts/start-test-server.mjs` inicia el backend de pruebas en entorno controlado
- `ecommerce-app-Nars/scripts/start-test-dev.mjs` permite correr frontend apuntando al backend de auth test

### Nuevos tests creados

Archivo nuevo:

- `ecommerce-app-Nars/cypress/e2e/authLifecycle.cy.js`

Cobertura agregada:

1. **refresh success**
   - login por UI
   - expiracion real del access token corto
   - accion protegida real (`/orders`)
   - `401` inicial observado
   - `POST /api/auth/refresh` exitoso
   - retry exitoso
   - sesion continuada

2. **refresh failure**
   - login por UI
   - revocacion controlada de refresh token en entorno `test`
   - expiracion real del access token corto
   - accion protegida real (`/orders`)
   - refresh falla con `401`
   - logout automatico
   - redirect a `/login`

### Soporte tecnico agregado

- `ecommerce-api-Nars/src/routes/testAuthRoutes.js`
  - endpoint controlado solo para entorno `test`: `POST /api/auth/test/revoke-refresh-tokens`
- `ecommerce-app-Nars/cypress/support/commands.js`
  - espera deterministica de expiracion
  - helper para revocacion controlada del refresh token sin manipular manualmente tokens en frontend

### Resultados de ejecucion

Ejecucion auth hardening en stack de test:

- `npx cypress run --spec cypress/e2e/authLifecycle.cy.js`
- resultado: `2/2 passing`

Validaciones adicionales comprobadas:

- access token emitido por backend test con TTL efectivo de `35s`
- endpoint de revocacion de refresh tokens activo solo en test

### Validacion del lifecycle auth completo

Queda demostrada la capacidad del sistema para:

- manejar expiracion real de access token
- recuperar sesion automaticamente via refresh
- reintentar la request protegida exitosamente tras refresh
- fallar de forma segura cuando refresh ya no es valido
- limpiar sesion local y redirigir a login cuando corresponde

### Estado actual

**AUTH HARDENING: completado**

La brecha principal de Phase 2 sobre lifecycle de sesion ya quedo cubierta de forma deterministica, real y sin mocks.

Nota importante:
- Restauré ecommerce-app-Nars/.env.local al backend normal 3000, así que el entorno de trabajo quedó nuevamente en modo estándar.

Siguiente paso natural:
1. separar scripts de CI entre release-gate, extended y auth-test
2. avanzar la siguiente iteración de hardening UX para shipping reuse

## Phase 2.2 - Checkout Reuse Operational Closure

- El detalle consolidado de cierre se mueve al documento canonico `docs/PHASE_2_4_PROGRESS.mdm` para evitar duplicidad entre reportes.
- Estado de la fase: `ALIGNED` en dev y test para los endpoints y smoke paths validados.
- Evidencia principal: `ecommerce-app-Nars/cypress/e2e/checkoutReuse.cy.js` con `5/5` escenarios passing en dev normal y `ecommerce-app-Nars/cypress/e2e/goldenPath.cy.js` con `1/1` smoke passing.
- La discrepancia previa de `GET /api/products` en `3000` quedo corregida al aislar `testAuthRoutes` solo bajo `/auth/test`.
