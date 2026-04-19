# Checkout Reuse Hardening Spec

## Metadata

- Date: 2026-03-30
- Phase: 2.2
- Status: Drafted before implementation
- Owners: OpenCode / checkout hardening track
- Scope: Backend, frontend, unit/integration tests, Cypress E2E, documentation

## Historia SMART

Como usuario autenticado que ya compro antes, quiero reutilizar una direccion de envio y un metodo de pago guardados al volver al checkout, para completar compras consecutivas con menos friccion y sin recrear datos innecesarios, manteniendo ownership, seguridad y compatibilidad con la orden final.

- Specific: permitir reuse de shipping y payment con fallback a captura nueva
- Measurable: cubrir 4 combinaciones principales en UI/E2E y ownership en backend
- Achievable: reutilizar endpoints y modelos existentes con cambios minimos
- Relevant: reduce friccion del checkout sin romper el happy path actual
- Time-bound: dejar fase lista para validacion en esta iteracion de Phase 2

## Contexto actual

- El backend ya expone `GET /api/shipping-addresses` para listar direcciones del usuario autenticado.
- El backend ya expone `GET /api/payment-methods/user/:userId` con `ownerOrAdmin` para listar metodos de pago del usuario.
- `POST /api/orders` ya valida ownership de `shippingAddress` y `paymentMethod` antes de crear la orden.
- `CheckoutPage` ya contiene una primera iteracion de reuse con modos `existing` y `new` para shipping y payment.
- El frontend cachea direcciones y metodos en `localStorage` por usuario para reducir friccion entre compras.
- Existe un E2E `ecommerce-app-Nars/cypress/e2e/checkoutReuse.cy.js` que valida reuse basico sin recreacion.

## Problema actual

- La fase 2.2 ya esta iniciada pero no esta cerrada de forma robusta ni documentada como spec-first.
- `ecommerce-app-Nars/src/services/shippingService.js` usa `userId` no definido, por lo que la carga remota de direcciones falla y hoy depende solo del cache local.
- `CheckoutPage` no comunica al usuario un error especifico cuando falla la carga de datos reutilizables; solo registra en logger.
- La cobertura actual del frontend es minima y no valida reuse/fallback/orden final.
- La suite E2E actual cubre solo un escenario principal y no las 4 combinaciones pedidas para shipping/payment existente o nuevo.
- La documentacion de progreso para Phase 2.2 aun no existe en la ruta solicitada y la ruta mencionada en el prompt contiene un typo (`Phase2.2_PROGRESS.md.md`).

## Objetivo

Cerrar la iteracion de hardening de checkout para que el usuario autenticado pueda reutilizar datos previos de envio y pago de manera clara, segura y consistente, con fallback a nuevos datos, sin romper el flujo actual de creacion de orden ni las pantallas de confirmacion e historial.

## Alcance

- Corregir la carga de direcciones/metodos guardados en checkout.
- Mantener y endurecer el selector entre recurso existente y captura nueva.
- Usar los contratos backend ya existentes siempre que cubran el caso real.
- Conservar la creacion incremental de nuevos recursos cuando el usuario elija ingresar datos nuevos.
- Validar ownership y no exposicion de campos sensibles.
- Ampliar pruebas unitarias, frontend y E2E para reuse y fallback.
- Actualizar documentacion de fase y progreso.

## No alcance

- No redisenar el dominio de ordenes ni el modelo de carrito.
- No agregar edicion o eliminacion inline de direcciones o metodos dentro del checkout.
- No almacenar PAN completo, CVV ni secretos adicionales.
- No cambiar flujos de admin ni de catalogo fuera de impactos directos del checkout.
- No introducir una pasarela de pago real ni tokenizacion PSP en esta fase.

## Requisitos funcionales

### Shipping reuse

- Si el usuario autenticado tiene direcciones previas, el checkout debe mostrarlas para seleccion.
- Debe existir una opcion explicita para capturar una direccion nueva.
- Si se reutiliza una direccion existente, no debe crearse un nuevo registro de shipping.
- Si se crea una direccion nueva, debe persistirse y poder usarse para la orden actual.
- Si no hay direcciones previas, el formulario debe comportarse como hoy.

### Payment reuse

- Si el usuario autenticado tiene metodos previos activos, el checkout debe mostrarlos para seleccion.
- Debe existir una opcion explicita para capturar un metodo nuevo.
- Si se reutiliza un metodo existente, no debe crearse un nuevo registro de payment.
- Si se crea un metodo nuevo, debe persistirse y poder usarse para la orden actual.
- La UI solo debe mostrar informacion segura del metodo, por ejemplo marca y `last4`.

### Orden final

- La orden debe seguir enviando IDs validos de `shippingAddress` y `paymentMethod` al backend.
- `ConfirmationPage` y `OrdersPage` deben seguir funcionando con la forma actual de la orden.
- Deben quedar cubiertas las combinaciones: existing/existing, new/existing, existing/new, new/new.

## Requisitos no funcionales

- Mantener compatibilidad con la arquitectura actual y cambios minimos.
- Preservar rendimiento con carga paralela de shipping y payment al entrar al checkout.
- Tolerar estados vacios, latencia y errores sin bloquear el flujo base.
- Mantener consistencia visual con el checkout actual.
- No romper suites ni scripts existentes.

## Consideraciones de seguridad

- Reutilizar ownership backend existente para que un usuario solo vea/use recursos propios.
- No exponer `cardNumber`, `token`, `accountNumber` ni CVV en respuestas del backend.
- Mantener sanitizacion actual de `PaymentMethod` en listados y detalle.
- No confiar en `localStorage` como fuente autoritativa; siempre refrescar desde backend cuando sea posible.
- No permitir que el frontend construya una orden con recursos de otro usuario.

