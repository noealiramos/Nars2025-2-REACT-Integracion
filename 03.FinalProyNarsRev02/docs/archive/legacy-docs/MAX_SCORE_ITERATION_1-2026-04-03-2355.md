# MAX SCORE ITERATION 1

## 0. LOG COMPLETO DE EJECUCION

Se entra en Iteracion 1 con alcance limitado a quick wins de bajo riesgo:

- `GuestOnlyRoute`
- lazy loading en `HomePage`, `ProductDetailPage`, `CheckoutPage` y `ProfilePage`

Analisis previo a implementar:

- Archivos a modificar:
  - `ecommerce-app-Nars/src/App.jsx`
  - `ecommerce-app-Nars/src/components/organisms/GuestOnlyRoute.jsx`
- Impacto esperado:
  - `GuestOnlyRoute` solo afecta `/login` y `/register`; usuarios autenticados serán redirigidos al home en lugar de volver a pantallas de auth.
  - El lazy loading solo cambia la forma de cargar estas rutas: `/`, `/product/:id`, `/checkout`, `/profile`.
  - No cambia contratos backend/frontend, payloads ni reglas de negocio.
  - No rompe rutas existentes porque los paths y guards actuales se conservan; solo se envuelven en `React.lazy`, `Suspense` y `GuestOnlyRoute`.

Implementacion ejecutada:

- Se creo `GuestOnlyRoute` con el mismo patron de seguridad/carga que `PrivateRoute`.
- Se migro `App.jsx` para usar `React.lazy` y `Suspense` en las 4 rutas exigidas.
- Se aplico `GuestOnlyRoute` a `/login` y `/register`.
- Se mantuvieron intactas las rutas protegidas existentes (`/checkout`, `/profile`, `/orders`, `/orders/:id`, `/admin/products`).

Validaciones ejecutadas:

### `npm test`

```text
> ramdi-jewelry-ecommerce-css@1.0.0 test
> vitest run


 RUN  v4.1.1 D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-app-Nars


 Test Files  12 passed (12)
      Tests  62 passed (62)
   Start at  23:55:23
   Duration  17.68s (transform 2.42s, setup 5.45s, import 11.32s, tests 19.78s, environment 35.88s)
```

### `npm run build`

```text
> ramdi-jewelry-ecommerce-css@1.0.0 build
> vite build

vite v6.4.1 building for production...
transforming...
✓ 149 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                             0.50 kB │ gzip:  0.33 kB
dist/assets/ProfilePage-T72OpfHe.css        0.80 kB │ gzip:  0.40 kB
dist/assets/ProductDetailPage-BUzZyFVF.css  0.93 kB │ gzip:  0.44 kB
dist/assets/HomePage-D61setUH.css           2.19 kB │ gzip:  0.77 kB
dist/assets/CheckoutPage-CfYwGph3.css       2.21 kB │ gzip:  0.79 kB
dist/assets/index-CdnAoEEY.css             21.73 kB │ gzip:  4.85 kB
dist/assets/productService-DfeP_JWq.js      0.86 kB │ gzip:  0.37 kB
dist/assets/ProductDetailPage-DUw1sQCR.js   2.07 kB │ gzip:  0.90 kB
dist/assets/ProfilePage-B2cMBiKB.js         2.48 kB │ gzip:  1.07 kB
dist/assets/HomePage-Dpzwktdt.js            2.62 kB │ gzip:  1.21 kB
dist/assets/CheckoutPage-CQTfOUm9.js       11.29 kB │ gzip:  3.69 kB
dist/assets/index-BidQx7mD.js             253.69 kB │ gzip: 82.31 kB
✓ built in 5.26s
```

### `npm run dev` + verificacion de navegación base

Se arranco servidor dev en segundo plano y luego se verifico respuesta HTTP local.

```text
200
<!doctype html>
<html lang="es" data-theme="dark">
  <head>
    <script type="module">import { injectIntoGlobalHook } fr
```

### Timestamp de evidencia

```text
2026-04-03-2355
```

Conclusiones operativas de la iteracion:

- `GuestOnlyRoute` ya existe y cubre `/login` y `/register`.
- Las 4 rutas objetivo ya se cargan con lazy loading.
- No se detectaron rupturas en tests ni build.
- La salida de build confirma code splitting real para `HomePage`, `ProductDetailPage`, `CheckoutPage` y `ProfilePage`.
- La verificacion del servidor dev confirma que la app sigue levantando correctamente.

## 1. Objetivo

Cerrar los quick wins de menor riesgo y alto retorno para la rubrica:

- `III.4 Rutas Protegidas (ProtectedRoute / GuestOnly)`
- `III.7 Lazy Loading con React.lazy / Suspense`

## 2. Brechas detectadas

### Implementacion real

- No existia `GuestOnlyRoute` explicito para `/login` y `/register`.
- No existia lazy loading en rutas principales.

### Evidencia / documentacion / demo

- Aunque la app funcionaba, no habia evidencia de redireccion para usuarios ya autenticados en rutas de auth.
- Tampoco habia evidencia de code splitting real en build.

## 3. Estrategia de cierre

Orden optimo aplicado:

1. Crear `GuestOnlyRoute` con el mismo patron seguro de `PrivateRoute`.
2. Integrarlo solo en `/login` y `/register` para no tocar rutas ajenas.
3. Migrar a `React.lazy + Suspense` solo las 4 rutas pedidas.
4. Validar dev server, tests y build.

Justificacion:

