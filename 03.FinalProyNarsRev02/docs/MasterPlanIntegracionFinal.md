# Master Plan de Integracion Final

## A. Resumen ejecutivo

Este plan estrategico convierte la rubrica oficial en una hoja de ruta incremental para cerrar las brechas del proyecto `React + Node + MongoDB` sin romper contratos frontend/backend.

- Puntaje base hoy: `61/110` verificado en `docs/AUDITORIA_FINAL_RUBRICA.md`.
- Extra hoy: `4/20` verificado en `docs/AUDITORIA_FINAL_RUBRICA.md`.
- Riesgo principal: la aplicacion ya funciona end-to-end, pero pierde muchos puntos por faltantes directos de rubrica en arquitectura React, perfil de usuario, admin frontend, validacion formal y pruebas unitarias especificas.
- Estrategia central: primero estabilizar contratos y flujo critico, despues cerrar rubros de arquitectura React, luego materializar UX/calidad, y por ultimo capturar extras con admin y CRUDs apoyados en el backend ya existente.
- Regla operativa: no hacer refactor big-bang; cada iteracion debe ser testeable, desplegable y compatible hacia atras.

## Fase 0. Carga de contexto

### Fuentes leidas

- Rubrica oficial: `opencode/rubrica-evaluacion.pdf`.
- Repo actual: `ecommerce-app-Nars/` y `ecommerce-api-Nars/`.
- Skills del proyecto: `Skills/API Best Practices.md`, `Skills/React.md`, `Skills/Testing Strategies.md`, `Skills/Express + MongoDB.md`, `Skills/MongoDB Patterns.md`, `Skills/Node.js Best Practices.md`, `Skills/Frontend Design.md`, `Skills/Git Workflow.md`, `Skills/SSDLC_SystemPrompt.md`.

### Hallazgos de sistema

- Frontend actual: React/Vite con `react-router-dom`, Axios, `AuthContext`, `CartContext`, Vitest y Cypress; no hay evidencia de `@tanstack/react-query`, `useReducer`, `React.lazy`, `Suspense`, `GuestOnly` ni `AdminRoute` en `ecommerce-app-Nars/src/App.jsx` y `ecommerce-app-Nars/src/`.
- Backend actual: Express/Mongoose con auth JWT + refresh, middlewares de rol, validacion, Swagger, health check y CRUDs amplios por dominio desde `ecommerce-api-Nars/src/routes/`.
- Integracion real ya verificada: auth, catalogo, carrito autenticado, checkout, ordenes e historial, segun `docs/ResultAuditoriaVsRubrica.md`.
- Falta de despliegue publico verificable: no hay evidencia suficiente en repo para cerrar `I.3`; el estado queda `desconocido/no verificable` hasta tener URL publica funcional.

### Contratos y dependencias criticas detectadas

