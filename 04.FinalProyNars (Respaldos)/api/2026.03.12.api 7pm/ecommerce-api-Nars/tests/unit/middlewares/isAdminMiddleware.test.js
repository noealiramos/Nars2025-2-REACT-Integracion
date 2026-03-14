import { describe, it, expect, vi } from 'vitest';
import isAdminMiddleware from '../../../src/middlewares/isAdminMiddleware.js';
import { createMockReqRes } from '../../testUtils.js';

describe('isAdminMiddleware', () => {
    it('debe retornar 401 si req.user no existe', () => {
        const { req, res, next } = createMockReqRes();

        isAdminMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('debe retornar 403 si el rol no es admin', () => {
        const { req, res, next } = createMockReqRes({
            user: { role: 'user' }
        });

        isAdminMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar a next() si el rol es admin', () => {
        const { req, res, next } = createMockReqRes({
            user: { role: 'admin' }
        });

        isAdminMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
});
