# Diagnostico productos Home vs Admin

## Objetivo

Auditar por que en la pagina de inicio no aparecen todos los productos visibles en administracion y confirmar el estado real de la paginacion sin modificar codigo.

## Contexto

- Frontend: React + Vite
- Backend: Node + Express + MongoDB
- Vista observada: `http://localhost:5173/`
- Hallazgo visible reportado: admin muestra mas productos que Home y no se ve paginacion en inicio.

## Archivos revisados

### Backend

- `ecommerce-api-Nars/src/routes/productRoutes.js`
- `ecommerce-api-Nars/src/controllers/productController.js`
- `ecommerce-api-Nars/src/models/product.js`
- `ecommerce-api-Nars/src/utils/pagination.js`
- `ecommerce-api-Nars/src/validators/productValidator.js`
- `ecommerce-api-Nars/server.js`
- `ecommerce-api-Nars/src/config/database.js`

### Frontend

- `ecommerce-app-Nars/src/api/apiClient.js`
- `ecommerce-app-Nars/src/api/productApi.js`
- `ecommerce-app-Nars/src/services/productService.js`
- `ecommerce-app-Nars/src/pages/HomePage.jsx`
- `ecommerce-app-Nars/src/components/organisms/ProductList.jsx`
- `ecommerce-app-Nars/src/components/molecules/ProductCard.jsx`
- `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx`
- `ecommerce-app-Nars/.env.local`

## Variables y endpoints relevantes

- Frontend consume `VITE_API_URL=http://localhost:3001/api`
- Backend corre en `PORT=3001`
- Endpoint publico de catalogo: `GET /api/products`
- No existe un endpoint admin separado para listar productos en la pantalla de administracion revisada.
- La vista admin usa el mismo endpoint publico con `limit=100`.

## Evidencia de terminal y comandos ejecutados

### Conteo real en MongoDB

Comando:

```text
node -e "const mongoose=require('mongoose'); (async()=>{await mongoose.connect('mongodb://localhost:27017/ecommerce-db-jewelry'); const count=await mongoose.connection.db.collection('products').countDocuments({}); console.log('products_in_db=' + count); ... })()"
```

Resultado relevante:

```text
products_in_db=21
```

### Endpoint publico sin parametros

Comando:

```text
node -e "fetch('http://localhost:3001/api/products')..."
```

Resultado relevante:

```text
status=200
items=10
total=21
pagination={"currentPage":1,"totalPages":3,"totalResults":21,"hasNext":true,"hasPrev":false}
```

Resumen estructurado de la respuesta:

