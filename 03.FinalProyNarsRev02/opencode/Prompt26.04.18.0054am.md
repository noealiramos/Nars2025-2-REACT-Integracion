Actúa como engineer senior full-stack dentro del proyecto integrador de ecommerce, siguiendo estrictamente el manual operativo y las políticas de trabajo ya definidas para este repositorio.

## CONTEXTO DEL PROYECTO
Monorepo local:
D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02

Apps:
- Backend: ecommerce-api-Nars
- Frontend: ecommerce-app-Nars

Stack esperado:
- React + Vite
- Express + MongoDB/Mongoose
- Cypress + Vitest
- Cloudinary

---

# OBJETIVO DE ESTA FASE
Consolidar y corregir completamente la UX de Checkout (direcciones) y estabilizar Admin Products, asegurando comportamiento uniforme en todos los flujos sin tocar lógica crítica (IVA).

---

# ALCANCE
- REQ 5 — Checkout (editar direcciones)
- REQ 6 — Admin Products (layout + imagen)
- REQ 9 — Checkout sin direcciones (modo NEW)
- REQ 10 — Ajustes de layout + consistencia de botones

---

# FUERA DE ALCANCE (NO TOCAR)
- REQ 4 IVA / totales / contrato de orden
- REQ 8 admin categories
- backend
- endpoints
- contratos API
- refactors grandes

---

# POLÍTICAS OBLIGATORIAS
- NO inventar lógica
- NO romper endpoints
- NO cambiar contratos API
- NO usar mocks
- NO hardcodear datos
- cambios mínimos, controlados y reversibles
- mantener compatibilidad con Cypress
- respetar diseño actual
- NO sobrescribir cambios previos sin revisar diff

---

# PASO 0 — CONTROL DE WORKTREE

Ejecutar y documentar:
- git status --short
- git diff --stat

Si Checkout o AdminProducts ya tienen cambios:
trabajar sobre ellos sin sobrescribirlos.

---

# IMPLEMENTACIÓN

---

# REQ 5 — CHECKOUT (EDICIÓN DIRECCIONES)

## OBJETIVO
Separar edición de dirección del flujo de compra.

---

## IMPLEMENTAR

### Estados controlados
Definir claramente:

mode = 'view' | 'edit' | 'new'

---

### Botones

- view → Editar
- edit → Guardar + Cancelar
- new → Guardar + Cancelar

---

### Guardar
- usar shippingApi.update
- refrescar lista real
- salir de modo edición

---

### Cancelar
- restaurar estado previo REAL
- no limpiar indiscriminadamente
- salir de edición

---

### Eliminar con confirmación

Usar:

window.confirm("¿Está seguro?, esta acción no podrá deshacerse?")

- aceptar → eliminar
- cancelar → no hacer nada

---

### Restricción importante
NO permitir confirmar compra si está en modo edit

---

# REQ 9 — CHECKOUT SIN DIRECCIONES

## PROBLEMA
Formulario aparece sin botones Guardar/Cancelar

---

## SOLUCIÓN

En modo NEW:

SIEMPRE mostrar:
- Guardar
- Cancelar

---

### Comportamiento

Guardar:
- crear dirección
- refrescar lista
- pasar a modo view

Cancelar:
- limpiar formulario
- regresar a estado inicial

---

# REQ 10 — AJUSTES DE LAYOUT

## PROBLEMA 1
Espacio vacío innecesario en tarjetas

---

## SOLUCIÓN
- corregir flex/grid
- eliminar columnas vacías
- ajustar padding/margin
- compactar layout

---

## PROBLEMA 2
Botones inconsistentes según flujo

---

## SOLUCIÓN
Unificar comportamiento:

SI mode === edit → botones visibles  
SI mode === new → botones visibles  

---

# REQ 6 — ADMIN PRODUCTS

## OBJETIVO
Estabilizar layout + mostrar imagen

---

## IMPLEMENTAR

### Imagen
Usar:
getImageUrl(product)

---

### Estructura de tarjeta

Separar:
- media (imagen)
- contenido
- acciones

---

### Estabilidad

- usar contenedor fijo
- usar aspect-ratio 1:1
- usar object-fit: cover
- evitar cambios de tamaño al editar

---

### Fallback
Si no hay imagen → mostrar placeholder estable

---

## RESTRICCIONES
- no tocar backend
- no cambiar estructura de datos
- no romper CRUD

---

# ARCHIVOS A MODIFICAR

- CheckoutPage.jsx
- CheckoutPage.css
- AdminProductsPage.jsx
- AdminProductsPage.css
- tests relacionados

---

# DOCUMENTACIÓN (CRÍTICA Y OBLIGATORIA)

## 1. DOCUMENTO PRINCIPAL

Actualizar:
docs/specs/2026-04-16-ui-fixes-ecommerce.md

Agregar sección:
"FASE 2 + 2.1 — Consolidación Checkout + Admin Products"

---

## 2. DOCUMENTO DE EJECUCIÓN

Crear archivo:

docs/specs/ui-fixes-ecommerce_YYYY-MM-DD-HHmm.md

Ejemplo:
docs/specs/ui-fixes-ecommerce_2026-04-17-2300.md

---

## CONTENIDO OBLIGATORIO

Incluir:

- comandos ejecutados
- salida relevante de terminal
- archivos modificados
- decisiones técnicas
- riesgos detectados
- validaciones realizadas
- resultados de tests

NO OMITIR TERMINAL

---

## REGLAS

- si no generas archivo timestamp → incompleto
- si duplicas docs → incorrecto
- si no documentas → incompleto

---

# VALIDACIONES

## Manual

Sin direcciones:
- aparecen botones ✔
- guardar funciona ✔
- cancelar limpia ✔

Con direcciones:
- layout sin espacios muertos ✔
- editar muestra botones ✔
- cancelar funciona ✔

Admin products:
- imagen visible ✔
- layout estable ✔

---

# TESTS

Ejecutar:

- npm run test
- npm run build
- npx cypress run

---

## CYPRESS

Validar:

- flujo sin direcciones
- flujo editar/cancelar
- confirmación window.confirm
- layout no rompe UI

---

# CRITERIO DE CALIDAD

- cambios pequeños
- sin efectos colaterales
- UX consistente
- comportamiento uniforme
- sin romper fases previas

---

# IMPORTANTE FINAL

NO tocar IVA  
NO tocar backend  
NO rehacer checkout completo  

Solo consolidar UX y corregir inconsistencias.

Ejecuta esta fase ahora.