# MP-05 FINAL PUSH - CERRAR GAPS PARA 130 SIN ROMPER NADA

Entra en modo **IMPLEMENTACIÓN FINAL QUIRÚRGICA + PROTECCIÓN TOTAL DE CONTRATOS**.

Objetivo:
cerrar los gaps detectados en la auditoría final para maximizar puntaje de rúbrica,
SIN romper flujos existentes,
SIN introducir refactors grandes,
SIN inventar arquitectura nueva,
SIN tocar despliegue.

---

## CONTEXTO

Proyecto fullstack e-commerce:

- Backend: Node.js + Express + MongoDB
- Frontend: React + Vite
- Integración real frontend-backend
- Tests:
  - Vitest
  - Cypress E2E real

Estado ya confirmado:

- auth funcional
- catálogo funcional
- carrito funcional
- checkout funcional
- órdenes funcionales
- profile funcional
- admin products funcional
- admin categories funcional
- wishlist funcional
- build verde
- Cypress crítico verde

Auditoría final actual:

- score real sin despliegue: 111 / 125
- gaps principales:
  1. falta evidencia/uso real de `useMutation`
  2. faltan 2 custom hooks con lógica real
  3. validación estricta de stock en carrito no está suficientemente cerrada/evidenciada
  4. estados de carga/error podrían ser más ricos
  5. evidencia responsive podría fortalecerse
  6. carrito anónimo local debilita pureza de integración backend

IMPORTANTE:
NO atacar todo con big-bang.
Primero resolver quick wins de alto impacto y bajo riesgo.
Solo tocar lo necesario para subir score.

---

## ALCANCE OBLIGATORIO DE ESTA ITERACIÓN

Debes enfocarte en cerrar, como mínimo, estos puntos:

### A. React Query - useMutation real y visible
Implementar `useMutation` en al menos 1 o 2 flujos visibles y defendibles.

Opciones preferidas:
- wishlist add/remove/clear/move-to-cart
- admin categories create/update/delete
- admin products create/update/delete

Requisito:
- que la integración sea real
- que haya invalidación/refetch coherente
- que quede defendible ante evaluación

---

### B. Dos custom hooks reales
Extraer al menos **2 custom hooks con lógica de negocio real**, NO solo wrappers triviales.

Opciones preferidas:
- `useWishlistActions`
- `useCheckoutSelections`
- `useAdminCategories`
- `useCartStockValidation`

Requisitos:
- deben encapsular lógica reutilizable real
- no deben ser solo `const x = useContext(...)`
- deben mejorar legibilidad sin romper el flujo
- deben quedar usados por componentes/páginas reales

---

### C. Validación estricta de stock en carrito
Revisar el flujo de actualización de cantidades del carrito.

Objetivo:
- impedir cantidades inválidas
- impedir superar stock disponible
- mostrar mensaje útil al usuario si aplica
- respetar backend real
- no romper checkout ni Golden Path

Validar tanto como sea posible:
- frontend defensivo
- integración backend si ya existe soporte
- si backend ya valida, reflejar correctamente el error en frontend
- si frontend estaba permitiendo inconsistencias, corregirlo

NO inventar contratos nuevos si no hacen falta.
Adaptarse a los contratos reales existentes.

---

### D. Estados de carga/error más ricos en 3 vistas
Mejorar estados visibles de carga/error/empty state en al menos 3 vistas importantes.

Prioridad sugerida:
- wishlist
- admin categories
- una vista de catálogo / detalle / checkout / profile según convenga

No hacer rediseño completo.
Solo mejorar percepción de calidad y defensa de UX.

Ejemplos válidos:
- loading claro
- empty state claro
- error state claro con retry si aplica
- mensajes más defendibles

---

### E. Evidencia responsive mínima y real
Fortalecer evidencia responsive SIN rehacer todo.

Opciones válidas:
- ajustes menores CSS donde sea necesario
- asegurar que wishlist/admin categories no colapsen en móvil
- documentar viewport checks en evidencia final si se ejecutan pruebas/manual QA

No hacer rediseño total.
Solo cerrar riesgo de evaluación.

---

## ALCANCE OPCIONAL SOLO SI SALE SEGURO

### F. Reducir debilidad del carrito anónimo
Solo si se puede hacer SIN alto riesgo y SIN romper flujos:

- revisar si el carrito anónimo local puede alinearse mejor con backend
- o al menos dejar claramente encapsulado/documentado para defensa

⚠️ Si esto implica cambios estructurales con riesgo, NO lo hagas en esta iteración.
Prioriza primero A, B, C, D, E.

---

## RESTRICCIONES FUERTES

- NO romper auth
- NO romper checkout
- NO romper orders
- NO romper admin products
- NO romper admin categories
- NO romper wishlist
- NO romper Cypress actual
- NO eliminar funcionalidades ya visibles
- NO hacer migraciones amplias
- NO cambiar contratos backend sin necesidad real
- NO introducir mocks
- NO usar localStorage nuevo para simular features
- NO tocar despliegue
- NO abrir nuevas fases

---

## ANTES DE IMPLEMENTAR

Primero revisa y documenta:

1. qué archivos vas a modificar
2. por qué esos archivos
3. qué riesgo tiene cada cambio
4. cómo evitarás romper lo ya validado

Genera esta sección al inicio del documento final.

---

## IMPLEMENTACIÓN

Haz cambios incrementales, en este orden recomendado:

1. custom hooks
2. useMutation visible
3. stock validation carrito
4. estados loading/error/empty
5. responsive mínimo
6. opcional carrito anónimo solo si es seguro

Después de cada bloque:
- valida imports
- valida build mentalmente/código
- evita duplicación innecesaria
- conserva contratos

---

## VALIDACIONES OBLIGATORIAS AL FINAL

Ejecuta como mínimo:

1. `npm test`
2. `npm run build`
3. Cypress sanity de rutas/flujos críticos

Prioridad de Cypress:
- `goldenPath.cy.js`
- `orders.cy.js`
- cualquier spec relacionado si tocaste wishlist o auth visible

Si algún test falla:
- corrige
- reejecuta
- documenta causa raíz y corrección

---

## SALIDA OBLIGATORIA

Genera un documento único con timestamp:

`docs/FINAL_PUSH_130_YYYY-MM-DD-HHMM.md`

Debe incluir exactamente estas secciones:

# 1. Objetivo de la iteración
# 2. Gaps atacados
# 3. Archivos modificados
# 4. Riesgo y mitigación
# 5. Implementación realizada
# 6. Validaciones ejecutadas
# 7. Resultado real
# 8. Riesgos remanentes
# 9. Estimación de nuevo score
# 10. Siguiente paso recomendado

---

## CRITERIO DE ÉXITO

Esta iteración solo se considera exitosa si:

- hay al menos 2 custom hooks reales implementados y usados
- hay al menos 1 flujo visible con `useMutation`
- la validación de stock queda más estricta y defendible
- mejoran estados de carga/error en 3 vistas
- no se rompe build
- no se rompe la sanity Cypress
- queda evidencia clara en el `.md`

Si algo no se puede cerrar de forma segura:
- no improvises
- documenta exactamente qué quedó pendiente y por qué

---

## RESUMEN FINAL EN TERMINAL

Al terminar, mostrar:

- qué gaps sí quedaron cerrados
- qué gaps no
- resultado de tests
- resultado de build
- resultado de Cypress
- estimación honesta de score posterior

No digas “130 logrado” sin evidencia.
Di la verdad con criterio estricto.