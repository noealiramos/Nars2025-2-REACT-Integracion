# Guía para Agentes - ecommerce-app (01.Project)

Este documento sirve como referencia rápida para cualquier agente de IA que trabaje en el proyecto frontend `ecommerce-app`. Sigue estrictamente estas convenciones y estructura.

## 📁 Estructura de Directorios (src/)

- **components/**: Componentes de la interfaz divididos por responsabilidad. Incluye la carpeta `common/` para componentes base.
- **context/**: Manejo del estado global mediante la API de Contexto de React.
- **data/**: Datos estáticos y mocks para desarrollo.
- **forms/**: Lógica y validaciones específicas de formularios.
- **hooks/**: Hooks personalizados de React, incluyendo `useFormReducer`.
- **layout/**: Componentes de estructura de página (Header, Footer, Nav).
- **pages/**: Vistas principales de la aplicación que corresponden a rutas.
- **services/**: Capa de servicios para comunicación con la API mediante `http.js`.
- **styles/**: Archivos CSS globales y temas.
- **utils/**: Funciones de utilidad y helpers.

## 🧠 Contextos Disponibles

### 1. AuthContext (`useAuth`)
Maneja la autenticación y el perfil del usuario.
- **Retorna**:
  - `user`: Objeto con los datos del usuario autenticado o `null`.
  - `isAuth`: Booleano que indica si el usuario está logueado.
  - `loading`: Booleano para el estado de carga inicial de la sesión.
  - `login(email, password)`: Función asíncrona para iniciar sesión.
  - `register(userData)`: Función asíncrona para registrar usuarios.
  - `logout()`: Función para cerrar sesión y limpiar tokens.
  - `hasRole(role)`: Función para verificar si el usuario tiene un rol específico.
  - `getToken()`: Retorna el JWT almacenado.

### 2. CartContext (`useCart`)
Maneja el carrito de compras y la sincronización con el backend.
- **Retorna**:
  - `cartItems`: Array de productos en el carrito.
  - `total`: Precio total acumulado (subtotal).
  - `addToCart(product, quantity)`: Agrega o incrementa un producto.
  - `removeFromCart(productId)`: Elimina un producto por ID.
  - `updateQuantity(productId, newQuantity)`: Actualiza la cantidad de un ítem.
  - `clearCart()`: Vacía el carrito por completo.
  - `getTotalItems()`: Retorna el número total de unidades en el carrito.
  - `getTotalPrice()`: Retorna el costo total de los ítems.

### 3. ThemeContext (`useTheme`)
Maneja el tema (claro/oscuro) de la aplicación.
- **Retorna**:
  - `theme`: String "light" o "dark".
  - `isDarkMode`: Booleano útil para condicionales rápidos.
  - `toggleTheme()`: Cambia entre los dos temas.
  - `setTheme(theme)`: Setea un tema específico.

## 🧱 Componentes de common/ (Props principales)

- **Button**: `children`, `onClick`, `type`, `disabled`, `variant` (primary, secondary, etc.), `size`, `className`.
- **Input**: `id`, `label`, `name`, `value`, `type`, `placeholder`, `onChange`, `onBlur`, `error`, `showError`.
- **Badge**: `text`, `variant` (info, success, warning, danger), `className`.
- **Loading**: `children` (mensaje opcional que aparece junto al spinner).

## 🪝 Hook `useFormReducer`

Hook personalizado para gestión robusta de formularios.
- **API**: `values`, `errors`, `touched`, `isSubmitting`, `submitError`, `onChange`, `onBlur`, `handleSubmit(onSubmit)`.
- **Ejemplo de uso**:
```javascript
const { values, onChange, handleSubmit, errors } = useFormReducer({
  initialValues: { email: "", password: "" },
  validate: (vals) => {
    const errs = {};
    if (!vals.email) errs.email = "Requerido";
    return errs;
  }
});

const onConfirm = async (formData) => { /* lógica de envío */ };
// En el JSX: <form onSubmit={() => handleSubmit(onConfirm)}>
```

## 🛒 Flujo de Checkout (paso a paso)

Basado en `Checkout.jsx`:
1. **Validación Inicial**: Verifica si hay ítems en el carrito. Si está vacío, redirige a `/cart`.
2. **Carga de Datos**: Recupera direcciones (`STORAGE_KEYS.addresses`) y métodos de pago (`STORAGE_KEYS.payments`) de `localStorage` (o servicios).
3. **Selección/Edición**:
   - Usuario selecciona o crea una **Dirección de envío**.
   - Usuario selecciona o crea un **Método de pago**.
4. **Resumen y Cálculos**: Se calcula subtotal, IVA (16%) y costo de envío (gratis si subtotal > $1000).
5. **Confirmación**: Al hacer clic en "Confirmar y Pagar":
   - Se crea el objeto `order` con items, totales, dirección y pago.
   - Se guarda en la historia del `localStorage`.
   - Se activa `suppressRedirect` para evitar saltos al vaciar el carrito.
   - Se llama a `clearCart()`.
   - Se navega a `/order-confirmation`.

## 🌐 Patrón de Servicio con `http.js`

El proyecto utiliza una instancia de Axios centralizada en `services/http.js` que maneja:
- `baseURL`: Definida en `.env` como `REACT_APP_API_BASE_URL`.
- **Interceptores**: Inyecta el `Authorization: Bearer <token>` automáticamente y maneja el refresco de tokens en caso de errores 401.

**Ejemplo de Servicio**:
```javascript
import { http } from "./http";

export const getProducts = async (page, limit) => {
  try {
    const response = await http.get("products", { params: { page, limit } });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
```

## 🚫 Restricciones (Qué NO hacer)

1. **NO usar hooks fuera del flujo de React**: Respeta las reglas de hooks.
2. **NO modificar el estado global directamente**: Usa siempre los dispatchers de los contextos.
3. **NO usar fetch**: Usa siempre la instancia `http` de `services/http.js`.
4. **NO manipular el DOM directamente**: Usa refs o estados de React.
5. **NO olvidar el manejo de errores**: Usa `try/catch` en llamadas asíncronas y muestra feedback al usuario (ej. `ErrorMessage`).
6. **NO crear nuevos componentes "common" si ya existen**: Reutiliza `Button`, `Input`, etc.
