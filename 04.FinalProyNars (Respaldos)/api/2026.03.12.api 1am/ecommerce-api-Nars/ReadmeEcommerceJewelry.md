# API de Joyería – E-commerce (Express.js + MongoDB)

Backend para una tienda de joyería con autenticación JWT, paginación, validaciones, relaciones y endpoints listos para demo con Postman.

---

## 🚀 Resumen del proyecto

- **¿Qué hace?** Expone endpoints para gestionar:
  **usuarios**, 
  **autenticación**, 
  **categorías**, 
  **productos**, 
  **carrito**, 
  **direcciones de envío**, 
  **métodos de pago**, 
  **órdenes**, 
  **reviews** y 
  **wishlist**.  
  
- **Tecnologías:** Node.js, Express.js, MongoDB/Mongoose, JWT (JSON Web Tokens), bcrypt, express-validator.  
- **Características clave**
  - Registro/Login con JWT (JSON Web Tokens)
  - Endpoints públicos (productos, categorías) y protegidos (usuarios, órdenes)
  - Paginación, búsqueda y ordenamiento 
  - Validaciones y manejo uniforme de errores 
  - Relaciones entre modelos (User–Order–Product, Product–Category, etc.) 

---

## 📦 Estructura del proyecto

```text
src/
├─ config/
│  └─ database.js
│  └─ catalog.js //para atributos del producto "joyería" materials, design, stones para productos
├─ models/
│  ├─ user.js
│  ├─ category.js
│  ├─ product.js
│  ├─ shippingAddress.js
│  ├─ paymentMethod.js
│  ├─ order.js
│  ├─ review.js
│  ├─ wishlist.js
│  └─ cart.js
├─ controllers/
│  ├─ authController.js
│  ├─ userController.js
│  ├─ categoryController.js
│  ├─ productController.js
│  ├─ shippingAddressController.js
│  ├─ paymentMethodController.js
│  ├─ orderController.js
│  ├─ reviewController.js
│  ├─ wishlistController.js
│  └─ cartController.js
├─ routes/
│  ├─ authRoutes.js
│  ├─ userRoutes.js
│  ├─ categoryRoutes.js
│  ├─ productRoutes.js
│  ├─ shippingAddressRoutes.js
│  ├─ paymentMethodRoutes.js
│  ├─ orderRoutes.js
│  ├─ reviewRoutes.js
│  ├─ wishlistRoutes.js
│  ├─ cartRoutes.js
│  └─ healthRoutes.js
├─ middlewares/
│  ├─ authMiddleware.js
│  ├─ isAdminMiddleware.js
│  ├─ ownerOrAdmin.js
│  ├─ validation.js
│  └─ errorHandler.js
│  └─ logger.js
├─ utils/
│  └─ pagination.js
│
└─ server.js
```

---

## 🗂️ Modelado y relaciones (ERD)

```text
User (1) ── (N) Order ── (N)─(1) Product
│              │
│              └─ OrderItem { productId, quantity, priceSnapshot }
│
├─ (N) ShippingAddress
├─ (N) PaymentMethod
├─ (1) Wishlist { items: [productId] }
├─ (1) Cart { user, products: [{ product, quantity }] }
└─ (N) Review ── (1) Product

Product (N) ── (1) Category
```

**Atributos de producto (ejemplo):**
- `material`: enum sugerido → `['plata','oro','acero','aluminio','laton']`
- `design`: enum sugerido → `['simple','grabado','con_piedra','personalizable']`
- `stone` (opcional): ej. `['circonia','esmeralda','zafiro','diamante']`

> **Tip:** normaliza a minúsculas y sin acentos en validadores. Permite `stone` ausente en lugar de `null`.

---

## 🔧 Variables de entorno (.env)

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=joyeria_api
JWT_SECRET=supersecreto-usa-uno-largo
JWT_EXPIRES_IN=1d
LOG_LEVEL=info
```

---

## 🏁 Instalación y ejecución

```bash
# 1) Instalar dependencias
npm install

# 2) Ejecutar en desarrollo
npm run dev
# o en producción
npm start

