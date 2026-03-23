# Plan de Pruebas E2E - Fase 3 (Flujos Secundarios, Persistencia y Órdenes)

## 1. Alcance y Propósito
Este plan de pruebas define los escenarios end-to-end diseñados para garantizar la solidez de las lógicas secundarias, como la persistencia de datos orientados al cliente, el proceso avanzado de ordenado, y el manejo del ciclo de compra posterior al alta/ingreso del usuario.

## 2. Escenarios de Prueba

### E2E-PH3-001: Persistencia del Carrito (Usuario Anónimo)
- **Descripción:** Un usuario no autenticado agrega productos al carrito, recarga la página, y la cesta debe conservar dichos elementos exactamente en el estado previo.
- **Precondiciones:** No debe estar logueado. API disponible.
- **Flujo:**
  1. Visitar inicio.
  2. Agregar producto "X" al carrito (ej. cantidad: 2).
  3. Ejecutar `cy.reload()`.
  4. Validar indicador numérico del carrito superior (badge) que coincida con lo agregado.
  5. Consultar `localStorage` para garantizar el resguardo (OPCIONAL/Módulo Context).

### E2E-PH3-002: Manipulación Avanzada del Carrito
- **Descripción:** Probar adición, remoción total, y decremento de items en la cesta.
- **Flujo:**
  1. Visitar el producto e inyectar cesta.
  2. Click en carrito para ver listado.
  3. Reducir la cantidad de elementos.
  4. Eliminar el producto.
  5. Validar que la interfaz arroje carrito vacío y/o total sea `$0.00`.

### E2E-PH3-003: Flujo Básico de Creación de Orden 
- **Descripción:** Evaluar que el `CheckoutPage` pueda ser operado por un usuario verídico recién inyectado vía backend, realizando la orquestación final sin caer (hasta el Post API /api/orders). 
- **Precondiciones:** Modificaciones previas en E2E (Fase 1) permitiendo la conexión a la base de datos para la generación del AuthToken.
- **Dependencias Backend:** `/api/shipping-addresses` (POST), `/api/payment-methods` (POST), `/api/orders` (POST).

### E2E-PH3-004: Historial de Órdenes (Si es aplicable)
- **Descripción:** Verificar si la UI permite el despliegue del historial a usuarios que ya ejecutaron una orden (E2E-PH3-003).
- **Criterios:** Si el front-end no alberga una sección `/orders` o un listado particular (Pending implementation GAP), se documentará formalmente indicando el escenario pendiente.

## 3. Criterios de Aprobación
- Que los assertions operen frente al BackEnd Real (0 Mocks a menos que sean forzosamente necesarios los stubs de latencia/fallo artificial).
- Ninguna prueba debe modificar el comportamiento React (a excepción de fixes explícitos como los que afectaban la Fase 1 en los bugs 001/002).
- Deben reportarse Bugs reales generados por contratos desincronizados.
