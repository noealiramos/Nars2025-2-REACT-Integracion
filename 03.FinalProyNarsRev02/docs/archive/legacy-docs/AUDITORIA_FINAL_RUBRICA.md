# Auditoria Final vs Rubrica Oficial

## Resumen Ejecutivo

Esta auditoria se realizo exclusivamente contra `opencode/rubrica-evaluacion.pdf`.

- Base obligatoria verificada: `61/110`
- Extra verificado: `4/20`
- Total verificado: `65/130`
- Porcentaje total: `50.0%`
- Nivel real: `riesgo`
- Lectura ejecutiva: el proyecto ya demuestra integracion real FE-BE y una base funcional usable, pero hoy pierde muchos puntos por desalineacion directa con la rubrica en React Query, `useReducer`, lazy loading, validacion de formularios, perfil de usuario, admin frontend y pruebas unitarias de login/register.

## Fase 0 - Descubrimiento Profundo

### Mapa del repositorio

- Frontend React/Vite: `ecommerce-app-Nars/package.json:5`
- Backend Node/Express/MongoDB: `ecommerce-api-Nars/package.json:6`
- Documentacion y reportes: `docs/`
- Prompts y rubrica: `opencode/`

### Hallazgos estructurales

- El frontend usa `React Router`, `Axios`, `Context API`, `Vitest` y `Cypress`: `ecommerce-app-Nars/package.json:5`
- El backend usa `Express`, `Mongoose`, `jsonwebtoken`, `express-validator`, `helmet`, `cors`, `swagger-ui-express`: `ecommerce-api-Nars/package.json:6`
- No hay evidencia de `@tanstack/react-query` en dependencias ni en codigo del frontend.
- No hay evidencia de `React.lazy`, `lazy(` ni `Suspense` en el frontend.
- No se encontraron archivos de despliegue como `vercel.json`, `netlify.toml`, `render.yaml`, `Dockerfile`, `docker-compose.yml` ni workflows CI.

### Integracion real FE-BE detectada

- Auth real con refresh token e interceptores: `ecommerce-app-Nars/src/api/apiClient.js:36`, `ecommerce-app-Nars/src/api/apiClient.js:81`, `ecommerce-app-Nars/src/api/apiClient.js:93`, `ecommerce-api-Nars/src/routes/authRoutes.js:90`, `ecommerce-api-Nars/src/controllers/authController.js:125`
- Catalogo real contra backend: `ecommerce-app-Nars/src/pages/HomePage.jsx:23`, `ecommerce-app-Nars/src/api/productApi.js:35`, `ecommerce-api-Nars/src/routes/productRoutes.js:26`
- Carrito real para usuario autenticado, local para anonimo: `ecommerce-app-Nars/src/contexts/CartContext.jsx:68`, `ecommerce-app-Nars/src/contexts/CartContext.jsx:73`, `ecommerce-app-Nars/src/api/cartApi.js:4`
- Checkout real con creacion de direccion, metodo de pago y orden: `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:269`, `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:287`, `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:303`
- Historial de ordenes real: `ecommerce-app-Nars/src/pages/OrdersPage.jsx:42`, `ecommerce-app-Nars/src/services/orderService.js:64`, `ecommerce-api-Nars/src/routes/orderRoutes.js:45`

### Riesgos estructurales previos a la evaluacion

- El frontend no tiene pagina de perfil ni modulo admin verificable.
- El checkout del frontend usa `POST /orders` y no `POST /orders/checkout`, por lo que no reutiliza la logica fuerte de checkout desde carrito del backend: `ecommerce-app-Nars/src/api/orderApi.js:19`, `ecommerce-app-Nars/src/api/orderApi.js:24`, `ecommerce-api-Nars/src/routes/orderRoutes.js:72`, `ecommerce-api-Nars/src/routes/orderRoutes.js:89`
- La confirmacion dice explicitamente `resumen simulado`: `ecommerce-app-Nars/src/pages/ConfirmationPage.jsx:81`
- El secreto JWT esta versionado en `ecommerce-api-Nars/.env:4`

## Fase 1 y 2 - Evaluacion Completa y Matriz