# 3) Comprobar salud
curl http://localhost:3000/api/health
```

---

## 🛡️ Autenticación y roles

- **JWT Bearer** en `Authorization: Bearer <token>`.
- **Roles:** `admin` y `customer` (o `user`).
- Rutas protegidas exigen token; algunas además exigen rol **admin**.

---

## ✅ Validaciones y errores

- `express-validator` en rutas de creación/actualización.
- Middleware `validation` centraliza respuesta de errores: `{ errors: [...] }`.
- `errorHandler` controla errores 4xx/5xx y los formatea de forma consistente.

---

## 📄 Convenciones de paginación/búsqueda/orden

- Query params estándar: `?page=1&limit=10&sort=createdAt:desc&q=texto`
- Listados devuelven `{ data, pagination }` o `{ data, meta }` e incluyen:
  - `currentPage`, `totalPages`, `totalResults`, `hasNext`, `hasPrev`.

---

## 🔗 Endpoints principales

**Base URL:** `http://localhost:3000`

### Auth
- `POST /api/auth/register` → crea usuario (hash con bcrypt)
- `POST /api/auth/login` → devuelve `{ token }`
- `GET /api/auth/profile` → perfil del usuario autenticado

### Categorías
- `GET /api/categories`
- `GET /api/categories/search?q=...`
- `GET /api/categories/:id`
- `POST /api/categories` (**admin**)
- `PUT/PATCH /api/categories/:id` (**admin**)
- `DELETE /api/categories/:id` (**admin**)

### Productos
- `GET /api/products` (público; soporta `page`, `limit`, `q`)
- `GET /api/products/search?q=...`
- `GET /api/products/:id`
- `POST /api/products` (**admin**)
- `PUT/PATCH /api/products/:id` (**admin**)
- `DELETE /api/products/:id` (**admin**)

### Carrito
- `GET /api/cart` (**admin**, paginado)
- `GET /api/cart/:id` (**admin**)
- `GET /api/cart/user` (usuario autenticado)
- `GET /api/cart/user/:userId` (owner o admin)
- `POST /api/cart` (**admin**)
- `PUT /api/cart/:id` (usuario/admin)
- `DELETE /api/cart/:id` (**admin**)
- `POST /api/cart/add-product` (usuario)  
  **Body:**  
  ```json
  { "productId": "<PRODUCT_ID>", "quantity": 2 }
  ```

### Direcciones de envío
- `GET /api/shipping-addresses` (usuario)
- `POST /api/shipping-addresses` (usuario)
- `GET/PUT/PATCH/DELETE /api/shipping-addresses/:id` (usuario)

### Métodos de pago
- `GET /api/payment-methods` (**admin** – listado global con paginación)
- `GET /api/payment-methods/user/:userId` (owner o admin; paginado)
- `GET /api/payment-methods/default/:userId` (owner o admin)
- `GET /api/payment-methods/:id` (owner o admin)
- `POST /api/payment-methods` (usuario)
- `PUT/PATCH /api/payment-methods/:id` (owner o admin)
- `PATCH /api/payment-methods/:id/set-default` (owner o admin)
- `PATCH /api/payment-methods/:id/deactivate` (owner o admin)
- `DELETE /api/payment-methods/:id` (soft delete reutilizando deactivate)

**Filtros de listado (PaymentMethod):**
- `?active=true|false|all` → usa `all` para traer activos e inactivos.  
**Seguridad:** no se aceptan `cardNumber`, `token` (ni `accountNumber` salvo `type = "bank_transfer"`).  
`type: "paypal"` requiere `paypalEmail`. `bank_transfer` requiere `bankName` y `accountNumber`.  
`isDefault=true` desmarca otros del mismo usuario.

