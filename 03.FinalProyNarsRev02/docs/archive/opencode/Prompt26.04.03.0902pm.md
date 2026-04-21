Entra en modo AUDITORIA FINAL CONTRA RUBRICA + PREPARACION DE DEFENSA.

NO implementes cambios grandes.
NO abras nuevas fases.
NO refactorices.

Solo:

1) evaluar el proyecto contra la rúbrica oficial
2) mapear evidencia real
3) detectar huecos de puntaje
4) proponer SOLO ajustes mínimos si son necesarios
5) preparar material de defensa

==================================================
CONTEXTO DEL PROYECTO
==================================================

Proyecto fullstack e-commerce:

- Backend: Node.js + Express + MongoDB
- Frontend: React + Vite
- Integración real frontend-backend
- Autenticación con JWT
- CRUD completo (productos, órdenes, etc.)
- Relaciones entre modelos
- Validaciones
- Testing:
  - Vitest (unit/integration)
  - Cypress (E2E REAL sin mocks)

Estado actual validado:

- Cypress: 100% en verde (`npx cypress run`)
- npm test: verde
- npm run build: verde
- Flujo E2E completo funcionando:
  login → productos → carrito → checkout → órdenes

Existe evidencia ya generada en:

- docs/CYPRESS_FINAL_CLOSURE-*.md
- docs/CYPRESS_STABILIZATION_FINAL-*.md
- otros docs del proyecto

==================================================
ENTRADA OBLIGATORIA
==================================================

Debes usar la rúbrica oficial proporcionada por el usuario.

IMPORTANTE:
- NO inventes criterios
- NO asumas puntos
- SI algo no está claro, márcalo como "evidencia insuficiente"

==================================================
METODO DE AUDITORIA (OBLIGATORIO)
==================================================

Para CADA criterio de la rúbrica:

Evaluar con esta estructura EXACTA:

### [Nombre del criterio]

- Estado: (CUMPLE / PARCIAL / NO CUMPLE / EVIDENCIA INSUFICIENTE)

- Evidencia REAL:
  (archivos, endpoints, tests, comportamiento observable)

- Análisis:
  (por qué sí o no cumple)

- Riesgo de evaluación:
  (ALTO / MEDIO / BAJO)

- Acción mínima recomendada:
  (SOLO si es necesario mejorar evidencia o cerrar hueco)

==================================================
CRITERIOS DE CALIDAD DE LA AUDITORIA
==================================================

- NO decir "cumple" sin evidencia concreta
- NO asumir que algo existe si no está visible
- PRIORIZAR:
  - integración real (no mocks)
  - consistencia backend/frontend
  - seguridad básica (auth, ownership)
  - flujo end-to-end
- DETECTAR:
  - huecos de evidencia (aunque el código exista)
  - puntos débiles de demo

==================================================
SECCION DE RESUMEN EJECUTIVO (OBLIGATORIO)
==================================================

Al final genera:

## RESUMEN EJECUTIVO

- Puntaje estimado actual: XX / 130
- Nivel de riesgo de evaluación: (BAJO / MEDIO / ALTO)
- Principales fortalezas (máx 5)
- Principales huecos (máx 5)

==================================================
SECCION DE PLAN FINAL (OBLIGATORIO)
==================================================

## PLAN MINIMO PARA 130/130

Lista priorizada:

1) quick wins (solo evidencia/documentación)
2) ajustes mínimos de código (si son estrictamente necesarios)
3) mejoras de presentación/demo

NO incluir cambios grandes ni refactors.

==================================================
SECCION DE DEFENSA (MUY IMPORTANTE)
==================================================

## GUIA DE DEFENSA

Genera:

1) Elevator pitch (30–45 segundos)
2) Flujo de demo recomendado (paso a paso)
3) Preguntas probables del evaluador y cómo responderlas
4) Puntos fuertes técnicos a destacar
5) Cómo justificar decisiones clave (ej. no usar mocks en Cypress)

==================================================
ENTREGABLE
==================================================

Genera un único archivo:

docs/FINAL_AUDIT_RUBRICA-YYYY-MM-DD-HHmm.md

Con TODAS las secciones anteriores, y no olvides también reflejar en dicho archivo lo que escribas en la terminal. 

==================================================
REGLAS FINALES
==================================================

- Sé brutalmente honesto
- No infles el puntaje
- No escondas debilidades
- Prioriza que el usuario obtenga el puntaje máximo REAL

EJECUTA YA.