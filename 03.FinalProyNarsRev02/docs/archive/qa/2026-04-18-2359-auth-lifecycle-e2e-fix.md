# Auth lifecycle E2E fix

## Objetivo

Corregir de forma minima y mantenible la unica falla restante de Cypress en `cypress/e2e/authLifecycle.cy.js`, alineando el helper de prueba con el comportamiento real actual del sistema sin tocar logica de negocio innecesaria.

## Diagnostico rapido

### Falla observada

- Spec: `cypress/e2e/authLifecycle.cy.js`
- Test: `cierra la sesion y redirige a login cuando el refresh ya fue revocado`
- Error original:

```text
AssertionError: expected 404 to equal 200
```

### Archivos implicados

- `ecommerce-app-Nars/cypress/e2e/authLifecycle.cy.js`
- `ecommerce-app-Nars/cypress/support/commands.js`
- `ecommerce-api-Nars/src/routes/testAuthRoutes.js`

### Causa raiz exacta

El helper Cypress `revokeRefreshTokensForCurrentSession()` dependia de una ruta auxiliar de test:

```text
POST /api/auth/test/revoke-refresh-tokens
```

En `cypress/support/commands.js`:

```js
url: `${AUTH_TEST_API_URL}/auth/test/revoke-refresh-tokens`
```

La expectativa del helper era:

```js
expect(response.status).to.eq(200)
expect(response.body?.revokedCount).to.be.greaterThan(0)
```

Pero la comprobacion directa del endpoint devolvio:

```text
status=404
{"message":"Route not found"}
```

La ruta existe en backend solo bajo esta condicion:

```js
if (env.NODE_ENV !== 'test' || !env.ENABLE_TEST_AUTH_TOOLS) {
  return res.status(404).json({ message: 'Route not found' });
}
```

Conclusión:

- la spec estaba acoplada a un endpoint auxiliar de soporte que no estaba disponible en el entorno real de corrida E2E;
- el problema estaba en el helper/test strategy, no en la logica de negocio principal de auth/refresh/logout.

## Solucion recomendada

Reemplazar el uso del endpoint auxiliar de test por el flujo publico real ya soportado por el sistema:

```text
POST /api/auth/logout
```

Con eso:

- se revoca el `refreshToken` usando una ruta real del producto;
- el frontend mantiene temporalmente `accessToken` en `localStorage`;
- al expirar el access token, la app intenta refrescar con un refresh token ya revocado;
- el backend responde `401` y el frontend limpia sesion/redirige a login.

Esta estrategia es mas robusta y menos acoplada que depender de un endpoint `auth/test/*`.

## Implementacion minima aplicada

Archivo modificado:

- `ecommerce-app-Nars/cypress/support/commands.js`

### Antes

```js
Cypress.Commands.add('revokeRefreshTokensForCurrentSession', () => {
  cy.window().then((win) => {
    const accessToken = win.localStorage.getItem('accessToken')
    expect(accessToken, 'access token for test revoke endpoint').to.be.a('string').and.not.be.empty

    return requestWithRetry({
      method: 'POST',
      url: `${AUTH_TEST_API_URL}/auth/test/revoke-refresh-tokens`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body?.revokedCount).to.be.greaterThan(0)
    })
  })
})
```

### Despues

```js
Cypress.Commands.add('revokeRefreshTokensForCurrentSession', () => {
  cy.window().then((win) => {
    const refreshToken = win.localStorage.getItem('refreshToken')
    expect(refreshToken, 'refresh token for session revoke flow').to.be.a('string').and.not.be.empty

    return requestWithRetry({
      method: 'POST',
      url: `${AUTH_TEST_API_URL}/auth/logout`,
      body: {
        refreshToken,
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body?.message).to.eq('Logged out successfully')
    })
  })
})
```

## Justificacion tecnica

- Cambio minimo: solo se toco el helper Cypress.
- No hubo cambios en backend.
- No se desactivo la prueba.
- No se relajaron asserts a ciegas.
- La prueba ahora usa un flujo real, publico y estable del sistema.

