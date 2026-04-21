Actúa como Senior Full-Stack Engineer + QA + revisor de consistencia UX/financiera.

CONTEXTO:
Proyecto ecommerce full-stack:
- Frontend: React (Vite)
- Backend: Node.js + Express + MongoDB
- Estado actual:
  - Se implementó soporte técnico para `taxAmount` / IVA en backend
  - Pero la decisión de producto final es NO mostrar IVA al usuario
  - El ecommerce debe sentirse más tipo marketplace simple
  - Debe mantenerse consistencia total entre carrito, confirmación y detalle de orden

PROBLEMA ACTUAL:
- Aún aparece "IVA" en algunas pantallas, al menos en `ConfirmationPage`
- Esto contradice la decisión actual del producto
- No queremos romper la lógica financiera ni reabrir bugs de total inconsistente

OBJETIVO:
Eliminar el IVA del flujo VISIBLE para el usuario, manteniendo consistencia en UI y evitando cambios riesgosos o innecesarios en backend.

DECISIÓN DE NEGOCIO A RESPETAR:
- El usuario final NO debe ver una línea de IVA
- El resumen visible debe mostrar solamente:
  - Subtotal
  - Envío
  - Total
- La experiencia debe ser consistente en:
  - carrito
  - checkout/confirmación
  - detalle de orden
  - cualquier resumen visible relacionado con compra

REGLAS IMPORTANTES:
- NO hacer refactor amplio
- NO romper órdenes legacy
- NO cambiar contratos de API salvo que sea indispensable
- NO introducir nuevos cálculos en frontend
- NO duplicar lógica financiera
- Mantener backend como única fuente de verdad
- En esta fase, priorizar cambio mínimo, seguro y reversible

ALCANCE ESPERADO:
1. Auditar dónde se sigue mostrando `taxAmount` / "IVA" en frontend
2. Eliminar la visualización del IVA en todas las pantallas visibles al usuario
3. Asegurar que el total visible siga siendo correcto y consistente
4. Confirmar si backend puede quedarse como está, aunque ya soporte `taxAmount`
5. Solo si es estrictamente necesario, ajustar backend; de preferencia NO tocarlo

FASE 1: AUDITORÍA
Revisar al menos:
- `ecommerce-app-Nars/src/components/organisms/CartSummary.jsx`
- `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`
- `ecommerce-app-Nars/src/pages/ConfirmationPage.jsx`
- `ecommerce-app-Nars/src/pages/OrderDetailPage.jsx`
- cualquier componente auxiliar de resumen de compra

Identificar:
- dónde se renderiza "IVA"
- dónde se usa `taxAmount`
- si hay textos, labels, bloques condicionales o tests ligados a IVA

FASE 2: CORRECCIÓN FRONTEND
Aplicar cambio mínimo para que el usuario NO vea IVA:
- quitar la línea visual "IVA"
- mantener visibles solo:
  - Subtotal
  - Envío
  - Total
- si el componente usa `taxAmount`, evaluar si basta con no renderizarlo
- evitar recalcular totales localmente

IMPORTANTE:
- Si el backend hoy manda `totalPrice` incluyendo `taxAmount`, NO inventar nuevas fórmulas en frontend.
- Validar cuidadosamente si hace falta:
  A) ocultar solo la línea IVA
  o
  B) además ajustar backend para que el total final ya no incluya impuesto

PRIMERO DIAGNOSTICA y luego ejecuta la opción correcta.

CRITERIO DE DECISIÓN:
- Si el total actual mostrado al usuario incluye IVA pero ya no queremos cobrar/mostrar IVA, entonces sí hay que ajustar backend y flujo de creación de orden.
- Si el IVA ya no forma parte del total real y solo se está mostrando visualmente, entonces basta con limpiar frontend.

NO SUPONGAS. VERIFICA EN CÓDIGO Y EN DATOS.

FASE 3: VALIDACIÓN
Validar visual y funcionalmente:
- carrito
- confirmación
- detalle de orden

Confirmar que:
- no aparece la palabra "IVA"
- los totales siguen siendo coherentes
- no hay discrepancias entre suma visible y total mostrado

FASE 4: TESTS
Actualizar o corregir tests afectados:
- tests de páginas/resúmenes
- tests de texto/UI
- solo tocar los necesarios por este cambio

Correr al menos:
- frontend tests relacionados
- build frontend

Si hay tests backend afectados, documentarlo claramente.

FASE 5: DOCUMENTACIÓN
Crear archivo:
docs/specs/[fecha]-remove-visible-tax-from-purchase-flow.md

Debe incluir:
- problema detectado
- decisión de negocio
- diagnóstico técnico
- archivos modificados
- si se tocó o no backend, y por qué
- evidencia de pruebas
- resultado final

IMPORTANTE:
Documenta también lo que Antigravity muestre en terminal durante el análisis y la corrección.

SALIDA ESPERADA:
1. Diagnóstico claro
2. Cambio mínimo correcto
3. Flujo visible sin IVA
4. Totales consistentes
5. Evidencia de pruebas