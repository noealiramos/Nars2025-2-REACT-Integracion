Entra en modo **MICRO-ITERACION FINAL CONTROLADA + CIERRE DE GAPs DE RUBRICA**.

OBJETIVO:
Cerrar exclusivamente los 3 gaps finales detectados en la auditoría post MP-05, **sin romper contratos**, **sin refactors grandes**, **sin rediseñar arquitectura**, **sin introducir mocks**, **sin degradar UX**, y **manteniendo el proyecto estable**.

PROYECTO:
- Monorepo fullstack e-commerce
- Backend: Node.js + Express + MongoDB
- Frontend: React + Vite
- Integración real frontend-backend
- Testing: Vitest + Cypress

RUTA BASE DE TRABAJO:
D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02

RÚBRICA / CONTEXTO:
Atender únicamente estos 3 gaps finales:

1) GAP-01
   En `ecommerce-app-Nars/src/components/molecules/ProductCard.jsx`
   el botón **"Agregar al carrito"** sigue visible para usuario no autenticado.
   La regla objetivo es:
   - solo mostrar CTA de agregar al carrito cuando:
     a) el usuario esté autenticado
     b) exista stock disponible
   - si no está autenticado:
     - NO mostrar ese CTA
     - mantener UX coherente y defendible
   - si no hay stock:
     - NO permitir alta al carrito
     - reflejar estado visual claro

2) GAP-02
   En `ecommerce-app-Nars/src/contexts/CartContext.jsx`
   el carrito anónimo sigue persistiendo localmente.
   Debe quedar **claramente aislado o eliminado del flujo evaluable**
   para que el flujo rubricado quede defendible como **100% backend para usuario autenticado**.
   IMPORTANTE:
   - no romper login
   - no romper carrito autenticado
   - no romper checkout
   - no romper historial/órdenes
   - no romper Cypress existente si depende del flujo autenticado real
   - preferir solución mínima, explícita y segura
   - si eliminar totalmente el carrito anónimo genera riesgo innecesario, entonces:
     - aislarlo de forma clara
     - impedir que contamine el flujo rubricado
     - dejar comportamiento defendible y consistente

3) GAP-03
   Responsive mejorado pero no completamente evidenciado.
   Se requiere fortalecer evidencia real y verificable en vistas principales.
   No hacer rediseño visual completo.
   Solo asegurar y demostrar responsive en pantallas clave:
   - móvil
   - tablet
   - escritorio

REGLAS ESTRICTAS:
- NO hacer cambios grandes de arquitectura
- NO refactorizar por gusto
- NO tocar backend salvo que sea estrictamente necesario
- NO cambiar contratos API salvo necesidad crítica
- NO introducir nuevos problemas UX
- NO usar mocks/stubs para “simular que funciona”
- NO romper tests existentes
- NO inventar requerimientos
- NO dispersar cambios en demasiados archivos si no hace falta
- SIEMPRE priorizar estabilidad real del proyecto
- TODO cambio debe ser mínimo, deliberado y reversible

MODO DE EJECUCIÓN OBLIGATORIO:

## FASE 0 — INSPECCIÓN PREVIA
Antes de modificar nada:

1. Inspecciona y reporta exactamente:
   - `ecommerce-app-Nars/src/components/molecules/ProductCard.jsx`
   - `ecommerce-app-Nars/src/contexts/CartContext.jsx`
   - componentes/servicios/hooks relacionados con auth y cart
   - páginas principales donde se deba validar responsive
   - specs Cypress y tests Vitest relacionados

2. Identifica:
   - cómo se determina autenticación actualmente
   - cómo se determina stock actualmente
   - cómo entra hoy el flujo de `addToCart`
   - qué pasa actualmente con usuarios no autenticados
   - qué riesgo real existe si se elimina el carrito anónimo
   - qué vistas son las mínimas necesarias para evidenciar responsive

3. Entrega un mini-plan de implementación:
   - archivos a modificar
   - motivo de cada cambio
   - riesgos
   - orden exacto de ejecución

IMPORTANTE:
Si detectas dos caminos posibles para GAP-02:
- CAMINO A: eliminar carrito anónimo
- CAMINO B: aislarlo claramente sin romper flujo autenticado

elige el de **menor riesgo real** y justifícalo brevemente.

NO te detengas esperando confirmación.
Después del mini-plan, ejecuta directamente.

---

## FASE 1 — IMPLEMENTACIÓN GAP-01
Corrige `ProductCard.jsx` para que:

- el botón **Agregar al carrito** solo aparezca si:
  - usuario autenticado
  - stock > 0

- si usuario NO autenticado:
  - ocultar CTA de agregar al carrito
  - mantener experiencia clara
  - si ya existe otro CTA razonable (por ejemplo login/ver detalle), reutilizarlo sin meter ruido
  - si no existe, agregar la alternativa mínima y limpia más coherente con la UX actual

- si stock = 0:
  - no mostrar CTA activo de compra
  - mostrar estado visual consistente tipo agotado / sin stock

Criterio:
Debe quedar alineado con lectura estricta de la rúbrica, no solo “funcionar técnicamente”.

---

## FASE 2 — IMPLEMENTACIÓN GAP-02
Ajusta `CartContext.jsx` y cualquier punto mínimo relacionado para que:

- el flujo evaluable/rubricado quede claramente basado en backend real
- el carrito autenticado siga funcionando completo
- no haya ambigüedad conceptual en defensa académica

Prioridad:
1. preservar flujo autenticado real
2. preservar checkout real
3. minimizar impacto colateral

Si decides ELIMINAR carrito anónimo:
- hazlo de forma limpia
- evita romper componentes consumidores
- controla estados vacíos y mensajes UX

