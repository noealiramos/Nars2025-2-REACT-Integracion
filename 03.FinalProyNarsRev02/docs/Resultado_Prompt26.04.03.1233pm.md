# Pre-implementacion detallada MP-02

Modo aplicado: pre-implementacion detallada. No se implemento ningun cambio de codigo de produccion.

## 1) Archivos a modificar

### Archivos nuevos previstos

- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\src\pages\ProfilePage.jsx`
  - tipo: nuevo
  - proposito: pagina de perfil protegida consumiendo `GET /api/users/me`

- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\src\pages\ProfilePage.css`
  - tipo: nuevo
  - proposito: estilos especificos de perfil, si no alcanza con estilos globales

- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\src\services\userService.js`
  - tipo: nuevo
  - proposito: encapsular consumo de `/api/users/me` sin acoplar la pagina al cliente HTTP crudo

- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\src\pages\__tests__\ProfilePage.test.jsx`
  - tipo: nuevo
  - proposito: cubrir render, loading, error y datos reales del perfil a nivel de componente

### Archivos modificados previstos

- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\src\App.jsx`
  - tipo: modificado
  - proposito: registrar la nueva ruta protegida `/profile`

- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\src\components\organisms\SiteHeader.jsx`
  - tipo: modificado
  - proposito: exponer navegacion al perfil autenticado

- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\src\components\organisms\__tests__\SiteHeader.test.jsx`
  - tipo: modificado
  - proposito: evitar regresion en header autenticado y nuevo enlace de perfil

- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\docs\iteraciones\iteracion-1-2026-04-03-1155.md`
  - tipo: modificado
  - proposito: anexar el resultado de MP-02 cuando se ejecute

### Eliminados

- Ninguno previsto.

## 2) Impacto en contratos (critico)

### Auth

- cambios: no en el contrato backend; si en consumo frontend de un endpoint ya existente
- justificacion tecnica:
  - MP-02 no altera `login`, `register`, `logout`, `refresh` ni almacenamiento de tokens.
  - solo agrega lectura de `GET /api/users/me`, ya expuesto por `ecommerce-api-Nars/src/routes/userRoutes.js:27` y respondido por `ecommerce-api-Nars/src/controllers/userController.js:6` con `200 { data: user }`.
  - el token se sigue adjuntando por `ecommerce-app-Nars/src/api/apiClient.js`; no se necesita nuevo payload ni headers custom.
- riesgo de regresion: bajo

### Cart

- cambios: no
- justificacion tecnica:
  - MP-02 no toca `CartContext`, `cartApi`, `CartPage` ni su routing.
  - el unico punto compartido es el header; agregar un enlace adicional no cambia el contador, los handlers ni el consumo del carrito.
- riesgo de regresion: bajo

### Checkout

- cambios: no
- justificacion tecnica:
  - MP-02 no modifica `CheckoutPage`, `orderApi`, `shippingApi`, `paymentApi` ni rutas relacionadas.
  - la nueva pagina de perfil es un flujo paralelo de lectura, no participa en el pipeline `cart -> checkout -> confirmation`.
- riesgo de regresion: bajo

## 3) Plan de implementacion (paso a paso)

### Paso 1. Crear servicio de perfil

- accion:
  - crear `src/services/userService.js`
  - exponer una funcion tipo `getCurrentProfile()` que consuma `/users/me` y normalice `response.data?.data`
- objetivo:
  - aislar contrato backend y mantener la pagina desacoplada del cliente HTTP
- validacion al final del paso:
  - `npm test`
  - `npm run build`
  - confirmar verde y sin warnings criticos

### Paso 2. Crear `ProfilePage`

- accion:
  - crear `src/pages/ProfilePage.jsx`
  - manejar `loading`, `error`, `data`
  - mostrar como minimo `displayName`, `email`, `role`, `phone`, `active`
  - usar valores defensivos si algun campo opcional viene vacio
- objetivo:
  - cumplir rubrica de pagina de perfil con datos reales
