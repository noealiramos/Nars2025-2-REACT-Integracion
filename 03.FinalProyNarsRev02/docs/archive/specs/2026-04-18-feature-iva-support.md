# Soporte de IVA en ordenes

## Decision

- Se adopta la opcion B: IVA real de 16% para nuevas ordenes.
- Justificacion de negocio: el ecommerce ya persiste subtotal, envio y total desde backend como fuente unica de verdad; dejar `taxAmount = 0` en nuevas compras mantiene consistencia tecnica, pero deja el flujo incompleto desde la perspectiva fiscal para un storefront tipo marketplace en Mexico.
- Alcance: solo ordenes nuevas o actualizadas por los flujos actuales. Las ordenes legacy se mantienen sin recalculo retroactivo.

## Justificacion de negocio

- El comprador necesita ver un desglose coherente de subtotal, impuesto, envio y total final.
- En un modo negocio simplificado tipo marketplace, no hace falta CFDI ni reglas fiscales avanzadas para comenzar, pero si un impuesto visible y consistente en toda la compra.
- El backend ya es la unica fuente de verdad, asi que el lugar correcto para introducir IVA es el calculo de orden, no el frontend.

## Implementacion tecnica

### Backend

- Archivo principal: `ecommerce-api-Nars/src/controllers/orderController.js`
- Se agrego `IVA_RATE = 0.16`.
- Se agregaron utilidades `roundMoney`, `getItemsSubtotal` y `calculateOrderTotals` para evitar errores de floating point y redondear a 2 decimales.
- Se actualizo `createOrder` para calcular:
  - `subtotal = sum(price * quantity)`
  - `taxAmount = subtotal * 0.16`
  - `totalPrice = subtotal + taxAmount + shippingCost`
- Se actualizo `checkoutFromCart` con la misma logica centralizada.
- Se actualizo `updateOrder` para recalcular `totalPrice` cuando cambia `shippingCost`, respetando `taxAmount` existente. Para ordenes legacy sin `taxAmount`, se conserva `0`.
- Se actualizo `enrichOrderTotals(...)` para:
  - redondear campos monetarios;
  - completar `subtotal`, `taxAmount`, `shippingCost` y `totalPrice` en respuestas;
  - mantener compatibilidad con ordenes antiguas sin recalcular impuesto retroactivo.

### Persistencia

- El modelo `Order` ya soportaba `subtotal`, `taxAmount`, `shippingCost` y `totalPrice` en `ecommerce-api-Nars/src/models/order.js`.
- La implementacion actual persiste esos cuatro campos desde backend al crear la orden.

### Frontend

- `ecommerce-app-Nars/src/pages/ConfirmationPage.jsx` ya consume `subtotal`, `taxAmount`, `shippingCost` y `totalPrice` desde backend y ahora queda validado con casos con IVA.
- `ecommerce-app-Nars/src/pages/OrderDetailPage.jsx` ya muestra IVA solo si `taxAmount > 0`; se validaron casos con y sin impuesto.
- `ecommerce-app-Nars/src/components/organisms/CartSummary.jsx` se ajusto para aceptar `taxAmount`, `shippingCost` y `total` como props opcionales sin recalculo local de IVA; si no llegan, mantiene el comportamiento actual del carrito y aclara que los cargos finales se confirman en backend al crear la orden.
- `CheckoutPage.jsx` no recalcula IVA localmente y sigue enviando solo `shippingCost`; el impuesto final lo define el backend al crear la orden.

## Compatibilidad legacy

- Si una orden antigua no tiene `taxAmount`, la API responde `taxAmount: 0`.
- No se recalcula IVA en ordenes ya guardadas.
- Si cambia `shippingCost` en una orden legacy, solo se recompone `totalPrice` usando `subtotal + taxAmount + shippingCost`.

## Ejemplos de calculo

### Caso simple

- Subtotal: `100.00`
- IVA 16%: `16.00`
- Envio: `0.00`
- Total: `116.00`

### Caso con redondeo

- Productos: `3 x 333.33`
- Subtotal: `999.99`
- IVA 16%: `159.9984 -> 160.00`
- Envio: `99.00`
- Total: `1258.99`

## Impacto

### Backend

- Nuevas ordenes quedan fiscalmente desglosadas y consistentes desde el origen.
- Se elimina la necesidad de que el frontend estime impuestos.

### Frontend

- Las pantallas de confirmacion y detalle reflejan el impuesto real enviado por API.
- El carrito sigue sin inventar IVA antes de crear la orden, preservando la regla de fuente unica de verdad.

## Evidencia

### Terminal

```text
> ramdi-jewelry-ecommerce-css@1.0.0 test
> vitest run src/pages/__tests__/ConfirmationPage.test.jsx src/pages/__tests__/OrderDetailPage.test.jsx src/pages/__tests__/CartPage.test.jsx

FAIL src/pages/__tests__/CartPage.test.jsx > CartPage > renderiza items correctamente
Error: expect(element).not.toBeInTheDocument()
expected document not to contain element, found <p class="cart-summary__note">...</p> instead
```

```text
> ecommerce-api@1.0.0 test
> vitest tests/unit/controllers/orderController.test.js

✓ tests/unit/controllers/orderController.test.js (10 tests) 118ms
Test Files  1 passed (1)
Tests       10 passed (10)
```

```text
> ramdi-jewelry-ecommerce-css@1.0.0 test
> vitest run src/pages/__tests__/ConfirmationPage.test.jsx src/pages/__tests__/OrderDetailPage.test.jsx src/pages/__tests__/CartPage.test.jsx

Test Files  3 passed (3)
Tests       9 passed (9)
```

```text
> ramdi-jewelry-ecommerce-css@1.0.0 test
> vitest run src/pages/__tests__/CheckoutPage.test.jsx

Test Files  1 passed (1)
Tests       17 passed (17)
```

```text
> ramdi-jewelry-ecommerce-css@1.0.0 build
> vite build

✓ built in 2.41s
```

### API

- Los tests del controlador verifican que `Order.create(...)` recibe `subtotal`, `taxAmount`, `shippingCost` y `totalPrice` consistentes.
- Se agrego validacion para redondeo de IVA y para compatibilidad legacy sin impuesto retroactivo.

### DB

- El esquema `Order` ya persiste `subtotal`, `taxAmount`, `shippingCost` y `totalPrice`.
- La ruta de creacion/checkout escribe esos campos desde backend en la llamada a `Order.create(...)`.
- No se realizo una verificacion manual contra una instancia Mongo activa en esta sesion.

### UI

- `ConfirmationPage` muestra IVA solo cuando `taxAmount > 0`.
- `OrderDetailPage` muestra IVA solo cuando `taxAmount > 0`.
- `CartSummary` no recalcula impuesto localmente y queda listo para recibir totales backend-driven si el flujo de carrito evoluciona.

## Confirmacion de consistencia total

- Regla implementada para nuevas ordenes: `subtotal + taxAmount + shippingCost = totalPrice`.
- Regla preservada para ordenes legacy: `subtotal + 0 + shippingCost = totalPrice` cuando `taxAmount` no existe.
- No se duplico logica financiera en frontend.
- Backend se mantiene como unica fuente de verdad.