| ID | Criterio | Max | Obtenido | Estatus | Evidencia | Observaciones |
|---|---|---:|---:|---|---|---|
| I.1 | Consumo de Backend | 5 | 3 | Parcial | `ecommerce-app-Nars/src/pages/HomePage.jsx:23`, `ecommerce-app-Nars/src/contexts/CartContext.jsx:68`, `ecommerce-api-Nars/src/routes/userRoutes.js:27` | Productos y carrito autenticado consumen backend real, pero no existe pagina FE de perfil y el carrito anonimo vive en `localStorage`. |
| I.2 | Mantenimiento del Flujo | 5 | 4 | Parcial | `ecommerce-app-Nars/cypress/e2e/cart.cy.js`, `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:303`, `ecommerce-app-Nars/src/pages/ConfirmationPage.jsx:81` | El flujo principal opera y se probo en E2E, pero la confirmacion es simulada y el FE no usa el endpoint fuerte de checkout del backend. |
| I.3 | Despliegue | 5 | 0 | No verificable | ausencia de URL publica y de archivos de deploy; `ecommerce-app-Nars/README.md:17`, `ecommerce-app-Nars/.env.local:1` | No hay evidencia verificable en el repo de un despliegue publico funcional. |
| II.1 | Autenticacion | 10 | 10 | Cumple | `ecommerce-app-Nars/src/pages/RegisterPage.jsx:28`, `ecommerce-app-Nars/src/pages/LoginPage.jsx:23`, `ecommerce-app-Nars/src/api/apiClient.js:103`, `ecommerce-app-Nars/src/components/organisms/SiteHeader.jsx:97`, `ecommerce-app-Nars/cypress/e2e/auth.cy.js` | Registro, login, almacenamiento de JWT/refresh y logout estan implementados y el spec `auth.cy.js` paso completo. |
| II.2 | Pagina de Productos | 10 | 6 | Parcial | `ecommerce-app-Nars/src/components/molecules/ProductCard.jsx:46`, `ecommerce-app-Nars/src/pages/ProductDetailPage.jsx:101`, `ecommerce-app-Nars/src/pages/HomePage.jsx:61` | Hay grid y add-to-cart, pero el boton no esta condicionado por autenticacion ni por `stock > 0`, justo el caso penalizado por la rubrica. |
| II.3 | Carrito de Compras | 10 | 5 | Parcial | `ecommerce-app-Nars/src/pages/CartPage.jsx:49`, `ecommerce-app-Nars/src/contexts/CartContext.jsx:169`, `ecommerce-app-Nars/src/contexts/CartContext.jsx:189`, `ecommerce-app-Nars/src/contexts/CartContext.jsx:207`, `ecommerce-api-Nars/src/routes/cartRoutes.js:99` | Tiene pagina dedicada, eliminar, cambiar cantidad y vaciar carrito, pero no hay validacion clara de stock en frontend ni en el `PUT /cart/:id`. |
| II.4 | Checkout | 10 | 8 | Parcial | `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:269`, `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:287`, `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:303`, `ecommerce-app-Nars/cypress/e2e/cart.cy.js` | Captura datos reales y crea orden real, pero el FE no usa `POST /orders/checkout` y la confirmacion posterior no refleja un detalle 100% persistido. |
| II.5 | Paginas de Usuario | 5 | 2 | Parcial | `ecommerce-app-Nars/src/App.jsx:29`, `ecommerce-app-Nars/src/App.jsx:37`, `ecommerce-app-Nars/src/App.jsx:45`, `ecommerce-app-Nars/src/pages/OrdersPage.jsx:42`, ausencia de pagina perfil FE | Hay historial y detalle de orden con datos reales, pero no existe pagina de perfil FE y carrito no esta protegido. |
| III.1 | Context API + useReducer | 5 | 2 | Parcial | `ecommerce-app-Nars/src/contexts/AuthContext.jsx:1`, `ecommerce-app-Nars/src/contexts/CartContext.jsx:1`, grep sin `useReducer` | Solo hay 2 contextos (`Auth`, `Cart`) y ambos usan `useState`; no hay tercer contexto ni `useReducer`. |
| III.2 | React Query | 5 | 0 | No cumple | `ecommerce-app-Nars/package.json:14`, busqueda sin matches de `useQuery`/`useMutation` | No existe React Query en dependencias ni en implementacion. |
| III.3 | Interceptores de Axios | 5 | 5 | Cumple | `ecommerce-app-Nars/src/api/apiClient.js:81`, `ecommerce-app-Nars/src/api/apiClient.js:93`, `ecommerce-app-Nars/src/api/apiClient.js:103` | Request interceptor agrega JWT y response interceptor intenta refresh en 401 y reintenta la solicitud. |
| III.4 | Rutas Protegidas | 5 | 3 | Parcial | `ecommerce-app-Nars/src/components/organisms/PrivateRoute.jsx:4`, `ecommerce-app-Nars/src/App.jsx:31`, grep sin `GuestOnly` | Hay `PrivateRoute`, pero no existe `GuestOnly` ni soporte de roles en frontend. |
| III.5 | Custom Hooks | 3 | 1 | Parcial | `ecommerce-app-Nars/src/contexts/AuthContext.jsx:69`, `ecommerce-app-Nars/src/contexts/CartContext.jsx:259` | Solo hay hooks de contexto (`useAuth`, `useCart`); no hay 2 custom hooks con logica extraida independiente como pide la rubrica. |
| III.6 | Formularios Controlados con Validacion | 3 | 1 | Parcial | `ecommerce-app-Nars/src/pages/LoginPage.jsx:42`, `ecommerce-app-Nars/src/pages/RegisterPage.jsx:49`, `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:343` | Son controlados, pero login y registro dependen casi solo de `required`; la validacion sincrona y feedback completo de 3 formularios no esta al nivel pedido. |
| III.7 | Lazy Loading | 5 | 0 | No cumple | `ecommerce-app-Nars/src/App.jsx:6`, grep sin `lazy`/`Suspense` | Todas las paginas se importan estaticamente. |
| III.8 | Estados de Carga y Error | 4 | 3 | Parcial | `ecommerce-app-Nars/src/pages/HomePage.jsx:58`, `ecommerce-app-Nars/src/pages/ProductDetailPage.jsx:39`, `ecommerce-app-Nars/src/pages/CartPage.jsx:24`, `ecommerce-app-Nars/src/pages/OrdersPage.jsx:80`, `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:337` | Existen estados de carga y error en varias vistas, pero predominan textos simples; no se observan skeletons ni placeholders mas ricos. |
| IV.1 | Diseño Responsivo | 5 | 3 | Parcial | `ecommerce-app-Nars/src/index.css:184`, `ecommerce-app-Nars/src/pages/CheckoutPage.css:133`, `ecommerce-app-Nars/src/pages/OrdersPage.css:138`, `ecommerce-app-Nars/src/components/organisms/SiteHeader.css:135` | Hay media queries reales en varias pantallas, pero no hay evidencia verificable de validacion completa en movil/tablet/escritorio. |
| IV.2 | Pruebas Unitarias de Registro y Login | 5 | 0 | No cumple | `ecommerce-app-Nars/src/**/*test*` sin tests de `LoginPage`, `RegisterPage` ni `authService` | No se encontraron las pruebas unitarias exigidas para login y registro. |
| IV.3 | Pruebas E2E | 5 | 5 | Cumple | `ecommerce-app-Nars/cypress/e2e/auth.cy.js`, `ecommerce-app-Nars/cypress/e2e/cart.cy.js` | Se verificaron E2E exitosas de registro, login y add-to-cart/checkouts relacionados. |
| V.1 | Panel de Administracion | 10 | 0 | No cumple | ausencia de rutas/admin FE, grep sin `admin` util en frontend | No existe modulo admin FE protegido por rol. |
| V.2 | CRUD en Administracion | 10 | 2 | Parcial | `ecommerce-api-Nars/src/routes/productRoutes.js:36`, `ecommerce-api-Nars/src/routes/userRoutes.js:65`, `ecommerce-api-Nars/src/routes/categoryRoutes.js:37` | El backend si expone CRUD admin para multiples entidades, pero no existe panel de administracion FE que materialice el criterio. |
| V.3 | CRUD de Modelo Adicional | 10 | 2 | Parcial | `ecommerce-api-Nars/src/routes/wishListRoutes.js:17`, `ecommerce-api-Nars/src/routes/reviewRoutes.js:31`, `ecommerce-api-Nars/src/routes/notificationRoutes.js:22` | Existen modelos extra con endpoints backend, pero no hay integracion frontend verificable. |

