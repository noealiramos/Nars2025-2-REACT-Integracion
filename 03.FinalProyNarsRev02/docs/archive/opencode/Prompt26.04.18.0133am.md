Actúa como engineer senior full-stack dentro del proyecto integrador de ecommerce, siguiendo estrictamente el manual operativo y las políticas de trabajo ya definidas para este repositorio.

## CONTEXTO DEL PROYECTO
Monorepo local:
D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02

Apps:
- Backend: ecommerce-api-Nars
- Frontend: ecommerce-app-Nars

Stack esperado:
- React + Vite
- Express + MongoDB/Mongoose
- Cypress + Vitest
- Cloudinary

---

# OBJETIVO DE ESTA FASE
Corregir la visualización del IVA en el flujo de compra, manteniendo intacta la lógica actual de cálculo y sin rehacer la arquitectura si no es necesario.

---

# ACLARACIÓN CRÍTICA DEL REQUERIMIENTO

ESTE PUNTO ES MUY IMPORTANTE:

1. El IVA YA se calcula actualmente.
2. El problema principal reportado NO es que el IVA no exista, sino que NO se muestra correctamente en la página final / página donde se procede al cobro o confirmación.
3. En carrito sí se ve IVA.
4. En la página final de confirmación/cobro aparece IVA = 0.00 o no se refleja correctamente como dato visible.
5. NO asumas de inicio que hay que rediseñar todo el modelo de órdenes. Primero audita y confirma dónde se pierde, omite, reconstruye mal o no se renderiza el dato.

---

# ALCANCE
- Corregir IVA visible en checkout/confirmación/flujo final de compra
- Validar consistencia visual entre carrito y confirmación
- Ajustar tests y documentación

---

# FUERA DE ALCANCE (NO TOCAR)
- REQ 5, 6, 9, 10 ya consolidados
- Admin categories
- refactors grandes no necesarios
- rediseño total del modelo de orden sin evidencia
- cambios de backend si el problema resulta ser solo de frontend/renderización
- cualquier cambio no relacionado con IVA visible

---

# POLÍTICAS OBLIGATORIAS
- NO inventar lógica nueva si la actual ya calcula IVA
- NO romper contratos API
- NO cambiar backend si no es indispensable
- NO hacer sobreingeniería
- cambios mínimos, controlados y verificables
- mantener compatibilidad con Cypress
- respetar fases previas ya implementadas
- revisar diff antes de tocar archivos

---

# PASO 0 — CONTROL DE WORKTREE

Ejecutar y documentar:
- git status --short
- git diff --stat

Si hay cambios previos en archivos de carrito, checkout, confirmation, orders o tests:
trabajar sobre ellos sin sobrescribirlos.

---

# FASE 1 — AUDITORÍA OBLIGATORIA ANTES DE CORREGIR

Antes de implementar, audita y documenta con precisión:

## 1. Fuente actual del IVA en carrito
Revisar:
- dónde se calcula
- con qué fórmula
- qué variable se usa
- si solo existe en frontend

## 2. Fuente actual del IVA en confirmación / cobro
Revisar:
- qué dato intenta mostrar la pantalla final
- si usa `order.iva`, `taxAmount`, `subtotal`, inferencia o reconstrucción
- si el backend sí devuelve el dato
- si el frontend lo pierde
- si el dato existe pero no se mapea/renderiza

## 3. Confirmar el problema real
Determinar exactamente cuál de estos casos aplica:

### Caso A
El backend sí envía IVA, pero frontend no lo pinta bien.

### Caso B
El frontend calcula IVA en carrito, pero no lo persiste al crear la orden.

### Caso C
La confirmación reconstruye mal el dato y por eso sale 0.

### Caso D
Hay una mezcla de los anteriores.

NO asumas. Confirmar con evidencia de código.

---

# FASE 2 — IMPLEMENTACIÓN

## REGLA PRINCIPAL
La solución debe ser la MÁS PEQUEÑA y SEGURA posible.

### Si el problema es solo de renderización:
- corregir frontend
- no tocar backend innecesariamente

### Si el problema es de persistencia / payload:
- hacer el ajuste mínimo necesario
- mantener compatibilidad con contrato existente
- documentar claramente el impacto

