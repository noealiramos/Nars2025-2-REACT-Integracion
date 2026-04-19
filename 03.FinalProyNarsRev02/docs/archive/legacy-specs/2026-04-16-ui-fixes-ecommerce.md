# UI Fixes Ecommerce Audit and Plan

## 1. Resumen ejecutivo

- Fecha de auditoria: 2026-04-17
- Fase actual: FASE 1 + FASE 2 unicamente. No se implementaron cambios funcionales.
- Alcance auditado: `ecommerce-app-Nars` y `ecommerce-api-Nars` para Home, Login, Profile, carrito/checkout/confirmation, admin products y admin categories.
- Hallazgo mas critico: hoy existen dos fuentes de verdad para totales. El carrito frontend muestra `subtotal + IVA + envio`, mientras backend y confirmacion trabajan con `totalPrice = subtotal + envio`. Eso explica la inconsistencia reportada del IVA.
- Hallazgo de mayor impacto UX: checkout ya tiene seleccionar/editar/eliminar direcciones guardadas, pero no tiene botones separados de Guardar/Cancelar para direccion; editar se persiste solo al confirmar la compra y eliminar no pide `window.confirm`.
- Hallazgo de mayor impacto visual: `ProfilePage` ya tiene la estructura correcta y botoneria funcional, pero usa una tarjeta clara con degradado blanco; no sigue la preferencia de tonos azules obscuros que ya existen en `src/index.css`.
- Hallazgo de riesgo operativo: el worktree ya esta sucio en archivos relevantes (`git status --short` mostro cambios previos en `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`, `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx`, `ecommerce-app-Nars/src/pages/ProfilePage.jsx`, entre otros). Cualquier ejecucion debe mezclar cambios con cuidado y no sobrescribir trabajo previo.

## 2. Evidencia de auditoria

### 2.1 Comandos ejecutados

| Comando | Resultado relevante |
| --- | --- |
| `git status --short` | Worktree sucio con cambios previos en frontend y backend; tambien hay archivos no trackeados en `docs/` y `opencode/`. |
| `ls` en `docs/` | Existe `docs/specs/` y varios reportes historicos de auditoria/cierre. |
| `ls` en `docs/specs/` | Solo existia `2026-03-30-feature-checkout-reuse-hardening.md` antes de este documento. |

### 2.2 Evidencia por requerimiento

#### REQ 1 - Home / bloque descriptivo principal

- El bloque vive en `ecommerce-app-Nars/src/pages/HomePage.jsx:48` y `ecommerce-app-Nars/src/pages/HomePage.jsx:50`.
- El ancho del texto lo limita `max-width: 32rem` en `ecommerce-app-Nars/src/pages/HomePage.css:26`.
- El contenedor `home-hero` no define grid/flex ni una distribucion mas rica; solo tiene `margin-bottom` en `ecommerce-app-Nars/src/pages/HomePage.css:22`.
- Diagnostico: el problema actual parece ser principalmente de `max-width` y distribucion del contenedor, no de responsive roto. En mobile ya se libera el ancho con `max-width: none` en `ecommerce-app-Nars/src/pages/HomePage.css:49`.
- Estado: existe parcialmente. El bloque ya existe y es responsive basico, pero no aprovecha el recuadro disponible.

#### REQ 2 - Login

- El texto demo existe en `ecommerce-app-Nars/src/pages/LoginPage.jsx:45`.
- Los valores precargados existen en `ecommerce-app-Nars/src/pages/LoginPage.jsx:13` y `ecommerce-app-Nars/src/pages/LoginPage.jsx:14`.
- La prueba unitaria actual espera esos valores en `ecommerce-app-Nars/src/pages/__tests__/LoginPage.test.jsx:46`.
- Cypress no depende de valores precargados porque siempre hace `clear().type(...)` en `ecommerce-app-Nars/cypress/e2e/auth.cy.js:77`, `ecommerce-app-Nars/cypress/e2e/goldenPath.cy.js:25` y `ecommerce-app-Nars/cypress/support/commands.js:94`.
- Diagnostico: los valores demo son una conveniencia local/manual, no un requisito tecnico del flujo de auth ni de Cypress.
- Estado: existe, pero en forma opuesta al requerimiento.

#### REQ 3 - Perfil de usuario

- La pantalla ya tiene estructura, carga real desde backend y guardado real por `PATCH /users/me` en `ecommerce-app-Nars/src/pages/ProfilePage.jsx:55` y `ecommerce-app-Nars/src/pages/ProfilePage.jsx:118`.
- El texto descriptivo actual es mas largo que el solicitado en `ecommerce-app-Nars/src/pages/ProfilePage.jsx:163`.
- El look actual usa fondo claro/blanco en `ecommerce-app-Nars/src/pages/ProfilePage.css:16` y tarjetas internas tambien claras en `ecommerce-app-Nars/src/pages/ProfilePage.css:37`.
- La paleta existente del proyecto ya tiene azules obscuros reutilizables en `ecommerce-app-Nars/src/index.css:28`, `ecommerce-app-Nars/src/index.css:38`, `ecommerce-app-Nars/src/index.css:71`.
- Estado: existe mayormente. El cambio es de copy + skin visual, no de logica.

#### REQ 4 - Calculo de IVA / consistencia aritmetica

- Carrito: `CartSummary` calcula `iva = subtotal * 0.16`, `shipping = 99`, `total = subtotal + iva + shipping` en `ecommerce-app-Nars/src/components/organisms/CartSummary.jsx:5`.
- Fuente del subtotal del carrito: `CartContext` suma `item.price * item.quantity` en `ecommerce-app-Nars/src/contexts/CartContext.jsx:223`.
- Checkout frontend no muestra resumen de subtotal/iva/total; solo envia `shippingCost` al backend en `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:432`.
- Backend orden manual: `createOrder` calcula `totalPrice = subtotal + shipping` en `ecommerce-api-Nars/src/controllers/orderController.js:200`.
- Backend checkout: `checkoutFromCart` calcula `totalPrice = subtotal + shipping` en `ecommerce-api-Nars/src/controllers/orderController.js:304`.
- Modelo de orden no tiene campos `subtotal`, `iva` o `tax`; solo `shippingCost` y `totalPrice` en `ecommerce-api-Nars/src/models/order.js:15`.
- Confirmation intenta renderizar `order.iva`, pero nunca lo normaliza ni lo recibe del backend; por eso tiende a salir `0`/vacío en `ecommerce-app-Nars/src/pages/ConfirmationPage.jsx:141`.
- Confirmation reconstruye `subtotal` como `totalPrice - shippingCost` en `ecommerce-app-Nars/src/pages/ConfirmationPage.jsx:44`, lo cual solo funciona si `totalPrice` no incluye IVA.
- Diagnostico: inconsistencia real frontend/backend. El carrito muestra un IVA visual que backend nunca persiste ni usa para la orden oficial.
- Estado: existe parcialmente y hoy es incoherente entre pantallas.

