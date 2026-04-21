Actúa como Senior Software Engineer + Tech Lead + QA Lead.

CONTEXTO:
Proyecto full stack ecommerce:
- Backend: ecommerce-api-Nars
- Frontend: ecommerce-app-Nars

El proyecto ya está:
- funcional
- probado (unit, integration, E2E)
- auditado (~90+ score)

OBJETIVO:
Ejecutar fase de LIMPIEZA DE REPO + DOCUMENTACIÓN FINAL para dejar el proyecto listo para:
- presentación académica
- despliegue en internet (modo free)

---

## REGLAS

1. Trabajar por fases: diagnóstico → plan → implementación
2. NO romper funcionalidad
3. NO eliminar información útil sin criterio
4. TODO lo de terminal debe documentarse
5. Documento con fecha y hora obligatorio

---

## FASE 1 — DIAGNÓSTICO

Revisar:

### Repo
- `git status`
- archivos no versionados
- archivos innecesarios
- screenshots antiguos
- logs
- duplicados

### Documentación
- existencia de README raíz
- README backend
- README frontend
- archivos duplicados o inconsistentes

### Estructura docs/
- detectar:
  - fixes
  - auditorías
  - pruebas
  - redundancias

ENTREGABLE:
- lista de qué limpiar
- lista de qué conservar
- lista de qué reestructurar

NO IMPLEMENTAR TODAVÍA.

---

## FASE 2 — PLAN

Proponer:

### 1. Limpieza
- archivos a eliminar
- archivos a mover a:
  - docs/archive/
  - docs/fixes/

### 2. Nueva estructura docs/
Ejemplo esperado:

docs/
  README.md
  architecture.md
  endpoints.md
  qa/
  audit/
  fixes/
  archive/

### 3. Documentos a crear/rehacer

#### README raíz
- descripción del proyecto
- arquitectura
- cómo correrlo
- links importantes

#### Backend README
- endpoints
- env variables
- cómo correr

#### Frontend README
- configuración
- VITE_API_URL
- build

---

## NO IMPLEMENTAR SIN AUTORIZACIÓN

---

## FASE 3 — IMPLEMENTACIÓN

Una vez aprobado:

- limpiar repo
- mover archivos
- eliminar basura real
- crear/actualizar documentación
- asegurar consistencia

---

## FASE 4 — VALIDACIÓN

Verificar:

- proyecto sigue funcionando
- no se eliminaron archivos necesarios
- estructura clara
- README comprensible

---

## FASE 5 — DOCUMENTACIÓN

Generar:

docs/release/YYYY-MM-DD-HHMM-repo-cleanup-docs.md

Debe incluir:

1. estado inicial
2. cambios realizados
3. archivos eliminados
4. archivos movidos
5. nueva estructura
6. documentos creados
7. output completo de terminal

---

## RESPUESTA EN CHAT

Quiero:

A) resumen ejecutivo  
B) plan de limpieza  
C) estructura final propuesta  
D) lista de documentos a crear  
E) confirmación antes de ejecutar  

---

OBJETIVO FINAL:
Dejar el proyecto limpio, entendible y listo para evaluación y despliegue.