# Integration Fixes

## Problema de paginacion

El frontend estaba consumiendo colecciones paginadas como si siempre llegaran en un arreglo plano. En la practica, el backend responde con contratos mixtos como `items`, `products`, `data` y bloques `pagination/meta`. Eso provocaba lecturas vacias, contadores inconsistentes y riesgo de pantallas sin datos aunque la API si hubiera respondido correctamente.

## Que se cambio

1. Se normalizo el consumo de productos en `src/api/productApi.js` y `src/services/productService.js` para aceptar `items`, `products` o arreglos directos.
2. Se agrego `src/services/orderService.js` para normalizar `orders`, items internos y metadata de paginacion.
3. La vista `/orders` ahora tolera paginas vacias y fuerza un `totalPages` minimo de `1` para evitar renders rotos.
4. Se corrigio el unwrap de respuestas de `shipping-addresses` y `payment-methods`, que devolvian entidades anidadas.

## Impacto en frontend

- Home y busqueda leen mejor respuestas paginadas reales.
- Checkout vuelve a ser compatible con la API actual de direcciones y metodos de pago.
- Historial de ordenes puede listar y paginar sin depender de una sola forma de payload.
- Se reduce el riesgo de estados vacios falsos y errores silenciosos de integracion.
