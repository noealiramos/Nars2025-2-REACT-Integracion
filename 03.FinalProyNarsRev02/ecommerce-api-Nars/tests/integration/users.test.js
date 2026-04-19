import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import User from '../../src/models/user.js';
import jwt from 'jsonwebtoken';

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

import app from '../../src/app.js';

describe('User Integration Tests (RBAC)', () => {
    const secret = 'test_secret';
    const adminToken = jwt.sign({ userId: 'admin123', role: 'admin' }, secret);
    const userToken = jwt.sign({ userId: 'user456', role: 'customer' }, secret);

    beforeEach(() => {
        vi.clearAllMocks();
        process.env.JWT_SECRET = secret;
        process.env.NODE_ENV = 'test';
    });

    describe('GET /api/users', () => {
        it('debe retornar 401 si no hay token', async () => {
            const response = await request(app).get('/api/users');
            expect(response.status).toBe(401);
        });

        it('debe retornar 403 si el usuario no es admin', async () => {
            const response = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).toBe(403);
        });

        it('debe permitir el acceso si el usuario es admin', async () => {
            User.countDocuments.mockResolvedValue(0);
            User.find.mockReturnValue({
                sort: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                lean: () => vi.fn().mockResolvedValue([])()
            });

            const response = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toBeInstanceOf(Array);
        });
    });

    describe('GET /api/users/me', () => {
        it('debe retornar el perfil propio con token valido', async () => {
            User.findById.mockReturnValue({
                lean: () => vi.fn().mockResolvedValue({ _id: 'user456', displayName: 'Customer' })()
            });

            const response = await request(app)
                .get('/api/users/me')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.displayName).toBe('Customer');
        });
    });
});