- validacion al final del paso:
  - `npm test`
  - `npm run build`
  - confirmar verde y sin warnings criticos

### Paso 3. Registrar la ruta protegida

- accion:
  - modificar `src/App.jsx`
  - agregar `/profile` dentro de `PrivateRoute`
- objetivo:
  - impedir acceso anonimo y reutilizar la guardia ya establecida
- validacion al final del paso:
  - `npm test`
  - `npm run build`
  - confirmar verde y sin warnings criticos

### Paso 4. Exponer acceso desde header

- accion:
  - modificar `src/components/organisms/SiteHeader.jsx`
  - agregar enlace `Mi perfil` visible solo para autenticados
- objetivo:
  - descubrir la funcionalidad sin afectar el resto del header
- validacion al final del paso:
  - `npm test`
  - `npm run build`
  - confirmar verde y sin warnings criticos

### Paso 5. Agregar cobertura de tests

- accion:
  - crear `src/pages/__tests__/ProfilePage.test.jsx`
  - extender `src/components/organisms/__tests__/SiteHeader.test.jsx`
- objetivo:
  - validar la nueva ruta y el nuevo acceso sin introducir regresiones visibles
- validacion al final del paso:
  - `npm test`
  - `npm run build`
  - confirmar verde y sin warnings criticos

### Paso 6. Actualizar documentacion de iteracion

- accion:
  - anexar MP-02 a `docs/iteraciones/iteracion-1-2026-04-03-1155.md`
- objetivo:
  - mantener trazabilidad de la iteracion
- validacion al final del paso:
  - no requiere test funcional adicional por si mismo, pero se conserva el ultimo `npm test` y `npm run build` verdes del paso 5

## 4) Estrategia de testing

### Tests existentes que podrian romperse

- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-app-Nars\src\components\organisms\__tests__\SiteHeader.test.jsx`
  - hoy solo verifica el badge del carrito.
  - puede romper si el header autenticado cambia estructura y el mock de `useAuth` queda incompleto.

- potencialmente cualquier test que renderice `App.jsx`
  - hoy no hay evidencia de un test directo de `App`, pero agregar una nueva ruta puede afectar snapshots futuros o navegacion si se agregaran luego.

### Nuevos tests propuestos

- `ProfilePage.test.jsx`
  - caso `loading`
  - caso `error`
  - caso exito con datos reales del perfil
  - opcional: manejo de campo `phone` ausente

- ajuste de `SiteHeader.test.jsx`
  - mantener prueba actual del badge
  - agregar caso autenticado con enlace `Mi perfil`

### Nivel de aislamiento vs integracion

- `ProfilePage.test.jsx`: aislamiento medio
  - mockear el servicio `userService`, no el cliente HTTP crudo ni el backend entero
  - esto evita mocks innecesarios y mantiene el contrato de servicio como unidad testeable

- `SiteHeader.test.jsx`: aislamiento alto razonable
  - mock de `useAuth` y `useCart` como ya hace el test existente

### Riesgo de falsos positivos

- medio
- si `userService` se mockea y luego el contrato real `/users/me` cambia, el componente puede seguir verde.
- mitigacion:
  - mantener el servicio minimalista
  - no mockear simultaneamente `ProfilePage`, `userService`, `apiClient` y `useAuth`
  - comprobar manualmente en una siguiente fase o con E2E que `/profile` carga con sesion real

## 5) Riesgos tecnicos

### Posibles regresiones

- header autenticado puede saturarse visualmente o romper layout responsive al agregar un nuevo link
- si `ProfilePage` asume campos que no siempre llegan, puede renderizar `undefined`
- si el servicio interpreta mal la forma `{ data: user }`, la pagina puede quedar en error pese a contrato correcto

### Dependencias sensibles

- `ecommerce-app-Nars/src/api/apiClient.js`
  - cualquier fallo de token/401 afectaria la carga del perfil

- `ecommerce-app-Nars/src/contexts/AuthContext.jsx`
  - la visibilidad del link depende de `isAuthenticated` y `user`

- backend `GET /api/users/me`
  - respuesta actual depende de auth middleware y de `req.user?.id || req.user?.userId`

### Puntos de acoplamiento

- `ProfilePage` con la forma exacta del backend `{ data: user }`
- `SiteHeader` con el shape de `user.displayName`
- `App.jsx` con la estrategia actual de `PrivateRoute`

### Efectos secundarios ocultos

- si el header usa texto o estructura muy rigida en CSS, un nuevo `NavLink` puede afectar wrapping o alineacion
- si el perfil falla por 401, podria dispararse el flujo global `auth-error` via interceptor y provocar logout; eso no es nuevo, pero se vuelve mas visible con esta pagina

## 6) Criterios de validacion

Al final de cada paso se debe ejecutar:

- `npm test`
- `npm run build`

Y confirmar:

- tests en verde
- build exitoso
- sin warnings criticos

Estado esperado para aceptar MP-02:

- `ProfilePage` accesible solo para autenticados
- `SiteHeader` muestra un acceso claro al perfil cuando hay sesion
- el perfil consume datos reales desde `/api/users/me`
- no hay impacto observable en carrito ni checkout
- el suite de tests sigue verde

## 7) Salida esperada

No se implemento nada en esta etapa.

Se entrega:

- plan completo
- analisis tecnico
- riesgos
- prompt de ejecucion controlada para MP-02

Y se detiene la ejecucion hasta que el siguiente prompt sea usado.

## Prompt generado: MP-02-EXEC

```text
Ejecuta MP-02 en modo controlado e incremental.

