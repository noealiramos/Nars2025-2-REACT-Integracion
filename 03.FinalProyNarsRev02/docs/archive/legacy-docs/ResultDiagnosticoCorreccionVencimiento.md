## Fase 1 - Diagnostico

### Comandos ejecutados

1. `npm test -- --run src/pages/__tests__/CheckoutPage.test.jsx` en `ecommerce-app-Nars`
   - Resultado: `1 passed`, `6 passed`.
2. `npm test -- tests/unit/controllers/paymentMethodController.test.js` en `ecommerce-api-Nars`
   - Resultado: `1 passed`, `12 passed`.

### Evidencia revisada

- Frontend checkout: `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:241`, `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:281`, `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:506`.
- API frontend: `ecommerce-app-Nars/src/api/paymentApi.js:8`.
- Backend validacion de ruta: `ecommerce-api-Nars/src/routes/paymentMethodRoutes.js:29`.
- Backend modelo: `ecommerce-api-Nars/src/models/paymentMethod.js:28`.
- Tests actuales frontend: `ecommerce-app-Nars/src/pages/__tests__/CheckoutPage.test.jsx:1`.
- E2E existentes con formato valido: `ecommerce-app-Nars/cypress/support/commands.js:115`, `ecommerce-app-Nars/cypress/e2e/checkoutReuse.cy.js:50`.

### Flujo exacto identificado

1. El input de vencimiento en checkout usa un `onChange` directo: `setCardExpiry(e.target.value)` en `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:509`.
2. No existe mascara, `maxLength`, `pattern`, `inputMode`, normalizacion ni sanitizacion para ese campo en `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:505`.
3. Al enviar, checkout manda el valor del estado sin transformar: `expiryDate: cardExpiry` en `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:281`.
4. El API frontend reenvia ese payload sin cambios en `ecommerce-app-Nars/src/api/paymentApi.js:8`.
5. El backend valida `expiryDate` con regex estricta `MM/YY` en `ecommerce-api-Nars/src/routes/paymentMethodRoutes.js:38` y nuevamente en el modelo `ecommerce-api-Nars/src/models/paymentMethod.js:33`.
6. Si el valor no coincide exactamente, la ruta responde con `expiryDate must be in MM/YY format` y checkout muestra ese mensaje remoto mediante `getCheckoutErrorMessage` en `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:20`.

### Causa raiz

La causa principal es una discrepancia de contrato no protegida por el frontend: el checkout no normaliza ni valida localmente `expiryDate`, pero el backend si exige estrictamente `MM/YY`.

En el estado y en el payload se conserva exactamente lo que capture el usuario. Si el usuario introduce `1226` u otra variante no canonica, el frontend la envia tal cual y el backend la rechaza. El sistema no falla por una transformacion oculta previa al submit; falla porque no existe ninguna transformacion para alinear la entrada con el contrato del backend.

### Verificacion de hipotesis pedidas

- `el frontend muestra un valor pero envia otro distinto`: no hay evidencia en el repo de una transformacion que cambie el valor entre input y payload; el valor enviado es el mismo estado (`cardExpiry`).
- `el input elimina o no inserta el /`: confirmado parcialmente. No inserta `/` automaticamente y no corrige nada.
- `el estado guarda 1226 en vez de 12/26`: confirmado si el usuario captura `1226`, porque `setCardExpiry` guarda el valor crudo.
- `el backend espera MM/YY pero el frontend manda MMYY`: confirmado como escenario posible y hoy no se corrige en frontend.
- `hay doble validacion inconsistente entre frontend y backend`: confirmado. Frontend solo valida vacio; backend valida formato estricto.
- `existe una transformacion previa al submit que rompe el formato`: descartado con evidencia del flujo actual.
- `el campo del input tiene maxLength, regex, formatter o parser defectuoso`: descartado; no tiene ninguno.
- `el error viene del backend pero se refleja mal en frontend`: parcialmente descartado. El mensaje si viene del backend, y checkout lo muestra como error general; no hay error de mapeo, pero tampoco hay ayuda local especifica antes del submit.
- `la tarjeta de prueba esta bien, pero el formato no pasa por una discrepancia de contrato`: confirmado.

### Observaciones adicionales

- Los E2E existentes usan siempre valores ya canonicos como `12/29`, por eso no detectan el bug.
- Con la evidencia del repo, un valor exactamente `12/26` deberia pasar hoy. No encontre codigo que convierta `12/26` en otro formato. Lo que si esta roto es el caso de entrada numerica o no canonica que la UI permite capturar sin corregirla.

## Fase 2 - Plan de correccion propuesto

### Archivos candidatos

- `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`
- `ecommerce-app-Nars/src/utils/paymentExpiry.js` (nuevo)
- `ecommerce-app-Nars/src/pages/__tests__/CheckoutPage.test.jsx`
- `ecommerce-app-Nars/src/utils/__tests__/paymentExpiry.test.js` (nuevo)
- `ecommerce-api-Nars/src/routes/paymentMethodRoutes.js`
- `ecommerce-api-Nars/src/models/paymentMethod.js`
- `ecommerce-api-Nars/src/utils/paymentExpiry.js` (nuevo)
- `ecommerce-api-Nars/tests/unit/utils/paymentExpiry.test.js` (nuevo)

### Correccion minima y segura

- Frontend: normalizar el input para que `1226` se convierta a `12/26`, limitar el campo al formato esperado y bloquear submit con mensaje claro cuando no cumpla `MM/YY`.
- Backend: reutilizar una utilidad central para normalizar y validar `expiryDate`, aceptando `MM/YY` como formato canonico almacenado y aceptando `MMYY` solo para normalizarlo antes de validar.
- Contrato final: backend persiste y responde siempre `MM/YY`; frontend envia siempre `MM/YY`.
- Pruebas: agregar cobertura para `12/26`, `01/30`, `1226`, `1/26`, `13/26`, `00/26`, vacio y submit exitoso.
- Riesgo principal: afectar reuse de metodos de pago guardados o validaciones del checkout; se mitiga manteniendo el formato canonico y sin tocar ordenes ni estilos.
