# Bugfix order total consistency 2026-04-18 0230

## Descripcion del bug

- En `Order Detail` la suma visible de los productos no coincidia con el total pagado.
- Ejemplo real auditado en MongoDB:
  - items: `999.99 + 180.00 + 95.00 + 220.00 = 1494.99`
  - total guardado: `1593.99`
  - diferencia: `99.00`
- La diferencia no era un IVA oculto ni un doble cobro; era `shippingCost` guardado en backend pero no mostrado en `Order Detail`.

## Diagnostico claro

### Hallazgo principal

- El backend ya calcula `totalPrice = subtotal + shippingCost`.
- No existe `taxAmount`/IVA real en backend ni en la persistencia actual de la orden auditada.
- `Order Detail` mostraba precios de items y `totalPrice`, pero no mostraba el desglose de `shippingCost`.

### Hallazgo secundario de consistencia

- `CartSummary.jsx` mostraba un IVA calculado solo en frontend (`subtotal * 0.16`) que no existia en backend ni en la orden persistida.
- `ConfirmationPage.jsx` tambien habia sido llevada a reconstruir IVA en frontend en la fase previa, lo cual chocaba con el principio de esta fase: backend = unica fuente de verdad.

## Causa raiz exacta

- Causa raiz 1: `Order Detail` omitia mostrar el `shippingCost` aunque el backend ya lo incluia en `totalPrice`.
- Causa raiz 2: el modelo/backend no exponia un desglose financiero completo y consistente (`subtotal`, `taxAmount`, `shippingCost`) como parte oficial de la orden.
- Causa raiz 3: frontend tenia logica local de IVA en carrito/confirmation que no estaba sincronizada con la orden real.

## Flujo de datos antes

1. `CartSummary.jsx`
   - calculaba `iva = subtotal * 0.16`
   - total visible = `subtotal + iva + shipping`
2. `CheckoutPage.jsx`
   - enviaba `shippingCost`
3. `orderController.js`
   - calculaba `subtotal` localmente desde `products`
   - guardaba solo `shippingCost` y `totalPrice = subtotal + shipping`
   - no guardaba `subtotal` ni `taxAmount`
4. MongoDB
   - persistia `products[].price`, `shippingCost`, `totalPrice`
5. `OrderDetailPage.jsx`
   - mostraba suma de items por fila
   - mostraba `totalPrice`
   - no mostraba `shippingCost`

Resultado: la UI hacia parecer que habia un error de calculo cuando en realidad faltaba mostrar el cargo extra explicito.

## Auditoria backend

### Archivos revisados

- `ecommerce-api-Nars/src/controllers/orderController.js`
- `ecommerce-api-Nars/src/models/order.js`

### Evidencia de codigo

- `createOrder` y `checkoutFromCart` calculaban:
  - `subtotal = sum(products.price * quantity)`
  - `totalPrice = subtotal + shippingCost`
- No habia calculo real de IVA en backend.
- `Order` no persistia `subtotal` ni `taxAmount`.

## Auditoria base de datos

### Consulta real de orden con el bug visible

```text
{
  "_id": "69e33b669762679aaf59985e",
  "products": [999.99, 180, 95, 220],
  "shippingCost": 99,
  "totalPrice": 1593.99
}
```

### Interpretacion

- Suma real de items: `1494.99`
- `shippingCost`: `99`
- `totalPrice`: `1593.99`
- Formula real guardada: `1494.99 + 99 = 1593.99`

### Nueva orden real creada y auditada despues del fix

```text
{
  "orderId": "69e340a4289fd82c92b07154",
  "itemsSubtotal": 820,
  "subtotal": 820,
  "taxAmount": 0,
  "shippingCost": 0,
  "totalPrice": 820,
  "expectedTotal": 820
}
```

## Auditoria frontend

### Archivos revisados

- `ecommerce-app-Nars/src/components/organisms/CartSummary.jsx`
- `ecommerce-app-Nars/src/pages/ConfirmationPage.jsx`
- `ecommerce-app-Nars/src/pages/OrderDetailPage.jsx`
- `ecommerce-app-Nars/src/services/orderService.js`
- `ecommerce-app-Nars/src/constants/orderConstants.js`

### Problema en frontend

- `OrderDetailPage.jsx` usaba `item.subtotal` por producto y `order.totalPrice`, pero no mostraba `order.shippingCost`.
- `CartSummary.jsx` mostraba IVA no respaldado por backend.
- `ConfirmationPage.jsx` dependia de reconstrucciones frontend incompatibles con la fuente de verdad del backend.

## Correccion aplicada

### Backend

