Ignora el archivo anterior porque quedó truncado. Usa estas instrucciones completas y actualizadas como la fuente vigente de esta fase.

Actúa como engineer senior full-stack dentro del proyecto integrador de ecommerce, siguiendo estrictamente el manual operativo y las políticas de trabajo ya definidas para este repositorio.

## CONTEXTO DEL PROYECTO
Monorepo local:
D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02

Apps:
- Backend: ecommerce-api-Nars
- Frontend: ecommerce-app-Nars

Stack esperado:
- Frontend: React + Vite
- Backend: Express + MongoDB/Mongoose
- Tests: Cypress + Vitest
- Imágenes: Cloudinary ya integrado

## OBJETIVO DE ESTA FASE
Implementar mejoras de UX e interacción ya auditadas, manteniendo estabilidad del sistema y sin tocar aún la lógica crítica de totales (IVA).

## ALCANCE DE ESTA FASE
- REQ 5 — Checkout (direcciones de envío)
- REQ 6 — Admin Products (layout + imagen)

## FUERA DE ALCANCE (NO TOCAR)
- REQ 4 IVA / totales / contrato de orden
- REQ 8 admin categories
- refactors grandes
- cambios de backend innecesarios
- cambios de contratos API

## POLÍTICAS OBLIGATORIAS
- No inventes nada
- No rompas endpoints
- No cambies contratos API
- No metas mocks
- No hardcodees datos
- Cambios mínimos, controlados y reversibles
- Mantener compatibilidad con Cypress
- Respetar diseño actual
- Si el worktree está sucio, NO sobrescribir cambios previos sin revisar diff

## PASO 0 — CONTROL DE WORKTREE
Antes de modificar, ejecuta y documenta:
- `git status --short`
- `git diff --stat`

Si hay archivos modificados en:
- CheckoutPage
- AdminProductsPage

Trabaja sobre esos cambios sin sobrescribirlos.

# IMPLEMENTACIÓN

# REQ 5 — CHECKOUT (DIRECCIONES)

## OBJETIVO
Separar claramente la edición de direcciones del flujo de compra.

## PROBLEMA ACTUAL
- Editar dirección no tiene botones dedicados
- Guardado ocurre solo al confirmar compra
- No existe Cancelar
- Eliminar no pide confirmación
- UI demasiado extendida (bloques muy largos)

## LO QUE DEBES IMPLEMENTAR

### 1. Modo de edición controlado
Agregar estados claros:
- view
- edit
- new

### 2. Botones requeridos
Cuando se edite una dirección, mostrar:
- Guardar
- Cancelar

### 3. Comportamiento esperado

#### Guardar
- Persistir cambios usando API existente (`shippingApi.update`)
- Refrescar lista de direcciones
- Salir de modo edición

#### Cancelar
- Restaurar estado previo REAL (no limpiar)
- Salir de modo edición sin persistir

### 4. Eliminar con confirmación
Antes de eliminar usar `window.confirm("¿Está seguro?, esta acción no podrá deshacerse?")`

- Si acepta → eliminar
- Si cancela → no hacer nada

### 5. Ajuste visual
- Reducir ancho excesivo de tarjetas
- Mejorar padding/márgenes
- Mantener responsive
- No rediseñar toda la pantalla

## RESTRICCIONES
- NO crear endpoints nuevos
- NO mezclar con lógica de compra
- NO romper submit del checkout
- NO duplicar lógica innecesaria

# REQ 6 — ADMIN PRODUCTS

## OBJETIVO
Estabilizar layout y mostrar imagen del producto.

## PROBLEMA ACTUAL
- Layout se siente inestable
- No hay imagen visible
- Tarjetas no tienen estructura fija

## LO QUE DEBES IMPLEMENTAR

### 1. Imagen por producto
Usar `getImageUrl(product)` y mostrar imagen en cada tarjeta.

### 2. Estructura de tarjeta
Separar claramente:
- Imagen
- Contenido
- Acciones

### 3. Estabilidad visual
- Definir contenedor con tamaño controlado
- Evitar que al editar cambie el tamaño o se desplace el layout

### 4. Manejo de imágenes
- Soportar tamaños distintos
- Usar `object-fit`
- Usar contenedor fijo o ratio estable

## RESTRICCIONES
- NO cambiar backend
- NO cambiar estructura de datos
- NO romper CRUD existente
- NO mezclar con otros requerimientos

# ARCHIVOS ESPERADOS A MODIFICAR
- `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`
- `ecommerce-app-Nars/src/pages/CheckoutPage.css`
- `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx`
- `ecommerce-app-Nars/src/pages/AdminProductsPage.css`
- posibles tests asociados

# DOCUMENTACIÓN OBLIGATORIA (CRÍTICA)

ESTE PUNTO ES OBLIGATORIO Y NO SE PUEDE OMITIR.

## 1. DOCUMENTO PRINCIPAL (UNIFICADO)
Trabajar SOLO sobre este archivo:
`docs/specs/2026-04-16-ui-fixes-ecommerce.md`

- Actualizarlo
- No duplicarlo
- No crear versiones paralelas
- Integrar la nueva fase dentro del mismo documento

## 2. DOCUMENTO DE EJECUCIÓN (OBLIGATORIO)
Debes crear un archivo NUEVO con este formato EXACTO:
`docs/specs/ui-fixes-ecommerce_YYYY-MM-DD-HHmm.md`

## CONTENIDO OBLIGATORIO EN AMBOS DOCUMENTOS
Debes incluir:
- comandos ejecutados
- salidas relevantes de terminal
- archivos modificados
- decisiones técnicas
- riesgos detectados
- validaciones realizadas
- resultados de tests

NO OMITIR NADA DE TERMINAL RELEVANTE.

## REGLAS
- Si no generas el archivo con formato timestamp, la tarea está incompleta
- Si generas múltiples archivos con nombres distintos, está incorrecto
- Si no documentas terminal, está incompleto

# VALIDACIONES OBLIGATORIAS

## Manuales
- Editar dirección → Guardar funciona
- Editar → Cancelar revierte cambios
- Eliminar muestra confirmación
- Cancelar confirmación no elimina
- Checkout sigue funcionando
- UI no se rompe en mobile
- Admin products muestra imagen visible
- Admin products mantiene layout estable
- Editar no rompe vista

## TESTS
Ejecutar mínimo:
- `npm run test`
- `npm run build`
- `npx cypress run`

## CYPRESS
Agregar o ajustar:
- test para confirmación (`window.confirm`)
- flujo editar/cancelar dirección
- validación visual básica admin products si aplica

Si no agregas tests, explica exactamente por qué.

# FORMA DE RESPUESTA
Quiero:
1. Resumen de implementación
2. Archivos modificados
3. Evidencia de terminal
4. Riesgos detectados
5. Validaciones ejecutadas
6. Estado final

# CRITERIO DE CALIDAD
- Código limpio
- Sin efectos colaterales
- Sin romper flujos existentes
- Sin tocar IVA
- Sin sobreingeniería

## IMPORTANTE FINAL
NO implementes nada fuera de REQ 5 y REQ 6.
NO toques IVA.
NO avances a otra fase.
Ejecuta ahora esta fase.