## Fase 3 - Puntaje Real

### Puntaje base obligatorio

- Obtenido: `61`
- Posible: `110`
- Porcentaje base: `55.5%`

### Puntaje total con extra verificado

- Obtenido: `65`
- Posible: `130`
- Porcentaje total: `50.0%`

### Interpretacion real

- Nivel: `riesgo`
- Probabilidad de perder puntos: `alta`
- Percepcion del evaluador: proyecto funcional y con trabajo serio en integracion y pruebas E2E, pero hoy claramente desalineado con varios rubros especificos de arquitectura React y con faltantes visibles de perfil/admin/deploy.

## Fase 4 - Analisis de Brecha

### 🔴 Critico

- Falta `React Query`; problema en todo el frontend; impacto: `-5 pts` directos en III.2.
- Falta `useReducer` y tercer contexto; problema en `ecommerce-app-Nars/src/contexts`; impacto: `-3 a -5 pts` en III.1.
- No existen unit tests de login/register; problema en `ecommerce-app-Nars/src/**/*test*`; impacto: `-5 pts` en IV.2.
- No hay `GuestOnly`, roles FE ni panel admin; problema en `ecommerce-app-Nars/src/App.jsx` y ausencia de modulo admin; impacto: `-2 pts` en III.4 y `-10 pts` en V.1.
- No hay pagina de perfil FE; problema por ausencia de ruta/componente; impacto: `-3 pts` aprox en II.5.

