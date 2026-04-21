# FINAL-CLOSURE-130 - PROYECTO INTEGRADOR

Entra en modo **CIERRE TOTAL PARA PUNTAJE MAXIMO (130/130)**.

Tu objetivo NO es experimentar.
Tu objetivo es **maximizar la calificación final SIN romper el sistema existente**.

---

## CONTEXTO

Proyecto fullstack e-commerce:

* Backend: Node.js + Express + MongoDB
* Frontend: React + Vite
* Integración real (sin mocks en E2E críticos)
* Testing: Vitest + Cypress
* MP-03 y MP-04 ya completados y validados

Estado actual:

* Proyecto FUNCIONA
* Tests pasan
* E2E pasan
* Build pasa
* Pero existen brechas detectadas en auditoría

---

## OBJETIVO

Cerrar TODAS las brechas necesarias para:

👉 obtener el puntaje máximo (130/130)

---

## INSTRUCCIÓN CRÍTICA

Trabaja en **3 fases obligatorias**:

---

# 🔎 FASE 1 — IDENTIFICACIÓN FINAL (NO IMPLEMENTAR)

Revisa la auditoría existente y confirma:

### Brechas críticas reales:

1. CRUD frontend/admin no visible
2. Checkout frontend no usa endpoint especializado `/api/orders/checkout`
3. UX inconsistente en confirmation (texto “simulado”)
4. Validaciones frontend no robustas
5. Testing backend con mocks sobrevendido como integration

---

### Para cada brecha define:

* impacto real en rúbrica
* dificultad de implementación
* riesgo de romper sistema

---

### SALIDA FASE 1

Genera:

* lista priorizada de cambios
* estrategia de implementación segura
* orden exacto de ejecución

NO implementes aún.

---

# 🧠 FASE 2 — PLAN DETALLADO

Define exactamente:

### 1) CRUD ADMIN (mínimo viable pero visible)

* qué vistas crear
* qué endpoints usar
* qué operaciones incluir (create/edit/delete/list)
* cómo restringir a admin

---

### 2) CHECKOUT CORRECTO

* cómo migrar de:
  POST /api/orders
  → POST /api/orders/checkout

* cómo adaptar payload

* cómo mantener compatibilidad

---

### 3) UX FIXES

* eliminar texto “simulado”
* mejorar feedback visual de confirmación

---

### 4) VALIDACIONES FRONTEND

* qué validar
* cómo hacerlo consistente

---

### 5) TESTING

* qué tests actualizar
* qué nuevos tests agregar
* evitar romper E2E actuales

---

### SALIDA FASE 2

Documento claro con:

* archivos a modificar
* cambios exactos
* riesgos
* checkpoints

---

# ⚙️ FASE 3 — IMPLEMENTACIÓN CONTROLADA

Ejecuta en orden ESTRICTO:

---

## ETAPA 1 — UX QUICK WINS (SIN RIESGO)

* corregir confirmation text
* mejorar feedback visual

VALIDAR:

* npm test
* npm run build

---

## ETAPA 2 — CRUD ADMIN (MVP)

Implementar:

* vista básica admin productos
* listar
* crear
* editar
* eliminar

NO hacer UI compleja.
Solo funcional.

VALIDAR:

* npm test
* build

---

## ETAPA 3 — CHECKOUT CORRECTO

Migrar a:

POST /api/orders/checkout

Manteniendo:

* compatibilidad con lógica actual
* fallback si necesario

VALIDAR:

* checkout completo
* E2E

---

## ETAPA 4 — VALIDACIONES FRONTEND

Agregar:

* validaciones en forms clave
* mensajes claros

VALIDAR:

* tests
* UX

---

## ETAPA 5 — TESTING FINAL

Actualizar:

* E2E si aplica
* unit/component

Ejecutar:

* auth.cy.js
* cart.cy.js
* checkoutReuse.cy.js
* productAccess.cy.js

TODO debe quedar verde.

---

## ETAPA 6 — BUILD FINAL

* npm run build

---

# 📄 DOCUMENTACIÓN FINAL

Generar:

docs/FINAL_CLOSURE_130-YYYY-MM-DD-HHMM.md

Debe incluir:

1. Resumen ejecutivo
2. Cambios realizados
3. Brechas cerradas
4. Evidencia real (tests/build/E2E)
5. Impacto en rúbrica
6. Riesgos mitigados
7. Decisión final
7. Todo lo que plasmes en la terminal al finalizar debe también estar al final de este archivo


---

# 🚨 REGLAS ABSOLUTAS

* NO romper funcionalidad existente
* NO hacer refactors innecesarios
* NO cambiar backend salvo estrictamente necesario
* NO introducir nuevas dependencias grandes
* TODO debe validarse con evidencia real

---

# 🎯 CRITERIO DE ÉXITO

El proyecto debe:

* cubrir TODOS los rubros de la rúbrica
* tener CRUD visible
* usar correctamente checkout backend
* mantener integración real
* tener UX consistente
* pasar todos los tests
* pasar todos los E2E

---

# INSTRUCCIÓN FINAL

Ejecuta FASE 1 → FASE 2 → FASE 3 en orden.

No saltes pasos.
No improvises.
No optimices fuera de alcance.

Detente completamente al terminar.
