# Ramdi Jewerly – E-commerce en React (Proyecto Final React I)

Este proyecto es un **e-commerce funcional**, desarrollado como entrega final del curso **React I** en la escuela *Inadaptados*.  

La tienda ficticia **Ramdi Jewerly** ofrece joyería elegante, moderna y accesible.

---

## 🚀 Tecnologías utilizadas

- **React + Vite**
- **Axios** (Integración con API real y manejo de JWT/Refresh Tokens)
- **React Router DOM 6**
- **Context API**
- **Cypress** (Pruebas End-to-End)
- **CSS modularizado por componente** (Atomic Design)
- **localStorage** (Carrito provisional)

---

## 📦 Instalación

```bash
npm install
npm start       # Ejecuta Vite y abre http://localhost:5173/
```

Scripts disponibles:

```bash
npm run dev     # entorno de desarrollo
npm run build   # build de producción
npm run preview # vista previa del build
```

---

## 🧩 Estructura del proyecto

- `/src/components/atoms` → Button, Text, Heading, TextInput  
- `/src/components/molecules` → ProductCard, CartItem  
- `/src/components/organisms` → SiteHeader, CartSummary  
- `/src/pages` → HomePage, ProductDetailPage, CartPage, CheckoutPage, ConfirmationPage  
- `/src/contexts` → CartContext, AuthContext  
- `/src/services` → productService, userService, authService  
- `/src/data` → products.js, users.js

---

## 🛒 Flujo principal del usuario

1. Ver productos en `/`
2. Ver detalle en `/product/:id`
3. Agregar productos al carrito
4. Revisar el carrito en `/cart`
   - Cambiar cantidades  
   - Vaciar carrito  
   - Mensaje especial si el carrito está vacío  
5. Iniciar sesión (login simulado) en `/login`
6. Acceder a `/checkout` (ruta protegida)
   - Capturar datos personales  
   - Seleccionar método de pago  
7. Ver confirmación en `/confirmation`
   - Resumen de productos  
   - Totales, envío, IVA  
   - Método de pago  
   - Ícono dorado de confirmación  

---

## 🔐 Autenticación

El login se simula con usuarios predefinidos en `/src/data/users.js`.  
Se usa **Context API + localStorage** para persistir:

- Token simulado  
- Datos del usuario logueado  
- Carrito  
- Última orden  

---

## 🎨 Estilos

El proyecto utiliza exclusivamente **CSS semántico**, distribuido por capas:

- `atoms/*.css`  
- `molecules/*.css`  
- `organisms/*.css`  
- `pages/*.css`  
- `index.css` (reset, tipografías, helpers)

La UI sigue un estilo:

- Oscuro
- Dorado elegante (#fbbf24)
- Componentes alineados y consistentes  
- Header sticky con logo circular

---

## ✅ Estado actual del proyecto
| Componente | Estado |
| :--- | :--- |
| **API Client** | Operativo (JWT + Refresh) |
| **Catálogo** | Dinámico desde API |
| **Checkout** | Integrado con Backend |
| **Pruebas** | Cypress configurado |
