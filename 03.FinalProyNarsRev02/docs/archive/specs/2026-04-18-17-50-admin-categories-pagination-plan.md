# 2026-04-18 17:50 - Admin Categories pagination plan

## 1. Diagnostico

### Frontend

✔ Que existe

- `ecommerce-app-Nars/src/pages/AdminCategoriesPage.jsx` ya tiene CRUD funcional de categorias.
- El listado se renderiza con `categories.map(...)` en `ecommerce-app-Nars/src/pages/AdminCategoriesPage.jsx:144`.
- El modulo usa `useAdminCategories()` para encapsular carga, guardado, borrado e invalidacion de React Query.
- `categoryApi.getAll(params)` ya acepta params arbitrarios en `ecommerce-app-Nars/src/api/categoryApi.js:4`.
- Hay estados de loading, error y empty state visibles en la pantalla.

❌ Que falta

- No existe estado de paginacion en la pagina ni en el hook.
- No hay controles visuales de paginacion.
- El hook fuerza `limit=100` en `ecommerce-app-Nars/src/hooks/useAdminCategories.js:11`.
- No hay logica para manejar pagina actual despues de borrar el ultimo item visible.
- No hay test localizado para `AdminCategoriesPage`; el intento de lectura de `ecommerce-app-Nars/src/pages/__tests__/AdminCategoriesPage.test.jsx` devolvio `File not found`.

⚠ Riesgos

- `parentOptions` hoy se construye con `categories` cargadas en memoria; si se pagina la lista visible sin estrategia adicional, el selector de categoria padre podria dejar de mostrar categorias que no esten en la pagina actual.
- El hook actual mezcla listado y mutaciones; si se cambia su contrato sin cuidado, podria afectar mensajes, invalidaciones o la forma en que la pagina consume datos.
- Borrar en una pagina alta puede dejar una pagina vacia si no se ajusta `page` tras la mutacion.

### Backend

✔ Que existe

- `GET /api/categories` ya soporta `page`, `limit`, `sort`, `order` y `parentCategory` en `ecommerce-api-Nars/src/controllers/categoryController.js:4`.
- El controlador usa `getPagination(req, 10)` y responde con:
  - `categories`
  - `pagination.currentPage`
  - `pagination.totalPages`
  - `pagination.totalResults`
  - `pagination.hasNext`
  - `pagination.hasPrev`
- `GET /api/categories/search` tambien ya soporta paginacion.
- El backend ya sigue un patron parecido al de productos y ordenes.

❌ Que falta

- No falta soporte backend para paginar `GET /categories`; ya existe.
- La respuesta no viene exactamente con `{ data, total, page, totalPages }`, pero si expone metadata suficiente y consistente con otros modulos del proyecto.

⚠ Riesgos