- Impacto en puntaje: alto para dos criterios directos de la rubrica.
- Riesgo tecnico: bajo, porque no cambia payloads, servicios, contratos ni logica de negocio.
- Dependencias: minimas; todo se concentra en routing.

## 4. Iteraciones propuestas

### Iteracion 1 - Guest + Lazy

- objetivo:
  - cerrar `GuestOnlyRoute`
  - cerrar lazy loading minimo de 4 rutas
- criterios que cubre:
  - `III.4`
  - `III.7`
- archivos a modificar (estimados y usados):
  - `ecommerce-app-Nars/src/App.jsx`
  - `ecommerce-app-Nars/src/components/organisms/GuestOnlyRoute.jsx`
- riesgos:
  - loops de redireccion si `GuestOnlyRoute` se diseña mal
  - fallback roto si `Suspense` se monta incorrectamente
- validaciones obligatorias:
  - `npm run dev`
  - `npm test`
  - `npm run build`

### Iteracion 2 - Arquitectura React real

- objetivo:
  - atacar `useReducer + tercer contexto`
  - introducir React Query minimo viable
- criterios que cubre:
  - `III.1`
  - `III.2`
- archivos a modificar (estimados):
  - contextos globales
  - bootstrap de app
  - vistas con fetch principal
- riesgos:
  - romper la integracion actual validada
  - mezclar estados legacy y nuevos
- validaciones obligatorias:
  - `npm test`
  - `npm run build`
  - Cypress sanity

### Iteracion 3 - Extras visibles

- objetivo:
  - segundo CRUD admin visible
  - modelo adicional integrado al frontend
- criterios que cubre:
  - `V.2`
  - `V.3`
- archivos a modificar (estimados):
  - admin frontend
  - APIs de categorias o entidad extra
  - paginas nuevas
- riesgos:
  - ampliar demasiado alcance visual
  - deuda de validacion si no se hace con MVP disciplinado
- validaciones obligatorias:
  - `npm test`
  - `npm run build`
  - E2E focales nuevos si se implementan

### Iteracion 4 - Evidencia final de despliegue

- objetivo:
  - cerrar `I.3 Despliegue` con evidencia real
- criterios que cubre:
  - `I.3`
- archivos a modificar (estimados):
  - documentacion y potencialmente config de deploy si hace falta
- riesgos:
  - externos al repo (hosting, variables de entorno, servicios)
- validaciones obligatorias:
  - URL publica funcional
  - smoke manual

## 5. Diseño técnico mínimo por brecha

### 5.1 GuestOnlyRoute

- archivo:
  - `ecommerce-app-Nars/src/components/organisms/GuestOnlyRoute.jsx`
- integración en rutas:
  - envolver `/login`
  - envolver `/register`

### 5.2 Lazy loading

- rutas específicas:
  - `/`
  - `/product/:id`
  - `/checkout`
  - `/profile`
- uso de React.lazy + Suspense:
  - `React.lazy()` con import de componentes nombrados
  - `<Suspense fallback={<RouteFallback />}>`

### 5.3 useReducer + tercer contexto

- nombre del contexto:
  - sugerido: `CheckoutUIContext` o `UIContext`
- estado que manejará:
  - banners, modales, estados de feedback o selector de experiencia de compra
- por qué sí cumple la rúbrica:
  - agregaria el tercer contexto exigido y permitiria usar `useReducer` en una logica no trivial y transversal

### 5.4 React Query

- qué módulos migrar primero:
  - `HomePage`
  - `ProductDetailPage`
  - `OrdersPage`
  - lecturas de `CheckoutPage`
- cómo evitar romper lo existente:
  - migracion progresiva solo en lecturas primero
  - mantener APIs y servicios existentes como adaptadores si conviene

### 5.5 Segundo CRUD admin

- entidad elegida:
  - `Categorias`
- por qué es válida:
  - ya existen endpoints backend admin y ya hay consumo parcial en frontend para productos

### 5.6 Modelo adicional (CRUD)

- entidad elegida:
  - `Wishlist`
- endpoints necesarios:
  - `GET /wishlist`
  - `POST /wishlist/add`
  - `DELETE /wishlist/remove/:productId`
  - `DELETE /wishlist/clear`
  - opcional `POST /wishlist/move-to-cart`
- integración frontend:
  - pagina o modulo usuario con lista, agregar, quitar, limpiar y mover a carrito

### 5.7 Despliegue

- estado actual:
  - no hay evidencia fuerte de URL publica en el repo revisado
- pasos concretos para URL pública funcional:
  - definir hosting real FE y BE
  - configurar variables de entorno
  - probar auth, checkout y orders en URL publica
  - documentar esa URL en el repo

## 6. Riesgos de ruptura

- `GuestOnlyRoute` podria generar redirecciones no deseadas si se usa sobre rutas equivocadas.
- Lazy loading podria romper rutas si el import nombrado no se envuelve correctamente.
- El fallback de `Suspense` podria alterar percepcion visual de navegacion si es muy agresivo.

Mitigacion aplicada en Iteracion 1:

- solo se tocaron 2 archivos
- no se tocaron servicios ni contratos
- se validó con dev, tests y build

## 7. Orden final recomendado

1. Iteracion 1 - Guest + Lazy
2. Iteracion 2 - Arquitectura React real
3. Iteracion 3 - Extras visibles
4. Iteracion 4 - Evidencia de despliegue

## 8. Regla de ejecución

En este documento se declara explícitamente que la etapa pedida era Iteracion 1 y no se avanzó automáticamente a la siguiente iteración.
