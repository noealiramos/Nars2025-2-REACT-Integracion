# Phase 1 Progress — Cart Source of Truth (Backend)

## Cambios realizados
- Se creó `cartApi` para consumir `/api/cart/user`, `/api/cart/add-product`, `/api/cart/:id`.
- Se refactorizó `CartContext` para usar backend como fuente de verdad en usuarios autenticados y mantener un fallback temporal para usuarios anónimos.
- Se sincroniza el carrito local al backend al iniciar sesión (si existe carrito local).
- Se agregó manejo de estados `loading` y `error` en UI de carrito.
- Se evitó limpiar el carrito al cerrar sesión para permitir persistencia entre sesiones.
- Se amplió el populate del backend de carrito para incluir `imagesUrl` en los productos del carrito.

## Archivos modificados
- `ecommerce-app-Nars/src/api/cartApi.js` (nuevo)
- `ecommerce-app-Nars/src/contexts/CartContext.jsx`
- `ecommerce-app-Nars/src/pages/CartPage.jsx`
- `ecommerce-app-Nars/src/pages/CartPage.css`
- `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`
- `ecommerce-app-Nars/src/components/organisms/SiteHeader.jsx`
- `ecommerce-api-Nars/src/controllers/cartController.js`

## Riesgos detectados
- Usuarios anónimos siguen usando fallback local hasta autenticarse (temporal, documentado).
- El backend ahora retorna `imagesUrl` en el carrito; si algún cliente dependía de un payload mínimo, debe revalidarse.

## Validación del sistema
- No se ejecutaron pruebas automáticas en esta fase.
- Validación manual recomendada:
  - Login → agregar producto → verificar `/cart` carga desde backend.
  - Logout → login → carrito persiste.
  - Vaciar carrito y confirmar UI vacía.

## Documentación generada
- `docs/progress-phase-1.md`
