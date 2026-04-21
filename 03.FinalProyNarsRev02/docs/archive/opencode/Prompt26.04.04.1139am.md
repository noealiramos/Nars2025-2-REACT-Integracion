Entra en modo **RESPONSIVE EVIDENCE MICRO-CLOSEOUT**.

OBJETIVO:
Intentar recuperar el punto pendiente de `IV.1 Diseño Responsivo` mediante **verificación formal, evidencia trazable y documentación clara**, sin hacer refactors grandes, sin tocar arquitectura y sin abrir nuevas fases.

CONTEXTO:
Ya existe auditoría final de cierre en:
`docs/FINAL_CLOSEOUT_VERIFY_AGAINST_RUBRIC_2026-04-04-1035.md`

Estado actual reportado:
- proyecto listo para entrega
- puntaje defendible actual: `124/125` local
- único matiz restante: `IV.1 Diseño Responsivo` quedó en `4/5` por falta de evidencia formal dedicada, no por falla funcional grave

RUTA BASE:
D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02

RÚBRICA:
Usa como referencia:
D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\opencode\rubrica-evaluacion.pdf

REGLAS ESTRICTAS:
- NO rediseñar pantallas
- NO abrir backlog nuevo
- NO hacer cambios grandes de CSS
- NO tocar backend
- NO tocar contratos
- NO romper tests
- NO declarar 5/5 si no hay evidencia real suficiente
- SI detectas un microajuste visual claramente necesario y de riesgo casi nulo, puedes hacerlo, pero debe ser minimo y justificable
- Prioridad absoluta: **evidencia formal + verificación real**

TAREA OBLIGATORIA:

## FASE 0 — BASE DE EVIDENCIA
Revisa:
- `docs/FINAL_MICRO_ITERATION_GAPS_CLOSED_2026-04-04-0836.md`
- `docs/FINAL_CLOSEOUT_VERIFY_AGAINST_RUBRIC_2026-04-04-1035.md`
- las vistas principales del frontend
- los CSS ya ajustados en la micro-iteración final

## FASE 1 — VERIFICACIÓN FORMAL DE RESPONSIVE
Realiza una verificación dedicada, explícita y documentada de responsive en al menos estos 3 viewports:

- móvil: `375x812` o equivalente
- tablet: `768x1024` o equivalente
- escritorio: `1440x900` o equivalente

Validar como mínimo estas vistas clave:
1. catálogo / home / listado de productos
2. detalle de producto
3. carrito
4. checkout
5. órdenes o perfil
6. login / register

Para cada vista y viewport, verificar y documentar:
- si hay overflow horizontal o no
- si botones/CTAs se montan o no
- si grids/cards/tablas/listas colapsan bien
- si textos largos rompen layout o no
- si navegación principal sigue usable
- si formularios siguen legibles y operables

## FASE 2 — MICROAJUSTE SOLO SI ES NECESARIO
Si durante la verificación encuentras un problema real, visible y puntual que impida defender `5/5`, aplica únicamente el microajuste mínimo necesario.

Ejemplos válidos:
- overflow-wrap
- width / max-width
- flex-wrap
- grid collapse
- padding/gap puntual
- CTA al 100% ancho en móvil
- tabla/lista que deba apilar o envolver texto

Ejemplos NO válidos:
- remaquetar páginas completas
- cambiar UX central
- tocar muchas vistas por estética
- refactorizar CSS por gusto

## FASE 3 — REVALIDACIÓN
Después de cualquier ajuste:
- corre `npm test`
- corre `npm run build`
- corre al menos un sanity mínimo si el cambio pudo tocar una vista crítica

## FASE 4 — DOCUMENTO FINAL DE EVIDENCIA
Genera un único markdown:

`docs/RESPONSIVE_EVIDENCE_CLOSEOUT_YYYY-MM-DD-HHmm.md`

Debe incluir EXACTAMENTE:

# RESPONSIVE EVIDENCE CLOSEOUT

## 1. Objetivo
## 2. Viewports evaluados
## 3. Vistas evaluadas
## 4. Checklist de verificación por vista y viewport
## 5. Hallazgos reales
## 6. Microajustes aplicados (si hubo)
## 7. Revalidación (tests/build)
## 8. Dictamen honesto sobre IV.1
## 9. Conclusión: ¿sube a 5/5 o se mantiene 4/5?

IMPORTANTE:
En la sección 4 quiero una matriz clara, tipo checklist, por ejemplo:

- Home / catálogo
  - móvil: [ok/parcial/falla] + observación
  - tablet: [ok/parcial/falla] + observación
  - escritorio: [ok/parcial/falla] + observación

Y repetir lo mismo para cada vista clave.

## FASE 5 — ACTUALIZACIÓN DE DICTAMEN FINAL
Si la evidencia realmente soporta subir `IV.1` de `4/5` a `5/5`, actualiza también el documento final de cierre:
`docs/FINAL_CLOSEOUT_VERIFY_AGAINST_RUBRIC_2026-04-04-1035.md`

Pero SOLO si es defendible con honestidad.
Si no lo es, NO lo fuerces.

## SALIDA FINAL EN TERMINAL
Imprime al terminar:

RESPONSIVE EVIDENCE CLOSEOUT COMPLETADO
- markdown evidencia: [ruta exacta]
- microajustes: [si/no]
- tests: [resultado]
- build: [resultado]
- IV.1 final: [4/5 o 5/5]
- puntaje local final: [124/125 o 125/125]
- dictamen: [2-4 lineas, directo y honesto]