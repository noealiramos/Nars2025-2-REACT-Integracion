# Resultado Profile Hardening - 2026-04-03 1308

## 1. Resumen ejecutivo

Se atendieron unicamente los dos puntos solicitados antes de cualquier otra fase:

- se fortalecio `ecommerce-app-Nars/src/services/userService.js` con defensive parsing
- se agrego un test E2E minimo real para `/profile` con escenario autenticado y no autenticado

No se modifico backend. No se avanzo a MP-03.

## 2. Archivos modificados

- `ecommerce-app-Nars/src/services/userService.js`
- `ecommerce-app-Nars/cypress/e2e/profile.cy.js`
- `docs/Resultado_Profile-Hardening-2026-04-03-1308.md`

## 3. Defensive parsing

### Antes

- `getCurrentProfile()` hacia `GET /users/me`
- retornaba `normalizeUserProfile(response.data?.data || {})`
- si el backend devolvia shape distinto o `data` ausente, el servicio regresaba `{}` y ocultaba el problema como un perfil vacio

### Despues

- se agrego `PROFILE_KEYS` para detectar senales minimas de entidad usuario
- se agrego `isRecord()` para validar objetos reales
- se agrego `hasProfileSignals()` para reconocer payloads con campos de usuario
- se agrego `extractProfilePayload()` para tolerar estos shapes:
  - `{ data: user }`
  - `{ user: user }`
  - `user`
- comportamiento ante invalidos:
  - `null` o `undefined` -> devuelve `null`
  - array o primitivo -> lanza `Error("Invalid profile response shape")` o `Error("Invalid profile entity shape")`
  - objeto sin senales de usuario -> devuelve `null`

### Riesgos cubiertos

- fragilidad ante cambios leves de shape en backend o wrappers
- ocultamiento silencioso de errores al convertir respuesta invalida en `{}`
- falsas pantallas de perfil con puros fallbacks

## 4. Test E2E agregado

Archivo agregado:

- `ecommerce-app-Nars/cypress/e2e/profile.cy.js`

### Flujo autenticado

- crea/asegura usuario real con `cy.ensureUser(loginUser)`
- login por UI en `/login`
- espera request real `POST **/api/auth/login`
- navega a `/profile`
- espera request real `GET **/api/users/me`
- valida:
  - URL incluye `/profile`
  - existe `[data-testid="profile-page"]`
  - se ve `Mi perfil`
  - se ve el email real del usuario autenticado

### Flujo NO autenticado

- limpia almacenamiento local y sesion
- visita `/profile` directamente
- valida:
  - URL incluye `/login`
  - no existe `[data-testid="profile-page"]`
  - no existe contenido visible `Mi perfil`

### Como se valida redireccion

- con `cy.url().should('include', '/login')`

### Como se evita fuga de datos

- el escenario anonimo verifica que no se renderiza `[data-testid="profile-page"]`
- tambien verifica que no se ve `Mi perfil`

## 5. Validacion de contratos

### Auth

- cambio de contrato: no
- riesgo: bajo
- justificacion: solo se endurece el parsing de `GET /users/me` y se agrega una prueba E2E sobre login/ruta protegida ya existente

### Cart

- cambio de contrato: no
- riesgo: bajo
- justificacion: no se tocaron carrito, contextos ni endpoints

### Checkout

- cambio de contrato: no
- riesgo: bajo
- justificacion: no se tocaron checkout, ordenes, pagos ni direcciones

## 6. Resultados de pruebas

### Unit/component

- despues de hardening de `userService`: `9` archivos, `44` pruebas aprobadas
- despues de agregar E2E: `9` archivos, `44` pruebas aprobadas

### E2E

- spec: `cypress/e2e/profile.cy.js`
- resultado: `2 passing`
- escenarios cubiertos:
  - autenticado
  - no autenticado

### Build

- despues de hardening de `userService`: build exitoso
- despues de agregar E2E: build exitoso
- sin warnings criticos en salidas capturadas

## 7. Riesgos residuales

- el E2E depende de que el backend devuelva el email visible en perfil; si el negocio oculta ese campo en el futuro, habra que ajustar la assertion al identificador estable disponible
- `ProfilePage` sigue mostrando un estado vacio controlado cuando el servicio devuelve `null`; eso evita ocultar errores graves, pero aun requiere decision UX si se quiere un mensaje mas especifico
- no se agrego una prueba unitaria dedicada a `userService`; la validacion actual se cubre por build, suite existente y E2E

## 8. Registro de terminal

### Vitest tras defensive parsing

