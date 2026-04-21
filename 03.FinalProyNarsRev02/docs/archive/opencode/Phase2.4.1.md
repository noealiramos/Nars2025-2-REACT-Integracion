OBJETIVO:
Corregir la discrepancia en el backend dev donde GET /api/products devuelve 404 en puerto 3000, mientras que en entorno test (3001) funciona correctamente.

IMPORTANTE:
- Este prompt NO debe continuar en modo conversacional
- Debe ejecutar debug completo y finalizar con:
  1) reporte markdown con timestamp
  2) siguiente prompt (PROMPT B) listo para ejecutar
- NO hacer preguntas al usuario
- NO esperar confirmación

---

FORMATO DE SALIDA OBLIGATORIO:

# DEBUG REPORT - {YYYY-MM-DD HH:mm:ss}

## 1. Contexto
Descripción breve del problema detectado

## 2. Auditoría realizada
- archivos revisados
- rutas inspeccionadas
- configuración evaluada

## 3. Causa raíz
Explicación clara del problema

## 4. Fix aplicado
- qué se cambió
- por qué

## 5. Validación
- request probado
- resultado esperado vs real

## 6. Estado final
- FIXED / NOT FIXED

---

## NEXT STEP (AUTO-GENERATED PROMPT B)

SI el estado es FIXED:
Generar el siguiente prompt listo para copiar/pegar.

SI el estado es NOT FIXED:
Generar un prompt de re-intento enfocado SOLO en resolver lo pendiente.

---

INSTRUCCIONES:

1. Auditar backend completo:
   - server.js / app.js
   - rutas /api/products
   - middlewares

2. Revisar diferencias entre:
   - .env
   - .env.local
   - .env.test

3. Validar si hay lógica condicional por entorno

4. Simular GET /api/products

5. Identificar causa raíz

6. Aplicar fix mínimo (sin romper contratos)

7. Validar:
   - GET /api/products?limit=1 → 200

---

RESTRICCIONES:
- no cambiar contratos API
- no rediseñar arquitectura
- no usar mocks

---

OUTPUT:
1) Markdown report
2) Prompt B listo para ejecutar inmediatamente
3) NO texto adicional fuera de estas dos secciones