import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    getCarts,
    getCartById,
    getCartByUser,
    createCart,
    updateCart,
    deleteCart,
    addProductToCart
} from '../../../src/controllers/cartController.js';
import Cart from '../../../src/models/cart.js';
import { createMockReqRes } from '../../testUtils.js';

vi.mock('../../../src/models/cart.js');

describe('cartController', () => {
    describe('getCarts (admin)', () => {
        it('debe listar carritos con paginación (200)', async () => {
            const { req, res, next } = createMockReqRes({ query: { page: '1' } });
            Cart.countDocuments.mockResolvedValue(1);
            Cart.find.mockReturnValue({
                populate: vi.fn().mockReturnThis(),
                sort: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                lean: vi.fn().mockResolvedValue([{ _id: 'c1' }])
            });

            await getCarts(req, res, next);
            expect(res.json).toHaveBeenCalled();
        });
    });

    describe('getCartById (admin)', () => {
        it('debe retornar 404 si no existe', async () => {
            const { req, res, next } = createMockReqRes({ params: { id: 'c1' } });
            Cart.findById.mockReturnValue({ populate: vi.fn().mockReturnThis(), lean: vi.fn().mockResolvedValue(null) });
            await getCartById(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

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
        it('debe retornar el carrito si existe (200)', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'user1', role: 'customer' },
                params: { userId: 'user1' }
            });
            Cart.findOne.mockReturnValue({
                populate: vi.fn().mockReturnThis(),
                lean: vi.fn().mockResolvedValue({ _id: 'c1', user: 'user1', products: [] })
            });

            await getCartByUser(req, res, next);
            expect(res.json).toHaveBeenCalled();
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

    describe('createCart', () => {
        it('debe retornar 409 si el usuario ya tiene carrito', async () => {
            const { req, res, next } = createMockReqRes({ body: { user: 'u1', products: [] } });
            Cart.create.mockRejectedValue({ code: 11000 });
            await createCart(req, res, next);
            expect(res.status).toHaveBeenCalledWith(409);
        });
    });

    describe('updateCart', () => {
        it('debe actualizar productos (200)', async () => {
            const { req, res, next } = createMockReqRes({
                params: { id: 'c1' },
                body: { products: [{ product: 'p1', quantity: 1 }] }
            });
            Cart.findByIdAndUpdate.mockReturnValue({ populate: vi.fn().mockReturnThis(), _id: 'c1' });
            await updateCart(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('deleteCart', () => {
        it('debe eliminar el carrito (200)', async () => {
            const { req, res, next } = createMockReqRes({ params: { id: 'c1' } });
            Cart.findByIdAndDelete.mockReturnValue({ lean: vi.fn().mockResolvedValue({ _id: 'c1' }) });
            await deleteCart(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
