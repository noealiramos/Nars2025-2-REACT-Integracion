Actúa como evaluador técnico senior + auditor académico de proyecto full stack (nivel bootcamp / ingeniería), con experiencia en rúbricas de evaluación de ecommerce (backend + frontend + seguridad + QA).

CONTEXTO:
Proyecto full stack:
- Backend: ecommerce-api-Nars (Node.js + Express + MongoDB)
- Frontend: ecommerce-app-Nars (React + Vite)

El proyecto ya pasó un SMOKE TEST funcional completo (login, productos, carrito, checkout, órdenes OK).

OBJETIVO:
Realizar una auditoría completa del proyecto CONTRA UNA RÚBRICA ACADÉMICA REALISTA para ecommerce full stack, identificando:
- cumplimiento
- gaps
- riesgos
- oportunidades de mejora
ANTES de despliegue y presentación.

IMPORTANTE:
1. NO modificar código en esta fase
2. NO asumir, TODO debe inferirse con evidencia
3. NO sobreingeniería, evaluar como profesor real
4. TODO lo de terminal debe incluirse en el documento
5. Documento con fecha y hora obligatorio
6. Evaluar tanto backend como frontend
7. Priorizar impacto en calificación final

---

## CRITERIOS DE EVALUACIÓN (BASE RÚBRICA)

Evalúa cada punto con:
- Estado: (Cumple / Parcial / No cumple)
- Evidencia
- Riesgo
- Recomendación concreta

### 1. ARQUITECTURA Y ESTRUCTURA
- Organización del proyecto (frontend/backend)
- Separación de responsabilidades
- Uso de capas (routes, controllers, services, models)
- Modularidad

---

### 2. BACKEND — API
- CRUD completo (usuarios, productos, órdenes, etc.)
- Manejo correcto de status codes
- Validaciones (express-validator u otros)
- Manejo de errores
- Paginación (muy importante)
- Filtros / búsqueda

---

### 3. AUTENTICACIÓN Y SEGURIDAD
- JWT (access + refresh)
- Manejo de expiración
- Protección de rutas
- Sanitización (NoSQL injection)
- Rate limiting
- CORS
- Buen manejo de roles

---

### 4. FRONTEND
- Consumo correcto de API
- Manejo de estados (loading, error)
- Navegación (React Router)
- UX básica
- Formularios funcionales
- Manejo de errores visible

---

### 5. INTEGRACIÓN FRONT-BACK
- Flujo real sin mocks
- Consistencia de datos
- Manejo de errores API
- Sin hardcodes indebidos

---

### 6. FUNCIONALIDAD DE NEGOCIO (CRÍTICO)
- Catálogo de productos
- Carrito
- Checkout
- Creación de orden
- Visualización de órdenes

---

### 7. TESTING / QA
- Pruebas unitarias (si existen)
- Cypress / E2E
- Cobertura funcional real
- Golden path funcional

---

### 8. DOCUMENTACIÓN
- README claro
- Instrucciones de instalación
- Descripción del proyecto
- Endpoints documentados
- Evidencia de pruebas

---

### 9. DESPLIEGUE (PREPARACIÓN)
- Variables de entorno
- Configuración para producción
- CORS listo
- URLs configurables

---

## TAREAS

1. Analiza estructura del proyecto
2. Revisa código clave (backend + frontend)
3. Revisa pruebas existentes
4. Verifica documentación actual
5. Evalúa cada criterio de la rúbrica
6. Identifica:
   - puntos fuertes
   - debilidades
   - riesgos de demo
   - gaps críticos

---

## ENTREGABLE OBLIGATORIO

Generar documento:

docs/audit/YYYY-MM-DD-HHMM-auditoria-rubrica-ecommerce.md

Debe incluir:

### 1. Resumen ejecutivo (MUY IMPORTANTE)
- nivel estimado del proyecto (ej. 85/100)
- estado general
- listo o no para presentación

### 2. Evaluación por criterio (tabla clara)
- criterio
- estado
- evidencia
- riesgo

### 3. Hallazgos críticos
- lo que puede bajar puntos

### 4. Hallazgos menores
- mejoras recomendadas

### 5. Riesgos para demo
- posibles fallos en vivo

### 6. Plan de acción priorizado
- TOP 5 cosas a corregir antes de presentar

### 7. Evidencia técnica
- comandos ejecutados
- outputs relevantes
- archivos revisados

---

## FORMATO DE RESPUESTA EN CHAT

Quiero que me compartas:

A) Resumen ejecutivo corto  
B) Score estimado del proyecto  
C) TOP 5 riesgos  
D) Recomendación: listo / listo con ajustes / no listo  

---

NO IMPLEMENTAR CAMBIOS.
SOLO AUDITAR Y EVALUAR COMO PROFESOR.