Objetivo:
Implementar `ProfilePage` real con datos de `GET /api/users/me`, agregar la ruta protegida `/profile` y exponer acceso desde `SiteHeader`, sin romper contratos existentes.

Reglas estrictas:
1. Ejecuta solo MP-02.
2. No hagas cambios big-bang.
3. Implementa exactamente en este orden:
   - Paso 1: crear `src/services/userService.js`
   - Paso 2: crear `src/pages/ProfilePage.jsx` y `ProfilePage.css` si hace falta
   - Paso 3: registrar `/profile` en `src/App.jsx` usando `PrivateRoute`
   - Paso 4: agregar enlace de perfil en `src/components/organisms/SiteHeader.jsx`
   - Paso 5: crear `src/pages/__tests__/ProfilePage.test.jsx` y ajustar `src/components/organisms/__tests__/SiteHeader.test.jsx`
   - Paso 6: actualizar `docs/iteraciones/iteracion-1-2026-04-03-1155.md`
4. Despues de cada paso corre:
   - `npm test`
   - `npm run build`
5. Reporta despues de cada paso:
   - archivos modificados
   - impacto en contratos auth/cart/checkout
   - resultado real de tests
   - resultado real de build
6. Si detectas riesgo alto o ambiguedad material, detente antes de seguir.
7. No avances a MP-03.

Condiciones de aceptacion:
- `/profile` existe y esta protegida
- `SiteHeader` enlaza al perfil autenticado
- la pagina consume `GET /api/users/me` sin cambiar el backend
- tests verdes
- build exitoso
- sin warnings criticos
```

## Anexo de evidencia revisada

- `ecommerce-app-Nars/src/App.jsx`: no existe ruta `/profile`; solo `/orders` y `/checkout` estan protegidas.
- `ecommerce-app-Nars/src/components/organisms/SiteHeader.jsx`: no existe enlace a perfil; solo `Mis órdenes` y saludo autenticado.
- `ecommerce-api-Nars/src/routes/userRoutes.js:27`: expone `GET /me` con `authMiddleware`.
- `ecommerce-api-Nars/src/controllers/userController.js:12`: responde `200` con `{ data: user }`.
- `ecommerce-api-Nars/src/models/user.js`: campos relevantes disponibles para perfil: `displayName`, `email`, `role`, `phone`, `avatar`, `active`.

## Anexo de terminal

No se ejecutaron comandos de terminal en esta etapa. La evidencia se obtuvo por lectura directa de archivos del repositorio.
