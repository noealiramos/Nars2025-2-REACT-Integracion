Actúa como Senior Full-Stack Engineer (React + Node + MongoDB) bajo un enfoque SSDLC estricto.

CONTEXTO:
Proyecto ecommerce monorepo:
- Frontend: React (Vite)
- Backend: Express + MongoDB
- Módulo: Admin → Categorías
- URL actual: /admin/categories
- Actualmente NO hay paginación funcional en este módulo

OBJETIVO:
Implementar paginación en "Admin categorías" SIN romper nada existente, siguiendo proceso controlado:
1) Revisar
2) Diagnosticar
3) Diseñar plan
4) Validar plan (NO ejecutar aún)
5) Ejecutar SOLO tras aprobación

REGLAS CRÍTICAS:
- NO modificar código en fase de análisis
- NO asumir que la paginación existente funciona
- NO romper:
  * CRUD de categorías
  * navegación admin
  * estilos actuales
- Mantener compatibilidad con backend actual
- Si backend no soporta paginación, proponer solución segura

----------------------------------------
FASE 1: REVISIÓN Y DIAGNÓSTICO
----------------------------------------
Analiza:

FRONTEND:
- Componente de listado de categorías
- Manejo actual de estado (useState, useEffect)
- Consumo de API (axios/fetch)
- Si existe lógica de paginación parcial o muerta
- Renderizado de lista (map)

BACKEND:
- Endpoint GET /categories
- ¿Soporta query params? (page, limit)
- ¿Hay paginación implementada en otros módulos (ej. productos)?
- Estructura de respuesta (total, pages, etc.)

OUTPUT OBLIGATORIO:
- Diagnóstico claro:
  ✔ Qué existe
  ❌ Qué falta
  ⚠ Riesgos

----------------------------------------
FASE 2: DISEÑO DEL PLAN
----------------------------------------
Genera un plan DETALLADO dividido en:

1. Backend (si aplica)
   - Agregar query params: page, limit
   - Uso de skip/limit en Mongo
   - Respuesta estándar:
     {
       data,
       total,
       page,
       totalPages
     }

2. Frontend
   - Estados nuevos:
     page, totalPages, loading
   - Llamada API con parámetros
   - Componente de paginación:
     * botones (prev/next)
     * numeración opcional
   - Manejo de edge cases:
     * sin datos
     * última página
     * loading

3. UI/UX
   - Ubicación de controles
   - No romper layout actual
   - Mantener estilo existente

4. Riesgos y mitigación

----------------------------------------
IMPORTANTE:
----------------------------------------
- NO ejecutes nada aún
- NO generes código todavía
- SOLO entrega el PLAN

----------------------------------------
FASE 3: VALIDACIÓN
----------------------------------------
Incluye sección:

"CHECKLIST DE SEGURIDAD"
- ¿Se rompe algo existente?
- ¿Afecta otros módulos?
- ¿Requiere cambios en tests?
- ¿Impacta Cypress?

----------------------------------------
FASE 4: FORMATO DE SALIDA (OBLIGATORIO)
----------------------------------------
Genera un documento con:

- Fecha y hora (formato: YYYY-MM-DD HH:mm)
- Secciones claras:
  1. Diagnóstico
  2. Plan
  3. Riesgos
  4. Checklist
- Incluir TODO lo que aparezca en la terminal
- No omitir logs

----------------------------------------
IMPORTANTE FINAL:
----------------------------------------
No ejecutar hasta que el usuario diga explícitamente:

"APROBADO – EJECUTAR PLAN"