```text
> ramdi-jewelry-ecommerce-css@1.0.0 test
> vitest run


 RUN  v4.1.1 D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-app-Nars


 Test Files  9 passed (9)
      Tests  44 passed (44)
   Start at  13:30:06
   Duration  15.57s (transform 3.10s, setup 6.06s, import 9.74s, tests 13.75s, environment 30.01s)
```

### Build tras defensive parsing

```text
> ramdi-jewelry-ecommerce-css@1.0.0 build
> vite build

vite v6.4.1 building for production...
transforming...
✓ 142 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                 0.50 kB │ gzip:  0.33 kB
dist/assets/index-BeWlP4G1.css  26.63 kB │ gzip:  5.73 kB
dist/assets/index-Cf0AzL5o.js   259.58 kB │ gzip: 83.38 kB
✓ built in 3.13s
```

### Vitest tras agregar E2E

```text
> ramdi-jewelry-ecommerce-css@1.0.0 test
> vitest run


 RUN  v4.1.1 D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-app-Nars


 Test Files  9 passed (9)
      Tests  44 passed (44)
   Start at  13:30:51
   Duration  14.20s (transform 1.74s, setup 3.35s, import 8.30s, tests 14.07s, environment 24.13s)
```

### Build tras agregar E2E

```text
> ramdi-jewelry-ecommerce-css@1.0.0 build
> vite build

vite v6.4.1 building for production...
transforming...
✓ 142 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                 0.50 kB │ gzip:  0.33 kB
dist/assets/index-BeWlP4G1.css  26.63 kB │ gzip:  5.73 kB
dist/assets/index-Cf0AzL5o.js   259.58 kB │ gzip: 83.38 kB
✓ built in 3.39s
```

### Health checks de servidores de test

```text
200
{"status":"ok","service":"ecommerce-api-jewelry","time":"2026-04-03T19:31:41.865Z","mongo":{"state":1,"stateText":"connected"},"requestId":"d07e622e-2b66-4910-8130-acb0795ca732"}
```

```text
200
<!doctype html>
<html lang="es" data-theme="dark">
  <head>
    <script type="module">import { injectIntoGlobalHook } fr
```

### Cypress `/profile`

```text

====================================================================================================

  (Run Starting)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Cypress:        15.13.0                                                                        │
  │ Browser:        Electron 138 (headless)                                                        │
  │ Node Version:   v22.15.0 (C:\Program Files\nodejs\node.exe)                                    │
  │ Specs:          1 found (profile.cy.js)                                                        │
  │ Searched:       D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsR │
  │                 ev02\ecommerce-app-Nars\cypress\e2e\profile.cy.js                              │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘


────────────────────────────────────────────────────────────────────────────────────────────────────
                                                                                                    
  Running:  profile.cy.js                                                                   (1 of 1)


  Flujo minimo de perfil
    √ PROFILE-001: Usuario autenticado accede a /profile y ve contenido real (4458ms)
    √ PROFILE-002: Usuario no autenticado es redirigido al login al intentar acceder a /profile (505ms)


  2 passing (5s)


  (Results)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Tests:        2                                                                                │
  │ Passing:      2                                                                                │
  │ Failing:      0                                                                                │
  │ Pending:      0                                                                                │
  │ Skipped:      0                                                                                │
  │ Screenshots:  0                                                                                │
  │ Video:        false                                                                            │
  │ Duration:     5 seconds                                                                        │
  │ Spec Ran:     profile.cy.js                                                                    │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘


====================================================================================================

  (Run Finished)


       Spec                                              Tests  Passing  Failing  Pending  Skipped  
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ ✔  profile.cy.js                            00:05        2        2        -        -        - │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
    ✔  All specs passed!                        00:05        2        2        -        -        -  
```

### Vitest final

```text
> ramdi-jewelry-ecommerce-css@1.0.0 test
> vitest run


 RUN  v4.1.1 D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-app-Nars


 Test Files  9 passed (9)
      Tests  44 passed (44)
   Start at  13:32:24
   Duration  14.63s (transform 2.21s, setup 3.57s, import 8.84s, tests 14.65s, environment 24.92s)
```

### Build final

```text
> ramdi-jewelry-ecommerce-css@1.0.0 build
> vite build

vite v6.4.1 building for production...
transforming...
✓ 142 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                 0.50 kB │ gzip:  0.33 kB
dist/assets/index-BeWlP4G1.css  26.63 kB │ gzip:  5.73 kB
dist/assets/index-Cf0AzL5o.js   259.58 kB │ gzip: 83.38 kB
✓ built in 3.48s
```
