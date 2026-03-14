import { describe, it, expect, vi } from 'vitest';
import ownerOrAdmin from '../../../src/middlewares/ownerOrAdmin.js';
import { createMockReqRes } from '../../testUtils.js';

describe('ownerOrAdmin middleware', () => {
    it('debe permitir acceso si el usuario es admin', () => {
        const middleware = ownerOrAdmin('id');
        const { req, res, next } = createMockReqRes({
            user: { id: 'u1', role: 'admin' },
            params: { id: 'u2' } // Diferente, pero es admin
        });

        middleware(req, res, next);
        expect(next).toHaveBeenCalledWith();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('debe permitir acceso si el usuario es el dueño', () => {
        const middleware = ownerOrAdmin('userId');
        const { req, res, next } = createMockReqRes({
            user: { id: 'u1', role: 'customer' },
            params: { userId: 'u1' }
        });

        middleware(req, res, next);
        expect(next).toHaveBeenCalledWith();
    });

    it('debe retornar 403 si no es admin ni dueño', () => {
        const middleware = ownerOrAdmin('id');
        const { req, res, next } = createMockReqRes({
            user: { id: 'u1', role: 'customer' },
            params: { id: 'u2' }
        });

        middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    it('debe retornar 403 si no hay usuario autenticado', () => {
        const middleware = ownerOrAdmin('id');
        const { req, res, next } = createMockReqRes({
            user: null,
            params: { id: 'u2' }
        });

        middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
    });
});
