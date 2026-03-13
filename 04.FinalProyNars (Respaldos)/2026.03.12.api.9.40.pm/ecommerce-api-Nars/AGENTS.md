# Guía para Agentes - ecommerce-api-Nars

Este documento sirve como referencia rápida para cualquier agente de IA que trabaje en el proyecto `ecommerce-api-Nars`. Sigue estrictamente estas convenciones y estructura.

## 📁 Estructura de Directorios (src/)

- **config/**: Configuración de base de datos (`database.js`) y atributos del catálogo (`catalog.js`).
- **controllers/**: Lógica de negocio de los endpoints. Un archivo por entidad (ej. `productController.js`).
- **middlewares/**: Funciones intermedias para autenticación (`authMiddleware.js`), roles (`isAdminMiddleware.js`), validaciones (`validation.js`), manejo de errores y logging.
- **models/**: Esquemas de Mongoose. Define la estructura de los datos en MongoDB.
- **routes/**: Definición de rutas Express. El punto de entrada es `index.js`, que agrupa todos los archivos de rutas específicas.
- **utils/**: Funciones de utilidad como paginación.

## 🗺️ Mapa de Rutas API

Todas las rutas tienen el prefijo `/api` (definido en `server.js`).

| Método | Path | Auth | Admin | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| **Auth** | | | | |
| POST | `/auth/register` | No | No | Registro de nuevo usuario. |
| POST | `/auth/login` | No | No | Login y obtención de JWT. |
| GET | `/users/me` | Sí | No | Perfil del usuario autenticado. |
| **Productos** | | | | |
| GET | `/products` | No | No | Listar productos con filtros y paginación. |
| GET | `/products/:id` | No | No | Detalle de un producto. |
| POST | `/products` | Sí | Sí | Crear producto. |
| PUT | `/products/:id` | Sí | Sí | Actualizar producto. |
| DELETE| `/products/:id` | Sí | Sí | Eliminar producto. |
| **Carrito** | | | | |
| GET | `/cart/user` | Sí | No | Obtener carrito del usuario actual. |
| POST | `/cart/add-product` | Sí | No | Agregar/incrementar producto. |
| PUT | `/cart/:id` | Sí | No* | Actualizar cantidades (owner o admin). |
| **Órdenes**| | | | |
| POST | `/orders/checkout` | Sí | No | Convierte carrito actual en orden. |
| GET | `/orders/user/:userId` | Sí | No* | Órdenes de un usuario (owner o admin). |
| PATCH| `/orders/:id/status` | Sí | Sí | Actualizar estado logístico. |
| **Categorías** | | | | |
| GET | `/categories` | No | No | Lista todas las categorías. |
| POST | `/categories` | Sí | Sí | Crear categoría. |

*\*Rutas con `ownerOrAdmin` permiten acceso al dueño del recurso o al administrador.*

## 💾 Modelos Mongoose (Campos Principales)

- **User**: `displayName`, `email` (unique), `hashPassword` (select: false), `role` (admin/customer/guest), `active`.
- **Product**: `name`, `description`, `price`, `stock`, `category` (Ref), `material` (Enum), `design` (Enum), `stone`.
- **Category**: `name`, `description`, `imageURL`, `parentCategory` (Ref).
- **Order**: `user` (Ref), `products` (snapshot: productId, quantity, price), `totalPrice`, `status`, `paymentStatus`.
- **Cart**: `user` (Ref, unique), `products` (Array: product Ref, quantity).
- **ShippingAddress**: `user` (Ref), `name`, `address`, `city`, `state`, `postalCode`, `phone`, `isDefault`.
- **PaymentMethod**: `user` (Ref), `type` (Enum), `last4`, `brand`, `isDefault`, `active`.

## ✅ Validaciones (express-validator)

Actualmente no existe un archivo `validators.js`. Las validaciones se definen **inline** en los archivos de rutas utilizando `body`, `param` y `query` de `express-validator`.

**Lógica común:**
- **displayName**: Not empty, length 2-50, alphanumeric and spaces.
- **email**: Not empty, valid email format, normalized.
- **password**: Not empty, min length 6.
- **MongoId**: Validaciones con `.isMongoId()` en parámetros de ID y referencias.
- **Enums**: Validación con `.isIn()` usando constantes de `src/config/catalog.js` (MATERIALS, DESIGNS, STONES).

## 🛠️ Patrón de Controller

Todos los métodos de los controladores deben seguir este patrón exacto con `try/catch` y `next(error)`:

```javascript
export const miAccion = async (req, res, next) => {
  try {
    // 1. Obtener datos (req.body, req.params, req.query)
    // 2. Realizar lógica
    // 3. Responder
    return res.status(200).json({ data: "..." });
  } catch (error) {
    // 4. Pasar error al middleware global
    return next(error);
  }
};
```

## 🛣️ Patrón de Ruta

Las rutas protegidas y con validación deben usar este orden:

```javascript
router.post('/recurso', 
  authMiddleware, 
  [
    body('campo').notEmpty().withMessage('Requerido'),
    // ... más validadores
  ], 
  validate, // Middleware que revisa errores de express-validator
  miControllerAccion
);
```

## 🚫 Restricciones (Qué NO hacer)

1. **NO usar `require`**: El proyecto usa Módulos ES (`import/export`).
2. **NO crear nuevos Contextos**: En el backend NO se usan contextos de React.
3. **NO inventar validadores**: Usa la lógica existente de `express-validator` e inyéctala en las rutas.
4. **NO exponer contraseñas**: Asegúrate de que `hashPassword` permanezca oculto (`select: false` en el modelo).
5. **NO usar lógica de persistencia manual**: Usa siempre los modelos de Mongoose.
6. **NO ignorar `next(error)`**: Siempre captura excepciones y pásalas a `next` para que el `globalErrorHandler` responda correctamente.
