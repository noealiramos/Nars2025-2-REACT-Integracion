# Reporte de Corrección de Defectos: Flujo de Autenticación (API Real)

## 1. Resumen Ejecutivo
Se identificaron defectos estructurales durante el ciclo de pruebas E2E (Fase 1) en la integración React-Express. Los defectos consistían principalmente en un desajuste del contrato de la API en relación con la entidad Usuario, causando un rechazo al crear cuenta (HTTP 422) y una lectura indefinida de los nombres tras un inicio de sesión exitoso.

Este reporte documenta las modificaciones realizadas directamente en los componentes de la interfaz de usuario (UI), asegurando una integración completa y en tiempo real contra el Backend. No hay stubs ni simulaciones temporales activos para este flujo.

## 2. Hallazgos Originales (Bugs Detectados)

- **AUTH-BUG-001 (Register Payload Mismatch):** El registro fallaba porque el frontend enviaba `{ name }` desde el state de *RegisterPage*, pero el esquema de validación en `authRoutes.js` (Express) imponía la presencia de `{ displayName }`.
- **AUTH-BUG-002 (Header Desync):** El renderizado del nombre del usuario fallaba porque los componentes de la UI como el *SiteHeader* y páginas de finalización de compra asumían que la propiedad proveniente de la API se llamaba `.name`, generando vistas rotas o estados de 'undefined'. El backend la registraba y devolvía como `.displayName`.

## 3. Correcciones Aplicadas y Decisiones de Arquitectura

**Decisión Arquitectónica:** Estandarizar el contrato frontend-backend utilizando `displayName` como el estándar y única fuente de la verdad para el nombre del usuario en todos los escenarios.

- En `RegisterPage.jsx`: Se mapeó explícitamente el estado local `name` (o se renombra la propiedad) para ser enviada como `displayName` en la petición de registro hacia el controlador intermedio `authApi.js`.
- En `SiteHeader.jsx`, `CheckoutPage.jsx` y `ConfirmationPage.jsx`: Se actualizó el acceso seguro al objeto de contexto de usuario para depender de `user?.displayName` primordialmente, incluyendo un fallback semántico sólo en los casos que devuelva otra cosa pero respetando la firma de la API provista.

## 4. Archivos Modificados

| Archivo Modificado | Detalles de la Corrección | Motivo / Causa |
| :--- | :--- | :--- |
| `src/pages/RegisterPage.jsx` | Modificado `authApi.register({ name, ... })` a `({ displayName: name, ... })` | Ajuste al contrato estricto del middleware backend (AUTH-BUG-001) |
| `src/components/organisms/SiteHeader.jsx` | Se cambió el render context. `user?.name` -> `user?.displayName` | Resolver fallo "Hola, undefined" y unificar esquema (AUTH-BUG-002) |
| `src/pages/CheckoutPage.jsx` | Formularios auto-llenados: `user?.name` -> `user?.displayName` | Evitar fallos dependientes al autocompletar envío y pago |
| `src/pages/ConfirmationPage.jsx` | Ficha al consumidor: `user.name` -> `user.displayName` | Renderizar ticket y resumen adecuadamente |
| `cypress/e2e/auth.cy.js` | Se re-escribieron las pruebas desde cero para omitir STUBs simulados utilizando `http://127.0.0.1:3000/api/auth` directamente interactuando como el E2E original | Puesto que el error base fue resuelto, la suite funciona al 100% sobre API |

## 5. Riesgos Remanentes y Validación 

- Las pruebas Cypress validan el Golden Path sin interrupciones relacionadas con la cuenta. 
- *Riesgo Menor:* En caso que algún MOCK local (archivos en `/data`) inyécte `name`, se resolvió dejando `user.displayName || user.name` en escenarios sensibles como el ticket de Confirmación.

**Estado Actual:** La Suite `auth.cy.js` corre local y exitosamente frente a Express (4 pruebas, 0 fallos).