## Riesgos

- Cache local desactualizado puede mostrar datos viejos antes del refresh remoto.
- Un cambio agresivo en contratos puede romper `CheckoutPage`, `ConfirmationPage` o E2E existentes.
- El bug actual en `shippingService` puede ocultar regresiones porque el cache enmascara el fallo.
- Mayor complejidad de UI puede introducir estados inconsistentes al alternar entre `existing` y `new`.
- Tests E2E adicionales pueden volverse fragiles si no se apoyan en helpers reutilizables.

## Decisiones tecnicas

- Decision 1: reutilizar endpoints existentes y no agregar nuevos endpoints en esta fase.
- Decision 2: para shipping, usar `GET /api/shipping-addresses` como contrato canonico del usuario autenticado.
- Decision 3: para payment, mantener `GET /api/payment-methods/user/:userId` porque ya aplica ownership y responde datos sanitizados.
- Decision 4: corregir `shippingService` en lugar de introducir otro adaptador o duplicar rutas.
- Decision 5: mantener en frontend los modos `existing` y `new`, pero endurecer estados `loading`, `error` y `empty`.
- Decision 6: seguir creando nuevos recursos solo cuando el modo seleccionado requiera captura nueva.
- Decision 7: mantener `localStorage` como optimizacion UX no autoritativa, con refresco desde backend y fallback silencioso controlado.

## Estrategia de pruebas

### Backend

- Agregar o ajustar tests unitarios para confirmar listados y ownership vigentes.
- Agregar cobertura de orden con recursos existentes y rechazo por ownership cruzado.
- Validar que metodos inactivos no puedan reutilizarse en orden.

### Frontend

- Ampliar `CheckoutPage.test.jsx` para cubrir:
  - autoseleccion de datos guardados cuando existen
  - cambio a modo `new`
  - creacion de shipping nuevo con payment existente
  - creacion de payment nuevo con shipping existente
  - manejo visible de error/empty/loading

### Cypress E2E

- Cubrir `existing/existing`.
- Cubrir `new/existing`.
- Cubrir `existing/new`.
- Cubrir `new/new`.

## Criterios de aceptacion

- Usuario autenticado puede reutilizar shipping existente.
- Usuario autenticado puede reutilizar payment existente.
- Usuario puede forzar captura de nuevos datos aunque existan guardados.
- No se crean duplicados innecesarios cuando se reutiliza.
- La orden final se crea correctamente en las 4 combinaciones principales.
- No hay fuga de datos de otros usuarios.
- La UI comunica claramente loading, reuse, fallback y errores.
- Tests relevantes quedan implementados y la documentacion queda actualizada.

## Plan de rollback

- Revertir cambios de frontend a captura manual completa si el selector incremental falla.
- Mantener backend sin nuevos endpoints para reducir superficie de rollback.
- Si el cache local causa inconsistencias, desactivar su uso y seguir consumiendo backend en caliente.
- Restaurar suites previas y conservar los nuevos tests como evidencia del gap si la implementacion se pospone.

## Checklist de cierre

- [ ] `shippingService` corregido y validado
- [ ] `CheckoutPage` endurecida para reuse/fallback/loading/error
- [ ] orden final validada en 4 combinaciones
- [ ] tests backend actualizados
- [ ] tests frontend actualizados
- [ ] Cypress E2E ampliado
- [ ] `README` actualizado si aplica
- [ ] progreso de Phase 2.2 documentado
- [ ] riesgos residuales registrados

## Auditoria breve del estado actual

- Backend: los contratos principales ya existen y el ownership critico de orden esta implementado.
- Frontend: la base de reuse ya existe en `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`, por lo que Phase 2.2 es principalmente hardening y cierre.
- Grieta principal: `ecommerce-app-Nars/src/services/shippingService.js` rompe la consulta remota por variable incorrecta.
- Cobertura: backend unitario existe, frontend unitario casi no cubre la funcionalidad y E2E solo cubre un caso principal.
- Documentacion: existe contexto general en `docs/PHASE2_HARDENING_PLAN.md` y `docs/PHASE2_PROGRESS.md`, pero falta el artefacto formal de spec y progreso especifico de Phase 2.2.

## Archivos previstos para implementacion

- `ecommerce-app-Nars/src/services/shippingService.js`
- `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`
- `ecommerce-app-Nars/src/pages/CheckoutPage.css`
- `ecommerce-app-Nars/src/pages/__tests__/CheckoutPage.test.jsx`
- `ecommerce-app-Nars/cypress/e2e/checkoutReuse.cy.js`
- `ecommerce-app-Nars/cypress/support/commands.js`
- `ecommerce-api-Nars/tests/unit/controllers/orderController.test.js`
- `ecommerce-api-Nars/tests/unit/controllers/shippingAddressController.test.js`
- `ecommerce-api-Nars/tests/unit/controllers/paymentMethodController.test.js`
- `docs/PHASE2_PROGRESS.md`
- `docs/Phase2.2_PROGRESS.md` or equivalent agreed project progress file

## Resultado esperado tras implementacion

- El checkout reutiliza datos guardados reales desde backend y cache local sin depender de hacks.
- El usuario entiende cuando usa datos existentes y cuando esta capturando nuevos.
- La orden final mantiene el contrato actual y no rompe confirmacion ni ordenes.
- La fase queda lista para pasar a la siguiente iteracion de Phase 2 con menor deuda funcional.
