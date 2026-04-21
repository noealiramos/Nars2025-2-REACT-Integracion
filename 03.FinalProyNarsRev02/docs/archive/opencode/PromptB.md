OBJETIVO:
Alinear comportamiento entre entorno dev (3000) y test (3001), asegurando consistencia en rutas, respuestas y flujo mínimo de ecommerce.

IMPORTANTE:
- Este prompt NO debe continuar en modo conversacional
- Debe ejecutar validación completa y finalizar con:
  1) reporte markdown con timestamp
  2) siguiente prompt (PROMPT C) listo para ejecutar
- NO hacer preguntas al usuario
- NO esperar confirmación

---

FORMATO DE SALIDA OBLIGATORIO:

# ALIGNMENT REPORT - {YYYY-MM-DD HH:mm:ss}

## 1. Contexto
Descripción breve del objetivo de alineación

## 2. Auditoría comparativa DEV vs TEST
- rutas disponibles
- middlewares activos
- diferencias detectadas

## 3. Inconsistencias encontradas
Lista clara de diferencias entre entornos

## 4. Ajustes aplicados
- cambios realizados
- motivo de cada ajuste

## 5. Validación funcional (smoke)
Flujo validado:
- home → productos
- detalle de producto
- add to cart
- checkout reuse básico

Resultados:
- status de requests
- comportamiento UI/backend

## 6. Estado final
- ALIGNED / NOT ALIGNED

---

## NEXT STEP (AUTO-GENERATED PROMPT C)

SI el estado es ALIGNED:
Generar el siguiente prompt listo para copiar/pegar.

SI el estado es NOT ALIGNED:
Generar un prompt de re-intento enfocado SOLO en resolver inconsistencias detectadas.

---

INSTRUCCIONES:

1. Comparar entorno DEV vs TEST:
   - endpoints disponibles
   - prefijos (/api)
   - responses (status + estructura)

2. Validar endpoints críticos:
   - GET /api/products
   - POST /api/cart
   - POST /api/orders

3. Detectar inconsistencias:
   - rutas faltantes
   - diferencias de respuesta
   - errores 404/500

4. Aplicar ajustes mínimos necesarios:
   - sin romper contratos
   - sin rediseñar arquitectura

5. Ejecutar smoke test:
   - home carga productos
   - navegar a detalle
   - agregar al carrito
   - iniciar checkout reuse

6. Validar:
   - respuestas correctas
   - flujo continuo sin errores

---

RESTRICCIONES:
- no cambiar contratos API
- no introducir mocks
- no rediseñar flujo de negocio

---

OUTPUT:
1) Markdown report
2) Prompt C listo para ejecutar inmediatamente
3) NO texto adicional fuera de estas dos secciones