### Órdenes
- `POST /api/orders` (usuario/admin) → crea orden a partir de `products[]`, `shippingAddress`, `paymentMethod` (**precios tomados desde DB**)
- `POST /api/orders/checkout` (usuario) → convierte el carrito en orden (ver **Checkout**)
- `GET /api/orders` (**admin**) → lista todas (paginadas, con filtros)
- `GET /api/orders/user/:userId` (owner o admin) → lista órdenes del usuario
- `GET /api/orders/:id` (owner o admin)
- `PATCH /api/orders/:id/status` (**admin**) → `pending|processing|shipped|delivered|cancelled`
- `PATCH /api/orders/:id/payment-status` (**admin**) → `pending|paid|failed|refunded`
- `PATCH /api/orders/:id/cancel` (**admin**)
- `DELETE /api/orders/:id` (**admin**; sólo si `status = cancelled`)

### Reviews & Wishlist
- **Reviews:**  
  `POST /api/reviews` (usuario)  
  `GET /api/reviews?productId=...`  
  `DELETE /api/reviews/:id`
- **Wishlist:**  
  `GET /api/wishlist` (usuario)  
  `POST /api/wishlist`  
  `DELETE /api/wishlist/:productId`

### Health
- `GET /api/health` (público)

---

## 🧾 ¿Qué pasa en el checkout (Carrito → Orden)?

Al llamar `POST /api/orders/checkout`:

1. Lee el **carrito** del usuario autenticado.  
2. Toma **precios reales** desde `Product` y arma un **snapshot** (se guarda en la orden: `products[]` con `productId`, `quantity`, `price`).  
3. Valida **stock** y lo descuenta.  
4. Crea la **orden** en `orders` con:
   - `user`
   - `products` (snapshot)
   - `shippingAddress`, `paymentMethod`
   - `shippingCost`, `totalPrice`
   - `status: "pending"`
   - `paymentStatus: "pending"`
5. **Vacía el carrito** (quedó “convertido” en esa orden).  
6. Devuelve la orden creada (con su `_id`).

> Por eso “desaparece” el carrito: a partir de aquí, todo seguimiento ocurre sobre el documento **Order**.

**¿Dónde veo la orden que se creó?**  
- Usuario (o admin):
  - Una en específico: `GET /api/orders/:id`
  - Todas del usuario: `GET /api/orders/user/:userId` (paginadas, con filtros)
- Admin (todas): `GET /api/orders` (paginadas, con filtros)

### Estados del modelo

La API separa **logística** de **pago**:

- `status`: `pending → processing → shipped → delivered` (o `cancelled`)
- `paymentStatus`: `pending | paid | failed | refunded`

Estados iniciales en checkout:
- `status = "pending"`
- `paymentStatus = "pending"`

Cambios típicos (**admin**):

**Pago**
```http
PATCH /api/orders/:id/payment-status
Content-Type: application/json

{ "paymentStatus": "paid" }   // o failed | refunded | pending
```

**Logística**
```http
PATCH /api/orders/:id/status
Content-Type: application/json

{ "status": "processing" }    // luego shipped, delivered, etc.
```

**Cancelación (admin)**
```http
PATCH /api/orders/:id/cancel
```
- Pone `status: "cancelled"`.
- Y `paymentStatus: "refunded"` si estaba “paid”, si no “failed”.  
- **Nota:** actualmente no se repone stock al cancelar (mejora opcional).

---

## 🧪 Guía de demo (5 minutos)

- **Resumen (30s):** API, entidades, auth JWT, paginación.  
- **Health (10s):** `GET /api/health` OK.  
- **Registro + Login (40s):** crear usuario, login → copiar token.  
- **Categorías (40s):** `POST /api/categories` → `GET /api/categories` → `GET /api/categories/search?q=ani`.  
- **Productos (60s):** `POST /api/products` (con `categoryId`, `material`, `design`) → `GET /api/products?q=anillo`.  
- **Dirección + Pago (40s):** `POST /api/shipping-addresses` y `POST /api/payment-methods`.  
- **Carrito → Orden (50s):**
  - `POST /api/cart/add-product` (x2)
  - `POST /api/orders/checkout`
  - `GET /api/orders/:id` (ver snapshot y totales)
- **Extras (40s):** `POST /api/reviews` y flujo de wishlist.  
En cada paso, destacar **paginación**, **validaciones** y **manejo de errores**.

---

## 🧰 Ejemplos rápidos (cURL)


# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"noe@example.com","password":"123456"}'