Si decides AISLAR carrito anónimo:
- debe quedar claro que:
  - no contamina flujo autenticado
  - no interfiere con sincronización backend
  - no afecta evaluación del flujo protegido
- idealmente:
  - no persistir localmente de forma que parezca flujo oficial rubricado
  - o convertirlo en comportamiento explícitamente separado y no central
  - o bloquear addToCart si no hay autenticación, dejando el carrito como flujo autenticado בלבד

En resumen:
La solución final debe hacer defendible que el carrito relevante del sistema evaluado es el autenticado y respaldado por backend.

---

## FASE 3 — IMPLEMENTACIÓN GAP-03
Fortalece responsive sin rediseño grande.

Objetivo:
Dejar evidencia real y verificable en vistas clave, al menos:
- catálogo / productos
- carrito
- wishlist o admin categories si son parte del gap visible
- alguna vista relevante de perfil/órdenes si aplica

Haz únicamente ajustes mínimos:
- media queries faltantes
- overflow
- grids/flex
- botones
- spacing
- tipografía si rompe layout
- tablas/listas si desbordan
- CTAs que se monten o colisionen

No conviertas esto en una remaquetación completa.

---

## FASE 4 — TESTING Y VERIFICACIÓN REAL
Después de implementar:

### Frontend
Ejecuta y documenta:
- `npm test`
- `npm run build`

### E2E / sanity
Ejecuta las pruebas mínimas más relevantes para demostrar que no rompiste:
- autenticación
- productos
- carrito
- checkout u órdenes
Usa los specs reales existentes más representativos.

Si todo el set E2E completo no es necesario, corre al menos el subconjunto más defensivo y explícitalo.
No simules resultados: ejecútalos de verdad.

---

## FASE 5 — VALIDACIÓN FUNCIONAL MANUAL
Además de tests automáticos, verifica manualmente y documenta:

1. Usuario no autenticado:
   - entra a catálogo
   - confirma que NO ve CTA de agregar al carrito si esa es la regla final
   - confirma comportamiento visual correcto

2. Usuario autenticado con stock:
   - ve CTA
   - puede agregar al carrito
   - carrito sincroniza como corresponde

3. Producto sin stock:
   - no permite compra
   - estado visual correcto

4. Responsive:
   - móvil
   - tablet
   - escritorio
   Documenta qué vistas revisaste y qué observaste.

---

## FASE 6 — DOCUMENTACIÓN FINAL OBLIGATORIA
Genera un único archivo markdown fuerte, completo y trazable en:

`docs/FINAL_MICRO_ITERATION_GAPS_CLOSED_YYYY-MM-DD-HHmm.md`

El archivo debe incluir EXACTAMENTE estas secciones:

# FINAL MICRO ITERATION - GAPS CLOSED

## 1. Objetivo
Explica que se cerraron los 3 gaps finales detectados por la auditoría post MP-05.

## 2. Archivos modificados
Lista rutas completas y propósito de cada cambio.

## 3. GAP-01 - CTA de agregar al carrito
- estado anterior
- cambio aplicado
- criterio final de visibilidad
- evidencia técnica

## 4. GAP-02 - Carrito anónimo vs flujo backend
- estado anterior
- decisión tomada (eliminar o aislar)
- justificación de menor riesgo
- cómo queda defendible frente a rúbrica
- evidencia técnica

## 5. GAP-03 - Responsive
- vistas revisadas
- ajustes aplicados
- qué problemas se corrigieron

## 6. Testing ejecutado
Pega resultados reales y resumidos de:
- `npm test`
- `npm run build`
- Cypress / sanity relevante

## 7. Verificación manual
Describe resultado real de las comprobaciones manuales clave.

## 8. Riesgo residual
Explica si queda algún riesgo menor, pero sin exagerar ni esconder nada.

## 9. Dictamen final honesto
Responder explícitamente:
- si los 3 gaps quedaron cerrados o no
- si el proyecto sube o no de nivel frente a la rúbrica
- si ya es defendible en un rango superior al auditado previamente

## 10. Siguiente prompt
Genera al final el siguiente prompt exacto para una última auditoría de cierre total:
`FINAL CLOSEOUT VERIFY AGAINST RUBRIC`

---

## CRITERIOS DE CALIDAD DE LA EJECUCIÓN
Tu ejecución solo se considera correcta si al final se cumple TODO esto:

- no se rompió el flujo autenticado
- no se rompió el checkout
- no se rompieron tests críticos
- el CTA de agregar al carrito ya no contradice la rúbrica
- el carrito rubricado queda claramente defendible como backend/authenticated-first
- responsive queda mejorado y evidenciado
- existe un único markdown fuerte con toda la evidencia
- no hubo cambios cosméticos innecesarios

---

## PROHIBIDO
- decir “sería recomendable”
- dejar solo análisis sin implementar
- abrir backlog nuevo
- postergar decisiones
- hacer cambios no validados
- declarar éxito sin pruebas reales
- crear múltiples archivos de reporte redundantes

---

## ENTREGA FINAL EN TERMINAL
Al terminar, imprime un cierre breve con este formato:

MICRO-ITERACION FINAL COMPLETADA
- GAP-01: [cerrado/parcial/no]
- GAP-02: [cerrado/parcial/no]
- GAP-03: [cerrado/parcial/no]
- tests: [resultado]
- build: [resultado]
- e2e sanity: [resultado]
- markdown final: [ruta exacta]
- dictamen: [1-3 lineas, honesto y directo]

y tambien anexalo al archivo "`docs/FINAL_MICRO_ITERATION_GAPS_CLOSED_YYYY-MM-DD-HHmm.md`" el cual se menciona en este documento en la línea 237.