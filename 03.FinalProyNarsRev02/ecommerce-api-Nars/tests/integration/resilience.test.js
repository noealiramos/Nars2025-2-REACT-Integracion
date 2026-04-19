import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import Product from '../../src/models/product.js';

// Mockeamos Product pero debemos mantener 'init' ya que server.js lo llama al iniciar
vi.mock('../../src/models/product.js', () => {
    const MockProduct = {
        init: vi.fn().mockResolvedValue({}),
        find: vi.fn(),
        create: vi.fn(),
        findById: vi.fn(),
        countDocuments: vi.fn()
    };
    return {
        default: MockProduct
    };
});

import app from '../../src/app.js';

describe('Resilience & Error Handling Integration', () => {
    it('debe retornar 500 y un JSON estructurado ante un error inesperado', async () => {
        // Forzamos un error en un modelo durante una ruta pública
        vi.mocked(Product.find).mockImplementationOnce(() => {
            throw new Error('Simulated Database Crash');
        });

        const response = await request(app).get('/api/products');

        expect(response.status).toBe(500);
        expect(response.body).toMatchObject({
            message: expect.stringContaining('Simulated Database Crash')
        });
    });

    it('debe mantener consistencia en errores 404', async () => {
        const response = await request(app).get('/api/invalid-route-12345');

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            status: 'error',
            error: 'Route not found'
        });
    });

    it('debe reportar el estado de la base de datos en el health check', async () => {
        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('database');
        expect(['connected', 'disconnected']).toContain(response.body.database);
    });
});
