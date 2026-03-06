import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCatalogMeta } from '../../../src/controllers/catalogController.js';
import Category from '../../../src/models/category.js';
import { MATERIALS, DESIGNS, STONES } from '../../../src/config/catalog.js';
import { createMockReqRes } from '../../testUtils.js';

vi.mock('../../../src/models/category.js');

describe('catalogController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getCatalogMeta', () => {
        it('debe retornar meta info del catalogo y categorias (200)', async () => {
            const { req, res, next } = createMockReqRes({});
            Category.find.mockReturnValue({
                sort: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                lean: vi.fn().mockResolvedValue([{ name: 'Joyería' }])
            });

            await getCatalogMeta(req, res, next);
            expect(res.json).toHaveBeenCalledWith({
                materials: MATERIALS,
                designs: DESIGNS,
                stones: STONES,
                categories: [{ name: 'Joyería' }]
            });
        });
    });
});