#### Contratos backend consumidos por frontend

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/logout`.
- Perfil: backend expone `GET /api/users/me`, pero el frontend aun no tiene pagina de perfil.
- Productos: `GET /api/products`, `GET /api/products/:id`, `GET /api/products/search`, `GET /api/products/category/:idCategory`.
- Carrito: `GET /api/cart/user`, `POST /api/cart/add-product`, `PUT /api/cart/:id`, `DELETE /api/cart/:id`.
- Checkout/ordenes: el frontend usa `POST /api/orders`; el backend tambien expone `POST /api/orders/checkout`, que es el contrato mas fuerte para vaciar carrito y descontar stock.
- Direcciones y pagos: `shipping-addresses` y `payment-methods` ya existen y son reutilizables para checkout y perfil.

#### Dependencias criticas

- `AuthContext` depende de `authService` y de los interceptores de `ecommerce-app-Nars/src/api/apiClient.js`.
- `CartContext` depende de auth, persistencia local y API de carrito; cualquier migracion debe respetar ambos modos durante la transicion.
- Checkout depende de carrito, direcciones, metodos de pago y ordenes; es la zona de mayor riesgo funcional.
- Admin frontend depende de soporte de roles ya disponible en backend; el riesgo esta mas en el orquestado UI que en la API.

## B. Mapa rubrica -> sistema

| ID | Criterio | Modulos involucrados | Archivos clave | Estado actual | Riesgo |
|---|---|---|---|---|---|
| I.1 | Consumo de backend | Frontend + Backend | `ecommerce-app-Nars/src/pages/HomePage.jsx`, `ecommerce-app-Nars/src/contexts/CartContext.jsx`, `ecommerce-api-Nars/src/routes/userRoutes.js` | Parcial | Medio |
| I.2 | Flujo catalogo -> carrito -> checkout -> confirmacion | Frontend + Backend | `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`, `ecommerce-app-Nars/src/pages/ConfirmationPage.jsx`, `ecommerce-api-Nars/src/routes/orderRoutes.js` | Parcial | Alto |
| I.3 | Despliegue publico | Frontend + Backend + Infra | repo completo, configuracion env, hosting | Desconocido | Medio |
| II.1 | Auth registro/login/logout + JWT | Frontend + Backend | `ecommerce-app-Nars/src/pages/LoginPage.jsx`, `ecommerce-app-Nars/src/pages/RegisterPage.jsx`, `ecommerce-app-Nars/src/api/apiClient.js`, `ecommerce-api-Nars/src/routes/authRoutes.js` | Cumple | Medio |
| II.2 | Pagina de productos | Frontend + Backend | `ecommerce-app-Nars/src/components/molecules/ProductCard.jsx`, `ecommerce-app-Nars/src/pages/ProductDetailPage.jsx`, `ecommerce-api-Nars/src/routes/productRoutes.js` | Parcial | Bajo |
| II.3 | Carrito de compras | Frontend + Backend | `ecommerce-app-Nars/src/pages/CartPage.jsx`, `ecommerce-app-Nars/src/contexts/CartContext.jsx`, `ecommerce-api-Nars/src/routes/cartRoutes.js` | Parcial | Alto |
| II.4 | Checkout | Frontend + Backend | `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`, `ecommerce-app-Nars/src/api/orderApi.js`, `ecommerce-api-Nars/src/routes/orderRoutes.js` | Parcial | Alto |
| II.5 | Paginas de usuario | Frontend + Backend | `ecommerce-app-Nars/src/App.jsx`, `ecommerce-app-Nars/src/pages/OrdersPage.jsx`, `ecommerce-api-Nars/src/routes/userRoutes.js` | Parcial | Medio |
| III.1 | Context API + useReducer | Frontend | `ecommerce-app-Nars/src/contexts/AuthContext.jsx`, `ecommerce-app-Nars/src/contexts/CartContext.jsx` | Parcial | Medio |
| III.2 | React Query | Frontend | `ecommerce-app-Nars/package.json`, `ecommerce-app-Nars/src/` | No cumple | Medio |
| III.3 | Interceptores de Axios | Frontend | `ecommerce-app-Nars/src/api/apiClient.js` | Cumple | Bajo |
| III.4 | Rutas protegidas | Frontend | `ecommerce-app-Nars/src/components/organisms/PrivateRoute.jsx`, `ecommerce-app-Nars/src/App.jsx` | Parcial | Bajo |
| III.5 | Custom hooks | Frontend | `ecommerce-app-Nars/src/contexts/AuthContext.jsx`, `ecommerce-app-Nars/src/contexts/CartContext.jsx` | Parcial | Bajo |
| III.6 | Formularios controlados con validacion | Frontend | `ecommerce-app-Nars/src/pages/LoginPage.jsx`, `ecommerce-app-Nars/src/pages/RegisterPage.jsx`, `ecommerce-app-Nars/src/pages/CheckoutPage.jsx` | Parcial | Bajo |
| III.7 | Lazy loading | Frontend | `ecommerce-app-Nars/src/App.jsx` | No cumple | Bajo |
| III.8 | Estados de carga y error | Frontend | `ecommerce-app-Nars/src/pages/HomePage.jsx`, `ecommerce-app-Nars/src/pages/ProductDetailPage.jsx`, `ecommerce-app-Nars/src/pages/OrdersPage.jsx`, `ecommerce-app-Nars/src/pages/CheckoutPage.jsx` | Parcial | Bajo |
| IV.1 | Diseno responsivo | Frontend | `ecommerce-app-Nars/src/index.css`, `ecommerce-app-Nars/src/pages/*.css`, `ecommerce-app-Nars/src/components/organisms/SiteHeader.css` | Parcial | Medio |
| IV.2 | Pruebas unitarias login/register | Frontend | `ecommerce-app-Nars/src/**/*test*` | No cumple | Bajo |
| IV.3 | Pruebas E2E | Frontend + Backend | `ecommerce-app-Nars/cypress/e2e/auth.cy.js`, `ecommerce-app-Nars/cypress/e2e/cart.cy.js` | Cumple | Medio |
| V.1 | Panel de administracion | Frontend + Backend | ausencia en `ecommerce-app-Nars/src/`; soporte de rol en `ecommerce-api-Nars/src/routes/` | No cumple | Medio |
| V.2 | CRUD admin para 2 entidades | Frontend + Backend | backend ya soporta `products`, `users`, `categories`; falta UI admin | Parcial | Medio |
| V.3 | CRUD modelo adicional | Frontend + Backend | `ecommerce-api-Nars/src/routes/wishListRoutes.js`, `reviewRoutes.js`, `notificationRoutes.js` | Parcial | Medio |

## C. Analisis de dependencias y backlog priorizado

### Dependencias entre features

- Perfil, historial y rutas protegidas dependen de auth estable y del contrato `users/me`.
- React Query debe introducirse sin romper `services/` actuales; conviene hacerlo como capa de adopcion progresiva y no como reescritura total.
- `useReducer` conviene aplicarlo primero al dominio mas complejo (`Cart`) y luego extender un tercer contexto adicional (`UI`, `Checkout` o `Catalog`) para cumplir rubrica sin sobrearquitectura.
- Checkout alineado con `POST /orders/checkout` depende de tener sincronizacion fuerte entre carrito frontend y backend.
- Admin frontend depende de role guard, layout admin y adaptadores de contratos ya presentes en backend.
- CRUD de modelo adicional conviene construir sobre `wishlist` porque es el modelo extra con mejor afinidad a e-commerce y menor friccion UX.

### Zonas criticas

- Auth: cualquier cambio en refresh/logout puede romper todo el frontend autenticado.
- Cart: hoy mezcla modo anonimo y autenticado; una migracion brusca puede causar perdida de items o duplicados.
- Checkout: alto acoplamiento con direcciones, pagos, ordenes, stock y confirmacion.
- Admin: el riesgo no es tanto de API sino de exponer vistas sin guardia de rol correcta.

### Backlog priorizado

| ID | Criterio(s) | Tarea | Prioridad | Impacto en calificacion | Riesgo | Dependencia | Validacion requerida |
|---|---|---|---|---|---|---|---|
| MP-01 | IV.2 | Crear pruebas unitarias de `LoginPage` y `RegisterPage` con minimo 5 casos por flujo | Alta | Muy alto | Bajo | Ninguna | `npm test` frontend |
| MP-02 | II.5, I.1 | Implementar `ProfilePage` real consumiendo `GET /api/users/me` y agregar ruta protegida | Alta | Alto | Bajo | Auth estable | prueba manual + E2E corto |
| MP-03 | II.2 | Corregir visibilidad/logica `auth + stock > 0` en catalogo y detalle | Alta | Alto | Bajo | Auth y productos actuales | unit/UI + E2E add-to-cart |
| MP-04 | III.4 | Agregar `GuestOnlyRoute` y soporte inicial de rol para guards | Alta | Alto | Bajo | Auth estable | smoke de navegacion |
| MP-05 | III.7 | Aplicar `React.lazy` + `Suspense` en al menos 3 rutas principales | Alta | Alto | Bajo | Ninguna | build + smoke |
| MP-06 | III.1 | Introducir `useReducer` en `CartContext` y crear tercer contexto adicional real | Alta | Alto | Medio | MP-03 recomendado | unit/integration cart |
| MP-07 | III.2 | Incorporar React Query en lecturas/mutaciones prioritarias: productos, detalle, ordenes, carrito/checkout | Alta | Muy alto | Medio | MP-06 no bloquea | unit/integration + smoke |
| MP-08 | II.4, I.2 | Migrar checkout del frontend a `POST /api/orders/checkout` con estrategia backward compatible | Alta | Alto | Alto | MP-06, MP-07 recomendado | Cypress checkout + verificacion de stock |
| MP-09 | III.6 | Unificar validacion sincrona en Login, Register y Checkout con mensajes utiles | Media | Medio | Bajo | MP-01 parcial | unit/UI |
| MP-10 | III.8 | Mejorar loading/error states con skeletons/spinners consistentes en 3 vistas | Media | Medio | Bajo | MP-07 recomendado | smoke visual + tests |
| MP-11 | IV.1 | Endurecer responsive en catalogo, carrito, checkout, header y admin | Media | Medio | Bajo | MP-10 recomendado | viewport manual/Cypress |
| MP-12 | I.3 | Documentar y ejecutar despliegue publico verificable de frontend y backend | Media | Alto | Medio | estabilidad minima | URL publica + smoke |
| MP-13 | V.1 | Crear panel admin FE protegido por rol admin | Media | Muy alto | Medio | MP-04 | smoke admin + E2E admin |
| MP-14 | V.2 | Implementar CRUD admin de productos y categorias o usuarios | Media | Muy alto | Medio | MP-13 | CRUD manual + tests |
| MP-15 | V.3 | Implementar CRUD de `wishlist` como modelo adicional integrado | Media | Alto | Medio | MP-07, MP-13 opcional | unit/integration + E2E |
| MP-16 | II.3 | Endurecer validacion de stock en carrito para incrementos, updates y mensajes UX | Media | Alto | Medio | MP-06, MP-07 | cart tests + Cypress |
| MP-17 | I.2 | Reemplazar confirmacion simulada por confirmacion basada en orden persistida | Media | Medio | Bajo | MP-08 | checkout E2E |
| MP-18 | Calidad transversal | Reparar tests backend de integracion fallando por `seedTestCatalog` | Media | Medio | Medio | Ninguna | `npm test` backend |

## D. Estrategia de implementacion por capas

### Capa 1. Estabilidad base

- Consolidar adaptadores de API para no tocar contratos crudos desde componentes.
- Mantener Axios interceptors como unica puerta de auth cliente.
- Corregir inconsistencias de entorno y documentar variables requeridas para demo/deploy.
- Reparar suites backend rotas para que el proyecto tenga validacion continua confiable.

### Capa 2. Flujo critico

- Perfil real.
- Catalogo con reglas `auth + stock`.
- Carrito con validacion de stock y comportamiento consistente.
- Checkout real usando el endpoint fuerte del backend.
- Confirmacion basada en orden persistida.

### Capa 3. Hardening tecnico

- `useReducer` en dominio de carrito.
- Tercer contexto real y justificado.
- React Query en lecturas/mutaciones.
- `GuestOnly`, `ProtectedRoute` con roles y eventualmente `AdminRoute`.
- Custom hooks reales: por ejemplo `useCheckoutForm`, `useProfile`, `useAuthRedirect`, `useCartSync`.

### Capa 4. UX y calidad

- Validaciones sincronas y mensajes de error.
- Skeletons/spinners consistentes.
- Responsive verificado en mobile/tablet/desktop.
- Cobertura de tests especifica para login/register y smoke por flujo critico.

### Capa 5. Administracion y CRUD

- Admin layout y guards de rol.
- CRUD de dos entidades ya soportadas por backend.
- Modelo adicional integrado, recomendado: `wishlist`.

## E. Plan por iteraciones seguras

### Iteracion 1. Cerrar perdidas de puntos rapidas y seguras

- Objetivo: capturar puntos de bajo riesgo y preparar la base para cambios mayores.
- Tareas: MP-01, MP-02, MP-03, MP-04, MP-05.
- Que se valida: login/register testeados, perfil real protegido, add-to-cart condicionado, guest-only funcional, lazy loading activo en 3+ rutas.
- Riesgo controlado: regresiones en routing y auth UI.

### Iteracion 2. Endurecer estado global y fetching

- Objetivo: cerrar arquitectura React exigida por la rubrica sin reescribir todo.
- Tareas: MP-06, MP-07, MP-09, MP-10.
- Que se valida: `CartContext` con reducer estable, tercer contexto real, `useQuery/useMutation` activos, formularios y estados UX mejorados.
- Riesgo controlado: incompatibilidad entre `services/` legacy y nueva capa de datos.

### Iteracion 3. Blindar carrito y checkout real

- Objetivo: fortalecer el flujo con mayor peso funcional y mayor riesgo tecnico.
- Tareas: MP-08, MP-16, MP-17, MP-18.
- Que se valida: carrito consistente, checkout via `/orders/checkout`, stock descontado, carrito vaciado, confirmacion persistida, backend test suite estable.
- Riesgo controlado: ruptura del flujo end-to-end, desincronizacion entre carrito local y remoto.

### Iteracion 4. Calidad operativa y despliegue

- Objetivo: dejar el proyecto evaluable y demostrable.
- Tareas: MP-11, MP-12.
- Que se valida: responsive sin quiebres en viewports clave y URL publica funcional con variables correctas.
- Riesgo controlado: demo fallida por layout o env.

### Iteracion 5. Captura de puntos extra

- Objetivo: sumar extras maximizando reutilizacion del backend existente.
- Tareas: MP-13, MP-14, MP-15.
- Que se valida: panel admin protegido por rol, 2 CRUDs admin end-to-end y modelo adicional integrado.
- Riesgo controlado: exponer UI admin sin guardias o mezclar contratos de cliente/admin.

## F. Proteccion de contratos

### Contrato 1. Auth y refresh tokens

- Contrato afectado: `auth/login`, `auth/register`, `auth/refresh`, `auth/logout`.
- Estrategia: `backward compatible`.
- Regla: no cambiar payloads ni nombres de tokens; cualquier mejora debe vivir en helpers/context/hooks.

### Contrato 2. Productos y catalogo

- Contrato afectado: `GET /api/products`, `GET /api/products/:id`.
- Estrategia: `adaptacion progresiva`.
- Regla: React Query debe envolver el fetch existente sin cambiar shape esperado por `services/` hasta estabilizar migracion.

### Contrato 3. Carrito

- Contrato afectado: `GET /api/cart/user`, `POST /api/cart/add-product`, `PUT /api/cart/:id`, `DELETE /api/cart/:id`.
- Estrategia: `backward compatible`.
- Regla: introducir validaciones y reducer sin alterar DTOs actuales; si se necesita enriquecer respuesta, solo agregar campos opcionales.

### Contrato 4. Checkout

- Contrato afectado: `POST /api/orders` y `POST /api/orders/checkout`.
- Estrategia: `adaptacion progresiva`.
- Plan:
  - mantener `POST /api/orders` operativo mientras el frontend migra;
  - introducir feature switch en frontend para usar `checkout` desde carrito autenticado;
  - conservar `create order` solo para escenarios admin o compatibilidad temporal;
  - retirar uso legacy solo cuando Cypress confirme carrito->checkout->orden->confirmacion.

### Contrato 5. Perfil y paginas de usuario

- Contrato afectado: `GET /api/users/me`, `GET /api/orders/user/:userId`.
- Estrategia: `backward compatible`.
- Regla: la UI nueva solo consume endpoints existentes; no requiere cambio de backend para capturar el criterio.

### Contrato 6. Admin y modelo adicional

- Contrato afectado: CRUDs admin y `wishlist/reviews/notifications`.
- Estrategia: `adaptacion progresiva`.
- Regla: empezar por leer/listar y luego mutar; no introducir cambios destructivos de schema si el backend actual ya cubre el flujo.

## G. Uso de skills

### Skills aplicables por bloque

| Bloque del plan | Skill principal | Como se usa | Reglas del skill que impactan |
|---|---|---|---|
| Contratos API, transiciones, admin CRUD | `Skills/API Best Practices.md` | preservar contratos, evitar breaking changes, estandarizar errores y versionar solo si fuera indispensable | cambios no destructivos, respuestas consistentes, seguridad y validacion |
| Endurecimiento frontend React | `Skills/React.md` | guiar Context API, hooks, routing, lazy loading, separacion de responsabilidades y manejo de estados | componentes pequenos, custom hooks reales, lazy loading, responsive |
| Plan de pruebas por iteracion | `Skills/Testing Strategies.md` | definir combinacion de unit/integration/E2E enfocada al camino critico | testing pyramid, casos de exito/fallo, quality gates |
| Refuerzos backend de carrito/checkout/admin | `Skills/Express + MongoDB.md` | revisar middlewares, validaciones, patrones de controllers y seguridad JWT | validacion, auth/roles, error handling, CRUD robusto |
| Ajustes de modelos/queries de wishlist y ordenes | `Skills/MongoDB Patterns.md` | elegir modelo adicional y optimizar lecturas o snapshots sin romper consistencia | denormalizacion controlada, referencias, performance |
| Entorno, logs, deploy, salud operativa | `Skills/Node.js Best Practices.md` | revisar env, logs, health, readiness para demo/deploy | env seguros, logging, error handling, configuracion de produccion |
| Seguridad y disciplina operativa | `Skills/SSDLC_SystemPrompt.md` | mantener trazabilidad, cambio incremental y mitigacion de riesgos | security by design, shift-left, auditabilidad |

### Skill faltante o no automatizable

- No existe un registro cargable de skills mediante herramienta runtime en este entorno; los skills se leyeron manualmente y se aplican como guias operativas documentales.
- Falta una skill especifica de `Deployment/CI-CD` para cerrar `I.3` con checklist de hosting, variables de entorno, smoke tests post deploy y rollback.
- Falta una skill especifica de `Admin UX / Dashboard CRUD` para homogeneizar la implementacion del panel extra sin improvisacion visual.

## H. Plan de validacion continua

### Despues de cada iteracion

- Verificar que frontend compile: `npm run build` en `ecommerce-app-Nars`.
- Verificar unit tests frontend: `npm test` en `ecommerce-app-Nars`.
- Verificar tests backend relevantes: `npm test` o `npm run test:coverage` en `ecommerce-api-Nars`.
- Ejecutar smoke E2E del flujo critico: `npx cypress run --spec "cypress/e2e/auth.cy.js"` y `npx cypress run --spec "cypress/e2e/cart.cy.js"` en `ecommerce-app-Nars`.

### Minimo de pruebas por bloque

| Iteracion | Unit | Integracion | E2E | Resultado esperado |
|---|---|---|---|---|
| 1 | `LoginPage`, `RegisterPage`, guards, perfil | n/a o ligera con servicios mockeados | auth smoke | rutas y auth sin regresion |
| 2 | reducers, hooks, validadores, estados loading/error | componentes con providers y mocks de API | smoke de productos/ordenes | React Query y reducer sin romper UX |
| 3 | validadores de carrito/checkout | backend order/cart y frontend checkout | `cart.cy.js`, `checkoutReuse.cy.js` si aplica | stock consistente, carrito vaciado, orden persistida |
| 4 | componentes responsive si existen | n/a | smoke publico sobre URL deploy | demo publica estable |
| 5 | admin hooks/forms | CRUD FE-BE sobre entorno test | E2E admin y wishlist | extras funcionales y protegidos |

### Comandos recomendados

#### Frontend

- `npm test`
- `npm run build`
- `npx cypress run --spec "cypress/e2e/auth.cy.js"`
- `npx cypress run --spec "cypress/e2e/cart.cy.js"`

#### Backend

- `npm test`
- `npm run test:coverage`
- `npm run lint`
- `npm run start:test`

### Criterio de exito

- Sin errores de build.
- Sin regresiones en auth y checkout.
- Con evidencia de rutas protegidas, formularios validados y datos reales.
- Con URL publica accesible para cerrar `I.3`.

## I. Alertas y riesgos

### Riesgos principales

- Migrar a React Query sin capa adaptadora puede romper componentes que esperan shapes heterogeneos de respuesta.
- Cambiar carrito y checkout sin estrategia de transicion puede duplicar ordenes o perder sincronizacion entre carrito local y remoto.
- Introducir guards por rol sin revisar persistencia de usuario puede generar redirecciones incorrectas o loops.
- El despliegue puede fallar por variables de entorno inconsistentes entre frontend/backend.
- El panel admin puede abrir una superficie de privilegios si la guardia FE no replica correctamente el rol del backend.

### Regresiones tipicas a vigilar

- Imagenes/productos: rutas locales vs URLs del backend.
- Auth: refresh token expirado, logout parcial, sesion corrupta en `localStorage`.
- Env: `VITE_API_URL`, CORS, puertos de test y produccion.
- Rutas: fallback de `Suspense`, `PrivateRoute`, `GuestOnly`, rutas admin.
- Async issues: doble submit de checkout, invalidaciones duplicadas, race conditions de refresh y cart sync.

## Recomendaciones finales

1. Ejecutar primero Iteracion 1 completa; es la mayor relacion puntos/riesgo y deja la base lista para arquitectura React.
2. Tratar React Query como migracion progresiva con adaptadores, no como reemplazo masivo de todos los `services/` en una sola entrega.
3. Reservar el cambio a `/orders/checkout` para una iteracion propia con Cypress como guardrail obligatorio.
4. Atacar extras solo despues de cerrar base obligatoria y despliegue; el backend ya tiene mucho terreno ganado para admin y wishlist.
5. Mantener este archivo como documento canonico del plan y actualizarlo al cerrar cada iteracion con evidencias y puntaje esperado.
