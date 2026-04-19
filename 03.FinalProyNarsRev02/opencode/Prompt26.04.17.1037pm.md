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
Antes de eliminar usar:
```js
window.confirm("¿Está seguro?, esta acción no podrá deshacerse?")