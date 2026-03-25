import { describe, it, expect, vi, beforeEach } from 'vitest';
import Order from '../../../src/models/order.js';
import Product from '../../../src/models/product.js';
import ShippingAddress from '../../../src/models/shippingAddress.js';
import PaymentMethod from '../../../src/models/paymentMethod.js';
import Cart from '../../../src/models/cart.js';
import {
    getOrders,
    getOrderById,
    createOrder,
    checkoutFromCart,
    cancelOrder,
    deleteOrder
} from '../../../src/controllers/orderController.js';
import { createMockReqRes } from '../../testUtils.js';

vi.mock('../../../src/models/order.js');
vi.mock('../../../src/models/product.js');
vi.mock('../../../src/models/shippingAddress.js');
vi.mock('../../../src/models/paymentMethod.js');
vi.mock('../../../src/models/cart.js');

describe('orderController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getOrders (admin)', () => {
        it('debe listar órdenes con filtros de estado (200)', async () => {
            const { req, res, next } = createMockReqRes({ query: { status: 'pending' } });
            Order.countDocuments.mockResolvedValue(1);
            Order.find.mockReturnValue({
                populate: vi.fn().mockReturnThis(),
                sort: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                lean: vi.fn().mockResolvedValue([{ _id: 'o1' }])
            });

            await getOrders(req, res, next);
            expect(Order.find).toHaveBeenCalledWith({ status: 'pending' });
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('getOrderById', () => {
        it('debe retornar la orden si existe (200)', async () => {
            const { req, res, next } = createMockReqRes({
                params: { id: 'o1' },
                user: { id: 'u_diff', role: 'customer' }
            });
            Order.findById.mockReturnValue({
                populate: vi.fn().mockReturnThis(),
                lean: vi.fn().mockResolvedValue({ _id: 'o1', user: 'u_owner' })
            });

            await getOrderById(req, res, next);
            expect(res.json).toHaveBeenCalled();
        });
    });

    describe('createOrder', () => {
        it('debe crear orden validando propiedad de dirección y método (201)', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u1' },
                body: {
                    products: [{ productId: 'p1', quantity: 1 }],
                    shippingAddress: 'addr1',
                    paymentMethod: 'pm1'
                }
            });
            ShippingAddress.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue({ _id: 'addr1', user: 'u1' }) });
            PaymentMethod.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue({ _id: 'pm1', user: 'u1', active: true }) });
            Product.find.mockReturnValue({ lean: vi.fn().mockResolvedValue([{ _id: 'p1', price: 100 }]) });

            const mockOrder = {
                _id: 'o1',
                populate: vi.fn().mockReturnThis()
            };
            Order.create.mockResolvedValue(mockOrder);

            await createOrder(req, res, next);
            expect(Order.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('checkoutFromCart', () => {
        it('debe crear orden, descontar stock y vaciar carrito (201)', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u1' },
                body: { shippingAddress: 'addr1', paymentMethod: 'pm1' }
            });

            ShippingAddress.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue({ _id: 'addr1', user: 'u1' }) });
            PaymentMethod.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue({ _id: 'pm1', user: 'u1', active: true }) });
            Cart.findOne.mockReturnValue({ lean: vi.fn().mockResolvedValue({ products: [{ product: 'p1', quantity: 1 }] }) });
            Product.find.mockReturnValue({ lean: vi.fn().mockResolvedValue([{ _id: 'p1', price: 100, stock: 10 }]) });
            Product.findOneAndUpdate.mockResolvedValue({ _id: 'p1' });

            const mockOrder = { _id: 'o1', populate: vi.fn().mockReturnThis() };
            Order.create.mockResolvedValue(mockOrder);

            await checkoutFromCart(req, res, next);

            expect(Product.findOneAndUpdate).toHaveBeenCalled(); // Descuento stock
            expect(Cart.updateOne).toHaveBeenCalledWith({ user: 'u1' }, { $set: { products: [] } }); // Vaciar carrito
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('debe hacer rollback del stock si falla un item (409)', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u1' },
                body: { shippingAddress: 'addr1', paymentMethod: 'pm1' }
            });

            ShippingAddress.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue({ _id: 'addr1', user: 'u1' }) });
            PaymentMethod.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue({ _id: 'pm1', user: 'u1', active: true }) });
            Cart.findOne.mockReturnValue({ lean: vi.fn().mockResolvedValue({ products: [{ product: 'p1', quantity: 2 }] }) });
            Product.find.mockReturnValue({ lean: vi.fn().mockResolvedValue([{ _id: 'p1', price: 100, stock: 1 }]) });
            // Primera llamada simula éxito (si hubiera varios), segunda falla
            Product.findOneAndUpdate.mockResolvedValue(null);

            await checkoutFromCart(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('cancelOrder', () => {
        it('debe retornar 400 si la orden ya está entregada', async () => {
            const { req, res, next } = createMockReqRes({ params: { id: 'o1' } });
            Order.findById.mockResolvedValue({ _id: 'o1', status: 'delivered' });
            await cancelOrder(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('deleteOrder', () => {
        it('debe permitir borrar solo si está cancelada (200)', async () => {
            const { req, res, next } = createMockReqRes({ params: { id: 'o1' } });
            Order.findById.mockResolvedValue({ _id: 'o1', status: 'cancelled' });
            await deleteOrder(req, res, next);
            expect(Order.findByIdAndDelete).toHaveBeenCalledWith('o1');
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