- Se agregaron `subtotal` y `taxAmount` al esquema de `Order`.
- `createOrder` y `checkoutFromCart` ahora persisten:
  - `subtotal`
  - `taxAmount` (`0` en el flujo actual)
  - `shippingCost`
  - `totalPrice`
- Se agrego `enrichOrderTotals(...)` en `orderController.js` para responder siempre con desglose financiero consistente, incluso para ordenes legacy donde `subtotal` no estuviera persistido.
- `updateOrder` ahora recalcula `totalPrice` desde `subtotal + taxAmount + shippingCost`.

### Frontend

- `CartSummary.jsx` deja de inventar IVA y ahora muestra solo `Subtotal + Envío = Total`.
- `ConfirmationPage.jsx` pasa a usar los campos financieros del backend (`subtotal`, `taxAmount`, `shippingCost`, `totalPrice`) y solo muestra IVA si `taxAmount > 0`.
- `OrderDetailPage.jsx` ahora muestra un bloque `Resumen` con:
  - `Subtotal`
  - `IVA` solo si existe
  - `Envío`
  - `Total pagado`
- `orderService.js` normaliza `subtotal` y `taxAmount` desde el backend.

## Archivos modificados

- `ecommerce-api-Nars/src/controllers/orderController.js`
- `ecommerce-api-Nars/src/models/order.js`
- `ecommerce-app-Nars/src/components/organisms/CartSummary.jsx`
- `ecommerce-app-Nars/src/services/orderService.js`
- `ecommerce-app-Nars/src/pages/ConfirmationPage.jsx`
- `ecommerce-app-Nars/src/pages/OrderDetailPage.jsx`
- `ecommerce-app-Nars/src/pages/__tests__/CartPage.test.jsx`
- `ecommerce-app-Nars/src/pages/__tests__/ConfirmationPage.test.jsx`
- `ecommerce-app-Nars/src/pages/__tests__/OrderDetailPage.test.jsx`
- `ecommerce-app-Nars/cypress/e2e/cart.cy.js`
- `ecommerce-app-Nars/cypress/e2e/goldenPath.cy.js`
- `ecommerce-app-Nars/cypress/e2e/orders.cy.js`

## Evidencia de terminal

### Control de worktree

```text
git status --short
```

- Confirmo worktree sucio antes de editar, con cambios previos en frontend/backend fuera de esta fase.

```text
git diff --stat
```

- Confirmo cambios previos amplios en el repo; el fix se limito al flujo financiero de orden.

### Consulta real a MongoDB

```text
node --input-type=module -e "... collection('orders').find(...).sort({ createdAt:-1 }) ..."
```

Salida relevante:

```text
{
  "_id": "69e33b669762679aaf59985e",
  "shippingCost": 99,
  "totalPrice": 1593.99
}
```

### Fetch real del endpoint de detalle de orden despues del fix

```text
LOGIN_STATUS 200
{
  "detailStatus": 200,
  "subtotal": 820,
  "taxAmount": 0,
  "shippingCost": 0,
  "totalPrice": 820,
  "itemsSubtotal": 820
}
```

## Tests y validaciones

### Frontend tests

```text
npm run test
Test Files  14 passed (14)
Tests       76 passed (76)
```

### Frontend build

```text
npm run build
208 modules transformed.
✓ built in 5.28s
```

### Backend tests

```text
npm run test
```

Hallazgo importante en terminal:

- `22` suites pasaron, pero `5` suites de integracion fallaron por problemas previos en `seedTestCatalog` (`countDocuments is not a function`, `insertMany is not a function`, `select` undefined).
- No aparecieron fallas nuevas relacionadas con `orderController.js` en las unit tests; `tests/unit/controllers/orderController.test.js` siguio pasando.

### Cypress full run

```text
npx cypress run
```

Resultado relevante:

- `13 specs`
- `33 tests`
- `32 passing`
- `1 failing`

Falla restante ajena al fix:

- `authLifecycle.cy.js`: `expected 404 to equal 200` en `/api/auth/test/revoke-refresh-tokens`

Specs del alcance que si pasaron:

- `cart.cy.js`
- `goldenPath.cy.js`
- `orders.cy.js`
- `checkoutReuse.cy.js`

## Resultado final

- El total de la orden ya queda explicado con desglose real.
- Backend ahora expone y persiste `subtotal`, `taxAmount` y `shippingCost` como fuente oficial.
- Frontend deja de recalcular totales finales y solo muestra lo que el backend define.
- La diferencia observada de `99.00` quedo identificada y corregida visualmente como `Envío`, no como bug de suma ni IVA oculto.
- Nueva orden real auditada: consistente en DB, endpoint y UI.