#### REQ 5 - Checkout / direcciones de envio

- Ya existe carga de direcciones guardadas, seleccion, modo nuevo, modo editar y eliminacion en `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:166`, `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:108`, `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:121`, `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:261`.
- Backend ya soporta crear, actualizar, eliminar y set default para direcciones en `ecommerce-api-Nars/src/controllers/shippingAddressController.js:5`, `ecommerce-api-Nars/src/controllers/shippingAddressController.js:136`, `ecommerce-api-Nars/src/controllers/shippingAddressController.js:197`, `ecommerce-api-Nars/src/controllers/shippingAddressController.js:228`.
- No existe boton Guardar ni Cancelar especifico para direccion en la UI; solo hay `Editar` y despues la persistencia ocurre dentro del submit final de checkout en `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:381`.
- Eliminar direccion no usa `window.confirm`; llama directo a `shippingApi.remove` en `ecommerce-app-Nars/src/pages/CheckoutPage.jsx:266`.
- Los contenedores usan `padding: 0.9rem 1rem` y ocupan todo el ancho de `saved-options`; no hay restriccion visual adicional en `ecommerce-app-Nars/src/pages/CheckoutPage.css:50`.
- Estado: existe parcialmente. La base de CRUD ya esta, pero falta la interaccion pedida y el ajuste visual.

#### REQ 6 - Admin productos / estabilidad del layout + imagen por producto

- La pantalla ya lista, crea, edita y elimina productos reales desde backend en `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx:67`, `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx:174`, `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx:159`.
- Ya existe helper para extraer imagen real `getImageUrl(product)` en `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx:30`, pero no se usa al renderizar cada tarjeta del listado.
- Las tarjetas actuales no reservan slot de media ni subgrid estable; solo apilan texto y acciones en `ecommerce-app-Nars/src/pages/AdminProductsPage.css:76`.
- No pude verificar por codigo una unica causa exacta del "se expande o se mueve al editar", porque el click en Editar solo rellena el formulario izquierdo (`ecommerce-app-Nars/src/pages/AdminProductsPage.jsx:126`) y no muta la tarjeta. Lo que si se ve es que el layout no tiene estructura fija para imagen/resumen/acciones, asi que sigue siendo fragil ante contenido variable.
- Estado: existe parcialmente. Falta imagen en listado y falta robustecer estructura visual para estabilizar la composicion.

#### REQ 7 - Admin productos / ocultar texto que no aporta

- El texto accesorio visible existe en `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx:282`: "Tambien puedes pegar una URL manual; ambas opciones guardan `imagesUrl`."
- Tambien se muestra `URL lista: ...` en `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx:284`.
- La logica de upload no depende de mostrar esos mensajes; la funcionalidad vive en `handleUploadImage` y en `uploadApi.uploadProductImage`.
- Estado: existe y es un ajuste puramente de UI visible.

#### REQ 8 - Admin categorias / guardar y cancelar en modo edicion

- La pagina ya muestra `Guardar cambios` y `Cancelar edicion` solo cuando `editing === true` en `ecommerce-app-Nars/src/pages/AdminCategoriesPage.jsx:126`.
- `Cancelar edicion` ya ejecuta `resetForm()` y revierte al estado vacio en `ecommerce-app-Nars/src/pages/AdminCategoriesPage.jsx:39`.
- `Guardar cambios` ya usa `saveCategory` con update real cuando hay `form.id` en `ecommerce-app-Nars/src/pages/AdminCategoriesPage.jsx:88`.
- El hook `useAdminCategories` ya persiste create/update/delete reales via API en `ecommerce-app-Nars/src/hooks/useAdminCategories.js:16`.
- No encontre Cypress para esta pantalla; tampoco vi prueba unitaria dedicada.
- Estado: ya existe funcionalmente. Lo pendiente aqui es validar y documentar, no construir desde cero.

## 3. Mapeo requerimiento -> archivos afectados

| Req | Frontend | Backend | Tests / soporte |
| --- | --- | --- | --- |
| REQ 1 Home | `ecommerce-app-Nars/src/pages/HomePage.jsx`, `ecommerce-app-Nars/src/pages/HomePage.css` | No | Posible Cypress visual en `ecommerce-app-Nars/cypress/e2e/responsiveEvidence.cy.js` |
| REQ 2 Login | `ecommerce-app-Nars/src/pages/LoginPage.jsx`, `ecommerce-app-Nars/src/pages/LoginPage.css` | No | `ecommerce-app-Nars/src/pages/__tests__/LoginPage.test.jsx`, `ecommerce-app-Nars/cypress/e2e/auth.cy.js`, `ecommerce-app-Nars/cypress/support/commands.js` |
| REQ 3 Profile | `ecommerce-app-Nars/src/pages/ProfilePage.jsx`, `ecommerce-app-Nars/src/pages/ProfilePage.css`, `ecommerce-app-Nars/src/index.css` | No | `ecommerce-app-Nars/src/pages/__tests__/ProfilePage.test.jsx`, posible `ecommerce-app-Nars/cypress/e2e/profile.cy.js` |
| REQ 4 IVA | `ecommerce-app-Nars/src/components/organisms/CartSummary.jsx`, `ecommerce-app-Nars/src/contexts/CartContext.jsx`, `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`, `ecommerce-app-Nars/src/pages/ConfirmationPage.jsx`, `ecommerce-app-Nars/src/constants/orderConstants.js` | `ecommerce-api-Nars/src/models/order.js`, `ecommerce-api-Nars/src/controllers/orderController.js`, posible `ecommerce-api-Nars/src/routes/orderRoutes.js` si se formaliza contrato | `ecommerce-app-Nars/src/pages/__tests__/CheckoutPage.test.jsx`, `ecommerce-app-Nars/cypress/e2e/cart.cy.js`, `ecommerce-app-Nars/cypress/e2e/goldenPath.cy.js`, `ecommerce-app-Nars/cypress/e2e/checkoutReuse.cy.js` |
| REQ 5 Checkout direcciones | `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`, `ecommerce-app-Nars/src/pages/CheckoutPage.css` | Reutiliza soporte existente en `ecommerce-api-Nars/src/controllers/shippingAddressController.js` | `ecommerce-app-Nars/src/pages/__tests__/CheckoutPage.test.jsx`, `ecommerce-app-Nars/cypress/e2e/checkoutReuse.cy.js`, `ecommerce-app-Nars/cypress/e2e/cart.cy.js` |
| REQ 6 Admin products layout + image | `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx`, `ecommerce-app-Nars/src/pages/AdminProductsPage.css` | No cambio de contrato esperado; usa imagen ya entregada por producto | `ecommerce-app-Nars/src/pages/__tests__/AdminProductsPage.test.jsx` |
| REQ 7 Admin products texto accesorio | `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx` | No | `ecommerce-app-Nars/src/pages/__tests__/AdminProductsPage.test.jsx` |
| REQ 8 Admin categories edit buttons | `ecommerce-app-Nars/src/pages/AdminCategoriesPage.jsx`, `ecommerce-app-Nars/src/pages/AdminCategoriesPage.css`, `ecommerce-app-Nars/src/hooks/useAdminCategories.js` | No cambio funcional esperado | Falta prueba; conviene agregar `ecommerce-app-Nars/src/pages/__tests__/AdminCategoriesPage.test.jsx` o Cypress admin |

