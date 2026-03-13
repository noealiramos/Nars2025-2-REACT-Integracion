import { describe, it, expect, vi, beforeEach } from 'vitest';
import ShippingAddress from '../../../src/controllers/../models/shippingAddress.js';
import {
    createShippingAddress,
    getUserAddresses,
    getAddressById,
    getDefaultAddress,
    updateShippingAddress,
    setDefaultAddress,
    deleteShippingAddress
} from '../../../src/controllers/shippingAddressController.js';
import { createMockReqRes } from '../../testUtils.js';

vi.mock('../../../src/models/shippingAddress.js');

describe('shippingAddressController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createShippingAddress', () => {
        it('debe retornar 401 si no hay usuario en la request', async () => {
            const { req, res, next } = createMockReqRes({ user: null });
            await createShippingAddress(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
        });

        it('debe crear una dirección y desmarcar otras si isDefault es true (201)', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u1' },
                body: { name: 'Casa', address: 'Calle 123', isDefault: true }
            });
            ShippingAddress.updateMany.mockResolvedValue({});
            ShippingAddress.create.mockResolvedValue({ _id: 'addr1', name: 'Casa' });

            await createShippingAddress(req, res, next);
            expect(ShippingAddress.updateMany).toHaveBeenCalledWith({ user: 'u1' }, { isDefault: false });
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('getUserAddresses', () => {
        it('debe obtener las direcciones del usuario con paginación (200)', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u1' },
                query: { page: '1' }
            });
            ShippingAddress.find.mockReturnValue({
                sort: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                lean: vi.fn().mockResolvedValue([{ _id: 'a1' }])
            });
            ShippingAddress.countDocuments.mockResolvedValue(1);

            await getUserAddresses(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ addresses: expect.any(Array) }));
        });
    });

    describe('getAddressById', () => {
        it('debe retornar 404 si la dirección no existe', async () => {
            const { req, res, next } = createMockReqRes({
                params: { addressId: 'a1' },
                user: { id: 'u1' }
            });
            ShippingAddress.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) });
            await getAddressById(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getDefaultAddress', () => {
        it('debe retornar 404 si no hay dirección por defecto', async () => {
            const { req, res, next } = createMockReqRes({ user: { id: 'u1' } });
            ShippingAddress.findOne.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) });
            await getDefaultAddress(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('updateShippingAddress', () => {
        it('debe actualizar campos y sincronizar isDefault (200)', async () => {
            const { req, res, next } = createMockReqRes({
                params: { addressId: 'a1' },
                user: { id: 'u1' },
                body: { name: 'Oficina', isDefault: true }
            });
            const mockAddress = {
                _id: 'a1',
                isDefault: false,
                save: vi.fn().mockResolvedValue(true)
            };
            ShippingAddress.findById.mockResolvedValue(mockAddress);
            ShippingAddress.updateMany.mockResolvedValue({});

            await updateShippingAddress(req, res, next);
            expect(ShippingAddress.updateMany).toHaveBeenCalled();
            expect(mockAddress.isDefault).toBe(true);
            expect(mockAddress.name).toBe('Oficina');
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('setDefaultAddress', () => {
        it('debe marcar una dirección como default y desactivar el resto (200)', async () => {
            const { req, res, next } = createMockReqRes({
                params: { addressId: 'a1' },
                user: { id: 'u1' }
            });
            const mockAddress = { _id: 'a1', save: vi.fn().mockResolvedValue(true) };
            ShippingAddress.findById.mockResolvedValue(mockAddress);
            ShippingAddress.updateMany.mockResolvedValue({});

            await setDefaultAddress(req, res, next);
            expect(ShippingAddress.updateMany).toHaveBeenCalledWith({ user: 'u1' }, { isDefault: false });
            expect(mockAddress.isDefault).toBe(true);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('deleteShippingAddress', () => {
        it('debe eliminar la dirección si existe (200)', async () => {
            const { req, res, next } = createMockReqRes({
                params: { addressId: 'a1' },
                user: { id: 'u1' }
            });
            ShippingAddress.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue({ _id: 'a1' }) });
            await deleteShippingAddress(req, res, next);
            expect(ShippingAddress.findByIdAndDelete).toHaveBeenCalledWith('a1');
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
