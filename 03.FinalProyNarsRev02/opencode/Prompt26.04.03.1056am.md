Actúa como un sistema coordinado de agentes expertos usando los SKILLS del proyecto ubicados en:

D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\Skills

Debes cargar, interpretar y aplicar esos skills como guías operativas reales (no como referencia pasiva).

--------------------------------------------------
OBJETIVO
--------------------------------------------------

Generar un PLAN ESTRATÉGICO DE IMPLEMENTACIÓN para llevar el proyecto e-commerce full stack (React + Node + MongoDB) al cumplimiento total de la rúbrica oficial.

El plan debe:

- cubrir TODOS los criterios de la rúbrica
- priorizar por impacto en calificación
- evitar romper contratos backend/frontend
- asegurar avances incrementales y estables
- minimizar retrabajo
- permitir validación continua (testing + ejecución real)

--------------------------------------------------
FUENTES DE VERDAD
--------------------------------------------------

1) Rúbrica oficial:
docs/rubrica-evaluacion.pdf

2) Código actual del proyecto (frontend + backend)

3) Skills del proyecto:
D:\MyDocuments\...\Skills

--------------------------------------------------
REGLAS CRÍTICAS
--------------------------------------------------

- NO inventar criterios
- NO omitir ningún criterio
- NO proponer cambios que rompan contratos existentes
- SI un cambio rompe contrato → debe proponerse estrategia de transición
- TODO debe ser incremental (no big-bang refactors)
- TODO cambio debe ser verificable
- priorizar estabilidad sobre velocidad

--------------------------------------------------
FASE 0 — CARGA DE CONTEXTO
--------------------------------------------------

1. Leer completamente:
   - rúbrica
   - estructura del repo
   - skills disponibles

2. Identificar:
   - contratos actuales (API, payloads, responses)
   - dependencias críticas
   - flujos principales
   - estado actual por módulo

3. Mapear:
   - qué ya cumple
   - qué está parcial
   - qué falta

NO generar el plan aún.

--------------------------------------------------
FASE 1 — MAPEO RÚBRICA → SISTEMA
--------------------------------------------------

Construir una tabla:

- criterio de la rúbrica
- módulo(s) involucrados (frontend/backend)
- archivos clave
- estado actual (cumple / parcial / no cumple / desconocido)
- riesgo de implementación

--------------------------------------------------
FASE 2 — ANÁLISIS DE DEPENDENCIAS
--------------------------------------------------

Identificar:

- dependencias entre features
- orden lógico de implementación
- riesgos de romper:
  - endpoints
  - DTOs
  - auth
  - estado global

Detectar:

- puntos donde un cambio afecta múltiples módulos
- zonas críticas (checkout, auth, cart)

--------------------------------------------------
FASE 3 — ESTRATEGIA DE IMPLEMENTACIÓN
--------------------------------------------------

Construir estrategia en capas:

CAPA 1: ESTABILIDAD BASE
- conexiones backend
- contratos API
- manejo de errores
- configuración env

CAPA 2: FLUJO CRÍTICO
- auth
- productos
- carrito
- checkout

CAPA 3: HARDENING TÉCNICO
- context
- react query
- interceptores
- rutas protegidas
- hooks

CAPA 4: UX Y CALIDAD
- loading/error states
- validaciones
- responsive

CAPA 5: ADMINISTRACIÓN Y CRUD
- panel admin
- CRUD entidades
- modelo adicional

--------------------------------------------------
FASE 4 — PLAN PRIORIZADO
--------------------------------------------------

Generar backlog ordenado por:

1. impacto en puntos
2. dependencia técnica
3. riesgo

Para cada tarea:

- ID
- criterio de rúbrica asociado
- descripción clara
- prioridad (alta/media/baja)
- impacto en calificación
- riesgo
- dependencia
- validación requerida

--------------------------------------------------
FASE 5 — PLAN INCREMENTAL (CRÍTICO)
--------------------------------------------------

Dividir en ITERACIONES SEGURAS:

Cada iteración debe:
- NO romper lo existente
- ser testeable
- ser deployable

Formato:

ITERACIÓN X:
- objetivo
- tareas
- qué se valida
- qué riesgo se controla

--------------------------------------------------
FASE 6 — PROTECCIÓN DE CONTRATOS
--------------------------------------------------

Para cada cambio que afecte backend/frontend:

- identificar contrato afectado
- definir estrategia:
  - backward compatible
  - versionado
  - feature flag
  - adaptación progresiva

NO permitir cambios destructivos directos.

--------------------------------------------------
FASE 7 — USO DE SKILLS
--------------------------------------------------

Para cada bloque del plan:

- indicar qué skill aplicar
- cómo se usa
- qué reglas del skill impactan

Si falta un skill, indicarlo.

--------------------------------------------------
FASE 8 — VALIDACIÓN CONTINUA
--------------------------------------------------

Definir:

- qué probar después de cada iteración
- pruebas mínimas necesarias:
  - unit
  - integración
  - E2E

- qué comandos ejecutar
- qué resultado esperado valida éxito

--------------------------------------------------
FASE 9 — ALERTAS Y RIESGOS
--------------------------------------------------

Listar:

- posibles regresiones
- conflictos frontend/backend
- problemas típicos:
  - imágenes
  - auth
  - env
  - rutas
  - async issues

--------------------------------------------------
FASE 10 — PLAN DE EJECUCIÓN FINAL
--------------------------------------------------

Entregar:

A. Resumen ejecutivo  
B. Mapa rúbrica → sistema  
C. Backlog priorizado  
D. Plan por iteraciones  
E. Estrategia de contratos  
F. Uso de skills  
G. Plan de validación  
H. Riesgos  
I. Recomendaciones finales  

--------------------------------------------------
MODO DE TRABAJO
--------------------------------------------------

- pensar como arquitecto, no como junior
- priorizar estabilidad
- evitar soluciones rápidas que rompan flujo
- construir plan ejecutable real

Empieza ahora.

- Documenta el plan resultante en D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\docs\MasterPlanIntegracionFinal.md el cual no existe, hay que crearlo.
- Es imprescindible que todo lo que plasmes en la terminal también se anexe al archivo \MasterPlanIntegracionFinal.md