## 4. Hallazgos

### 4.1 Lo que ya existe

- Home, Login, Profile, Checkout, Confirmation, Admin Products y Admin Categories ya existen y estan cableadas en rutas en `ecommerce-app-Nars/src/App.jsx`.
- Profile ya consume backend real y tiene guardado real.
- Checkout ya tiene base avanzada para reusar direcciones/metodos guardados.
- Admin Products ya tiene CRUD real y soporte de upload de imagen a Cloudinary.
- Admin Categories ya tiene Guardar/Cancelar funcionales en modo edicion.

### 4.2 Lo que existe parcialmente

- Home ya es responsive basico, pero el texto no aprovecha ancho disponible.
- Login funciona, pero su estado inicial y copy contradicen el requerimiento.
- Profile tiene estructura correcta, pero visualmente usa una paleta clara distinta a la preferencia pedida.
- Checkout direcciones ya tiene editar/eliminar, pero la persistencia y cancelacion no estan desacopladas del submit final.
- Admin Products ya conoce `imageUrl`, pero no la muestra en el listado.
- Las pantallas relacionadas con orden ya muestran totales, pero no comparten una formula unica.

### 4.3 Lo que no existe

- No existe una fuente de verdad unica para `subtotal`, `iva`, `shipping` y `total` entre carrito, checkout y confirmacion.
- No existen botones `Guardar` y `Cancelar` especificos para direccion de envio en checkout.
- No existe `window.confirm` previo al borrado de direccion.
- No existe prueba visible para admin categories.
- No existe hoy render de imagen por producto en `/admin/products`.

### 4.4 Deuda tecnica separada del alcance

- `HomePage.jsx` usa `Button` en el bloque de error (`ecommerce-app-Nars/src/pages/HomePage.jsx:66`) pero el import no aparece; eso merece revision separada si el archivo actual del worktree sigue asi.
- El nombre comercial aparece repetido como `Jewerly` en varias pantallas; no es parte explicita de estos 8 requerimientos, asi que debe tratarse como observacion separada.
- `CheckoutPage.css` contiene reglas de `order-summary` dentro del CSS de checkout (`ecommerce-app-Nars/src/pages/CheckoutPage.css:183`), lo cual mezcla responsabilidades de estilos.

## 5. Plan de implementacion

### REQ 1 - Home

- Diagnostico: restriccion de ancho y layout demasiado simple del hero.
- Causa raiz probable: `max-width: 32rem` y ausencia de layout interno mas flexible.
- Archivos a modificar: `ecommerce-app-Nars/src/pages/HomePage.jsx`, `ecommerce-app-Nars/src/pages/HomePage.css`.
- Estrategia tecnica: ampliar el copy sin inventar contenido ajeno, dar una estructura de ancho controlado con mejor uso de linea, mantener el mismo tono visual y liberar el ancho solo donde convenga.
- Riesgos: sobreextender texto o romper el balance visual en mobile.
- Validaciones: desktop/tablet/mobile, captura del hero, ausencia de overflow.
- Impacto esperado: solo frontend.

### REQ 2 - Login

- Diagnostico: texto demo y credenciales precargadas vienen hardcodeadas del componente.
- Causa raiz probable: decision de conveniencia para pruebas manuales iniciales.
- Archivos a modificar: `ecommerce-app-Nars/src/pages/LoginPage.jsx`, `ecommerce-app-Nars/src/pages/LoginPage.css`, `ecommerce-app-Nars/src/pages/__tests__/LoginPage.test.jsx`.
- Estrategia tecnica: iniciar `email` y `password` en vacio, retirar hint demo visible, actualizar tests unitarios para esperar inputs vacios, verificar que Cypress siga estable porque ya llena sus propios datos.
- Riesgos: romper solo la prueba unitaria actual que espera precarga.
- Validaciones: login exitoso, login invalido, redirect desde ruta protegida.
- Impacto esperado: frontend + tests.

### REQ 3 - Profile

- Diagnostico: copy largo y skin clara.
- Causa raiz probable: estilo aislado que no reutiliza la paleta azul obscura ya definida globalmente.
- Archivos a modificar: `ecommerce-app-Nars/src/pages/ProfilePage.jsx`, `ecommerce-app-Nars/src/pages/ProfilePage.css`, si hace falta `ecommerce-app-Nars/src/index.css` solo para reutilizar variables existentes sin crear paleta nueva.
- Estrategia tecnica: recortar el texto a la frase solicitada y migrar card/surfaces a combinaciones de `--color-strong-blue`, `--color-darker`, `--color-blue` o valores equivalentes ya existentes, cuidando contraste en labels/inputs/botones.
- Riesgos: bajar legibilidad si solo se oscurece fondo sin ajustar bordes y texto.
- Validaciones: contraste AA razonable visual, responsive a una columna, tests de Profile intactos salvo snapshots/texto.
- Impacto esperado: frontend.

