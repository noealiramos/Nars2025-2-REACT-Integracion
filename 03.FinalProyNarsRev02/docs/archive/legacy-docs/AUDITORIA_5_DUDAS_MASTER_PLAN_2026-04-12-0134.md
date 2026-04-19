# AUDITORIA DE 5 DUDAS PREVIAS AL MASTER PLAN

## 1. Objetivo

Auditar el estado real del proyecto `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02` para responder con evidencia concreta cinco dudas tecnicas previas a la redaccion de un master plan. Este documento distingue entre hallazgos confirmados y hallazgos probables, cita archivos especificos y explicita cuando algo no fue encontrado.

## 2. Estructura inspeccionada

- Backend inspeccionado: `ecommerce-api-Nars/src/models`, `ecommerce-api-Nars/src/controllers`, `ecommerce-api-Nars/src/routes`, `ecommerce-api-Nars/src/middlewares`, `ecommerce-api-Nars/package.json`.
- Frontend inspeccionado: `ecommerce-app-Nars/src/pages`, `ecommerce-app-Nars/src/components`, `ecommerce-app-Nars/src/services`, `ecommerce-app-Nars/src/api`, `ecommerce-app-Nars/src/contexts`, `ecommerce-app-Nars/src/utils`, `ecommerce-app-Nars/src/index.css`, `ecommerce-app-Nars/package.json`.
- Archivos clave revisados para checkout: `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`, `ecommerce-app-Nars/src/api/shippingApi.js`, `ecommerce-app-Nars/src/api/paymentApi.js`, `ecommerce-api-Nars/src/routes/shippingAddressRoutes.js`, `ecommerce-api-Nars/src/routes/paymentMethodRoutes.js`, `ecommerce-api-Nars/src/controllers/orderController.js`.
- Archivos clave revisados para perfil: `ecommerce-api-Nars/src/routes/userRoutes.js`, `ecommerce-api-Nars/src/controllers/userController.js`, `ecommerce-app-Nars/src/pages/ProfilePage.jsx`, `ecommerce-app-Nars/src/services/userService.js`, `ecommerce-app-Nars/src/App.jsx`.
- Archivos clave revisados para imagenes de producto: `ecommerce-api-Nars/src/models/product.js`, `ecommerce-api-Nars/src/controllers/productController.js`, `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx`, `ecommerce-app-Nars/src/services/productService.js`, `ecommerce-app-Nars/src/components/molecules/ProductCard.jsx`, `ecommerce-app-Nars/src/pages/ProductDetailPage.jsx`.
- Archivos clave revisados para estilos: `ecommerce-app-Nars/package.json`, `ecommerce-app-Nars/src/main.jsx`, `ecommerce-app-Nars/src/index.css`, `ecommerce-app-Nars/src/components/atoms/TextInput.css`, `ecommerce-app-Nars/src/pages/AdminProductsPage.css`, `ecommerce-app-Nars/src/pages/AdminCategoriesPage.css`.

## 3. Respuesta a la duda 1: direcciones y metodos de pago

### Direcciones

Estado: confirmado.

- Se guardan en una coleccion propia de MongoDB llamada `ShippingAddress`, no embebidas dentro de `User`.
  - Evidencia: `ecommerce-api-Nars/src/models/shippingAddress.js:3` define `shippingAddressSchema`.
  - Evidencia: `ecommerce-api-Nars/src/models/shippingAddress.js:4` relaciona cada direccion con `user` por `ObjectId`.
  - Evidencia: `ecommerce-api-Nars/src/models/user.js:3` no contiene campos de direcciones.
- Existen rutas backend reales para crear, listar, consultar, actualizar, marcar default y eliminar direcciones.
  - Evidencia: `ecommerce-api-Nars/src/routes/index.js:28` monta `/shipping-addresses`.
  - Evidencia: `ecommerce-api-Nars/src/routes/shippingAddressRoutes.js:103` crea direccion por `POST /`.
  - Evidencia: `ecommerce-api-Nars/src/routes/shippingAddressRoutes.js:112` lista direcciones del usuario autenticado por `GET /`.
  - Evidencia: `ecommerce-api-Nars/src/routes/shippingAddressRoutes.js:136` actualiza por `PUT /:addressId`.
  - Evidencia: `ecommerce-api-Nars/src/routes/shippingAddressRoutes.js:149` actualiza parcialmente por `PATCH /:addressId`.
