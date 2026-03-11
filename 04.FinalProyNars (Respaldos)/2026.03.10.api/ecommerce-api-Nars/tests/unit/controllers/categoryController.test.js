import { describe, it, expect, vi, beforeEach } from 'vitest';
import Category from '../../../src/models/category.js';
import {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    searchCategory
} from '../../../src/controllers/categoryController.js';
import { createMockReqRes } from '../../testUtils.js';

vi.mock('../../../src/models/category.js');

describe('categoryController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getCategories', () => {
        it('debe listar categorías con filtros opcionales (200)', async () => {
            const { req, res, next } = createMockReqRes({
                query: { sort: 'name', order: 'asc', parentCategory: 'cat1' }
            });
            Category.countDocuments.mockResolvedValue(1);
            Category.find.mockReturnValue({
                populate: vi.fn().mockReturnThis(),
                sort: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                then: vi.fn(cb => cb([{ name: 'Test' }]))
            });

            await getCategories(req, res, next);
            expect(Category.find).toHaveBeenCalledWith({ parentCategory: 'cat1' });
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('getCategoryById', () => {
        it('debe retornar 404 si la categoría no existe', async () => {
            const { req, res, next } = createMockReqRes({ params: { id: 'c1' } });
            Category.findById.mockReturnValue({ populate: vi.fn().mockResolvedValue(null) });
            await getCategoryById(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('createCategory', () => {
        it('debe crear una categoría exitosamente (201)', async () => {
            const { req, res, next } = createMockReqRes({
                body: { name: 'Joyería', description: 'desc' }
            });
            Category.create.mockResolvedValue({ _id: 'c1', name: 'Joyería' });
            await createCategory(req, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('updateCategory', () => {
        it('debe actualizar la categoría y retornar 200', async () => {
            const { req, res, next } = createMockReqRes({
                params: { id: 'c1' },
                body: { name: 'Updated' }
            });
            Category.findByIdAndUpdate.mockResolvedValue({ _id: 'c1', name: 'Updated' });
            await updateCategory(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('deleteCategory', () => {
        it('debe eliminar la categoría correctamente (200)', async () => {
            const { req, res, next } = createMockReqRes({ params: { id: 'c1' } });
            Category.findByIdAndDelete.mockResolvedValue({ _id: 'c1' });
            await deleteCategory(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('searchCategory', () => {
        it('debe buscar categorías por texto usando regex (200)', async () => {
            const { req, res, next } = createMockReqRes({ query: { q: 'anillo' } });
            Category.countDocuments.mockResolvedValue(1);
            Category.find.mockReturnValue({
                populate: vi.fn().mockReturnThis(),
                sort: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                then: vi.fn(cb => cb([{ name: 'Anillo de oro' }]))
            });

            await searchCategory(req, res, next);
            expect(Category.find).toHaveBeenCalledWith(expect.objectContaining({
                $or: expect.arrayContaining([
                    expect.objectContaining({ name: expect.any(Object) })
                ])
            }));
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
