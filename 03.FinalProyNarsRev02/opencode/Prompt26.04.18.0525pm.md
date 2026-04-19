Actúa como **Senior Full-Stack Engineer + Frontend Integration Engineer + QA Reviewer** sobre mi proyecto e-commerce.

## Contexto

Ya se implementó correctamente la paginación en la página **Home / Inicio**.
Ahora requiero aplicar paginación también en la página **Admin de productos**, pero de forma **segura, incremental y sin romper nada**.

### Estado actual conocido

* Backend ya expone paginación funcional en `GET /api/products`
* Home ya consume correctamente `products + pagination`
* Admin actualmente consume productos con `limit=100`
* En esta nueva fase quiero corregir únicamente la paginación de **Admin**
* Lo ya implementado en **Home no debe romperse**
* El backend no debe modificarse salvo que sea estrictamente indispensable; si detectas que sería necesario, primero documenta el motivo claramente

---

## Objetivo de esta fase

Implementar paginación visible y funcional en la pantalla de **Admin Products**, reemplazando el enfoque actual de traer hasta 100 productos, pero sin afectar:

* Home
* búsqueda existente
* edición de productos
* eliminación de productos
* flujo general de administración

---

## Restricción crítica

### NO ROMPER HOME

No modificar el comportamiento ya funcional de Home, salvo que sea estrictamente inevitable y antes de hacerlo debes detenerte y reportarlo.

### NO HACER REFACTORS GRANDES

Haz cambios mínimos, puntuales y reversibles.
No rehagas módulos completos si no hace falta.

---

## Estrategia obligatoria

Aplica estrategia de **mínimo riesgo** y **máxima compatibilidad**.

### Regla importante

Si en Admin hoy existe una lógica específica, consérvala lo más posible.
La intención es:

* sustituir el uso de `limit=100`
* incorporar `page`, `limit` y metadata de paginación
* agregar controles visuales
* mantener estable el resto del comportamiento

### Muy importante

Antes de tocar código, revisa cómo conviven actualmente en Admin:

* listado
* búsqueda
* edición
* borrado / eliminación
* refresco de datos
* estado local o React Query
* parámetros actuales enviados al backend

No asumas: valida primero.

---

## Qué debes hacer

### 1) Revisar el flujo actual de Admin

Analiza y documenta:

* cómo se cargan hoy los productos en Admin
* qué endpoint consume
* qué parámetros manda
* si existe búsqueda
* si existe filtrado
* qué pasa después de editar o borrar
* cómo se refresca la tabla/listado
* si el listado actual depende de traer todo junto

### 2) Implementar paginación segura en Admin

Haz los cambios mínimos necesarios para que Admin:

* deje de depender de `limit=100`
* envíe `page` y `limit`
* consuma `products + pagination`
* muestre paginación visual usable
* mantenga búsqueda funcional
* mantenga edición y eliminación funcionales

### 3) UX mínima pero correcta

Como mínimo, la paginación de Admin debe mostrar:

* botón `Anterior`
* botón `Siguiente`
* texto `Página X de Y`
* botones deshabilitados cuando corresponda

Si consideras viable agregar selector de cantidad por página sin elevar riesgo, puedes proponerlo, pero **no es obligatorio**.

### 4) Casos delicados que debes cuidar

Evalúa y valida explícitamente qué pasa cuando:

* se elimina un producto y la página actual queda vacía
* se edita un producto y se refresca el listado
* se realiza una búsqueda estando en página distinta de 1
* se cambia de página y luego se busca
* el backend responde una sola página
* no hay resultados

No improvises; documenta cómo resuelves cada punto.

### 5) Mantener compatibilidad

Evita romper contratos compartidos si no hace falta.
Si puedes reutilizar la estrategia ya usada en Home sin afectar otros consumidores, adelante.
Si necesitas crear una variante específica para Admin, hazlo.

---

## Validaciones obligatorias

Después de implementar, valida como mínimo:

1. Admin página 1 carga correctamente
2. Admin puede navegar a página 2 y siguientes
3. Admin muestra estado correcto en última página
4. Home sigue funcionando igual
5. búsqueda en Admin sigue funcionando
6. edición en Admin sigue funcionando
7. eliminación en Admin sigue funcionando
8. si se elimina el último producto de una página, el comportamiento queda coherente
9. build compila correctamente
10. no aparecen errores relevantes en terminal

---

## Tests

Haz ajustes mínimos de tests si aplica.
Prioriza pruebas útiles y enfocadas, sin sobreingeniería.

Como mínimo, si resulta viable:

* pruebas de Admin con respuesta paginada
* navegación básica entre páginas
* continuidad de búsqueda
* prueba de no afectación de Home si aplica

---

## Entregable documental obligatorio

Genera o actualiza un documento con nombre con **fecha y hora**, por ejemplo:

`docs/specs/YYYY-MM-DD-HH-MM-admin-paginacion-implementacion.md`

### Regla obligatoria:

El archivo debe incluir **fecha y hora** en el nombre.
No omitas el timestamp.

---

## Contenido obligatorio del documento

El documento debe incluir como mínimo:

1. Objetivo
2. Contexto
3. Alcance de esta fase
4. Archivos revisados
5. Archivos modificados
6. Cambios realizados
7. Motivo de cada cambio
8. Riesgos evaluados
9. Validaciones ejecutadas
10. Resultado funcional
11. Casos límite revisados
12. Pendientes / siguientes pasos

---

## Requisito CRÍTICO sobre terminal

### TODO lo que aparezca en terminal debe incluirse SÍ o SÍ dentro del documento

No lo omitas.

Incluye:

* comandos ejecutados
* salida relevante
* errores
* warnings
* resultados de tests
* resultados de build
* validaciones manuales
* evidencia útil de comportamiento

No dejes solo resumen:
**debe quedar trazabilidad suficiente de terminal en el documento.**

---

## Formato de trabajo requerido

Trabaja en este orden:

### Fase A. Revisar

Primero comprende el flujo actual de Admin y documenta riesgos.

### Fase B. Implementar

Haz solo cambios mínimos y seguros.

### Fase C. Validar

Corre pruebas y validaciones razonables.

### Fase D. Documentar

Deja evidencia de cambios, validaciones y terminal.

### Fase E. Reporte final

Entrega un cierre con esta estructura:

#### Resumen ejecutivo

* qué se corrigió
* qué archivos se tocaron
* resultado funcional
* riesgos

#### Validaciones

* qué probaste
* qué pasó
* qué casos límite revisaste

#### Estado final

Debes cerrar indicando explícitamente algo como:

**“Implementación terminada. Se aplicó paginación en Admin. Home no fue modificado funcionalmente.”**

---

## Criterios de aceptación

La tarea se considera bien hecha solo si:

* Admin deja de depender de `limit=100`
* Admin muestra paginación visible y funcional
* búsqueda en Admin sigue funcionando
* edición/eliminación en Admin siguen funcionando
* Home no se rompe
* build y validaciones pasan
* el documento existe con fecha y hora en el nombre
* el documento incluye evidencia de terminal SÍ o SÍ

---

## Regla final

Si durante la implementación descubres que para paginar Admin se requiere tocar backend, Home, o hacer un refactor mayor:

* detente
* documenta el bloqueo
* explica con evidencia por qué
* no improvises cambios de alto impacto