- El controlador persiste y consulta direcciones reales en MongoDB.
  - Evidencia: `ecommerce-api-Nars/src/controllers/shippingAddressController.js:30` usa `ShippingAddress.create(...)`.
  - Evidencia: `ecommerce-api-Nars/src/controllers/shippingAddressController.js:67` usa `ShippingAddress.find(...)`.
  - Evidencia: `ecommerce-api-Nars/src/controllers/shippingAddressController.js:156` carga una direccion existente para actualizarla.
- En frontend, el checkout consume estas direcciones via API y tambien las cachea en `localStorage` por usuario.
  - Evidencia: `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:40` lee cache desde `localStorage`.
  - Evidencia: `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:53` escribe cache en `localStorage`.
  - Evidencia: `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:177` consulta direcciones guardadas.
  - Evidencia: `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:278` crea una nueva direccion durante checkout.
  - Evidencia: `ecommerce-app-Nars/src/api/shippingApi.js:5` usa `GET /shipping-addresses`.
  - Evidencia: `ecommerce-app-Nars/src/api/shippingApi.js:9` usa `POST /shipping-addresses`.

Conclusion de direcciones: persistencia principal en coleccion propia MongoDB, con cache auxiliar en `localStorage` del frontend para reutilizacion en checkout.

### Metodos de pago

Estado: confirmado.

- Se guardan en una coleccion propia de MongoDB llamada `PaymentMethod`, no embebidos dentro de `User`.
  - Evidencia: `ecommerce-api-Nars/src/models/paymentMethod.js:6` define `paymentMethodSchema`.
  - Evidencia: `ecommerce-api-Nars/src/models/paymentMethod.js:7` relaciona cada metodo con `user` por `ObjectId`.
  - Evidencia: `ecommerce-api-Nars/src/models/user.js:3` no contiene campos de metodos de pago.
- Existen rutas backend reales para listar, consultar por usuario, crear, actualizar, marcar default, desactivar y hacer soft delete.
  - Evidencia: `ecommerce-api-Nars/src/routes/index.js:38` monta rutas de payment methods.
  - Evidencia: `ecommerce-api-Nars/src/routes/paymentMethodRoutes.js:59` expone `GET /payment-methods` para admin.
  - Evidencia: `ecommerce-api-Nars/src/routes/paymentMethodRoutes.js:73` expone `GET /payment-methods/user/:userId`.
  - Evidencia: `ecommerce-api-Nars/src/routes/paymentMethodRoutes.js:92` expone `POST /payment-methods`.
  - Evidencia: `ecommerce-api-Nars/src/routes/paymentMethodRoutes.js:127` expone `PUT /payment-methods/:id`.
  - Evidencia: `ecommerce-api-Nars/src/routes/paymentMethodRoutes.js:137` expone `DELETE /payment-methods/:id` como soft delete.
- El controlador persiste y administra metodos reales en MongoDB.
  - Evidencia: `ecommerce-api-Nars/src/controllers/paymentMethodController.js:174` usa `PaymentMethod.create(payload)`.
  - Evidencia: `ecommerce-api-Nars/src/controllers/paymentMethodController.js:204` carga el metodo para actualizarlo.
  - Evidencia: `ecommerce-api-Nars/src/controllers/paymentMethodController.js:314` desactiva por `findByIdAndUpdate`.
- En frontend, checkout consulta y crea metodos de pago via API y tambien los cachea en `localStorage`.
  - Evidencia: `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:164` lee cache de metodos de pago.
  - Evidencia: `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:178` consulta metodos guardados.
  - Evidencia: `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:295` crea un metodo de pago nuevo.
  - Evidencia: `ecommerce-app-Nars/src/api/paymentApi.js:5` usa `GET /payment-methods/user/:userId`.
  - Evidencia: `ecommerce-app-Nars/src/api/paymentApi.js:9` usa `POST /payment-methods`.

Conclusion de metodos de pago: persistencia principal en coleccion propia MongoDB, con cache auxiliar en `localStorage` del frontend para reutilizacion en checkout.

