import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    getReviews,
    getProductReviews,
    getUserReviews,
    createReview,
    updateReview,
    deleteReview
} from '../../../src/controllers/reviewController.js';
import Review from '../../../src/models/review.js';
import { createMockReqRes } from '../../testUtils.js';

vi.mock('../../../src/models/review.js');

describe('reviewController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getReviews (admin list)', () => {
        it('debe retornar lista de reseñas con paginación (200)', async () => {
            const { req, res, next } = createMockReqRes({
                query: { page: '1', limit: '10' }
            });

            Review.find.mockReturnValue({
                populate: vi.fn().mockReturnThis(),
                sort: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                lean: vi.fn().mockResolvedValue([{ _id: 'r1', rating: 5 }])
            });
            Review.countDocuments.mockResolvedValue(1);

            await getReviews(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                reviews: expect.any(Array),
                pagination: expect.any(Object)
            }));
        });

        it('debe manejar errores de base de datos (500)', async () => {
            const { req, res, next } = createMockReqRes();
            Review.find.mockImplementation(() => { throw new Error('DB Error'); });

            await getReviews(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('getProductReviews', () => {
        it('debe obtener reseñas por productId (200)', async () => {
            const { req, res, next } = createMockReqRes({
                params: { productId: 'p123' }
            });

            Review.find.mockReturnValue({
                populate: vi.fn().mockReturnThis(),
                sort: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                lean: vi.fn().mockResolvedValue([])
            });
            Review.countDocuments.mockResolvedValue(0);

            await getProductReviews(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('getUserReviews', () => {
        it('debe retornar 401 si no hay usuario en la petición', async () => {
            const { req, res, next } = createMockReqRes({ user: null });
            await getUserReviews(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
        });

        it('debe obtener reseñas del usuario autenticado (200)', async () => {
            const { req, res, next } = createMockReqRes({ user: { id: 'u123' } });

            Review.find.mockReturnValue({
                populate: vi.fn().mockReturnThis(),
                sort: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                lean: vi.fn().mockResolvedValue([])
            });
            Review.countDocuments.mockResolvedValue(0);

            await getUserReviews(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('createReview', () => {
        it('debe retornar 400 si faltan campos obligatorios', async () => {
            const { req, res, next } = createMockReqRes({ body: {} });
            await createReview(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('debe retornar 400 si el rating es inválido', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u1' },
                body: { product: 'p1', rating: 6 }
            });
            await createReview(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('debe retornar 409 si ya existe una reseña para el usuario/producto', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u1' },
                body: { product: 'p1', rating: 5 }
            });
            Review.findOne.mockReturnValue({ lean: vi.fn().mockResolvedValue({ _id: 'r1' }) });

            await createReview(req, res, next);
            expect(res.status).toHaveBeenCalledWith(409);
        });

        it('debe crear la reseña exitosamente (201)', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u1' },
                body: { product: 'p1', rating: 5, comment: 'excelente' }
            });
            Review.findOne.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) });
            const mockReview = {
                populate: vi.fn().mockReturnThis(),
                _id: 'new_r'
            };
            Review.create.mockResolvedValue(mockReview);

            await createReview(req, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(Review.create).toHaveBeenCalled();
        });
    });

    describe('updateReview', () => {
        it('debe retornar 404 si la reseña no existe', async () => {
            const { req, res, next } = createMockReqRes({ params: { reviewId: 'r1' } });
            Review.findById.mockResolvedValue(null);
            await updateReview(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('debe retornar 403 si el usuario no es dueño ni admin', async () => {
            const { req, res, next } = createMockReqRes({
                params: { reviewId: 'r1' },
                user: { id: 'u2', role: 'customer' }
            });
            Review.findById.mockResolvedValue({ user: 'u1' });
            await updateReview(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('debe actualizar la reseña si es el dueño (200)', async () => {
            const { req, res, next } = createMockReqRes({
                params: { reviewId: 'r1' },
                user: { id: 'u1' },
                body: { rating: 4 }
            });
            Review.findById.mockResolvedValue({ user: 'u1' });
            Review.findByIdAndUpdate.mockReturnValue({
                populate: vi.fn().mockReturnThis(),
                _id: 'r1'
            });

            await updateReview(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('deleteReview', () => {
        it('debe eliminar la reseña si es admin (200)', async () => {
            const { req, res, next } = createMockReqRes({
                params: { reviewId: 'r1' },
                user: { id: 'u2', role: 'admin' }
            });
            Review.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue({ user: 'u1' }) });

            await deleteReview(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(Review.findByIdAndDelete).toHaveBeenCalledWith('r1');
        });
    });
});