### 🟠 Importante

- Botones de add-to-cart no respetan `auth + stock`; problema en `ecommerce-app-Nars/src/components/molecules/ProductCard.jsx:46` y `ecommerce-app-Nars/src/pages/ProductDetailPage.jsx:101`; impacto: `-4 pts` aprox en II.2.
- Carrito no valida stock de forma clara; problema en `ecommerce-app-Nars/src/contexts/CartContext.jsx:207` y `ecommerce-api-Nars/src/routes/cartRoutes.js:99`; impacto: `-5 pts` aprox en II.3.
- Checkout FE no usa `POST /orders/checkout`; problema en `ecommerce-app-Nars/src/api/orderApi.js:19` y `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:303`; impacto: `-2 pts` aprox en II.4 e I.2.
- Confirmacion muestra `resumen simulado`; problema en `ecommerce-app-Nars/src/pages/ConfirmationPage.jsx:81`; impacto: merma de confianza en flujo E2E real.
- No hay lazy loading; problema en `ecommerce-app-Nars/src/App.jsx:6`; impacto: `-5 pts` directos en III.7.
- Login y registro no tienen validacion sincrona rica; problema en `ecommerce-app-Nars/src/pages/LoginPage.jsx:42` y `ecommerce-app-Nars/src/pages/RegisterPage.jsx:49`; impacto: `-2 pts` aprox en III.6.

### 🟡 Mejora

- Responsive no esta verificado con evidencia fuerte; problema en falta de pruebas/checklist responsive; impacto: `-2 pts` aprox en IV.1.
- Estados de carga/error son correctos pero basicos; problema en vistas con solo texto; impacto: `-1 pt` aprox en III.8.
- Inconsistencia de puertos entre README y `.env.local`; problema en `ecommerce-app-Nars/README.md:17` y `ecommerce-app-Nars/.env.local:1`; impacto: riesgo de demo.
- Secreto JWT versionado y flags de test activos; problema en `ecommerce-api-Nars/.env:4`; impacto: riesgo tecnico y mala impresion en revision.

## Fase 5 - Plan de Ataque Estrategico

| Tarea | Prioridad | Dificultad | Tiempo | Impacto en puntos |
|---|---|---|---|---|
| Agregar unit tests de Login y Register (>=5 por funcionalidad) | Alta | Media | 1.5-2 h | +5 |
| Implementar pagina de Perfil real y protegerla | Alta | Media | 1-2 h | +3 a +5 |
| Corregir logica de visibilidad `auth + stock` en productos | Alta | Baja | 30-45 min | +4 |
| Agregar `GuestOnly` y endurecer rutas protegidas | Alta | Baja | 30-45 min | +2 |
| Introducir lazy loading en al menos 3 rutas | Alta | Baja | 30-45 min | +5 |
| Migrar fetch/mutations principales a React Query | Alta | Alta | 2-4 h | +5 |
| Introducir tercer contexto y `useReducer` donde haya logica compleja | Alta | Media | 1-2 h | +3 a +5 |
| Alinear checkout FE con `/orders/checkout` | Media | Media | 1-2 h | +2 a +4 |
| Crear modulo admin FE minimo con 2 CRUD | Media | Alta | 3-5 h | +10 a +12 |
| Integrar un modelo adicional en FE (wishlist o reviews) | Media | Media | 1.5-3 h | +8 |

