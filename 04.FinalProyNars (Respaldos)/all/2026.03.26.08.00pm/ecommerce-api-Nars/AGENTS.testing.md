# Guía de Testing - ecommerce-api-Nars (Vitest)

Este documento define el estándar para escribir pruebas unitarias y de integración en el backend del proyecto utilizando **Vitest**.

## ⚙️ Configuración y Estándares

### Importaciones
**NO usar variables globales**. Todas las utilidades de testing deben importarse explícitamente desde `vitest`.
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
```

### Helper `createMockReqRes`
Utiliza este helper para simular los objetos `req`, `res` y `next` de Express en controladores.
```javascript
export const createMockReqRes = (overrides = {}) => {
  const req = {
    body: {},
    params: {},
    query: {},
    user: null,
    ...overrides
  };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis()
  };
  const next = vi.fn();
  return { req, res, next };
};
```

## 🧪 Estrategia de Mocking (Mongoose)

Para evitar dependencias con la base de datos real, mockea los modelos usando `vi.mock`.

```javascript
import User from '../src/models/user.js';

vi.mock('../src/models/user.js', () => ({
  default: {
    create: vi.fn(),
    findOne: vi.fn(),
    findById: vi.fn(),
    // Añade otros métodos según sea necesario
  }
}));
```

## 📝 Ejemplos de Test

### AuthController: register()
```javascript
import { register } from '../src/controllers/authController.js';
import User from '../src/models/user.js';
import { createMockReqRes } from './testUtils.js';

describe('authController: register', () => {
  it('debe registrar un usuario exitosamente', async () => {
    const { req, res, next } = createMockReqRes({
      body: { 
        displayName: 'Test User', 
        email: 'test@example.com', 
        password: 'password123' 
      }
    });

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: '123', email: 'test@example.com' });

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Usuario registrado exitosamente'
    }));
  });
});
```

### AuthController: login()
```javascript
import { login } from '../src/controllers/authController.js';
import User from '../src/models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

vi.mock('bcrypt');
vi.mock('jsonwebtoken');

describe('authController: login', () => {
  it('debe retornar un token si las credenciales son válidas', async () => {
    const { req, res, next } = createMockReqRes({
      body: { email: 'test@example.com', password: 'password123' }
    });

    const mockUser = { 
      _id: '123', 
      email: 'test@example.com', 
      hashPassword: 'hashed_password' 
    };

    User.findOne.mockReturnValue({
      select: vi.fn().mockResolvedValue(mockUser)
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mock_token');

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      token: 'mock_token'
    }));
  });
});
```

## ✅ Checklist de Casos Obligatorios

Para cada endpoint, el agente DEBE validar al menos:

- [ ] **Éxito (200/201)**: El flujo principal funciona con datos válidos.
- [ ] **Fallo de Validación (400)**: Campos faltantes, formatos incorrectos (email), o tipos de datos inválidos.
- [ ] **Conflicto (409)**: (Si aplica) Intentar crear duplicados de campos únicos (ej. email).
- [ ] **No Autorizado/Prohibido (401/403)**: Validar que el middleware de auth/admin bloquea accesos indebidos.
- [ ] **No Encontrado (404)**: Intentar acceder a recursos inexistentes vía ID.
- [ ] **Error de Servidor (500)**: Simular una caída de base de datos (`mockRejectedValue`) y verificar que llega al `next(error)`.

## 🚫 Restricciones de Testing
1. **NO usar bases de datos reales**: Todo debe ser mockeado a nivel de modelo.
2. **NO obviar el `next(error)`**: Los tests deben verificar que los errores son propagados al middleware de error global.
3. **NO inventar variables de entorno**: Usa `process.env` mockeado si es necesario.