Respuesta consolidada a la duda 1: confirmado que direcciones y metodos de pago no viven en `User`; viven en entidades propias relacionadas (`ShippingAddress` y `PaymentMethod`) y el checkout mantiene una copia cacheada en `localStorage`. `sessionStorage` no fue encontrado para este flujo.

## 4. Respuesta a la duda 2: campo real de imagenes de producto

Estado: confirmado, con discrepancia de nombres entre persistencia y consumo visual.

- El nombre real del campo en el modelo Mongoose es `imagesUrl`.
  - Evidencia: `ecommerce-api-Nars/src/models/product.js:11` define `imagesUrl` como arreglo de strings.
- En backend, los controladores de producto esperan y guardan `imagesUrl`.
  - Evidencia: `ecommerce-api-Nars/src/controllers/productController.js:96` desestructura `imagesUrl` desde `req.body`.
  - Evidencia: `ecommerce-api-Nars/src/controllers/productController.js:121` persiste `imagesUrl` al crear producto.
- En frontend admin, el formulario usa un campo local llamado `imageUrl`, pero lo transforma al payload real `imagesUrl`.
  - Evidencia: `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx:26` usa `imageUrl` en el estado del formulario.
  - Evidencia: `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx:165` construye `imagesUrl: form.imageUrl.trim() ? [form.imageUrl.trim()] : []`.
  - Evidencia: `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx:243` muestra el input "Imagen principal (URL)" enlazado a `imageUrl`.
- En frontend de consumo, la UI muestra `product.image`, pero ese valor es derivado desde `imagesUrl`.
  - Evidencia: `ecommerce-app-Nars/src/services/productService.js:7` normaliza `image` desde `imagesUrl[0]` o `imagesUrl`.
  - Evidencia: `ecommerce-app-Nars/src/components/molecules/ProductCard.jsx:13` consume `image` para renderizar la card.
  - Evidencia: `ecommerce-app-Nars/src/pages/ProductDetailPage.jsx:79` consume `product.image` para detalle.
- Hay rastros heredados de `image` en otras capas, pero no como campo real del modelo.
  - Evidencia: `ecommerce-api-Nars/src/controllers/cartController.js:13` popula `'imagesUrl image'`.
  - Evidencia: `ecommerce-app-Nars/src/contexts/CartContext.jsx:23` hace fallback `product.imagesUrl || product.image`.
  - Evidencia: `ecommerce-app-Nars/src/data/products.js:8` usa `image` en datos locales heredados.

Conclusion: el campo real y persistido es `imagesUrl`. `imageUrl` es solo el nombre del input local del formulario admin. `image` es un campo derivado o heredado usado por la UI para renderizar una sola imagen.

## 5. Respuesta a la duda 3: actualizacion de perfil

Estado: implementacion parcial.

- Backend `GET` del perfil autenticado: confirmado.
  - Evidencia: `ecommerce-api-Nars/src/routes/userRoutes.js:27` expone `GET /users/me`.
  - Evidencia: `ecommerce-api-Nars/src/controllers/userController.js:6` implementa `getUserProfile`.
- Backend `PUT/PATCH` del perfil autenticado: confirmado para `PATCH`, no encontrado para `PUT` en la ruta propia del perfil.
  - Evidencia: `ecommerce-api-Nars/src/routes/userRoutes.js:30` expone `PATCH /users/me`.
  - Evidencia: `ecommerce-api-Nars/src/routes/userRoutes.js:33` valida `displayName`.
  - Evidencia: `ecommerce-api-Nars/src/routes/userRoutes.js:34` valida `phone`.
  - Evidencia: `ecommerce-api-Nars/src/routes/userRoutes.js:35` valida `avatar`.
  - Evidencia: `ecommerce-api-Nars/src/controllers/userController.js:64` implementa `updateUserProfile`.
- Hay autenticacion asociada al flujo.
  - Evidencia: `ecommerce-api-Nars/src/routes/userRoutes.js:27` y `ecommerce-api-Nars/src/routes/userRoutes.js:31` usan `authMiddleware`.
  - Evidencia: `ecommerce-api-Nars/src/middlewares/authMiddleware.js:3` valida token Bearer y carga `req.user`.