## Fase 6 - Plan Tactico por Archivo

### 1) Perfil de usuario real

- Archivos a crear/modificar: `ecommerce-app-Nars/src/pages/ProfilePage.jsx`, `ecommerce-app-Nars/src/services/userService.js`, `ecommerce-app-Nars/src/App.jsx`
- Tipo: `feature`
- Cambio: consumir `GET /api/users/me`, mostrar datos reales y proteger ruta `/profile`
- Riesgo: bajo
- Validacion: prueba manual + E2E de acceso autenticado/no autenticado

### 2) GuestOnly + rutas de auth

- Archivos: `ecommerce-app-Nars/src/components/organisms/GuestOnlyRoute.jsx`, `ecommerce-app-Nars/src/App.jsx`
- Tipo: `feature`
- Cambio: redirigir `/login` y `/register` al home o perfil si ya hay sesion
- Riesgo: bajo
- Validacion: login manual, navegacion con sesion activa, E2E auth

### 3) Productos con logica `auth + stock`

- Archivos: `ecommerce-app-Nars/src/components/molecules/ProductCard.jsx`, `ecommerce-app-Nars/src/pages/ProductDetailPage.jsx`
- Tipo: `bugfix`
- Cambio: ocultar/deshabilitar add-to-cart si no hay auth o si `stock <= 0`
- Riesgo: bajo
- Validacion: tests unitarios y E2E de UI condicional

### 4) Unit tests de Login y Register

- Archivos: `ecommerce-app-Nars/src/pages/__tests__/LoginPage.test.jsx`, `ecommerce-app-Nars/src/pages/__tests__/RegisterPage.test.jsx`, potencialmente `ecommerce-app-Nars/src/services/__tests__/authService.test.js`
- Tipo: `test`
- Cambio: cubrir exito, error API, submit disabled/loading, validaciones, redireccion y persistencia de sesion
- Riesgo: bajo
- Validacion: `npm test`

### 5) Lazy loading de rutas

- Archivos: `ecommerce-app-Nars/src/App.jsx`
- Tipo: `refactor`
- Cambio: usar `React.lazy` + `Suspense` en al menos `CheckoutPage`, `OrdersPage`, `OrderDetailPage`, `ProductDetailPage`
- Riesgo: bajo
- Validacion: smoke test de navegacion + unit test del fallback

### 6) Checkout alineado al backend

- Archivos: `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`, `ecommerce-app-Nars/src/api/orderApi.js`
- Tipo: `bugfix`
- Cambio: usar `orderApi.checkout` cuando se deba checkout desde carrito real y reservar `create` para admin o escenarios especiales
- Riesgo: medio
- Validacion: `cart.cy.js`, `checkoutReuse.cy.js`, inspeccion de carrito backend y stock

## Fase 7 - Ejecucion Guiada para los Top 5 Issues

### Issue 1 - No hay React Query

1. Problema: la rubrica exige `useQuery`/`useMutation`; hoy todo usa `useEffect + axios`.
2. Correccion: instalar `@tanstack/react-query`, crear `QueryClientProvider`, migrar `HomePage`, `ProductDetailPage`, `OrdersPage`, `CheckoutPage` y mutaciones de carrito.
3. Pasos:
   - instalar dependencia
   - crear `src/lib/queryClient.js`
   - envolver la app en provider
   - reemplazar fetch manual por hooks
4. Prueba: invalidacion tras add-to-cart, recarga de orders, manejo de `isLoading`/`isError`.

### Issue 2 - No hay pruebas unitarias de Login/Register

1. Problema: hoy el criterio IV.2 vale cero.
2. Correccion: agregar baterias RTL/Vitest para `LoginPage` y `RegisterPage`.
3. Pasos:
   - mockear `useAuth`, `authApi`, `persistAuthSession`, `useNavigate`
   - cubrir render, submit exitoso, submit fallido, loading, errores y redireccion
