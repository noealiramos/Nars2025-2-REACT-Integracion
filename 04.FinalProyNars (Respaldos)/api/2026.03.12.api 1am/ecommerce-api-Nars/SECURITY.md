# Políticas de Seguridad - ecommerce-api-Nars

Este documento resume las políticas de seguridad implementadas y las estrategias de mitigación para proteger la API de joyería.

## 🛡️ Medidas Preventivas Implementadas

### 1. Protección contra Inyecciones (NoSQL)
- **Mitigación:** Implementación de **Sanitización Global NoSQL** en `server.js` (fix in-place para compatibilidad con Express 5). Esto evita ataques mediante objetos maliciosos en `body`, `query` y `params`.

### 2. Control de Acceso (RBAC & IDOR)
- **Política:** Se aplica el Principio de Menor Privilegio (PoLP).
- **Mitigación:** 
    - Middlewares `authMiddleware` e `isAdmin` para roles globales.
    - **Estandarización de `ownerOrAdmin`**: Middleware mejorado que valida la propiedad del recurso de forma atómica consultando la base de datos (Orders, Carts, Addresses, Payment Methods). Esto previene vulnerabilidades de Insecure Direct Object Reference (IDOR).

### 3. Seguridad de Comunicaciones
- **Mitigación:** Uso de **Helmet.js** para configurar cabeceras HTTP seguras (HSTS, CSP, etc.).
- **CORS:** Política de lista blanca (whitelist) estricta para permitir solo orígenes confiables.

## 🔐 Gestión de Identidad y Credenciales

### Política de Contraseñas
- **Hashing:** Uso de `bcrypt` con un factor de costo de 10 (mínimo recomendado).
- **Almacenamiento:** Las contraseñas nunca se almacenan en texto plano y están excluidas de las consultas por defecto (`select: false` en Mongoose).

### Tokens de Acceso (JWT)
- **Algoritmo:** HS256 con una clave secreta robusta.
- **Expiración:** Tokens de corta duración (1 hora) para limitar la ventana de exposición en caso de compromiso.

## 🚀 Mitigación de Denegación de Servicio (DoS)

- **Rate Limiting:** 
    - Global: Máximo 100 peticiones cada 15 minutos por IP.
    - Auth: Máximo 10 intentos de login por hora para prevenir ataques de fuerza bruta.

## 📂 Reporte de Vulnerabilidades

Si encuentras una vulnerabilidad, por favor no la publiques. Reporta el hallazgo directamente al equipo de desarrollo para una remediación coordinada.

---
> [!TIP]
> Mantener las dependencias actualizadas (`npm audit`) es una política obligatoria para evitar vulnerabilidades conocidas en librerías de terceros.
