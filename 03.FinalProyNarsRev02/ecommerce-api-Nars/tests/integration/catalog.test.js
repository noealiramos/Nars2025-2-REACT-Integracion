import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import Product from '../../src/models/product.js';

vi.mock('../../src/config/database.js', () => ({
    default: vi.fn().mockResolvedValue(null)
}));

vi.mock('../../src/models/product.js');
vi.mock('../../src/models/category.js');

import app from '../../src/app.js';

describe('Catalog & Health Integration Tests', () => {
    beforeAll(async () => {
        process.env.JWT_SECRET = 'test_secret';
    });

    afterAll(async () => {
        vi.clearAllMocks();
    });

    describe('GET /api/products (Public Catalog)', () => {
        it('debe listar productos con filtros publicos', async () => {
            Product.find.mockReturnValue({
                populate: vi.fn().mockReturnThis(),
                sort: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                lean: vi.fn().mockResolvedValue([{ name: 'Prod1', design: 'Simple' }])
            });
            Product.countDocuments.mockResolvedValue(1);

            const res = await request(app).get('/api/products');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('items');
        });

        it('debe filtrar por diseño Simple', async () => {
            const res = await request(app).get('/api/products?design=Simple');
            expect(res.status).toBe(200);
            expect(res.body.items).toBeDefined();
        });
    });

    describe('Health Check', () => {
        it('debe estar saludable en el root', async () => {
            const res = await request(app).get('/');
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('ok');
        });
    });
});