# Listar productos (público)
curl "http://localhost:3000/api/products?page=1&limit=10&q=anillo"

# Agregar al carrito (usuario autenticado)
curl -X POST http://localhost:3000/api/cart/add-product \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"productId":"<PRODUCT_ID>", "quantity": 2}'

# Checkout desde carrito (usuario autenticado)
curl -X POST http://localhost:3000/api/orders/checkout \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"shippingAddress":"<ADDRESS_ID>","paymentMethod":"<PAYMENT_METHOD_ID>","shippingCost":120}'


---

## 🧱 Validadores clave (ejemplo de intención)

**Productos**
- `name`: string **requerido**  
- `price`: número `> 0`  
- `stock`: entero `≥ 0`  
- `category`: MongoId válido  
- `material`: `isIn(MATERIALS)`  
- `design`: `isIn(DESIGNS)`  
- `stone`: **opcional** (`optional({ nullable: true, checkFalsy: true })`)

> Si recibes **Invalid value** en `material/design`, revisa que el valor coincida exactamente con el enum y que normalices acentos/mayúsculas.

---

### Cadena típica de una petición (ejemplo real)

## “Crear un producto nuevo”

1. El cliente envía POST /api/products con un JWT en Authorization: Bearer ....
2. Pasa por:

requestId (asigna ID) → logger (cronometra) → authMiddleware (valida token) → isAdminMiddleware (¿es admin?) → validaciones de campos (validation).

3. Si todo ok, entra al controller (productController) que guarda en MongoDB.
4. Si algo falla, el errorHandler lo escribe en logs/error.log y responde con un JSON estándar.
5. logger imprime la línea con el tiempo total.

¿Sin token? → 401 Unauthorized.
¿Con token pero no admin? → 403 Forbidden.
¿Datos inválidos? → 422 con la lista de errores.


## 📋 Checklist de Revisión

| Categoría                       | Criterio                                                                        | Cumple |
| ------------------------------- | ------------------------------------------------------------------------------- | ------ |
| **Funcionalidad de Endpoints**  | Registro/Login funcional con JWT                                                |        |
|                                 | Productos: GET público, POST/PUT/DELETE (requiere token)                        |        |
|                                 | Carrito de compras funcional (agregar, actualizar, eliminar)                    |        |
|                                 | Usuarios: CRUD básico, acceso restringido por token                             |        |
|                                 | Órdenes: creación, listado por usuario                                          |        |
| **Relaciones y datos**          | Productos asociados a categorías                                                |        |
|                                 | Órdenes asociadas a usuarios y productos                                        |        |
|                                 | Al menos 10 registros por entidad principal                                     |        |
|                                 | Datos consistentes (FK válidas, sin campos vacíos)                              |        |
| **Seguridad y validación**      | Middleware de validación (`express-validator`) en rutas clave                   |        |
|                                 | Middleware de autenticación con JWT                                             |        |
|                                 | Manejo correcto de errores (400–500)                                            |        |
| **Paginación**                  | Listado de usuarios y productos con paginación implementada                     |        |
| **Organización del código**     | Separación clara por carpetas: `models`, `controllers`, `routes`, `middlewares` |        |
|                                 | Código modular, funciones separadas, uso de helpers si aplica                   |        |
| **Presentación de la demo**     | Explicación clara del flujo                                                     |        |
|                                 | Pruebas funcionales en vivo con Postman                                         |        |
| **Retos requeridos**            | ✅ Reto 8 – Code Challenge: API con MongoDB y Relaciones Validator              |        |
|                                 | ✅ Reto 9 – Code Challenge: API con MySQL y Relaciones protegida                |   x     |
|                                 | ✅ Reto 10 – Reto 10: Registro de usuario con validaciones                      |        |
|                                 | ✅ Reto 11 – Reto 11: Autenticación con JWT                                     |        |
| **Funcionalidades adicionales** | Uso de `bcrypt` para encriptar contraseñas                                      |        |
|                                 | Manejo de roles en modelo de usuario (admin/cliente)                            |        |
|                                 | Documentación básica en `README.md`                                             |        |