---

# COMPORTAMIENTO ESPERADO

## Carrito
- debe seguir mostrando subtotal, IVA, envío y total correctamente

## Checkout / Confirmación / página final
- debe mostrar IVA real, no 0.00
- debe coincidir visualmente con el flujo de compra
- el total pagado no debe romperse
- no debe duplicar IVA
- no debe alterar envío
- no debe alterar subtotal de forma incorrecta

---

# ARCHIVOS A REVISAR PRIORITARIAMENTE

Frontend:
- `ecommerce-app-Nars/src/components/organisms/CartSummary.jsx`
- `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`
- `ecommerce-app-Nars/src/pages/ConfirmationPage.jsx`
- `ecommerce-app-Nars/src/constants/orderConstants.js`
- tests relacionados

Backend (solo si la auditoría demuestra que hace falta):
- `ecommerce-api-Nars/src/controllers/orderController.js`
- `ecommerce-api-Nars/src/models/order.js`

También revisar si impacta:
- Orders page
- Order detail page
- cualquier mapper/adaptador de respuesta

---

# DOCUMENTACIÓN (CRÍTICA Y OBLIGATORIA)

## 1. DOCUMENTO PRINCIPAL
Actualizar:
`docs/specs/2026-04-16-ui-fixes-ecommerce.md`

Agregar sección:
`FASE 3 — Corrección de visualización IVA`

## 2. DOCUMENTO DE EJECUCIÓN
Crear archivo:
`docs/specs/ui-fixes-ecommerce_YYYY-MM-DD-HHmm.md`

## 3. CONTENIDO OBLIGATORIO EN AMBOS DOCUMENTOS
Debes incluir TODO esto, sin omitir nada relevante:

- comandos ejecutados
- salida relevante de terminal
- hallazgos de auditoría
- archivos revisados
- archivos modificados
- causa raíz encontrada
- decisión técnica tomada
- riesgos detectados
- validaciones manuales
- resultados de tests

IMPORTANTE:
Tambien debes integrar en la documentación lo relevante que Antigravity muestre en terminal durante el proceso, no solo los comandos. No omitir mensajes importantes, errores, advertencias, resultados parciales ni hallazgos mostrados en consola.

---

# VALIDACIONES MANUALES OBLIGATORIAS

Validar al menos estos escenarios:

1. Carrito:
- subtotal correcto
- IVA correcto
- envío correcto
- total correcto

2. Compra / checkout:
- flujo sigue funcionando
- no se rompe pago/confirmación

3. Confirmación:
- IVA visible y correcto
- no aparece en 0.00 incorrectamente
- total pagado consistente

4. Verificar que no se haya duplicado el IVA en total final.

---

# TESTS OBLIGATORIOS

Ejecutar y documentar:
- npm run test
- npm run build
- npx cypress run

Si el full run falla por algo ajeno al alcance, documentarlo claramente.

---

# CYPRESS / TESTS
Agregar o ajustar pruebas para cubrir al menos:

- que carrito muestra IVA
- que confirmación muestra IVA correcto
- que total final sigue consistente
- que el flujo de compra no se rompe

Si decides no agregar un test, explica exactamente por qué.

---

# FORMA DE RESPUESTA ESPERADA

Quiero que entregues:

1. Resumen ejecutivo
2. Causa raíz real
3. Explicación de por qué en carrito sí se ve y en confirmación no
4. Archivos modificados
5. Evidencia de terminal
6. Tests ejecutados y resultados
7. Estado final

---

# CRITERIO DE CALIDAD

- no romper nada ya consolidado
- no tocar backend si no hace falta
- no reinventar el cálculo del IVA si ya existe
- mostrar correctamente el IVA donde hoy no aparece
- mantener consistencia visual y funcional

---

# IMPORTANTE FINAL

Recuerda:
EL IVA YA SE CALCULA.
El objetivo principal es corregir que se muestre correctamente en la página final / confirmación / cobro.

NO asumas desde el inicio que hay que rediseñar toda la arquitectura.
Primero audita.
Luego corrige con el cambio mínimo necesario.

Ejecuta esta fase ahora.