- La pantalla `http://localhost:5173/profile` existe y esta conectada solo a lectura.
  - Evidencia: `ecommerce-app-Nars/src/App.jsx:85` registra la ruta `/profile`.
  - Evidencia: `ecommerce-app-Nars/src/components/organisms/PrivateRoute.jsx:16` la protege para usuarios autenticados.
  - Evidencia: `ecommerce-app-Nars/src/pages/ProfilePage.jsx:26` llama `getCurrentProfile()`.
  - Evidencia: `ecommerce-app-Nars/src/pages/ProfilePage.jsx:69` solo renderiza datos, sin formulario ni submit.
- El servicio frontend para perfil solo implementa lectura del perfil actual.
  - Evidencia: `ecommerce-app-Nars/src/services/userService.js:43` implementa `getCurrentProfile`.
  - No fue encontrado un metodo frontend para `PATCH /users/me` ni una UI de edicion conectada.

Conclusion: existe soporte real backend para leer y actualizar perfil propio mediante `GET /users/me` y `PATCH /users/me`, con auth y validacion. En frontend, `/profile` solo muestra informacion; no existe flujo de edicion conectado. El estado actual es parcial: backend listo, frontend incompleto para update profile.

## 6. Respuesta a la duda 4: sistema de estilos frontend

Estado: confirmado.

- El frontend usa CSS tradicional, no un framework utility-first ni librerias de UI.
  - Evidencia: `ecommerce-app-Nars/package.json:14` y `ecommerce-app-Nars/package.json:21` muestran dependencias de React, React Query, Axios, React Router, Vite y testing, sin Tailwind, MUI, Chakra, Bootstrap ni styled-components.
  - No fueron encontrados `tailwind.config.*` ni `postcss.config.*` dentro de `ecommerce-app-Nars`.
- La base de estilos es hibrida entre CSS global y CSS por pagina/componente.
  - Evidencia: `ecommerce-app-Nars/src/main.jsx:4` importa `src/index.css` global.
  - Evidencia: `ecommerce-app-Nars/src/components/atoms/TextInput.jsx:1` importa `TextInput.css`.
  - Evidencia: `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx:10` importa `AdminProductsPage.css`.
  - Evidencia: `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:18` importa `CheckoutPage.css`.
- Se usan clases utilitarias y semanticas propias, no CSS Modules.
  - Evidencia: `ecommerce-app-Nars/src/index.css:81` define `.container`.
  - Evidencia: `ecommerce-app-Nars/src/index.css:94` define `.grid`.
  - Evidencia: `ecommerce-app-Nars/src/index.css:109` define `.flex`.
  - No fue encontrado uso de archivos `.module.css`.
- El punto principal para inputs es `TextInput.css`.
  - Evidencia: `ecommerce-app-Nars/src/components/atoms/TextInput.jsx:16` usa `className="form-input"`.
  - Evidencia: `ecommerce-app-Nars/src/components/atoms/TextInput.css:14` define fondo, borde y color del input.
- El punto principal para textareas admin esta en CSS de pagina, separado de `TextInput.css`.
  - Evidencia: `ecommerce-app-Nars/src/pages/AdminProductsPage.css:41` define `.admin-products-form__textarea`.
  - Evidencia: `ecommerce-app-Nars/src/pages/AdminCategoriesPage.css:35` define `.admin-categories-form__textarea`.
- El blanco de `textarea` tiene una causa probable fuerte: se usa `var(--surface-elevated, #fff)` pero no se encontro `--surface-elevated` definido en `src/index.css`, por lo que cae al fallback blanco.
  - Evidencia: `ecommerce-app-Nars/src/pages/AdminProductsPage.css:46` usa `background: var(--surface-elevated, #fff)`.
  - Evidencia: `ecommerce-app-Nars/src/pages/AdminCategoriesPage.css:40` usa `background: var(--surface-elevated, #fff)`.
  - Evidencia: `ecommerce-app-Nars/src/index.css:24` define variables globales, y no aparece `--surface-elevated`.

