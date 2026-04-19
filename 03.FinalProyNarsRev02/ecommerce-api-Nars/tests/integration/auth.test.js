import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import User from '../../src/models/user.js';
import bcrypt from 'bcrypt';

vi.mock('../../src/config/database.js', () => ({
    default: vi.fn().mockResolvedValue(null)
}));

vi.mock('../../src/models/user.js');
vi.mock('../../src/models/category.js', () => ({
    default: { init: vi.fn().mockResolvedValue(null) }
}));
vi.mock('../../src/models/product.js', () => ({
    default: { init: vi.fn().mockResolvedValue(null), find: vi.fn() }
}));
vi.mock('../../src/models/refreshToken.js', () => ({
    default: {
        create: vi.fn().mockResolvedValue({}),
        findOne: vi.fn(),
        updateMany: vi.fn().mockResolvedValue({ modifiedCount: 1 })
    }
}));

import app from '../../src/app.js';

describe('Auth Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.JWT_SECRET = 'test_secret';
        process.env.NODE_ENV = 'test';
    });

    describe('POST /api/auth/register', () => {
        it('debe validar errores de express-validator (email invalido)', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    displayName: 'Test',
                    email: 'not-an-email',
                    password: '123'
                });

            expect(response.status).toBe(422);
            expect(response.body.errors).toBeDefined();
        });

        it('debe registrar exitosamente si los datos son validos', async () => {
            User.findOne.mockReturnValue({ lean: () => vi.fn().mockResolvedValue(null)() });
            User.create.mockResolvedValue({
                _id: '123',
                displayName: 'Test',
                email: 'test@example.com',
                role: 'user',
                active: true
            });

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    displayName: 'Test',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User registered successfully');
            expect(response.body.accessToken).toBeDefined();
            expect(response.body.refreshToken).toBeDefined();
        });
    });

    describe('POST /api/auth/login', () => {
        it('debe fallar si faltan campos requeridos', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(422);
        });

        it('debe loguear exitosamente con datos validos', async () => {
            const mockUser = {
                _id: '123',
                email: 'test@example.com',
                active: true,
                hashPassword: await bcrypt.hash('password123', 10)
            };

            User.findOne.mockReturnValue({
                select: vi.fn().mockResolvedValue(mockUser)
            });

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body.accessToken).toBeDefined();
            expect(response.body.refreshToken).toBeDefined();
        });
    });

    describe('POST /api/auth/logout', () => {
        it('debe retornar 200 al cerrar sesión correctamente', async () => {
            const response = await request(app)
                .post('/api/auth/logout')
                .send({ refreshToken: 'mock_token' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Logged out successfully');
        });
    });
});
