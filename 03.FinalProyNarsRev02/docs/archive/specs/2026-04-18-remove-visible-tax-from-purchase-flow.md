# Remove visible tax from purchase flow

## Problema detectado

- La decision actual de producto es no mostrar IVA al usuario final.
- Sin embargo, el frontend seguia renderizando la linea `IVA` en `ConfirmationPage`, `OrderDetailPage` y `CartSummary`.
- Ademas, el backend acababa de incluir `taxAmount` dentro de `totalPrice` para ordenes nuevas.
- Eso hacia riesgoso ocultar solo la linea visual: `Subtotal + Envio` podia dejar de coincidir con `Total`.

## Decision de negocio

- El flujo visible de compra debe mostrar solo `Subtotal`, `Envío` y `Total`.
- El usuario final no debe ver la palabra `IVA`.
- Para mantener consistencia visible, el total real de nuevas ordenes ya no debe incluir impuesto.

## Diagnostico tecnico

### Auditoria frontend

- `ecommerce-app-Nars/src/components/organisms/CartSummary.jsx`: renderizaba un bloque condicional con `IVA` si `taxAmount > 0`.
- `ecommerce-app-Nars/src/pages/ConfirmationPage.jsx`: renderizaba `IVA` si `order.taxAmount > 0`.
- `ecommerce-app-Nars/src/pages/OrderDetailPage.jsx`: renderizaba `IVA` si `order.taxAmount > 0`.
- Tests afectados:
  - `ecommerce-app-Nars/src/pages/__tests__/ConfirmationPage.test.jsx`
  - `ecommerce-app-Nars/src/pages/__tests__/OrderDetailPage.test.jsx`

### Verificacion backend

- En `ecommerce-api-Nars/src/controllers/orderController.js`, `calculateOrderTotals(...)` estaba calculando:
  - `taxAmount = subtotal * 0.16`
  - `totalPrice = subtotal + taxAmount + shippingCost`
- Con ese comportamiento, si se ocultaba solo la linea `IVA`, el usuario podia ver un total mayor al resultado visible de `Subtotal + Envío`.
- Por ese motivo, no bastaba con limpiar frontend; tambien hacia falta un ajuste minimo en backend para nuevas ordenes.

## Archivos modificados

- `ecommerce-api-Nars/src/controllers/orderController.js`
- `ecommerce-api-Nars/tests/unit/controllers/orderController.test.js`
- `ecommerce-app-Nars/src/components/organisms/CartSummary.jsx`
- `ecommerce-app-Nars/src/pages/ConfirmationPage.jsx`
- `ecommerce-app-Nars/src/pages/OrderDetailPage.jsx`
- `ecommerce-app-Nars/src/pages/__tests__/ConfirmationPage.test.jsx`
- `ecommerce-app-Nars/src/pages/__tests__/OrderDetailPage.test.jsx`

## Cambios aplicados

### Frontend

- Se elimino la visualizacion de `IVA` en `CartSummary`, `ConfirmationPage` y `OrderDetailPage`.
- Se conservaron visibles solo `Subtotal`, `Envío` y `Total`.
- No se introdujeron calculos financieros nuevos en frontend.

### Backend

- Si se toco backend, porque era indispensable para mantener coherencia visible.
- `calculateOrderTotals(...)` ahora deja `taxAmount = 0` para nuevas ordenes.
- `totalPrice` vuelve a calcularse como `subtotal + shippingCost`.
- Se mantuvo compatibilidad del contrato: el campo `taxAmount` sigue existiendo, pero en nuevas ordenes queda en `0`.
- No se hizo refactor amplio ni se modificaron rutas/API de forma invasiva.

## Legacy / compatibilidad

- No se hizo migracion ni recalculo retroactivo de ordenes existentes.
- El cambio se enfoca en nuevas ordenes y en quitar la linea visual de IVA.
- El backend conserva soporte tecnico del campo `taxAmount`, pero el flujo activo ya no lo usa para el total de nuevas compras.

## Evidencia de terminal

### Analisis

```text
Found 23 matches
... ecommerce-app-Nars/src/components/organisms/CartSummary.jsx:
  Line 29:             <span>IVA</span>
... ecommerce-app-Nars/src/pages/OrderDetailPage.jsx:
  Line 123:               {order.taxAmount > 0 && (
... ecommerce-app-Nars/src/pages/ConfirmationPage.jsx:
  Line 159:             {order.taxAmount > 0 && (
```

```text
ecommerce-api-Nars/src/controllers/orderController.js
const calculateOrderTotals = (items = [], shippingCost = 0) => {
  const subtotal = getItemsSubtotal(items);
  const shipping = roundMoney(shippingCost);
  const taxAmount = roundMoney(subtotal * IVA_RATE);
  const totalPrice = roundMoney(subtotal + taxAmount + shipping);
}
```

### Pruebas

```text
> ecommerce-api@1.0.0 test
> vitest tests/unit/controllers/orderController.test.js

✓ tests/unit/controllers/orderController.test.js (10 tests) 185ms
Test Files  1 passed (1)
Tests       10 passed (10)
```

```text
> ramdi-jewelry-ecommerce-css@1.0.0 test
> vitest run src/pages/__tests__/ConfirmationPage.test.jsx src/pages/__tests__/OrderDetailPage.test.jsx src/pages/__tests__/CartPage.test.jsx src/pages/__tests__/CheckoutPage.test.jsx

Test Files  4 passed (4)
Tests       24 passed (24)
```

```text
> ramdi-jewelry-ecommerce-css@1.0.0 build
> vite build

✓ built in 2.42s
```

## Resultado final

- Ya no aparece `IVA` en el flujo visible de compra auditado.
- Carrito, confirmacion y detalle de orden muestran solo `Subtotal`, `Envío` y `Total`.
- Para nuevas ordenes, el total vuelve a ser coherente con lo visible: `subtotal + shippingCost = totalPrice`.
- Se hizo el cambio minimo correcto: limpieza visual en frontend y ajuste puntual en backend porque el total real seguia incluyendo impuesto.
