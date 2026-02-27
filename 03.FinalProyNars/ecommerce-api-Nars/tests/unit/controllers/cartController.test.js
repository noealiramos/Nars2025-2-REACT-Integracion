import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addProductToCart, getCartByUser } from '../../../src/controllers/cartController.js';
import Cart from '../../../src/models/cart.js';
import { createMockReqRes } from '../../testUtils.js';

vi.mock('../../../src/models/cart.js');

describe('cartController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('addProductToCart', () => {
        it('debe retornar 400 si faltan datos requeridos', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u123' },
                body: { quantity: 1 } // Falta productId
            });

            await addProductToCart(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('debe incrementar la cantidad si el producto ya existe en el carrito', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u123' },
                body: { productId: 'p123', quantity: 2 }
            });

            // Mock de updateOne (upsert inicial)
            Cart.updateOne.mockResolvedValue({ acknowledged: true });

            // Mock de findOneAndUpdate (incremento exitoso)
            const mockUpdatedCart = { user: 'u123', products: [{ product: 'p123', quantity: 2 }] };
            Cart.findOneAndUpdate.mockReturnValue({
                populate: vi.fn().mockReturnThis(),
                exec: vi.fn().mockResolvedValue(mockUpdatedCart) // Ajuste si usa .exec() o es thenable
            });
            // Vitest mock simplificado para el encadenamiento de populate
            Cart.findOneAndUpdate.mockReturnValue({
                populate: vi.fn().mockReturnThis(),
                then: vi.fn(callback => callback(mockUpdatedCart))
            });

            await addProductToCart(req, res, next);

            expect(Cart.updateOne).toHaveBeenCalled();
            expect(Cart.findOneAndUpdate).toHaveBeenCalledWith(
                { user: 'u123', 'products.product': 'p123' },
                { $inc: { 'products.$.quantity': 2 } },
                expect.anything()
            );
            expect(res.json).toHaveBeenCalledWith({ data: mockUpdatedCart });
        });

        it('debe agregar un nuevo producto si no existia en el carrito', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u123' },
                body: { productId: 'pNew', quantity: 1 }
            });

            Cart.updateOne.mockResolvedValue({});
            // Primer findOneAndUpdate falla (no existe el item para incrementar)
            Cart.findOneAndUpdate.mockReturnValueOnce({
                populate: vi.fn().mockReturnThis(),
                then: vi.fn(cb => cb(null))
            });
            // Segundo findOneAndUpdate exitoso (push)
            const mockCartAfterPush = { user: 'u123', products: [{ product: 'pNew', quantity: 1 }] };
            Cart.findOneAndUpdate.mockReturnValueOnce({
                populate: vi.fn().mockReturnThis(),
                then: vi.fn(cb => cb(mockCartAfterPush))
            });

            await addProductToCart(req, res, next);

            expect(Cart.findOneAndUpdate).toHaveBeenCalledTimes(2);
            expect(res.json).toHaveBeenCalledWith({ data: mockCartAfterPush });
        });
    });

    describe('getCartByUser', () => {
        it('debe retornar 403 si un usuario intenta ver el carrito de otro', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'user1', role: 'customer' },
                params: { userId: 'user2' }
            });

            await getCartByUser(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('debe retornar una estructura vacia si el carrito no existe', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u123' }
            });

            Cart.findOne.mockReturnValue({
                populate: vi.fn().mockReturnThis(),
                lean: () => vi.fn().mockResolvedValue(null)()
            });

            await getCartByUser(req, res, next);
            expect(res.json).toHaveBeenCalledWith({
                data: expect.objectContaining({ user: 'u123', products: [] })
            });
        });
    });
});
