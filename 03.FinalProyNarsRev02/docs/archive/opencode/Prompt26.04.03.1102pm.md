Entra en modo MAX-SCORE CLOSURE PLAN + SAFE EXECUTION.

OBJETIVO:
cerrar de forma REAL las brechas técnicas detectadas en la auditoría final contra la rúbrica,
para llevar el proyecto al estado más cercano posible a puntaje máximo, SIN romper la integración actual ya validada.

NO improvises.
NO infles resultados.
NO declares éxito sin evidencia real.
NO hagas big-bang.

==================================================
CONTEXTO ACTUAL
==================================================

El proyecto ya tiene:

- Backend: Node.js + Express + MongoDB
- Frontend: React + Vite
- JWT + refresh
- Flujo real end-to-end funcionando
- Cypress completo en verde
- npm test en verde
- npm run build en verde

Existe una auditoría final que detectó brechas para puntaje máximo en:

1. despliegue verificable
2. React Query
3. lazy loading
4. useReducer + tercer contexto real
5. GuestOnlyRoute explícito
6. segundo CRUD admin visible
7. CRUD de modelo adicional integrado al frontend

Documento base:
- docs/FINAL_AUDIT_RUBRICA-2026-04-03-2106.md

==================================================
MISION
==================================================

Debes proponer y ejecutar un plan REAL, incremental y seguro para cerrar esas brechas.

Pero hazlo en 2 etapas obligatorias:

ETAPA 1 = PLAN MAESTRO DETALLADO
ETAPA 2 = IMPLEMENTACION POR ITERACIONES

NO empieces con big-bang.

==================================================
ETAPA 1 - PLAN MAESTRO OBLIGATORIO
==================================================

Primero, SIN implementar todavía, genera un documento:

- docs/MAX_SCORE_MASTER_PLAN-YYYY-MM-DD-HHmm.md

==================================================
REGLA CRITICA DE TRAZABILIDAD (OBLIGATORIA)
==================================================

TODO lo que escribas en la terminal DEBE quedar reflejado también dentro del archivo .md.

Esto incluye:
- análisis
- decisiones
- listas
- razonamiento técnico resumido
- advertencias
- conclusiones

NO puede existir información en terminal que NO esté en el .md.

El archivo debe ser una copia fiel y completa del proceso.

==================================================
ESTRUCTURA DEL DOCUMENTO (OBLIGATORIA)
==================================================

# MAX SCORE MASTER PLAN

## 0. LOG COMPLETO DE EJECUCION
(Pegar aquí TODO lo que se mostraría en terminal, en orden cronológico)

## 1. Objetivo
Qué puntajes/criterios de la rúbrica se buscan cerrar.

## 2. Brechas detectadas
Lista exacta de brechas abiertas, separando:
- implementación real
- evidencia/documentación/demo

## 3. Estrategia de cierre
Proponer el ORDEN óptimo de implementación, justificando:
- impacto en puntaje
- riesgo técnico
- dependencias

## 4. Iteraciones propuestas

Cada iteración debe incluir:
- nombre
- objetivo
- criterios que cubre
- archivos a modificar (estimados)
- riesgos
- validaciones obligatorias

## 5. Diseño técnico mínimo por brecha

### 5.1 GuestOnlyRoute
- archivo
- integración en rutas

### 5.2 Lazy loading
- rutas específicas
- uso de React.lazy + Suspense

### 5.3 useReducer + tercer contexto
- nombre del contexto
- estado que manejará
- por qué sí cumple la rúbrica

### 5.4 React Query
- qué módulos migrar primero
- cómo evitar romper lo existente

### 5.5 Segundo CRUD admin
- entidad elegida
- por qué es válida

### 5.6 Modelo adicional (CRUD)
- entidad elegida
- endpoints necesarios
- integración frontend

### 5.7 Despliegue
- estado actual
- pasos concretos para URL pública funcional

## 6. Riesgos de ruptura
Qué puede romperse y cómo evitarlo.

## 7. Orden final recomendado
Lista priorizada de ejecución.

## 8. Regla de ejecución
Declarar explícitamente que NO se implementará nada aún.

==================================================
REGLAS DE ETAPA 1
==================================================

- NO implementar código
- NO modificar archivos del proyecto aún
- SOLO plan
- SI algo no es viable, decirlo
- SI algo requiere backend, indicarlo claramente

==================================================
FORMATO DE SALIDA EN TERMINAL
==================================================

1) RESULTADO:
- PLAN READY

2) ARCHIVO GENERADO:
- ruta completa del .md

3) ITERACION 1 RECOMENDADA:
- nombre corto

4) RESUMEN HONESTO:
- 5 a 10 bullets
- directo
- sin adornos
- indicando el camino real hacia 130

==================================================
IMPORTANTE FINAL
==================================================

NO avances a implementación.
NO mezcles etapas.
NO omitas el log en el .md.

EJECUTA SOLO ETAPA 1.