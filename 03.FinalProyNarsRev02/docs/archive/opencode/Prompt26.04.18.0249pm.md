Actúa como Senior Full-Stack Engineer + Arquitecto de dominio + Auditor financiero de e-commerce.

CONTEXTO:
Proyecto ecommerce full-stack:
- Frontend: React (Vite)
- Backend: Node.js + Express + MongoDB
- Estado actual:
  - Se corrigió inconsistencia de totales
  - Backend ahora es la única fuente de verdad
  - Se persisten: subtotal, taxAmount, shippingCost, totalPrice
  - Actualmente taxAmount = 0
  - El frontend SOLO muestra IVA si taxAmount > 0

SITUACIÓN ACTUAL:
- Antes existía IVA en frontend (subtotal * 0.16), pero fue eliminado porque no venía del backend.
- Ahora el sistema NO muestra IVA en ninguna pantalla.
- El comportamiento actual es consistente pero incompleto desde el punto de vista fiscal.

OBJETIVO:
1. Evaluar si el sistema DEBE manejar IVA actualmente (modo negocio tipo Mercado Libre simplificado).
2. En caso afirmativo:
   - Implementar cálculo de IVA REAL en backend
   - Persistirlo correctamente en la orden
   - Exponerlo en API
   - Mostrarlo en frontend sin romper consistencia

3. En caso negativo:
   - Confirmar que el sistema está correcto sin IVA
   - Documentar por qué no se implementa aún

REGLAS IMPORTANTES:
- Backend SIEMPRE es la única fuente de verdad
- Frontend NO debe recalcular IVA
- No usar mocks
- No duplicar lógica financiera
- Mantener compatibilidad con órdenes existentes (legacy)

FASE 1: ANÁLISIS DE NEGOCIO
- Determinar:
  - ¿El ecommerce requiere IVA en esta fase?
  - ¿Se busca simulación simple (tipo marketplace)?
  - ¿Se requiere desglose fiscal real?

- Concluir:
  - Opción A: Sin IVA (modo simple)
  - Opción B: Con IVA real (16%)

FASE 2: SI SE IMPLEMENTA IVA (Opción B)

BACKEND:

1. Modificar lógica en:
   - orderController.js

2. Implementar:
   subtotal = sum(items)
   taxAmount = subtotal * 0.16
   totalPrice = subtotal + taxAmount + shippingCost

3. Asegurar:
   - Redondeo correcto (2 decimales)
   - No errores de floating point

4. Persistir en Order:
   - subtotal
   - taxAmount
   - shippingCost
   - totalPrice

5. Ajustar:
   - createOrder
   - checkoutFromCart
   - updateOrder

6. Actualizar función:
   - enrichOrderTotals(...) para órdenes legacy

FASE 3: FRONTEND

1. Revisar:
   - CartSummary.jsx
   - CheckoutPage.jsx
   - ConfirmationPage.jsx
   - OrderDetailPage.jsx

2. Mostrar:
   - Subtotal
   - IVA (solo si taxAmount > 0)
   - Envío
   - Total

3. Eliminar cualquier cálculo local de IVA

FASE 4: COMPATIBILIDAD

- Para órdenes antiguas:
  - Si no tienen taxAmount → asumir 0
  - No recalcular retroactivamente

FASE 5: VALIDACIÓN

- Crear nueva orden
- Verificar:
   subtotal + IVA + envío = total
- Revisar en:
   - DB
   - API
   - UI

FASE 6: TESTS

- Ajustar tests existentes
- Agregar test para:
   - cálculo correcto de IVA
   - consistencia total

FASE 7: DOCUMENTACIÓN

Crear archivo:
docs/specs/[fecha]-feature-iva-support.md

Debe incluir:
- Decisión (con o sin IVA)
- Justificación de negocio
- Implementación técnica
- Impacto en backend y frontend
- Ejemplos de cálculo
- Evidencia (terminal, DB, UI)

IMPORTANTE:
Incluir TODO lo que se imprima en terminal durante el proceso.

SALIDA ESPERADA:
1. Decisión clara (con o sin IVA)
2. Código implementado (si aplica)
3. Evidencia funcional
4. Confirmación de consistencia total