Conclusion: el stack real de estilos es CSS global + CSS por pagina/componente. Conviene tocar `ecommerce-app-Nars/src/components/atoms/TextInput.css` para inputs/selects y `ecommerce-app-Nars/src/pages/AdminProductsPage.css` junto con `ecommerce-app-Nars/src/pages/AdminCategoriesPage.css` para textareas admin.

## 7. Respuesta a la duda 5: flujo actual de imagenes

Estado: confirmado para flujo por URL manual. No fue encontrado upload real operativo.

- El formulario admin actual pide una URL manual para la imagen principal.
  - Evidencia: `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx:243` muestra el campo "Imagen principal (URL)".
- El frontend envia esa URL como `imagesUrl` en el payload al crear o editar producto.
  - Evidencia: `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx:156` arma el payload.
  - Evidencia: `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx:165` envia `imagesUrl` como arreglo.
  - Evidencia: `ecommerce-app-Nars/src/api/productApi.js:57` hace `POST /products`.
  - Evidencia: `ecommerce-app-Nars/src/api/productApi.js:62` hace `PUT /products/:id`.
- El backend espera `imagesUrl` y lo guarda en MongoDB.
  - Evidencia: `ecommerce-api-Nars/src/controllers/productController.js:96` recibe `imagesUrl`.
  - Evidencia: `ecommerce-api-Nars/src/controllers/productController.js:120` persiste `imagesUrl`.
  - Evidencia: `ecommerce-api-Nars/src/models/product.js:11` define el campo persistido.
- El frontend luego renderiza la primera URL almacenada.
  - Evidencia: `ecommerce-app-Nars/src/services/productService.js:7` transforma `imagesUrl[0]` a `image`.
  - Evidencia: `ecommerce-app-Nars/src/components/molecules/ProductCard.jsx:44` renderiza esa imagen en cards.
  - Evidencia: `ecommerce-app-Nars/src/pages/ProductDetailPage.jsx:79` renderiza esa imagen en detalle.
  - Evidencia: `ecommerce-app-Nars/src/services/orderService.js:12` y `ecommerce-app-Nars/src/services/wishlistService.js:11` repiten la misma normalizacion.
- El campo visual del admin si esta conectado; no es solo decorativo.
  - Evidencia: `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx:243` enlaza el input al estado.
  - Evidencia: `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx:165` lo transforma y lo envia realmente.
- Upload real o flujo multipart: no fue encontrado en `src` del backend ni del frontend.
  - No fueron encontradas rutas/controladores con `multer`, `FormData`, `multipart`, `cloudinary` o endpoints de upload en `src`.
  - Evidencia: `ecommerce-api-Nars/package.json:22` y `ecommerce-api-Nars/package.json:32` muestran que `cloudinary` y `multer` existen como dependencias, pero no se encontro uso operativo en el codigo inspeccionado.

Conclusion: el flujo real actual de imagenes funciona asi: usuario escribe URL manual, frontend la envia como `imagesUrl`, backend la guarda en MongoDB y frontend la renderiza usando la primera URL. No se encontro upload ya implementado en el flujo activo.

## 8. Hallazgos adicionales relevantes

- Inconsistencia relevante de nomenclatura en imagenes: el backend persiste `imagesUrl`, mientras el frontend renderiza `image` derivado y varios puntos mantienen fallbacks heredados a `product.image`.
  - Evidencia: `ecommerce-api-Nars/src/models/product.js:11`, `ecommerce-app-Nars/src/services/productService.js:7`, `ecommerce-api-Nars/src/controllers/cartController.js:13`.
- El servicio `fetchShippingAddressesByUser(userId)` recibe `userId`, pero `shippingApi.getByUser` realmente no usa ese parametro y consulta al usuario autenticado actual.
  - Evidencia: `ecommerce-app-Nars/src/services/shippingService.js:4`.
  - Evidencia: `ecommerce-app-Nars/src/api/shippingApi.js:4`.
- En checkout, el CVV se captura en UI pero no se envia al backend ni se persiste, lo cual parece intencional pero debe ser tenido en cuenta en cualquier rediseño.
  - Evidencia: `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:82` captura `cardCvv`.
  - Evidencia: `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:295` crea el metodo de pago sin enviar `cardCvv`.
