Actúa como Senior Full-Stack Engineer + QA + Auditor de consistencia financiera.

CONTEXTO:
Proyecto ecommerce full-stack:
- Frontend: React (Vite)
- Backend: Node.js + Express + MongoDB
- Flujo: Checkout → creación de orden → visualización en "Detalle de orden"

PROBLEMA DETECTADO:
En la pantalla de detalle de orden:
- Los precios individuales de los productos NO coinciden con el total pagado.
- Ejemplo:
  Items:
    999.99
    180.00
    95.00
    220.00
  Suma esperada: 1,494.99
  Total mostrado: 1,593.99

=> Hay una diferencia (posible IVA, shipping, o bug de cálculo).

OBJETIVO:
1. Auditar COMPLETAMENTE el flujo de cálculo de precios desde:
   - Cart
   - Checkout
   - Backend (Order creation)
   - Persistencia en DB
   - Render en frontend (Order Detail)

2. Identificar EXACTAMENTE:
   - Dónde se calcula el total
   - Si existe IVA, envío u otro cargo
   - Si ese cargo:
        a) Se está sumando pero no mostrando
        b) Se está calculando incorrectamente
        c) Está duplicado
        d) Está hardcodeado o mal sincronizado

3. Validar consistencia entre:
   - Precio unitario del producto
   - Subtotal
   - Total en backend
   - Total en frontend

4. Confirmar si el backend es la única fuente de verdad (debe serlo).

REGLAS IMPORTANTES:
- NO usar mocks
- NO asumir nada sin verificar código
- TRAZAR el flujo real de datos (console, logs, endpoints)
- Revisar tanto frontend como backend
- Validar contra datos reales en MongoDB

PASOS A EJECUTAR:

FASE 1: BACKEND
- Localizar lógica de creación de órdenes (OrderController / Service)
- Revisar:
   - cálculo de subtotal
   - cálculo de impuestos (IVA?)
   - cálculo de envío
   - total final guardado
- Confirmar qué campos se guardan en DB:
   - items[].price
   - subtotal
   - tax
   - shipping
   - total

FASE 2: BASE DE DATOS
- Consultar una orden real (la del ejemplo si es posible)
- Ver valores almacenados
- Comparar:
   - suma de items vs total guardado

FASE 3: FRONTEND
- Revisar componente de Order Detail
- Validar:
   - qué campo usa para mostrar total
   - si recalcula o sólo muestra lo del backend
   - si falta mostrar desglose (IVA/envío)

FASE 4: DEBUG
- Imprimir en consola:
   - items
   - subtotal
   - total
   - cualquier tax/shipping
- Confirmar origen de la diferencia

FASE 5: PROPUESTA DE SOLUCIÓN
- Ajuste en backend (si aplica)
- Ajuste en frontend (mostrar desglose si existe IVA/envío)
- Garantizar:
   total = suma(items) + extras (explícitos)

FASE 6: FIX
- Implementar corrección
- Mantener principio:
   Backend = única fuente de verdad
- Frontend NO recalcula totales

FASE 7: VALIDACIÓN
- Crear nueva orden
- Verificar:
   suma visual = total
   o
   desglose claro (subtotal + IVA + envío = total)

DOCUMENTACIÓN OBLIGATORIA:
Crear archivo:
docs/specs/[fecha]-bugfix-order-total-consistency.md

Debe incluir:
- Descripción del bug
- Causa raíz
- Flujo de datos (antes)
- Corrección aplicada
- Evidencia (logs, consola, DB)
- Resultado final

IMPORTANTE:
Incluir TODO lo que se imprima en terminal durante el análisis.

SALIDA ESPERADA:
1. Diagnóstico claro
2. Causa raíz exacta
3. Código corregido
4. Evidencia de que el total ahora es consistente