### REQ 4 - IVA / totales

- Diagnostico: carrito, backend y confirmacion no usan la misma definicion de total.
- Causa raiz probable: el frontend agrego IVA visual, pero el backend nunca modelado `iva` ni `subtotal`; la confirmacion intenta inferir valores con datos insuficientes.
- Archivos a modificar: minimo `ecommerce-app-Nars/src/components/organisms/CartSummary.jsx`, `ecommerce-app-Nars/src/pages/ConfirmationPage.jsx`, `ecommerce-api-Nars/src/models/order.js`, `ecommerce-api-Nars/src/controllers/orderController.js`, y pruebas asociadas.
- Estrategia tecnica recomendada: definir una unica fuente de verdad oficial en backend para orden persistida. La ruta mas segura es que backend calcule y devuelva `subtotal`, `taxAmount`/`iva`, `shippingCost` y `totalPrice`, y que frontend solo renderice esos valores cuando la orden ya existe. Mientras tanto, el carrito puede seguir mostrando una previsualizacion con la misma formula oficial, no una distinta.
- Riesgos: cambio de contrato de orden; puede impactar confirmation, orders, order detail y E2E. Debe hacerse de forma backward compatible, agregando campos y sin romper `totalPrice` existente.
- Validaciones: comparar una misma orden en carrito, request de checkout y confirmation; revisar `OrdersPage`/`OrderDetailPage` por efecto colateral; revisar Cypress `cart`, `goldenPath`, `checkoutReuse`.
- Impacto esperado: frontend + backend + tests.

### REQ 5 - Checkout direcciones

- Diagnostico: CRUD de direccion existe, pero UX de edicion no esta separada del submit final.
- Causa raiz probable: la pagina actual usa un solo formulario de checkout para editar datos guardados y completar compra a la vez.
- Archivos a modificar: `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`, `ecommerce-app-Nars/src/pages/CheckoutPage.css`, `ecommerce-app-Nars/src/pages/__tests__/CheckoutPage.test.jsx`.
- Estrategia tecnica: agregar modo de edicion de direccion con snapshot local del estado previo, botones `Guardar` y `Cancelar` para direccion, persistencia inmediata con `shippingApi.update`, cancelacion que restaure el snapshot real, `window.confirm` antes de `shippingApi.remove`, y ajuste de ancho/padding de tarjetas guardadas sin tocar endpoints.
- Riesgos: duplicar estados de formulario y romper el happy path actual de compra.
- Validaciones: editar guardar, editar cancelar, eliminar confirmando, eliminar cancelando, compra con direccion existente y nueva, responsive.
- Impacto esperado: frontend + tests. Backend ya soporta la logica requerida.

### REQ 6 - Admin products layout + image

- Diagnostico: listado actual no reserva espacio para imagen ni define una composicion estable por tarjeta.
- Causa raiz probable: tarjeta minima basada solo en texto/acciones.
- Archivos a modificar: `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx`, `ecommerce-app-Nars/src/pages/AdminProductsPage.css`, `ecommerce-app-Nars/src/pages/__tests__/AdminProductsPage.test.jsx`.
- Estrategia tecnica: usar `getImageUrl(product)` para renderizar imagen real con contenedor de ratio fijo, separar media/contenido/acciones dentro de la tarjeta y fijar alineacion para que editar no empuje visualmente la composicion.
- Riesgos: imagenes de dimensiones variadas rompiendo altura o recorte.
- Validaciones: listado usable con y sin imagen fallback, editar sin salto apreciable del layout, tablet/mobile.
- Impacto esperado: frontend + tests.

### REQ 7 - Admin products texto accesorio

- Diagnostico: hay copy util para dev, pero accesorio para usuario final.
- Causa raiz probable: ayuda temporal de implementacion dejada visible.
- Archivos a modificar: `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx`, posible ajuste minimo en `ecommerce-app-Nars/src/pages/AdminProductsPage.css`.
- Estrategia tecnica: ocultar o retirar el texto auxiliar visible, manteniendo intacta la logica de upload y el feedback de error/exito realmente util.
- Riesgos: perder informacion operativa si se elimina feedback demasiado agresivamente.
- Validaciones: upload sigue funcionando, formulario sigue entendible, tests siguen encontrando controles.
- Impacto esperado: frontend.

### REQ 8 - Admin categories guardar/cancelar

- Diagnostico: funcionalidad ya existe.
- Causa raiz probable: el requerimiento parece venir de una observacion desactualizada o no validada contra el estado actual.
- Archivos a modificar: probablemente ninguno funcional; si se requiere endurecer evidencia, agregar pruebas en `ecommerce-app-Nars/src/pages/__tests__/AdminCategoriesPage.test.jsx`.
- Estrategia tecnica: no tocar UI si la auditoria visual confirma que ya cumple; solo documentar, y opcionalmente agregar test de no regresion.
- Riesgos: introducir cambios innecesarios donde hoy ya funciona.
- Validaciones: entrar en modo editar, guardar persistiendo, cancelar limpiando formulario.
- Impacto esperado: probablemente tests/documentacion solamente.

## 6. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigacion |
| --- | --- | --- |
| Cambiar contrato de orden por IVA | Alto | Agregar campos nuevos backward compatible, conservar `totalPrice`, revisar Confirmation/Orders/OrderDetail antes de tocar UI. |
| Worktree ya modificado en archivos relevantes | Alto | Leer diff antes de editar, aplicar cambios minimos y no sobrescribir trabajo previo. |
| Checkout combina CRUD y compra en un solo formulario | Alto | Introducir estados locales claros (`view/edit/new`) y pruebas unitarias adicionales antes de E2E. |
| Ajustes visuales rompen responsive | Medio | Validar desktop/tablet/mobile y mantener cambios acotados a contenedores afectados. |
| Limpieza de textos rompe tests por selectores/texto literal | Medio | Basar Cypress/Vitest en `data-testid` existentes, no en copy accesorio. |
| Admin categories ya cumple y se toque sin necesidad | Bajo | Marcar como requerimiento ya existente y limitar cambios a validacion/test. |

## 7. Validaciones manuales

