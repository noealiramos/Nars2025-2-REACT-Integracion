import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import ownerOrAdminByCartId from '../../../src/middlewares/ownerOrAdminByCartId.js';
import Cart from '../../../src/models/cart.js';
import { createMockReqRes } from '../../testUtils.js';

vi.mock('../../../src/models/cart.js');

describe('ownerOrAdminByCartId middleware', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe retornar 401 si no hay usuario autenticado', async () => {
        const { req, res, next } = createMockReqRes({ user: null });
        await ownerOrAdminByCartId(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('debe retornar 400 si el ID del carrito es inválido', async () => {
        const { req, res, next } = createMockReqRes({
            user: { id: 'u1' },
            params: { id: 'invalid-id' }
        });
        await ownerOrAdminByCartId(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('debe retornar 404 si el carrito no existe', async () => {
        const cartId = new mongoose.Types.ObjectId().toString();
        const { req, res, next } = createMockReqRes({
            user: { id: 'u1' },
            params: { id: cartId }
        });
        Cart.findById.mockReturnValue({ select: vi.fn().mockReturnThis(), lean: vi.fn().mockResolvedValue(null) });

        await ownerOrAdminByCartId(req, res, next);
        expect(res.status).toHaveBeenCalledWith(404);
    });

    it('debe permitir acceso si el usuario es el dueño', async () => {
        const cartId = new mongoose.Types.ObjectId().toString();
        const { req, res, next } = createMockReqRes({
            user: { id: 'u1', role: 'customer' },
            params: { id: cartId }
        });
        Cart.findById.mockReturnValue({ select: vi.fn().mockReturnThis(), lean: vi.fn().mockResolvedValue({ user: 'u1' }) });

        await ownerOrAdminByCartId(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('debe permitir acceso si el usuario es admin aunque no sea dueño', async () => {
        const cartId = new mongoose.Types.ObjectId().toString();
        const { req, res, next } = createMockReqRes({
            user: { id: 'admin_user', role: 'admin' },
            params: { id: cartId }
        });
        Cart.findById.mockReturnValue({ select: vi.fn().mockReturnThis(), lean: vi.fn().mockResolvedValue({ user: 'u1' }) });

        await ownerOrAdminByCartId(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('debe retornar 403 si no es dueño ni admin', async () => {
        const cartId = new mongoose.Types.ObjectId().toString();
        const { req, res, next } = createMockReqRes({
            user: { id: 'u2', role: 'customer' },
            params: { id: cartId }
        });
        Cart.findById.mockReturnValue({ select: vi.fn().mockReturnThis(), lean: vi.fn().mockResolvedValue({ user: 'u1' }) });

        await ownerOrAdminByCartId(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
    });
});