- `totalPages` se calcula con `Math.ceil(totalResults / limit)`; si `totalResults` fuera 0`, hoy podria devolver `0`, asi que el frontend debe tolerar `0` o normalizar a `1` en UI.
- Si se intentara cambiar la forma de respuesta backend en esta fase, se elevaria el riesgo innecesariamente.

### Evidencia de terminal

#### Lecturas y hallazgos de archivos

```text
Error: File not found: D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\src\pages\__tests__\AdminCategoriesPage.test.jsx
```

#### Conteo real en MongoDB

Comando:

```text
node -e "const mongoose=require('mongoose'); (async()=>{await mongoose.connect('mongodb://localhost:27017/ecommerce-db-jewelry'); const count=await mongoose.connection.db.collection('categories').countDocuments({}); console.log('categories_in_db=' + count); ... })()"
```

Salida:

```text
categories_in_db=13
[
  {
    "_id": "68a572b9a1f69c1bbfa577a9",
    "name": "Anillos",
    "parentCategory": null
  },
  {
    "_id": "68a57412a1f69c1bbfa577b1",
    "name": "Pulseras",
    "parentCategory": null
  },
  {
    "_id": "68a57428a1f69c1bbfa577b3",
    "name": "Aretes",
    "parentCategory": null
  },
  {
    "_id": "68a6b6715aceec4975c87e88",
    "name": "Collares",
    "parentCategory": null
  },
  {
    "_id": "68a6b6a15aceec4975c87e8a",
    "name": "Dijes",
    "parentCategory": null
  }
]
```

#### Endpoint por default

Comando:

```text
node -e "fetch('http://localhost:3001/api/categories')..."
```

Salida:

```text
status=200
categories=10
pagination={"currentPage":1,"totalPages":2,"totalResults":13,"hasNext":true,"hasPrev":false}
```

#### Endpoint con `limit=100`

Comando:

```text
node -e "fetch('http://localhost:3001/api/categories?limit=100&sort=name&order=asc')..."
```

Salida:

```text
status=200
categories=13
pagination={"currentPage":1,"totalPages":1,"totalResults":13,"hasNext":false,"hasPrev":false}
```

## 2. Plan

### 2.1 Backend

- No propongo cambios backend en esta fase.
- Justificacion:
  - `GET /categories` ya soporta `page` y `limit`.
  - Ya usa `skip/limit` con MongoDB.
  - Ya devuelve metadata suficiente para UI.
- Solo si durante implementacion aparece una incompatibilidad real no vista aqui, habria que documentarla antes de tocar backend.

### 2.2 Frontend

#### Opcion de menor riesgo recomendada

- Mantener `AdminCategoriesPage.jsx` casi intacto visualmente.
- Evolucionar `useAdminCategories()` para soportar paginacion sin cambiar radicalmente el CRUD.

#### Estados nuevos

- En `AdminCategoriesPage.jsx`:
  - `page`
- En el hook o en la pagina, segun diseño final:
  - `pagination`
  - `isLoading`
  - `isSaving`
  - `isDeleting`

#### Llamada API con parametros

- Sustituir `categoryApi.getAll({ limit: 100, sort: "name", order: "asc" })`
- Por algo como:

```text
categoryApi.getAll({ page, limit: 10, sort: "name", order: "asc" })
```

#### Componente de paginacion

- Agregar debajo del listado de categorias:
  - boton `Anterior`
  - texto `Pagina X de Y`
  - boton `Siguiente`
- Botones deshabilitados con `hasPrev` y `hasNext`.
- Mostrar controles solo si `totalPages > 1`.

#### Edge cases a cubrir

- Sin datos:
  - mantener el mensaje actual.
- Ultima pagina:
  - `Siguiente` deshabilitado.
- Loading:
  - conservar estado actual.
- Borrado del ultimo item de la pagina:
  - si la pagina queda vacia y `page > 1`, retroceder a `page - 1`.
- Selector de categoria padre:
  - no debe depender solo de la pagina actual del listado.
  - recomendacion segura: seguir cargando opciones de padres por separado con `limit=100` o con una query dedicada solo para `parentOptions`, mientras el listado visible si usa paginacion.

### 2.3 UI/UX

- Ubicacion recomendada: debajo de `admin-categories-list__items`, igual al patron ya usado en Home/Admin Products.
- Mantener layout actual de dos columnas.
- Reutilizar estilos existentes del modulo y agregar solo una clase ligera para la barra de paginacion.
- No introducir selector de page size en esta fase para no aumentar riesgo.

### 2.4 Riesgos y mitigacion

- Riesgo: romper `parentOptions` al paginar el mismo dataset.
  - Mitigacion: separar lista paginada visible de opciones completas para categoria padre.
- Riesgo: romper CRUD por cambiar demasiado el hook.
  - Mitigacion: mantener `saveCategory` y `deleteCategory` con el mismo contrato, cambiando solo la query de listado.
- Riesgo: pagina vacia tras delete.
  - Mitigacion: ajustar `page` despues de borrar si ya no quedan items visibles.
- Riesgo: inconsistencia con estilos.
  - Mitigacion: agregar estilos minimos y coherentes, sin tocar estructura principal.

## 3. Riesgos

- El riesgo tecnico principal no es backend; es frontend por la dependencia actual entre listado visible y selector de categoria padre.
- Tambien hay riesgo menor de regresion porque hoy no existe test dedicado del modulo, asi que convendra agregar cobertura minima al ejecutar.
- No se detecta impacto directo en otros modulos si se limita el cambio a `AdminCategoriesPage` y/o `useAdminCategories`.

## 4. Checklist

### Checklist de seguridad

- ¿Se rompe algo existente?
  - No deberia, si se conserva CRUD y se separa correctamente el origen de `parentOptions`.
- ¿Afecta otros modulos?
  - No deberia afectar Home, Products ni Orders si el cambio queda aislado al modulo de categorias.
- ¿Requiere cambios en tests?
  - Si. Hace falta agregar o crear tests minimos para `AdminCategoriesPage`, porque hoy no existe archivo de prueba localizado.
- ¿Impacta Cypress?
  - Potencialmente si hay specs admin que asumen lista completa en una sola vista. No se verifico una spec especifica en esta fase, asi que debe revisarse al ejecutar.

### Plan resumido de ejecucion futura

1. Ajustar listado de categorias para consumir `page/limit/pagination`.
2. Mantener opciones de categoria padre con una fuente segura separada o una estrategia que no dependa de la pagina visible.
3. Agregar controles de paginacion sin romper layout.
4. Crear tests minimos del modulo.
5. Validar CRUD, empty state, ultima pagina y borrado del ultimo item.

## Estado

Plan listo. No se ejecuto ningun cambio de codigo.

No ejecutar hasta recibir: `APROBADO – EJECUTAR PLAN`.