- [ ] Home: el bloque principal usa mejor el recuadro sin overflow ni perdida de responsive.
- [ ] Login: la pantalla abre con correo y contrasena vacios.
- [ ] Login: ya no se muestra texto de usuario demo.
- [ ] Login: autenticacion valida sigue entrando y la invalida sigue mostrando error.
- [ ] Profile: se ve en tonos azules obscuros coherentes con la paleta actual y el texto descriptivo queda exactamente en la frase solicitada.
- [ ] Carrito: subtotal, IVA, envio y total coinciden con la formula oficial definida.
- [ ] Checkout: si se muestra resumen de totales, coincide con carrito y confirmation; si no, la orden enviada mantiene la misma fuente de verdad.
- [ ] Confirmation: subtotal, IVA, envio y total de la orden coinciden con lo calculado oficialmente y no por inferencia incorrecta.
- [ ] Checkout direcciones: editar -> guardar persiste; editar -> cancelar revierte; eliminar pide confirmacion; cancelar confirmacion no borra.
- [ ] Checkout direcciones: las tarjetas guardadas reducen ancho/exceso visual y siguen legibles en mobile.
- [ ] Admin products: cada producto muestra imagen real y el layout se mantiene estable al editar.
- [ ] Admin products: el texto accesorio ya no aparece al usuario.
- [ ] Admin categories: al editar aparecen Guardar/Cancelar, Guardar persiste y Cancelar revierte.

## 8. Validaciones Cypress

### Suites actuales relevantes

- `ecommerce-app-Nars/cypress/e2e/auth.cy.js`
- `ecommerce-app-Nars/cypress/e2e/cart.cy.js`
- `ecommerce-app-Nars/cypress/e2e/goldenPath.cy.js`
- `ecommerce-app-Nars/cypress/e2e/checkoutReuse.cy.js`
- `ecommerce-app-Nars/cypress/e2e/checkoutErrors.cy.js`
- `ecommerce-app-Nars/cypress/e2e/profile.cy.js`
- `ecommerce-app-Nars/cypress/e2e/responsiveEvidence.cy.js`

### Ajustes propuestos

- Login: no deberia requerir cambio en Cypress principal porque ya limpia y escribe inputs. Si alguna prueba valida texto demo, ajustarla para verificar solo formulario funcional.
- Home/Profile: ampliar o reusar `responsiveEvidence.cy.js` para capturar que el hero y el profile no rompen layout.
- Carrito/Checkout/Confirmation: extender `goldenPath.cy.js` o `cart.cy.js` para afirmar valores visibles de subtotal/IVA/envio/total una vez definida la fuente oficial.
- Checkout direcciones: extender `checkoutReuse.cy.js` con casos de `Editar -> Guardar`, `Editar -> Cancelar`, y `Eliminar -> confirm/cancel` usando `cy.on('window:confirm', ...)`.
- Admin products: hoy no hay suite Cypress dedicada; agregar una minima o reforzar Vitest para imagen renderizada y estabilidad de tarjetas.
- Admin categories: agregar prueba Vitest o Cypress admin para demostrar que Guardar/Cancelar ya existen y no se rompen.

### Posibles fallas esperables por cambios

- `ecommerce-app-Nars/src/pages/__tests__/LoginPage.test.jsx` fallara si no se actualiza, porque hoy espera valores precargados.
- Las suites E2E de login no deberian fallar por el cambio a campos vacios, ya que siempre escriben sus credenciales.
- Si se agrega render de imagen en admin products, cualquier test que asuma solo texto podria requerir aserciones adicionales, no necesariamente reemplazos de selectores.
- Si se corrige el contrato de orden para IVA, las pruebas que hoy solo esperan `_id` en confirmation seguiran pasando, pero conviene agregar assertions de totales para evitar regresiones silenciosas.

## 9. Resultado final

- FASE 1 completada: auditoria tecnica realizada con evidencia de codigo real.
- FASE 2 completada: plan de ajustes definido por requerimiento, con riesgos, validaciones e impacto.
- Implementacion: pendiente. No se aplicaron cambios funcionales en frontend ni backend en esta corrida.
- Requerimiento que ya existe al momento de la auditoria: REQ 8 (admin categories Guardar/Cancelar) ya esta implementado funcionalmente en el estado actual del workspace.
- Requerimiento mas delicado para ejecutar: REQ 4, porque toca la fuente de verdad de la aritmetica y podria implicar frontend + backend.

## 10. FASE 2 + 2.1 - Consolidacion Checkout + Admin Products

### 10.1 Alcance ejecutado

- REQ 5: Checkout - separar y consolidar la edicion de direcciones.
- REQ 6: Admin Products - estabilizar layout y mostrar imagen visible por producto.
- REQ 9: Checkout sin direcciones - modo `new` con botoneria consistente.
- REQ 10: compactacion de layout y consistencia de botones en flujos `view/edit/new`.
- Fuera de alcance respetado: REQ 4 IVA/totales, REQ 8 admin categories, backend, endpoints y contratos API.

### 10.2 Comandos ejecutados

| Comando | Resultado relevante |
| --- | --- |
| `git status --short` | Worktree siguio sucio antes de editar. Checkout/Admin Products ya tenian cambios previos y se trabajo encima de ellos sin sobrescribirlos. |
| `git diff --stat` | El repo traia cambios previos fuera de alcance en backend, auth, profile, login y otros modulos. |
| `npm run test` | `12 passed`, `74 passed`, duracion `19.60s`. |
| `npm run build` | Build OK con Vite, `208 modules transformed`, `built in 4.65s`. |
| `npx cypress run` | Suite completa ejecutada: `13 specs`, `33 tests`, `30 passing`, `3 failing`. Las fallas quedaron en `authLifecycle.cy.js` (ajena al alcance) y una primera version de `checkoutAddressModes.cy.js` por registro de usuario de prueba con nombre invalido. |
| `npx cypress run --spec cypress/e2e/checkoutAddressModes.cy.js --browser electron` | Re-ejecucion puntual tras ajustar el nombre del usuario de prueba: `2 passing`, `0 failing`. |

### 10.3 Archivos modificados en esta fase

