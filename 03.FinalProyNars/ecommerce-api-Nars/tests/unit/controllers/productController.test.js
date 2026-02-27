import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProduct, getProducts } from '../../../src/controllers/productController.js';
import Product from '../../../src/models/product.js';
import { createMockReqRes } from '../../testUtils.js';

vi.mock('../../../src/models/product.js', () => ({
    default: {
        create: vi.fn(),
        find: vi.fn(),
        findById: vi.fn(),
        findByIdAndUpdate: vi.fn(),
        findByIdAndDelete: vi.fn(),
        countDocuments: vi.fn()
    }
}));
vi.mock('../../../src/models/category.js', () => ({
    default: {
        findById: vi.fn().mockReturnValue({
            select: vi.fn().mockResolvedValue({ _id: 'cat123' })
        })
    }
}));

describe('productController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createProduct', () => {
        it('debe crear un producto exitosamente con datos validos', async () => {
            const productData = {
                name: 'Anillo de Plata',
                description: 'Anillo artesanal',
                price: 50,
                stock: 10,
                category: '65d100000000000000000001',
                material: 'Plata',
                design: 'Simple'
            };
            const { req, res, next } = createMockReqRes({ body: productData });

            const mockProduct = {
                ...productData,
                _id: 'p123',
                populate: vi.fn().mockReturnValue(Promise.resolve({ name: 'Mock' }))
            };
            vi.mocked(Product.create).mockResolvedValue(mockProduct);

            await createProduct(req, res, next);

            expect(Product.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Anillo de Plata' }));
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('debe fallar si el diseño es "Con piedra mineral" y no se envia "stone"', async () => {
            const productData = {
                name: 'Collar con Piedra',
                description: 'Collar artesanal',
                price: 50,
                stock: 10,
                category: '65d100000000000000000001',
                material: 'Plata',
                design: 'Con piedra mineral',
                stone: null
            };
            const { req, res, next } = createMockReqRes({ body: productData });

            const ValidationError = new Error('Validation Failed');
            vi.mocked(Product.create).mockRejectedValue(ValidationError);

            await createProduct(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json.mock.calls[0][0].message).toBe('stone es obligatorio cuando design = "Con piedra mineral"');
        });
    });

    describe('getProducts', () => {
        it('debe aplicar filtros de material y diseño si se proporcionan', async () => {
            const { req, res, next } = createMockReqRes({
                query: { material: 'Oro', design: 'Simple' }
            });

            const mockQuery = {
                populate: vi.fn().mockReturnThis(),
                sort: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                lean: vi.fn().mockResolvedValue([])
            };
            vi.mocked(Product.find).mockReturnValue(mockQuery);

            await getProducts(req, res, next);

            expect(Product.find.mock.calls[0][0]).toEqual(expect.objectContaining({
                material: 'Oro',
                design: 'Simple'
            }));
            expect(res.json).toHaveBeenCalled();
        });
    });
});