```json
{
  "page": 1,
  "limit": 10,
  "total": 21,
  "firstItemNames": [
    "Anillo de plata grabado Laser",
    "Anillo de resina arcoiris",
    "Anillo latón con turquesa",
    "Anillo simple de plata",
    "Aretes de plata minimalistas",
    "Aretes de resina con glitter",
    "Bolsa terciopelo premium",
    "Broqueles hipoalergénicos",
    "Caja para regalo mediana",
    "Charm bracelet rosca plata"
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalResults": 21,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Mismo endpoint con `limit=100` (equivalente funcional a admin)

Comando:

```text
node -e "fetch('http://localhost:3001/api/products?limit=100')..."
```

Resultado relevante:

```text
status=200
items=21
total=21
pagination={"currentPage":1,"totalPages":1,"totalResults":21,"hasNext":false,"hasPrev":false}
```

## Validaciones minimas solicitadas

1. Cantidad de productos en base de datos: `21`
2. Cantidad que devuelve el endpoint publico: `10` por default
3. Cantidad que devuelve el flujo admin: `21`, porque usa `GET /products?limit=100`
4. Cantidad que renderiza Home: `10` en el flujo general actual, porque `HomePage` consume `fetchProducts()` sin params y `ProductList` renderiza todo lo recibido sin slices adicionales
5. Parametro `limit` aplicado: si, backend usa `defaultLimit = 10`
6. Paginacion en backend: si, existe y responde con `pagination.currentPage`, `totalPages`, `hasNext`, `hasPrev`
7. Componente visual de paginacion en frontend Home: no se encontro
8. Filtro por estado / stock / visibilidad: no existe en el endpoint auditado para Home
9. Omision por imagen faltante o stock: no; `ProductCard` muestra placeholder si no hay imagen y solo cambia CTA si no hay stock
10. Errores observados en terminal relacionados con productos: no aparecieron errores en las consultas auditadas

## Hallazgos

### A. Hallazgo principal

La causa raiz mas probable es una combinacion de dos cosas:

1. El backend pagina `GET /products` con `limit=10` por defecto en `ecommerce-api-Nars/src/controllers/productController.js:19` usando `getPagination(req, 10)`.
2. Home nunca envia `page` ni `limit`, y tampoco muestra controles de paginacion en `ecommerce-app-Nars/src/pages/HomePage.jsx:19-22`.

Resultado: Home siempre carga solo la primera pagina de 10 productos, aunque existan 21 en MongoDB.

### B. Hallazgos secundarios

- No hay endpoint admin separado para listado. La administracion usa el mismo endpoint publico con `limit=100` en `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx:71-74`.
- La paginacion backend si existe y funciona. La respuesta incluye `pagination`, pero Home no la consume.
- `productApi.getAll()` preserva metadatos de paginacion en `ecommerce-app-Nars/src/api/productApi.js:24-31`, pero `fetchProducts()` los descarta y devuelve solo el array de productos en `ecommerce-app-Nars/src/services/productService.js:19-23`.
- `HomePage` trata `data` como `products = []`, o sea, como una lista plana; no mantiene `page`, `limit`, `totalPages` ni `hasNext`.
- `ProductList` no recorta ni filtra localmente; renderiza todos los elementos recibidos en `ecommerce-app-Nars/src/components/organisms/ProductList.jsx:14-21`.
- `ProductCard` no oculta productos por falta de imagen o stock; solo cambia la accion visible en `ecommerce-app-Nars/src/components/molecules/ProductCard.jsx:41-104`.
- El endpoint publico no filtra por `stock`, `active`, `status`, `deletedAt` ni visibilidad. En `ecommerce-api-Nars/src/controllers/productController.js:21-28` solo filtra por `q`, `category`, `material`, `design`, `stone`.

### C. Impacto

- Visibilidad de productos: Home deja fuera 11 productos existentes.
- UX: el usuario percibe un catalogo incompleto sin explicacion ni forma de navegar a paginas siguientes.
- Consistencia admin vs inicio: admin y Home muestran cantidades distintas aun usando el mismo origen de datos.
- Paginacion: backend cumple, frontend Home no la presenta ni la interpreta.
- Cumplimiento funcional: la paginacion fue contemplada tecnicamente en API, pero no esta implementada visualmente en la pantalla de inicio.

### D. Riesgos

- Si se corrige solo aumentando `limit` en Home, se oculta el problema de integracion y se pierde la paginacion real.
- Si se cambia el contrato de `fetchProducts()` sin revisar consumidores, se puede romper `HomePage` u otros usos del servicio.
- Si se toca el endpoint de productos para devolver todo por default, se puede afectar rendimiento y expectativas de otras vistas.
- Si se agrega paginacion visual sin sincronizar `search`, `page` y React Query, se pueden producir estados inconsistentes, cache incorrecta o UX confusa.

## Causa raiz probable

Home no esta rota por datos faltantes en MongoDB ni por filtros ocultos; esta limitada por una paginacion backend real que el frontend de inicio no expone ni maneja. Admin parece mostrar "todos" porque pide el mismo endpoint con `limit=100`, no porque use una ruta distinta.

## Plan de accion propuesto

### Paso 1

- Archivo(s): `ecommerce-app-Nars/src/services/productService.js`, `ecommerce-app-Nars/src/pages/HomePage.jsx`
- Cambio propuesto: dejar de devolver solo `products` desde `fetchProducts()` y entregar tambien metadatos de paginacion, o crear una variante nueva solo para Home que preserve `products + pagination`.
- Por que resuelve: Home necesita saber cuantas paginas existen y cual esta activa.
- Riesgo: medio si se cambia el contrato actual del servicio compartido; bajo si se crea una variante nueva enfocada a Home.
- Validacion: verificar que Home sigue listando productos y que no se rompen otras vistas que usen `productService`.

### Paso 2

- Archivo(s): `ecommerce-app-Nars/src/pages/HomePage.jsx`
- Cambio propuesto: introducir estado de pagina y enviar `page`/`limit` al backend; opcionalmente sincronizar `page` con query params.
- Por que resuelve: Home dejaria de pedir siempre la pagina 1 implicita.
- Riesgo: bajo-medio por cache de React Query y combinacion con `search`.
- Validacion: comprobar pagina 1, siguiente, anterior, y comportamiento al buscar.

### Paso 3

- Archivo(s): `ecommerce-app-Nars/src/pages/HomePage.jsx` y/o un componente nuevo de paginacion reutilizable
- Cambio propuesto: agregar controles visuales de paginacion usando `pagination.currentPage`, `totalPages`, `hasNext`, `hasPrev`.
- Por que resuelve: hace visible la paginacion que backend ya implementa.
- Riesgo: bajo si se hace incremental y sin rehacer `ProductList`.
- Validacion: asegurar que se rendericen los 10 de pagina 1, luego los siguientes, y que el texto de pagina sea correcto.

### Paso 4

- Archivo(s): tests de Home y posiblemente de `productService`
- Cambio propuesto: agregar o ajustar pruebas para respuesta paginada y renderizado por pagina.
- Por que resuelve: evita regresiones y documenta el contrato de integracion correcto.
- Riesgo: bajo.
- Validacion: ejecutar tests del frontend relacionados con Home y build.

## Criterios de validacion despues de corregir

- Home debe renderizar exactamente la cantidad de productos de la pagina actual.
- Debe existir un control visible para navegar entre paginas o una decision documentada de pedir todo el catalogo explicitamente.
- El numero total de productos visibles a lo largo de las paginas debe coincidir con `totalResults` del backend.
- Admin debe seguir mostrando su lista actual.
- La busqueda no debe romper la navegacion entre paginas.
- No deben aparecer errores de red ni errores de render en consola/terminal.

## Recomendacion

- No tocar backend primero.
- El problema principal esta en frontend/integracion: Home ignora la paginacion ya existente.
- La correccion mas segura es consumir la metadata ya disponible y agregar paginacion visual en Home sin alterar la API publica.

## Cierre

Diagnostico terminado. No se realizo ninguna modificacion. Quedo en espera de liberacion para ejecutar el plan.
