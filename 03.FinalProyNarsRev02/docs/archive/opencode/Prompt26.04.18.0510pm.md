Actúa como **Senior Full-Stack Engineer + Frontend Integration Engineer + QA Reviewer** sobre mi proyecto e-commerce.

## Contexto

Ya se realizó un diagnóstico previo y la conclusión fue:

* Backend **sí tiene paginación funcional** en `GET /api/products`
* Home **no consume correctamente la metadata de paginación**
* Home **solo muestra la primera página**
* Admin actualmente usa `limit=100` y **NO debe tocarse en esta fase**
* La corrección debe hacerse **solo en Home / frontend / integración**, sin romper nada existente

## Objetivo de esta fase

Ejecutar la corrección **únicamente para la página Home / Inicio**, de forma segura, incremental y documentada.

## Restricción crítica

### NO TOCAR ADMIN

No modificar:

* lógica de Admin Products
* comportamiento actual de Admin
* `limit=100` de Admin, salvo que sea estrictamente inevitable y antes de hacerlo debes detenerte y reportarlo

## Resultado funcional esperado

Quiero que en la página Home / Inicio:

1. Se sigan mostrando productos correctamente
2. Se consuma la metadata de paginación del backend
3. Existan controles visuales de paginación
4. Se pueda navegar entre páginas
5. No se rompa búsqueda ni render actual
6. No se rompan otras vistas ya existentes

---

## Estrategia obligatoria

Aplica una estrategia de **mínimo riesgo**.

### Muy importante:

**NO rompas el contrato actual global si no es necesario.**

Si hoy existe algo como:

* `fetchProducts()` que devuelve solo array,
* y eso puede afectar otras pantallas,

entonces:

### crea una variante específica para Home

Por ejemplo una función nueva tipo:

* `fetchProductsPaginated()`
  o equivalente

La idea es:

* preservar compatibilidad hacia atrás
* evitar regresiones
* encapsular el cambio solo donde se necesita

---

## Qué debes hacer

### 1) Implementación segura

Revisa y ajusta solo los archivos necesarios para que Home:

* preserve `products + pagination`
* maneje estado de página
* envíe `page` y `limit` al backend
* renderice controles de paginación visibles
* use `currentPage`, `totalPages`, `hasNext`, `hasPrev`

### 2) Mantener compatibilidad

No cambies agresivamente contratos compartidos si no hace falta.
Prefiero una solución incremental antes que un refactor amplio.

### 3) UI simple pero funcional

La paginación visual no necesita ser sofisticada.
Debe ser clara, usable y coherente con el diseño actual.

Como mínimo:

* botón anterior
* botón siguiente
* indicador de página actual / total páginas
* estado deshabilitado cuando corresponda

### 4) Validación

Después del cambio, valida:

* Home página 1
* Home página 2 / siguiente
* Home última página
* que el total de productos a través de páginas coincida con backend
* que Admin siga igual
* que no aparezcan errores en consola/terminal
* que búsqueda no quede rota

### 5) Tests

Haz ajustes mínimos de tests si aplica, especialmente para:

* servicio nuevo o variante nueva
* Home con respuesta paginada
* navegación básica entre páginas

No metas sobreingeniería.

---

## Entregable documental obligatorio

Genera o actualiza un documento en una ruta coherente del proyecto, por ejemplo:

`docs/specs/YYYY-MM-DD-HH-MM-home-paginacion-implementacion.md`

### Regla obligatoria:

El nombre del archivo **debe incluir fecha y hora**.

Ejemplo válido:

* `docs/specs/2026-04-18-02-40-home-paginacion-implementacion.md`

Ejemplo NO válido:

* `docs/specs/home-paginacion.md`

---

## Contenido obligatorio del documento

El documento debe incluir como mínimo:

1. Objetivo
2. Contexto
3. Alcance de esta fase
4. Archivos modificados
5. Cambios realizados
6. Motivo de cada cambio
7. Riesgos evaluados
8. Validaciones ejecutadas
9. Resultado funcional
10. Pendientes / siguientes pasos

---

## Requisito CRÍTICO sobre terminal

### TODO lo que aparezca en terminal debe incluirse SÍ o SÍ en el documento

No lo omitas.

Incluye:

* comandos ejecutados
* salida relevante
* errores
* warnings
* resultados de tests
* resultados de build
* validaciones manuales
* cualquier evidencia útil

No hagas resumen solamente:
**deja trazabilidad suficiente de terminal dentro del documento.**

---

## Formato de trabajo requerido

Trabaja en este orden:

### Fase A. Implementar

Haz solo los cambios mínimos necesarios.

### Fase B. Validar

Corre validaciones y pruebas razonables.

### Fase C. Documentar

Actualiza el documento con:

* cambios
* evidencia
* logs de terminal
* resultado final

### Fase D. Reporte final en terminal/chat

Entrega un cierre con esta estructura:

#### Resumen ejecutivo

* qué se corrigió
* qué archivos se tocaron
* resultado funcional
* riesgos

#### Validaciones

* qué probaste
* qué pasó
* si quedó algo pendiente

#### Estado final

Debes cerrar indicando explícitamente algo como:

**“Implementación terminada. Se aplicó paginación en Home únicamente. Admin no fue modificado.”**

---

## Criterios de aceptación

La tarea se considera bien hecha solo si:

* Home ya no queda limitada silenciosamente a la primera página
* la paginación es visible y funcional en Home
* Admin sigue intacto
* no se rompe el flujo actual
* el documento existe con fecha y hora en el nombre
* el documento incluye también evidencia de terminal SÍ o SÍ

## Regla final

Si en algún punto descubres que para corregir Home sería indispensable tocar Admin o hacer un refactor más grande del esperado:

* detente
* documenta el bloqueo
* explica por qué
* no improvises cambios de alto impacto