4. Prueba: `npm test` y conteo minimo de 10 pruebas utiles.

### Issue 3 - Falta pagina de perfil

1. Problema: II.5 pide perfil, historial y carrito; falta perfil.
2. Correccion: crear `ProfilePage` consumiendo `/users/me`.
3. Pasos:
   - agregar servicio `getCurrentProfile`
   - crear vista con loading/error/data
   - proteger ruta `/profile`
   - enlazarla desde header
4. Prueba: login, abrir `/profile`, verificar datos reales del backend.

### Issue 4 - Add-to-cart no respeta auth + stock

1. Problema: pierde puntos directos en II.2.
2. Correccion: condicionar el boton en grid y detalle.
3. Pasos:
   - obtener `isAuthenticated`
   - revisar `product.stock`
   - renderizar boton solo si ambas condiciones se cumplen o mostrar CTA alterno
4. Prueba: usuario anonimo sin boton, usuario auth con stock boton visible, stock cero boton deshabilitado/oculto.

### Issue 5 - No hay GuestOnly ni admin FE

1. Problema: III.4 y V.1 quedan penalizados.
2. Correccion: crear `GuestOnlyRoute` y al menos un shell admin protegido por rol.
3. Pasos:
   - extender `AuthContext` para soportar rol real del usuario
   - crear guardias `GuestOnlyRoute` y `AdminRoute`
   - crear `/admin` con dashboard minimo y links CRUD
4. Prueba: usuario normal bloqueado, admin autorizado, rutas auth cerradas para usuarios ya logueados.

## Fase 8 - Checklist Final de Verificacion

- Catalogo carga desde backend
- Add-to-cart cumple `auth + stock`
- Registro, login y logout funcionan
- Refresh token en 401 funciona
- Carrito CRUD respeta stock
- Checkout usa flujo correcto del backend
- Confirmacion refleja datos persistidos
- Perfil real disponible
- Historial y detalle de orden funcionando
- Minimo 3 rutas protegidas correctas
- `GuestOnly` funcionando
- Unit tests de login/register pasando
- E2E de auth/cart pasando
- Build y deploy verificados con URL publica

## Fase 9 - Alertas de Demo

- `README` frontend indica backend en `3000`, pero `.env.local` apunta a `3001`: `ecommerce-app-Nars/README.md:17`, `ecommerce-app-Nars/.env.local:1`
- `JWT_SECRET` esta commiteado: `ecommerce-api-Nars/.env:4`
- `ENABLE_TEST_AUTH_TOOLS=true` en `.env`: `ecommerce-api-Nars/.env:8`
- `ACCESS_TOKEN_TTL=35s` y `REFRESH_TOKEN_TTL=2m` pueden provocar expiraciones agresivas en demo: `ecommerce-api-Nars/.env:6`, `ecommerce-api-Nars/.env:7`
- Login precarga credenciales demo visibles: `ecommerce-app-Nars/src/pages/LoginPage.jsx:12`
- Confirmacion declara `resumen simulado`: `ecommerce-app-Nars/src/pages/ConfirmationPage.jsx:81`
- El FE no usa el endpoint `orders/checkout` aunque existe: `ecommerce-app-Nars/src/api/orderApi.js:19`, `ecommerce-app-Nars/src/api/orderApi.js:24`
- No hay evidencia de deploy publico verificable.

## Fase 10 - Veredicto Final

- ¿Esta listo para entregar?: `No`
- Nivel real del proyecto: `medio-bajo con riesgo de evaluacion`
- Que te puede bajar puntos: ausencia total de React Query, lazy loading, unit tests de login/register, perfil FE, admin FE, GuestOnly, validacion de formularios al nivel pedido y despliegue no verificable.
- Que arreglaria HOY en 2-4 horas:
  1. tests unitarios de login/register
  2. perfil FE real
  3. GuestOnly
  4. condicion `auth + stock` en productos
  5. lazy loading en rutas principales

## Fase 11 - Cierre

La mayor oportunidad inmediata no esta en rehacer todo el proyecto, sino en cerrar la brecha exacta contra la rubrica. Si atacas las 5 tareas anteriores en orden, el proyecto puede subir de una zona de riesgo a una entrega defendible mucho mas rapido que con refactors amplios.