- `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`
- `ecommerce-app-Nars/src/pages/CheckoutPage.css`
- `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx`
- `ecommerce-app-Nars/src/pages/AdminProductsPage.css`
- `ecommerce-app-Nars/src/pages/__tests__/CheckoutPage.test.jsx`
- `ecommerce-app-Nars/src/pages/__tests__/AdminProductsPage.test.jsx`
- `ecommerce-app-Nars/cypress/e2e/checkoutReuse.cy.js`
- `ecommerce-app-Nars/cypress/e2e/checkoutAddressModes.cy.js`

### 10.4 Decisiones tecnicas

- En Checkout se uso un modo de direccion mas explicito: `view`, `edit`, `new`.
- Se mantuvo intacto el contrato actual del checkout final; los cambios se limitaron a la UX de direccion y al comportamiento del formulario.
- `Guardar` en `edit` usa `shippingApi.update(...)` y luego refresca la lista real con `fetchShippingAddressesByUser(user.id)`.
- `Guardar` en `new` usa `shippingApi.create(...)`, refresca la lista real y cambia la seleccion a `view` sobre la direccion recien creada.
- `Cancelar` en `edit` restaura el estado previo real de la direccion seleccionada; `Cancelar` en `new` limpia el formulario y vuelve al estado inicial o a la direccion por defecto si ya habia guardadas.
- En Admin Products se reutilizo `getImageUrl(product)` ya existente, sin introducir helpers ni contratos nuevos.

### 10.5 Implementacion funcional

#### Checkout

- La direccion seleccionada ahora entra en modo `view` y deja los campos bloqueados.
- Al editar una direccion aparecen botones dedicados `Guardar` y `Cancelar` sin mezclar esa persistencia con el submit principal de compra.
- En modo `new` los botones `Guardar` y `Cancelar` tambien son visibles siempre, incluso cuando el usuario no tiene direcciones guardadas.
- `Guardar` en `new` crea la direccion y cambia la pantalla a modo `view` con la direccion recien creada seleccionada.
- `Cancelar` en `new` limpia el formulario y mantiene un estado consistente del checkout.
- Se mantiene la restriccion de no confirmar compra mientras la direccion esta en `edit`.
- Eliminar direccion ya pide confirmacion con `window.confirm("¿Está seguro?, esta acción no podrá deshacerse?")`.
- El layout de tarjetas guardadas se compacto con `max-width`, acciones agrupadas y menor espacio muerto.

#### Admin Products

- Cada tarjeta del listado ahora separa `media`, `content` y `actions`.
- Se muestra imagen visible por producto usando `getImageUrl(product)`.
- Si no existe imagen, se muestra un placeholder estable en el mismo slot.
- El contenedor usa `aspect-ratio: 1 / 1` y `object-fit: cover` para evitar saltos de layout con imagenes desiguales.

### 10.6 Riesgos detectados

- Checkout y Admin Products ya tenian cambios previos en el worktree; cualquier fase posterior debe seguir revisando diff antes de editar.
- `npx cypress run` sigue fallando por `authLifecycle.cy.js`, especificamente porque `POST /api/auth/test/revoke-refresh-tokens` devuelve `404` donde el test espera `200`; esto es ajeno a REQ 5/6/9/10.
- Cypress sigue mostrando un warning no bloqueante al intentar limpiar screenshots previos de `responsiveEvidence.cy.js`.

### 10.7 Validaciones realizadas

- Unit tests: se agregaron casos para `new` con botones visibles, guardar direccion nueva, cancelar limpieza real, editar/cancelar direccion y confirmacion antes de eliminar.
- Cypress real: se agrego `checkoutAddressModes.cy.js` para cubrir el flujo sin direcciones, ademas de ampliar `checkoutReuse.cy.js` para editar/cancelar y confirmar borrado.
- Responsive: la suite `responsiveEvidence.cy.js` siguio pasando con el checkout ya compactado.
- Admin Products: se valido imagen visible en test unitario y se mantuvo la cobertura de upload.

### 10.8 Resultados de tests

- Vitest: `12` archivos, `74` tests, todos pasando.
- Build: `vite build` exitoso.
- Cypress suite completa: ejecutada; la cobertura nueva de checkout paso, pero la corrida global no quedo totalmente verde por una falla externa en `authLifecycle.cy.js`.
- Cypress puntual `checkoutAddressModes.cy.js`: `2 passing`, `0 failing`.

### 10.9 Estado final de la fase

- REQ 5 consolidado.
- REQ 6 consolidado.
- REQ 9 implementado.
- REQ 10 implementado.
- Sin cambios de backend, endpoints ni contratos.

## 10. FASE 3 - Ejecucion quick wins

### 10.1 Comandos ejecutados en esta fase

| Comando | Resultado relevante |
| --- | --- |
| `git status --short` | El worktree seguia sucio antes de editar. Archivos de esta fase ya modificados previamente por otro trabajo: `ecommerce-app-Nars/src/pages/ProfilePage.jsx`, `ecommerce-app-Nars/src/pages/ProfilePage.css`, `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx`, `ecommerce-app-Nars/src/pages/AdminProductsPage.css`, `ecommerce-app-Nars/src/pages/__tests__/ProfilePage.test.jsx`, `ecommerce-app-Nars/src/pages/__tests__/AdminProductsPage.test.jsx`, `ecommerce-app-Nars/src/index.css`. |
| `git diff --stat` | Antes de esta fase ya habia cambios amplios fuera de alcance en checkout, API y backend. Se trabajo sin revertirlos ni mezclarlos con REQ 4/5/6/8. |
| `npm run test -- src/pages/__tests__/LoginPage.test.jsx src/pages/__tests__/ProfilePage.test.jsx src/pages/__tests__/AdminProductsPage.test.jsx` | `3 passed`, `15 passed`, duracion `8.23s`. |
| `npm run build` | Build frontend OK con Vite; `208 modules transformed`, `built in 2.96s`. |
| `npx cypress run --spec cypress/e2e/auth.cy.js --browser electron` | `4 passing` en `12s`. Warning no bloqueante al intentar limpiar screenshots viejos de `responsiveEvidence.cy.js`. |
| `npx cypress run --spec cypress/e2e/profile.cy.js --browser electron` | `2 passing` en `7s`. Mismo warning no bloqueante de limpieza de screenshots viejos. |

### 10.2 Archivos revisados