- Existe soporte backend para `PATCH /users/me/password`, pero no se observo UI de cambio de contrasena en `/profile`.
  - Evidencia: `ecommerce-api-Nars/src/routes/userRoutes.js:42`.
  - No fue encontrada UI correspondiente en `ecommerce-app-Nars/src/pages/ProfilePage.jsx`.

## 9. Resumen ejecutivo para preparar el prompt maestro

- Duda 1 resuelta: direcciones y metodos de pago se persisten en colecciones MongoDB propias (`ShippingAddress` y `PaymentMethod`) y el checkout mantiene cache local en `localStorage`.
- Duda 2 resuelta: el campo real de imagen de producto es `imagesUrl`; `imageUrl` es un alias de formulario y `image` es un alias derivado para render.
- Duda 3 resuelta: backend ya soporta `GET /users/me` y `PATCH /users/me`, pero frontend `/profile` solo implementa lectura.
- Duda 4 resuelta: el frontend usa CSS plano con `index.css` global y CSS por componente/pagina; el punto correcto para arreglar inputs/textareas esta claramente localizado.
- Duda 5 resuelta: el flujo activo de imagenes funciona por URL manual; no se encontro upload operativo en uso.
- Ambiguedades que conviene cerrar antes del master plan: unificar `imagesUrl` vs `image`, decidir si `/profile` se ampliara a edicion completa, y definir si el flujo de imagenes seguira siendo por URL o migrara a upload real.

## 10. Evidencia consultada

- `ecommerce-api-Nars/src/models/shippingAddress.js`
- `ecommerce-api-Nars/src/models/paymentMethod.js`
- `ecommerce-api-Nars/src/models/user.js`
- `ecommerce-api-Nars/src/models/product.js`
- `ecommerce-api-Nars/src/controllers/shippingAddressController.js`
- `ecommerce-api-Nars/src/controllers/paymentMethodController.js`
- `ecommerce-api-Nars/src/controllers/productController.js`
- `ecommerce-api-Nars/src/controllers/userController.js`
- `ecommerce-api-Nars/src/controllers/orderController.js`
- `ecommerce-api-Nars/src/routes/index.js`
- `ecommerce-api-Nars/src/routes/shippingAddressRoutes.js`
- `ecommerce-api-Nars/src/routes/paymentMethodRoutes.js`
- `ecommerce-api-Nars/src/routes/userRoutes.js`
- `ecommerce-api-Nars/src/routes/orderRoutes.js`
- `ecommerce-api-Nars/src/middlewares/authMiddleware.js`
- `ecommerce-api-Nars/package.json`
- `ecommerce-app-Nars/package.json`
- `ecommerce-app-Nars/src/main.jsx`
- `ecommerce-app-Nars/src/index.css`
- `ecommerce-app-Nars/src/App.jsx`
- `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`
- `ecommerce-app-Nars/src/pages/ProfilePage.jsx`
- `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx`
- `ecommerce-app-Nars/src/pages/AdminProductsPage.css`
- `ecommerce-app-Nars/src/pages/AdminCategoriesPage.css`
- `ecommerce-app-Nars/src/pages/ProductDetailPage.jsx`
- `ecommerce-app-Nars/src/components/molecules/ProductCard.jsx`
- `ecommerce-app-Nars/src/components/atoms/TextInput.jsx`
- `ecommerce-app-Nars/src/components/atoms/TextInput.css`
- `ecommerce-app-Nars/src/contexts/CartContext.jsx`
- `ecommerce-app-Nars/src/services/userService.js`
- `ecommerce-app-Nars/src/services/productService.js`
- `ecommerce-app-Nars/src/services/orderService.js`
- `ecommerce-app-Nars/src/services/paymentService.js`
- `ecommerce-app-Nars/src/services/shippingService.js`
- `ecommerce-app-Nars/src/services/wishlistService.js`
- `ecommerce-app-Nars/src/api/apiClient.js`
- `ecommerce-app-Nars/src/api/productApi.js`
- `ecommerce-app-Nars/src/api/paymentApi.js`
- `ecommerce-app-Nars/src/api/shippingApi.js`
- `ecommerce-app-Nars/src/utils/storageHelpers.js`
- `ecommerce-app-Nars/src/data/products.js`
