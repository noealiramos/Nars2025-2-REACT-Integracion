# AUDIT-V-EXTRA-COMPLETE + FINAL-CLOSEOUT — VERIFICACIÓN TOTAL CONTRA RÚBRICA

Entra en modo **AUDITORÍA TÉCNICA PROFUNDA + VERIFICACIÓN REAL + PREPARACIÓN DE CIERRE FINAL**.

NO implementes cambios.
NO corrijas código.
NO hagas refactors.
NO abras nuevas fases.

Tu objetivo es:

1) Auditar TODO el apartado V (extra)
2) Validar estado real del proyecto contra la rúbrica
3) Confirmar si el proyecto está realmente listo para entrega
4) Generar un documento FINAL de auditoría y defensa

---

## CONTEXTO

Proyecto e-commerce fullstack:

- Backend: Node.js + Express + MongoDB
- Frontend: React + Vite
- Integración real frontend-backend
- Testing: Vitest + Cypress
- Objetivo: maximizar cumplimiento (~130 pts)
- Nota: deployment público aún NO se considera en esta auditoría

---

## APARTADO A AUDITAR

### V. Apartado Extra (Opcional)

- V.1 Panel de Administración
- V.2 CRUD en Administración (mínimo 2 entidades)
- V.3 CRUD de Modelo Adicional

Máximo acumulable: 20 puntos

---

## PRECONDICIÓN

Asume que backend y frontend están corriendo.

Debes validar:

- código fuente
- integración real
- comportamiento en runtime

Si algo NO está comprobado en runtime → marcarlo como NO cumplido o PARCIAL.

---

# INSTRUCCIONES DE AUDITORÍA

## 1) V.1 PANEL ADMIN

Validar:

- existencia de panel admin
- rutas protegidas
- verificación de rol admin
- bloqueo/redirección correcta
- acceso real desde frontend

---

## 2) V.2 CRUD ADMIN

Validar CRUD completo para:

- Productos (obligatorio)
- Segunda entidad (usuarios, categorías u otra)

Cada entidad debe tener:

- POST (create)
- GET (read)
- PUT/PATCH (update)
- DELETE

Y además:

- backend real
- frontend real
- integración end-to-end
- persistencia Mongo
- protección admin

---

## 3) V.3 MODELO ADICIONAL

Validar CRUD completo de:

- wishlist, reviews, notifications u otro modelo adicional

Debe incluir:

- backend
- integración
- persistencia
- uso real (no código muerto)

---

## 4) VALIDACIÓN EN RUNTIME

Confirmar:

- creación real
- edición real
- eliminación real
- reflejo en UI
- persistencia en MongoDB

---

## 5) EVIDENCIA OBLIGATORIA

Debes incluir:

### Backend
- rutas
- controladores
- middlewares
- modelos

### Frontend
- páginas
- componentes
- rutas
- formularios

### Runtime
- qué se comprobó funcionando
- qué no
- qué falló

---

## ⚠️ REGLAS CRÍTICAS

- NO asumir nada
- NO inferir por nombres
- NO contar código no usado
- NO contar mocks como válido
- NO contar endpoints sin UI/integración como completos
- Si no es 100% verificable → NO cumplido

---

# GENERACIÓN DE DOCUMENTO FINAL

Genera un único archivo markdown en:

docs/AUDITORIA_AGAINST_RUBRIC_YYYY-MM-DD-HHmm.md

---

## EL DOCUMENTO DEBE CONTENER EXACTAMENTE:

# FINAL CLOSEOUT VERIFY AGAINST RUBRIC

## 1. Resumen ejecutivo
- Estado general del proyecto
- Nivel real de cumplimiento
- ¿Está listo para entrega o no?

---

## 2. Evidencia revisada
- Archivos backend analizados
- Archivos frontend analizados
- Endpoints detectados
- Componentes clave

---

## 3. Verificación por criterio de rúbrica

### V.1 Panel de Administración
- Estado: [✅ / ⚠️ / ❌]
- Evidencia:
- Validación runtime:

### V.2 CRUD en Administración
- Estado: [✅ / ⚠️ / ❌]

#### Entidad 1: Productos
- Create:
- Read:
- Update:
- Delete:

#### Entidad 2:
- Create:
- Read:
- Update:
- Delete:

- Evidencia:
- Validación runtime:

### V.3 CRUD Modelo Adicional
- Estado: [✅ / ⚠️ / ❌]
- Modelo detectado:
- CRUD:
- Evidencia:
- Validación runtime:

---

## 4. Confirmación de cierre de gaps previos
- Lista de gaps históricos
- Estado actual (cerrado / parcial / abierto)
- Evidencia de cierre real

---

## 5. Puntaje final honesto
- Puntaje base (sin extra):
- Puntaje extra real:
- Total estimado actual:
- ¿El ~125 es real o inflado?

---

## 6. Riesgos residuales
- Fallos potenciales
- Puntos débiles
- Casos no cubiertos

---

## 7. Dictamen final de entrega

Responder directo:

👉 ¿Se puede entregar HOY con confianza o NO?

Justificar técnicamente.

---

## 8. Defensa breve oral (puntos clave)

Preparar bullets para explicar:

- arquitectura
- decisiones técnicas
- integración real
- seguridad
- testing
- flujo end-to-end

---

## 9. Siguiente paso exacto recomendado

Una sola acción concreta:

- cerrar gap crítico
o
- proceder a deployment
o
- ajuste mínimo final

---

# OUTPUT ADICIONAL EN TERMINAL - este tambien tiene que estar en el documento generado

Además del archivo, muestra un resumen corto:

- Estado V.1:
- Estado V.2:
- Estado V.3:
- Puntaje extra:
- ¿Listo para entrega?: SI / NO