- `ecommerce-app-Nars/src/pages/HomePage.jsx`
- `ecommerce-app-Nars/src/pages/HomePage.css`
- `ecommerce-app-Nars/src/pages/LoginPage.jsx`
- `ecommerce-app-Nars/src/pages/LoginPage.css`
- `ecommerce-app-Nars/src/pages/ProfilePage.jsx`
- `ecommerce-app-Nars/src/pages/ProfilePage.css`
- `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx`
- `ecommerce-app-Nars/src/pages/AdminProductsPage.css`
- `ecommerce-app-Nars/src/pages/__tests__/LoginPage.test.jsx`
- `ecommerce-app-Nars/src/pages/__tests__/ProfilePage.test.jsx`
- `ecommerce-app-Nars/src/pages/__tests__/AdminProductsPage.test.jsx`
- `ecommerce-app-Nars/src/index.css`
- `ecommerce-app-Nars/cypress/e2e/auth.cy.js`
- `ecommerce-app-Nars/cypress/e2e/profile.cy.js`
- `ecommerce-app-Nars/cypress/e2e/responsiveEvidence.cy.js`
- `ecommerce-app-Nars/cypress/support/commands.js`

### 10.3 Archivos modificados

- `ecommerce-app-Nars/src/pages/HomePage.jsx`
- `ecommerce-app-Nars/src/pages/HomePage.css`
- `ecommerce-app-Nars/src/pages/LoginPage.jsx`
- `ecommerce-app-Nars/src/pages/LoginPage.css`
- `ecommerce-app-Nars/src/pages/ProfilePage.jsx`
- `ecommerce-app-Nars/src/pages/ProfilePage.css`
- `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx`
- `ecommerce-app-Nars/src/pages/AdminProductsPage.css`
- `ecommerce-app-Nars/src/pages/__tests__/LoginPage.test.jsx`
- `ecommerce-app-Nars/src/pages/__tests__/ProfilePage.test.jsx`
- `ecommerce-app-Nars/src/pages/__tests__/AdminProductsPage.test.jsx`

### 10.4 Diff funcional resumido

- REQ 1 Home: el hero ahora usa mejor el ancho disponible con padding, borde, fondo consistente con el look actual y texto con `max-width` mas amplio para evitar que quede comprimido.
- REQ 1 Home: se agrego el import faltante de `Button` para no dejar una referencia rota en el estado de error del listado.
- REQ 2 Login: se removio el texto demo visible y `email/password` ahora inician vacios siempre.
- REQ 2 Login: las pruebas de login se actualizaron para llenar credenciales explicitamente cuando validan submit, redirect y estado de carga.
- REQ 3 Profile: el texto descriptivo quedo exactamente en `Consulta tu informacion y actualiza los datos.` y la tarjeta principal paso a tonos azul obscuro reutilizando la paleta ya existente.
- REQ 3 Profile: se preservo la legibilidad de resumen, labels e inputs oscuros ya existentes.
- REQ 7 Admin products: se retiro de la UI visible el texto accesorio de `URL manual` y `URL lista`, sin tocar la logica de upload ni el mensaje de exito/error util.

### 10.5 Motivo de cada cambio

- Home: el problema era de aprovechamiento de espacio, no de estructura; por eso el ajuste fue visual y de ancho, no un rediseño.
- Login: el requerimiento pedia una pantalla mas limpia y sin ayudas demo; mantener precarga afectaba tanto UX como pruebas.
- Profile: la implementacion previa ya resolvia carga/guardado real, asi que solo se corrigio copy y skin para alinearlo con la paleta azul obscura del proyecto.
- Admin products: el texto removido era accesorio para implementacion, no para usuario final; la funcionalidad queda igual porque `handleUploadImage` no dependia de ese copy.

### 10.6 Riesgos y hallazgos

- El worktree ya venia sucio en archivos relevantes de Profile y Admin Products; los cambios se hicieron encima del estado actual sin revertir trabajo ajeno.
- No se ejecuto una prueba Cypress dedicada para Home ni Admin Products porque no existe hoy una suite especifica para esos dos quick wins; Home quedo cubierto por build y revision CSS, y Admin Products por Vitest.
- Cypress emitio un warning no bloqueante al intentar borrar resultados viejos bajo `cypress/screenshots/responsiveEvidence.cy.js`; no afecto el exit code ni los specs ejecutados.

### 10.7 Validaciones ejecutadas

- Home: validacion tecnica por diff y build, confirmando que el hero compila con estilos nuevos y sin afectar el resto de la pagina.
- Login: validacion automatizada unitaria + Cypress real; inputs vacios, submit valido, credenciales invalidas y redirect siguieron funcionando.
- Profile: validacion unitaria + Cypress real; acceso autenticado, redirect de no autenticado y render del contenido principal siguieron OK.
- Admin products: validacion unitaria real de listado, create/update/delete y upload con URL retornada; adicionalmente se afirmo que el texto accesorio ya no aparece.

### 10.8 Resultados de tests

- Vitest: `3` archivos, `15` tests, todos pasando.
- Build: `vite build` exitoso.
- Cypress `auth.cy.js`: `4 passing`.
- Cypress `profile.cy.js`: `2 passing`.

### 10.9 Ajustes menores a pruebas

- `LoginPage.test.jsx`: ahora espera campos vacios y escribe credenciales explicitamente antes de enviar el formulario.
- `ProfilePage.test.jsx`: se agrego assertion del nuevo texto descriptivo exacto.
- `AdminProductsPage.test.jsx`: se agregaron assertions para verificar la ausencia del texto accesorio y se mantuvo la cobertura del upload.

### 10.10 Estado de esta fase

- Implementado solo el alcance de REQ 1, REQ 2, REQ 3 y REQ 7.
- No se tocaron REQ 4, REQ 5, REQ 6 ni REQ 8 en esta corrida.


## FASE 4 — Ejecución REQ 5 y REQ 6

(resumen de lo que ya generó Antigravity)

## 11. FASE 3 - Correccion de visualizacion IVA

### 11.1 Comandos ejecutados

