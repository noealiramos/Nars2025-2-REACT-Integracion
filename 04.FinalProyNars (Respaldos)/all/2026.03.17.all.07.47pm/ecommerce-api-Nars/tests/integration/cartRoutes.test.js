import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import router from '../../src/routes/cartRoutes.js';
import * as cartController from '../../src/controllers/cartController.js';

// Mock de los controladores para que no toquen DB
vi.mock('../../src/controllers/cartController.js', () => ({
    getCartByUser: vi.fn((req, res) => res.status(200).json({ status: 'ok' })),
    getCarts: vi.fn((req, res) => res.status(200).json({ status: 'ok' })),
    getCartById: vi.fn((req, res) => res.status(200).json({ status: 'ok' })),
    createCart: vi.fn((req, res) => res.status(201).json({ status: 'ok' })),
    updateCart: vi.fn((req, res) => res.status(200).json({ status: 'ok' })),
    deleteCart: vi.fn((req, res) => res.status(200).json({ status: 'ok' })),
    addProductToCart: vi.fn((req, res) => res.status(200).json({ status: 'ok' })),
}));

// Mock de authMiddleware para inyectar req.user
vi.mock('../../src/middlewares/authMiddleware.js', () => ({
    default: (req, res, next) => {
        // El usuario se inyectará en cada test según sea necesario
        next();
    }
}));

// Mock de Cart model (usado por el middleware interno)
vi.mock('../../src/models/cart.js', () => ({
    default: {
        findById: vi.fn()
    }
}));

const app = express();
app.use(express.json());

const validId1 = '65d100000000000000000001';
const validId2 = '65d100000000000000000002';

// Middleware para inyectar req.user manualmente en los tests
let mockUser = null;
app.use((req, res, next) => {
    req.user = mockUser;
    next();
});
app.use('/api', router);

describe('cartRoutes internal middlewares', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUser = null;
    });

    describe('allowSelfOrAdmin middleware', () => {
        it('debe permitir acceso si el usuario es dueño (200)', async () => {
            mockUser = { id: validId1, role: 'customer' };
            const response = await request(app)
                .get(`/api/cart/user/${validId1}`)
                .set('Authorization', 'Bearer dummy');
            expect(response.status).toBe(200);
        });

        it('debe permitir acceso si el usuario es admin (200)', async () => {
            mockUser = { id: 'admin1', role: 'admin' };
            const response = await request(app)
                .get(`/api/cart/user/${validId1}`)
                .set('Authorization', 'Bearer dummy');
            expect(response.status).toBe(200);
        });

        it('debe retornar 403 si el usuario no es dueño ni admin', async () => {
            mockUser = { id: validId2, role: 'customer' };
            const response = await request(app)
                .get(`/api/cart/user/${validId1}`)
                .set('Authorization', 'Bearer dummy');
            expect(response.status).toBe(403);
            expect(response.body.message).toContain('Forbidden');
        });

        it('debe retornar 401 si no hay usuario autenticado', async () => {
            mockUser = null;
            const response = await request(app)
                .get(`/api/cart/user/${validId1}`)
                .set('Authorization', 'Bearer dummy');
            expect(response.status).toBe(401);
        });
    });
});
