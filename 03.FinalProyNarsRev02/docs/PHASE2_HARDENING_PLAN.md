# PHASE 2 Hardening Plan

## 1. Arquitectura propuesta

Phase 2 se apoya en la arquitectura actual y la endurece en 4 ejes:

1. **Auth resiliente por entorno**
   - TTL de access/refresh token configurable por `env`
   - comportamiento de expiracion distinto por `dev`, `test` y `prod`
   - base para habilitar pruebas deterministicas del lifecycle de sesion

2. **Checkout con reuso de datos**
   - reutilizacion de shipping address y payment method existentes
   - fallback a captura de nuevos datos
   - persistencia local ligera para reducir friccion entre compras consecutivas

3. **Suites separadas por objetivo**
   - `release gate`: happy path y regresiones criticas
   - `extended`: auth lifecycle, recovery, reuse, error handling avanzado

4. **Configuracion por stage**
   - secretos fuera del codigo
   - flags y TTLs controlados por entorno
   - herramientas de test sensibles deshabilitadas por defecto

## 2. Cambios requeridos backend

### Alta prioridad

- Hacer configurable `ACCESS_TOKEN_TTL`
- Hacer configurable `REFRESH_TOKEN_TTL`
- Mantener `ENABLE_TEST_AUTH_TOOLS=false` por defecto
- Centralizar conversion de duraciones a milisegundos para expiracion persistida en MongoDB

### Media prioridad

- Exponer config de TTL por `.env.test` o pipeline CI
- Agregar tooling de test controlado solo para entorno `test` si se aprueba
- Incorporar endpoint o mecanismo seguro de expiracion forzada solo en `test`

### Baja prioridad

- Agregar endpoint de health/auth capabilities para debugging interno de ambientes de test

## 3. Cambios requeridos frontend

### Alta prioridad

- Cargar datos guardados de checkout al entrar a `CheckoutPage`
- Permitir seleccionar metodos de pago existentes
- Mantener opcion para crear nuevos datos de checkout
- Deshabilitar inputs cuando se reutiliza informacion existente

### Media prioridad

- Mostrar direccion guardada seleccionable de forma mas consistente y visible
- Agregar mejor feedback de carga para datos guardados
- Permitir cambiar entre default existente y captura nueva sin perder contexto

### Baja prioridad

- Añadir edicion inline de direccion/metodo desde checkout
- Mostrar metadata UX adicional: default badge, fecha de uso, alias de tarjeta

## 4. Estrategia de testing

### Release gate

- `auth.cy.js`
- `criticalClosure.cy.js`
- `checkoutErrors.cy.js`
- `checkoutReuse.cy.js`

### Extended suite

- carrito anonimo y autenticado
- historial/detalle de ordenes
- escenarios de refresh success/failure con entorno `test`
- session recovery despues de `401`
- logout + refresh revocado

### CI

- job 1: backend health + frontend build
- job 2: release gate Cypress
- job 3: extended suite Cypress
- job 4: backend unit/integration tests para auth lifecycle cuando se incorporen

## 5. Priorizacion clara

### Alta

- TTL configurable por entorno
- base para forzar expiracion en `test`
- reuso de payment method en checkout
- separacion conceptual de suites

### Media

- reuso de shipping address con UI mas robusta
- hardening de refresh failure/revocation
- pipeline CI con suites separadas

### Baja

- tooling interno adicional
- telemetria extra para auth lifecycle
- refinamientos UX no bloqueantes

## 6. Riesgos tecnicos

- Introducir tooling de expiracion forzada fuera de `test` seria un riesgo de seguridad
- Cambiar TTLs sin aislar entorno podria alterar comportamiento real en desarrollo/productivo
- El reuso de datos en checkout necesita evitar inconsistencias entre cache local y backend
- La UX de shipping reuse todavia necesita una vuelta adicional para quedar tan clara como payment reuse

## 7. Roadmap de implementacion

### Fase 2.1 - Auth foundation

- [hecho] TTL configurable en backend
- [hecho] expiracion persistida de refresh token basada en config
- [pendiente] `.env.test` con TTL corto
- [pendiente] spec de refresh exitoso con expiracion controlada
- [pendiente] spec de refresh fallido con token revocado

### Fase 2.2 - Checkout reuse

- [hecho] carga de metodos guardados en checkout
- [hecho] reuso validado de payment method sin recreacion
- [hecho] opcion de crear nuevos datos en checkout
- [en curso] endurecer UI de shipping reuse para que la seleccion sea siempre visible y consistente

### Fase 2.3 - Testing hardening

- [hecho] nuevo spec `checkoutReuse.cy.js`
- [hecho] suite completa sigue en verde
- [pendiente] separar comandos/scripts para `release-gate` y `extended`
- [pendiente] integrar estrategia en CI

## 8. Ejecucion iniciada en esta iteracion

Se comenzo la ejecucion real de Phase 2 con estos cambios ya aplicados:

- backend con `ACCESS_TOKEN_TTL` y `REFRESH_TOKEN_TTL` configurables
- nuevo utilitario `ecommerce-api-Nars/src/utils/duration.js`
- frontend checkout con soporte de reuso de datos guardados
- nuevo spec `ecommerce-app-Nars/cypress/e2e/checkoutReuse.cy.js`
- correccion de `shippingApi.getByUser()` para consultar la ruta real disponible

## 9. Estado actual

- `npx cypress run` -> `16/16` passing
- `npm run build` frontend -> OK
- backend y frontend siguen saludables localmente

## 10. Siguiente paso recomendado

Implementar `test auth tools` solo para entorno `test` o, preferiblemente, agregar `.env.test` con TTL corto para cerrar la brecha de refresh token sin degradar la fidelidad del sistema.