## Validacion

### Comprobacion directa del endpoint real soportado

Comando:

```text
node -e "fetch('http://localhost:3001/api/auth/logout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({refreshToken:'dummy'})}).then(r=>r.text().then(t=>console.log('logout_status=' + r.status + '\n' + t))).catch(err=>{console.error(err); process.exit(1);});"
```

Salida:

```text
logout_status=200
{"message":"Logged out successfully"}
```

### Spec puntual

Comando:

```text
npx cypress run --spec cypress/e2e/authLifecycle.cy.js
```

Salida completa:

```text
Warning: We failed to trash the existing run results.

This error will not affect or change the exit code.

Error: Command failed: C:\Users\ALI\AppData\Local\Cypress\Cache\15.13.0\Cypress\resources\app\node_modules\trash\lib\windows-trash.exe D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\cypress\screenshots\responsiveEvidence.cy.js

====================================================================================================

  (Run Starting)

  Cypress:        15.13.0
  Browser:        Electron 138 (headless)
  Node Version:   v22.15.0
  Specs:          1 found (authLifecycle.cy.js)

  Running:  authLifecycle.cy.js

  Phase 2.1 - Auth Lifecycle Hardening
    √ renueva la sesion automaticamente tras expirar el access token (50374ms)
    √ cierra la sesion y redirige a login cuando el refresh ya fue revocado (48172ms)

  2 passing (2m)

  (Results)
  Tests:        2
  Passing:      2
  Failing:      0
  Pending:      0
  Skipped:      0
  Screenshots:  0
  Video:        false
  Duration:     1 minute, 38 seconds
  Spec Ran:     authLifecycle.cy.js

  All specs passed!
```

### Suite E2E completa

Comando:

```text
npx cypress run
```

Salida completa:

```text
Warning: We failed to trash the existing run results.

This error will not affect or change the exit code.

Error: Command failed: C:\Users\ALI\AppData\Local\Cypress\Cache\15.13.0\Cypress\resources\app\node_modules\trash\lib\windows-trash.exe D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\cypress\screenshots\responsiveEvidence.cy.js

====================================================================================================

  (Run Starting)

  Cypress:        15.13.0
  Browser:        Electron 138 (headless)
  Node Version:   v22.15.0
  Specs:          13 found (auth.cy.js, authLifecycle.cy.js, cart.cy.js, checkoutAddressModes.cy.js, checkoutErrors.cy.js, checkoutReuse.cy.js, criticalClosure.cy.js, goldenPath.cy.js, loginErrors.cy.js, orders.cy.js, productAccess.cy.js, profile.cy.js, responsiveEvidence.cy.js)

  auth.cy.js                               4/4 passing
  authLifecycle.cy.js                      2/2 passing
  cart.cy.js                               4/4 passing
  checkoutAddressModes.cy.js               2/2 passing
  checkoutErrors.cy.js                     1/1 passing
  checkoutReuse.cy.js                      7/7 passing
  criticalClosure.cy.js                    1/1 passing
  goldenPath.cy.js                         1/1 passing
  loginErrors.cy.js                        1/1 passing
  orders.cy.js                             3/3 passing
  productAccess.cy.js                      2/2 passing
  profile.cy.js                            2/2 passing
  responsiveEvidence.cy.js                 3/3 passing

  All specs passed!                        04:49       33       33        -        -        -
```

## Resultado final

- Causa raiz: helper Cypress dependia de una ruta auxiliar de test no disponible (`/api/auth/test/revoke-refresh-tokens`).
- Solucion aplicada: helper actualizado para usar el flujo real `POST /api/auth/logout` con el `refreshToken` de la sesion actual.
- Spec puntual: `PASS`
- Suite E2E completa: `PASS`

## Warnings no bloqueantes

- Sigue apareciendo el warning de limpieza de screenshots previos de Cypress.
- No afecta el exit code.
- No afecta el resultado de la suite.
