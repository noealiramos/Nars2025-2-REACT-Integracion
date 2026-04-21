# CYPRESS-STABILIZATION-FINAL - VERDE TOTAL E2E

Entra en modo **ESTABILIZACION FINAL DE CYPRESS**.

Tu objetivo es dejar en verde los specs E2E que hoy estan fallando por fragilidad de test, **sin tocar backend y sin cambiar logica funcional del producto**.

---

## CONTEXTO REAL

La corrida real completa de Cypress mostro este patron:

### Specs en verde

* `auth.cy.js`
* `cart.cy.js`
* `checkoutErrors.cy.js`
* `loginErrors.cy.js`
* `orders.cy.js`
* `productAccess.cy.js`
* `profile.cy.js`

### Specs fallando

* `authLifecycle.cy.js`
* `checkoutReuse.cy.js`
* `criticalClosure.cy.js`
* `goldenPath.cy.js`

### Causas observadas

1. **Seleccion fragil de producto**

   * varios specs intentan hacer click en un producto agotado
   * evidencia real:

     * boton deshabilitado
     * texto `Agotado`
     * error en `cy.click()` sobre CTA disabled

2. **Asercion demasiado rigida en authLifecycle**

   * el spec esperaba `200`
   * la corrida real observo `304`
   * eso apunta a fragilidad de assertion, no necesariamente a bug funcional

---

## OBJETIVO EXACTO

Corregir SOLO la robustez de estos 4 specs:

* `cypress/e2e/authLifecycle.cy.js`
* `cypress/e2e/checkoutReuse.cy.js`
* `cypress/e2e/criticalClosure.cy.js`
* `cypress/e2e/goldenPath.cy.js`

Sin tocar:

* backend
* contratos de API
* logica de negocio del frontend
* reglas UX de stock/auth ya implementadas
* MP-03, MP-04 o features ya cerradas

---

## REGLAS ABSOLUTAS

1. **NO tocar backend**
2. **NO relajar seguridad**
3. **NO usar `{ force: true }` para saltarte botones deshabilitados**
4. **NO volver a permitir agregar productos agotados**
5. **NO hardcodear un producto especifico si no es estrictamente necesario**
6. **NO romper specs que ya estan en verde**
7. **Generar UN SOLO documento final**

   * `docs/CYPRESS_STABILIZATION_FINAL-YYYY-MM-DD-HHMM.md`

---

## ESTRATEGIA OBLIGATORIA

### A. Robustecer seleccion de producto

En los specs que agregan productos al carrito:

* NO seleccionar ciegamente el primer producto
* NO depender de un ID fijo si eso hoy apunta a producto agotado
* seleccionar dinamicamente un producto realmente agregable

Criterio obligatorio:

* elegir una card o detalle cuyo CTA:

  * exista
  * este visible
  * **NO** este disabled
  * **NO** muestre `Agotado`

Usa los selectores reales ya disponibles (`data-cy`, `data-testid`, etc.) y haz la minima correccion posible.

Si necesitas reutilizar logica comun:

* puedes endurecer helpers en `cypress/support/commands.js`
* pero solo si eso reduce fragilidad sin ampliar alcance

---

### B. Robustecer `authLifecycle.cy.js`

Revisar la asercion del flujo de renovacion automatica.

Si el comportamiento correcto del sistema hoy acepta `200` o `304`:

* ajustar el spec para validar lo real y estable

NO maquilles el test.
NO borres la verificacion importante.
Solo corrige la asercion para que refleje el comportamiento real del sistema.

---

## ALCANCE PERMITIDO

Puedes modificar solo lo estrictamente necesario en:

* `cypress/e2e/authLifecycle.cy.js`
* `cypress/e2e/checkoutReuse.cy.js`
* `cypress/e2e/criticalClosure.cy.js`
* `cypress/e2e/goldenPath.cy.js`
* `cypress/support/commands.js` (solo si ayuda a robustecer la seleccion de producto)

---

## PLAN DE EJECUCION OBLIGATORIO

### Etapa 1 - Analisis puntual

Para cada spec fallando:

* identifica linea o bloque fragil
* explica causa raiz real
* define cambio minimo

### Etapa 2 - Implementacion minima

Aplicar cambios solo de robustez:

* seleccion dinamica de producto disponible
* assertion estable en authLifecycle

### Etapa 3 - Validacion focal

Ejecutar individualmente:

* `npx cypress run --spec "cypress/e2e/authLifecycle.cy.js"`
* `npx cypress run --spec "cypress/e2e/checkoutReuse.cy.js"`
* `npx cypress run --spec "cypress/e2e/criticalClosure.cy.js"`
* `npx cypress run --spec "cypress/e2e/goldenPath.cy.js"`

### Etapa 4 - Validacion completa Cypress

Despues ejecutar:

* `npx cypress run`

### Etapa 5 - Validacion frontend complementaria

Despues ejecutar:

* `npm test`
* `npm run build`

---

## DOCUMENTACION FINAL OBLIGATORIA

Generar un solo archivo:

* `docs/CYPRESS_STABILIZATION_FINAL-YYYY-MM-DD-HHMM.md`

Debe incluir exactamente estas secciones:

1. Resumen ejecutivo
2. Specs fallando originalmente
3. Causa raiz por spec
4. Cambios aplicados
5. Archivos modificados
6. Validacion focal
7. Validacion completa Cypress
8. Validacion frontend (tests/build)
9. Riesgos y mitigaciones
10. Decision final
11. Evidencia REAL de terminal

---

## CRITERIO DE EXITO

Solo declarar exito final si:

* los 4 specs originalmente fallando quedan verdes
* la corrida completa `npx cypress run` queda verde
* `npm test` sigue verde
* `npm run build` sigue verde
* no se uso `force: true`
* no se rompio la regla de productos agotados

---

## INSTRUCCION FINAL

Ejecuta exactamente este plan.

No improvises.
No amplíes alcance.
No cambies backend.
No parchees con hacks.

Detente completamente al terminar.