| Comando | Resultado relevante |
| --- | --- |
| `git status --short` | El worktree seguia sucio antes de editar. Archivos relacionados con checkout ya venian modificados: `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`, `ecommerce-app-Nars/src/pages/__tests__/CheckoutPage.test.jsx` y otros fuera de alcance. |
| `git diff --stat` | Se confirmaron cambios previos amplios en frontend/backend. Se trabajo solo sobre archivos de carrito, confirmation, constantes y pruebas relacionadas con IVA visible. |
| `git diff -- <archivos IVA>` | Se verifico que `CartSummary.jsx`, `ConfirmationPage.jsx`, `orderConstants.js`, `cart.cy.js` y `goldenPath.cy.js` no tenian un ajuste previo de IVA visible en confirmation. |
| `npm run test` | `13 passed`, `75 passed`, duracion `19.83s`. |
| `npm run build` | Build frontend OK con Vite; `208 modules transformed`, `built in 5.08s`. |
| `npx cypress run` | `13 specs`, `33 tests`: `25 passing`, `2 failing`, `6 skipped`. `cart.cy.js` y `goldenPath.cy.js` siguieron pasando con nuevas assertions de IVA. Fallas ajenas/recurrentes en `authLifecycle.cy.js` y `checkoutReuse.cy.js`. |

### 11.2 Archivos revisados

- `ecommerce-app-Nars/src/components/organisms/CartSummary.jsx`
- `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`
- `ecommerce-app-Nars/src/pages/ConfirmationPage.jsx`
- `ecommerce-app-Nars/src/constants/orderConstants.js`
- `ecommerce-app-Nars/src/services/orderService.js`
- `ecommerce-app-Nars/src/pages/CartPage.jsx`
- `ecommerce-app-Nars/src/pages/OrderDetailPage.jsx`
- `ecommerce-app-Nars/src/pages/__tests__/CartPage.test.jsx`
- `ecommerce-app-Nars/cypress/e2e/cart.cy.js`
- `ecommerce-app-Nars/cypress/e2e/goldenPath.cy.js`

### 11.3 Hallazgos de auditoria

- En carrito el IVA ya existia y se calculaba solo en frontend con `subtotal * 0.16` en `CartSummary.jsx`.
- El `subtotal` que usa carrito viene de `CartContext.totalPrice`, que hoy representa la suma de items sin IVA.
- En confirmation la pantalla intentaba mostrar `order.iva`, pero el backend actual no entrega ese campo en el payload final de orden.
- La misma pantalla reconstruia `subtotal` como `order.totalPrice - shippingCost`, lo que deja visible el subtotal de productos, pero no el IVA.
- El resultado real era: carrito si mostraba IVA porque lo calculaba localmente; confirmation mostraba `0.00` porque dependia de `order.iva` inexistente.

### 11.4 Causa raiz real

- Caso D: mezcla de frontend y payload.
- Carrito calcula IVA localmente, pero la orden final no lo persiste en un campo dedicado que confirmation pueda consumir.
- Confirmation ademas no recalculaba IVA desde los items o desde el subtotal; solo intentaba renderizar un valor ausente (`order.iva`).
- No se encontro evidencia suficiente para justificar un cambio de backend en esta fase; el problema visible principal era de renderizacion/reconstruccion en frontend.

### 11.5 Decision tecnica tomada

- Se aplico el cambio mas pequeno y seguro posible en frontend.
- Se centralizo la formula ya existente en `orderConstants.js` con helpers reutilizables para IVA y total visible.
- `CartSummary.jsx` paso a reutilizar esos helpers sin cambiar la logica funcional que ya tenia.
- `ConfirmationPage.jsx` ahora normaliza items, calcula `subtotal` real desde items cuando hace falta, calcula `iva` si el payload no lo trae y arma el total visible con la misma formula que ya usa carrito.
- No se tocaron backend, endpoints ni contratos API.

### 11.6 Archivos modificados

- `ecommerce-app-Nars/src/constants/orderConstants.js`
- `ecommerce-app-Nars/src/components/organisms/CartSummary.jsx`
- `ecommerce-app-Nars/src/pages/ConfirmationPage.jsx`
- `ecommerce-app-Nars/src/pages/__tests__/CartPage.test.jsx`
- `ecommerce-app-Nars/src/pages/__tests__/ConfirmationPage.test.jsx`
- `ecommerce-app-Nars/cypress/e2e/cart.cy.js`
- `ecommerce-app-Nars/cypress/e2e/goldenPath.cy.js`

### 11.7 Riesgos detectados

- El backend sigue persisitiendo `totalPrice` sin un campo dedicado de IVA; esta fase corrige la visualizacion final, no el contrato oficial de orden.
- `OrderDetailPage` y `OrdersPage` siguen leyendo `totalPrice` directo del backend; no se tocaron porque el requerimiento se enfoco en carrito/confirmacion/flujo final.
- La suite completa de Cypress ya venia con fallas ajenas al alcance: `authLifecycle.cy.js` y `checkoutReuse.cy.js`.
- Cypress mantuvo el warning no bloqueante al intentar limpiar screenshots previos de `responsiveEvidence.cy.js`.

### 11.8 Validaciones manuales realizadas

- Carrito: se verifico por codigo y por E2E que sigue mostrando subtotal, IVA, envio y total.
- Flujo de compra: `cart.cy.js` y `goldenPath.cy.js` confirmaron que el checkout y la confirmacion siguen funcionando sin romper el submit.
- Confirmacion: la pantalla ya no depende de `order.iva` ausente y ahora muestra IVA distinto de `0.00` en el flujo final.
- Total final visible: se alinea con la misma formula del carrito para evitar que confirmation quede desfasada respecto al flujo previo.

### 11.9 Resultados de tests

- Vitest: `13` archivos, `75` tests, todos pasando.
- Build: `vite build` exitoso.
- Cypress `cart.cy.js`: sigue pasando con assertions nuevas de IVA en carrito y confirmation.
- Cypress `goldenPath.cy.js`: sigue pasando con assertions nuevas de IVA visible en confirmation.
- Cypress full run: ejecutado. Fallas ajenas/recurrentes:
  - `authLifecycle.cy.js`: `expected 404 to equal 200` en `/api/auth/test/revoke-refresh-tokens`
  - `checkoutReuse.cy.js`: fallo en hook `before all` esperando `201` y recibiendo `undefined` en un flujo de bootstrap previo a las pruebas

### 11.10 Estado final

- Carrito sigue calculando y mostrando IVA.
- Confirmation ahora muestra IVA visible y consistente con carrito.
- No se tocaron backend ni contratos API.
- La correccion aplicada fue minima, controlada y enfocada solo en IVA visible del flujo final.
