import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import {
    getPaymentMethods,
    getDefaultPaymentMethod,
    getPaymentMethodById,
    createPaymentMethod,
    updatePaymentMethod,
    setDefaultPaymentMethod,
    deactivatePaymentMethod
} from '../../../src/controllers/paymentMethodController.js';
import PaymentMethod from '../../../src/models/paymentMethod.js';
import { createMockReqRes } from '../../testUtils.js';

vi.mock('../../../src/models/paymentMethod.js');

describe('paymentMethodController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getPaymentMethods (admin)', () => {
        it('debe listar métodos de pago con paginación y sanitizar campos (200)', async () => {
            const { req, res, next } = createMockReqRes({ query: { page: '1', limit: '5' } });
            PaymentMethod.countDocuments.mockResolvedValue(1);
            PaymentMethod.find.mockReturnValue({
                sort: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                lean: vi.fn().mockResolvedValue([{ _id: 'pm1', cardNumber: '1234', user: 'u1' }])
            });

            await getPaymentMethods(req, res, next);
            expect(res.json).toHaveBeenCalled();
            const data = res.json.mock.calls[0][0].data;
            expect(data[0]).not.toHaveProperty('cardNumber');
        });
    });

    describe('getDefaultPaymentMethod', () => {
        it('debe retornar 404 si no hay método por defecto', async () => {
            const { req, res, next } = createMockReqRes({ params: { userId: 'u1' } });
            PaymentMethod.findOne.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) });
            await getDefaultPaymentMethod(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('debe retornar el método por defecto (200)', async () => {
            const { req, res, next } = createMockReqRes({ params: { userId: 'u1' } });
            PaymentMethod.findOne.mockReturnValue({ lean: vi.fn().mockResolvedValue({ _id: 'pm1', isDefault: true }) });
            await getDefaultPaymentMethod(req, res, next);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.any(Object) }));
        });
    });

    describe('getPaymentMethodById', () => {
        it('debe retornar el método de pago si existe (200)', async () => {
            const { req, res, next } = createMockReqRes({
                params: { id: 'pm1' },
                user: { id: 'u2', role: 'customer' }
            });
            PaymentMethod.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue({ user: 'u1' }) });
            await getPaymentMethodById(req, res, next);
            expect(res.json).toHaveBeenCalled();
        });
    });

    describe('createPaymentMethod', () => {
        it('debe bloquear campos sensibles prohibidos (400)', async () => {
            const { req, res, next } = createMockReqRes({
                body: { type: 'card', cardNumber: '123' }
            });
            await createPaymentMethod(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Sensitive fields are not allowed via API' }));
        });

        it('debe permitir crear bank_transfer con accountNumber (210)', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u1' },
                body: { type: 'bank_transfer', accountNumber: 'bank123' }
            });
            PaymentMethod.updateMany.mockResolvedValue({});
            PaymentMethod.create.mockResolvedValue({ toObject: () => ({ type: 'bank_transfer', accountNumber: 'bank123' }) });

            await createPaymentMethod(req, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('debe manejar ValidationError del esquema (400)', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u1' },
                body: { type: 'card' }
            });
            PaymentMethod.create.mockRejectedValue({ name: 'ValidationError', message: 'Missing fields' });
            await createPaymentMethod(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('updatePaymentMethod', () => {
        it('debe retornar 400 si el ID es inválido', async () => {
            const { req, res, next } = createMockReqRes({ params: { id: 'invalid' } });
            await updatePaymentMethod(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('debe disparar save() para ejecutar hooks del modelo (200)', async () => {
            const pmId = new mongoose.Types.ObjectId();
            const { req, res, next } = createMockReqRes({
                params: { id: pmId.toString() },
                user: { id: 'u1', role: 'customer' },
                body: { last4: '9999' }
            });

            const mockPm = {
                _id: pmId,
                user: 'u1',
                type: 'card',
                save: vi.fn().mockResolvedValue(true)
            };
            PaymentMethod.findById.mockResolvedValue(mockPm);
            PaymentMethod.findById.mockReturnValueOnce(mockPm).mockReturnValue({ lean: vi.fn().mockResolvedValue(mockPm) });

            await updatePaymentMethod(req, res, next);
            expect(mockPm.save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalled();
        });

        it('debe manejar colisión de default (409)', async () => {
            const pmId = new mongoose.Types.ObjectId();
            const { req, res, next } = createMockReqRes({
                params: { id: pmId.toString() },
                user: { id: 'u1' },
                body: { isDefault: true }
            });
            const mockPm = {
                _id: pmId,
                user: 'u1',
                save: vi.fn().mockRejectedValue({ code: 11000 })
            };
            PaymentMethod.findById.mockResolvedValue(mockPm);
            await updatePaymentMethod(req, res, next);
            expect(res.status).toHaveBeenCalledWith(409);
        });
    });

    describe('setDefaultPaymentMethod', () => {
        it('debe marcar como default y desactivar otros (200)', async () => {
            const { req, res, next } = createMockReqRes({
                params: { id: 'pm1' },
                user: { id: 'u1' }
            });
            PaymentMethod.findById.mockResolvedValue({ _id: 'pm1', user: 'u1' });
            PaymentMethod.findByIdAndUpdate.mockResolvedValue({ _id: 'pm1', isDefault: true });

            await setDefaultPaymentMethod(req, res, next);
            expect(PaymentMethod.updateMany).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalled();
        });
    });

    describe('deactivatePaymentMethod', () => {
        it('debe realizar soft delete (200)', async () => {
            const { req, res, next } = createMockReqRes({
                params: { id: 'pm1' },
                user: { id: 'u1' }
            });
            PaymentMethod.findById.mockResolvedValue({ _id: 'pm1', user: 'u1' });
            PaymentMethod.findByIdAndUpdate.mockResolvedValue({ _id: 'pm1', active: false });

            await deactivatePaymentMethod(req, res, next);
            expect(res.json).toHaveBeenCalled();
        });
    });
});
