import { describe, it, expect, vi, beforeEach } from 'vitest';
import WishList from '../../../src/models/wishList.js';
import Product from '../../../src/models/product.js';
import {
    getUserWishList,
    addToWishList,
    removeFromWishList,
    clearWishList,
    checkProductInWishList,
    moveToCart
} from '../../../src/controllers/wishListController.js';
import { createMockReqRes } from '../../testUtils.js';

vi.mock('../../../src/models/wishList.js');
vi.mock('../../../src/models/product.js');

describe('wishListController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getUserWishList', () => {
        it('debe crear una wishlist si no existe (200)', async () => {
            const { req, res, next } = createMockReqRes({ user: { id: 'u1' } });
            WishList.findOne.mockReturnValue({ populate: vi.fn().mockReturnThis(), lean: vi.fn().mockResolvedValue(null) });
            WishList.create.mockResolvedValue({ _id: 'wl1' });
            WishList.findById.mockReturnValue({ populate: vi.fn().mockReturnThis(), lean: vi.fn().mockResolvedValue({ products: [] }) });

            await getUserWishList(req, res, next);
            expect(WishList.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('debe retornar la wishlist existente (200)', async () => {
            const { req, res, next } = createMockReqRes({ user: { id: 'u1' } });
            WishList.findOne.mockReturnValue({
                populate: vi.fn().mockReturnThis(),
                lean: vi.fn().mockResolvedValue({ products: [{ product: 'p1' }] })
            });

            await getUserWishList(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ count: 1 }));
        });
    });

    describe('addToWishList', () => {
        it('debe retornar 404 si el producto no existe', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u1' },
                body: { productId: 'invalid' }
            });
            Product.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) });
            await addToWishList(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('debe agregar un producto usando updateOne con upsert (200)', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u1' },
                body: { productId: 'p1' }
            });
            Product.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue({ _id: 'p1' }) });
            WishList.updateOne.mockResolvedValue({});
            WishList.findOne.mockReturnValue({ populate: vi.fn().mockResolvedValue({ _id: 'wl1' }) });

            await addToWishList(req, res, next);
            expect(WishList.updateOne).toHaveBeenCalledWith(
                { user: 'u1' },
                expect.any(Object),
                { upsert: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('removeFromWishList', () => {
        it('debe retornar 404 si la wishlist no existe', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u1' },
                params: { productId: 'p1' }
            });
            WishList.findOneAndUpdate.mockReturnValue({ populate: vi.fn().mockResolvedValue(null) });
            await removeFromWishList(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('debe remover el producto de la wishlist (200)', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u1' },
                params: { productId: 'p1' }
            });
            const mockWl = { products: [] };
            WishList.findOneAndUpdate.mockReturnValue({ populate: vi.fn().mockResolvedValue(mockWl) });

            await removeFromWishList(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('clearWishList', () => {
        it('debe vaciar la wishlist del usuario (200)', async () => {
            const { req, res, next } = createMockReqRes({ user: { id: 'u1' } });
            WishList.findOneAndUpdate.mockReturnValue({ populate: vi.fn().mockResolvedValue({ products: [] }) });
            await clearWishList(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('checkProductInWishList', () => {
        it('debe retornar true si el producto está en la lista (200)', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u1' },
                params: { productId: 'p1' }
            });
            WishList.findOne.mockReturnValue({ lean: vi.fn().mockResolvedValue({ products: [{ product: 'p1' }] }) });
            await checkProductInWishList(req, res, next);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ inWishList: true }));
        });
    });

    describe('moveToCart', () => {
        it('debe remover de la wishlist y simular el movimiento al carrito (200)', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u1' },
                body: { productId: 'p1' }
            });
            const mockWl = {
                populate: vi.fn().mockResolvedValue({ products: [] })
            };
            WishList.findOneAndUpdate.mockResolvedValue(mockWl);

            await moveToCart(req, res, next);
            expect(WishList.findOneAndUpdate).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
