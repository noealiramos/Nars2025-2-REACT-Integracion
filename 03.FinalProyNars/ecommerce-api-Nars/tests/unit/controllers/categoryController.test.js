import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as categoryController from '../../../src/controllers/categoryController.js';
import Category from '../../../src/models/category.js';
import { createMockReqRes } from '../../testUtils.js';

vi.mock('../../../src/models/category.js', () => ({
    default: {
        create: vi.fn(),
        find: vi.fn(),
        countDocuments: vi.fn(),
        findById: vi.fn()
    }
}));

describe('categoryController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createCategory', () => {
        it('debe crear una categoria exitosamente', async () => {
            const categoryData = { name: 'Anillos', description: 'Todo tipo de anillos' };
            const { req, res, next } = createMockReqRes({ body: categoryData });

            const mockCreated = { ...categoryData, _id: 'cat123' };
            vi.mocked(Category.create).mockResolvedValue(mockCreated);

            await categoryController.createCategory(req, res, next);

            expect(Category.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Anillos' }));
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Anillos' }));
        });
    });

    describe('getCategories', () => {
        it('debe retornar todas las categorias con paginacion', async () => {
            const { req, res, next } = createMockReqRes({ query: { page: '1' } });

            Category.find.mockReturnValue({
                populate: vi.fn().mockReturnThis(),
                sort: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                limit: vi.fn().mockResolvedValue([{ name: 'Cat1' }])
            });
            Category.countDocuments.mockResolvedValue(1);

            await categoryController.getCategories(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                categories: expect.arrayContaining([expect.objectContaining({ name: 'Cat1' })]),
                pagination: expect.any(Object)
            }));
        });
    });
});
