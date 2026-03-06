import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../server.js';
import User from '../../src/models/user.js';
import Product from '../../src/models/product.js';
import Cart from '../../src/models/cart.js';
import ShippingAddress from '../../src/models/shippingAddress.js';
import PaymentMethod from '../../src/models/paymentMethod.js';
import Order from '../../src/models/order.js';
import jwt from 'jsonwebtoken';

vi.mock('../../src/config/database.js', () => ({ default: vi.fn().mockResolvedValue(null) }));
vi.mock('../../src/models/user.js');
vi.mock('../../src/models/product.js', () => ({
    default: {
        init: vi.fn().mockResolvedValue(null),
        find: vi.fn(),
        findOneAndUpdate: vi.fn(),
        updateOne: vi.fn()
    }
}));
vi.mock('../../src/models/cart.js');
vi.mock('../../src/models/shippingAddress.js');
vi.mock('../../src/models/paymentMethod.js');
vi.mock('../../src/models/order.js');
vi.mock('../../src/models/category.js', () => ({
    default: { init: vi.fn().mockResolvedValue(null) }
}));

describe('Cart & Order Integration Tests', () => {
    const secret = 'test_secret';
    const mockUserEmail = 'test@example.com';
    const validUserId = '65d100000000000000000001';
    const validProductId = '65d100000000000000000002';
    const validAddrId = '65d100000000000000000003';
    const validPMId = '65d100000000000000000004';

    const userToken = jwt.sign({ userId: validUserId, role: 'customer' }, secret);

    beforeEach(() => {
        vi.clearAllMocks();
        process.env.JWT_SECRET = secret;
        process.env.NODE_ENV = 'test';
    });

    describe('POST /api/cart/add-product', () => {
        it('debe permitir añadir productos al carrito mediante la API', async () => {
            Cart.updateOne.mockResolvedValue({});
            const mockCart = { user: validUserId, products: [{ product: validProductId, quantity: 1 }] };
            Cart.findOneAndUpdate.mockReturnValue({
                populate: vi.fn().mockReturnThis(),
                then: vi.fn(cb => cb(mockCart))
            });

            const response = await request(app)
                .post('/api/cart/add-product')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ productId: validProductId, quantity: 1 });

            if (response.status !== 200) console.log('Cart Add Error:', response.body);
            expect(response.status).toBe(200);
            expect(response.body.data.products).toHaveLength(1);
        });
    });

    describe('POST /api/orders/checkout', () => {
        it('debe completar el flujo de checkout exitosamente', async () => {
            // Mocks para validación de dirección y pago
            ShippingAddress.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue({ user: validUserId }) });
            PaymentMethod.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue({ user: validUserId, active: true }) });

            // Mock de carrito con items
            Cart.findOne.mockReturnValue({
                lean: vi.fn().mockResolvedValue({
                    products: [{ product: validProductId, quantity: 2 }]
                })
            });

            // Mock de producto con stock y precio
            Product.find.mockReturnValue({ lean: () => vi.fn().mockResolvedValue([{ _id: validProductId, price: 100, stock: 10 }])() });
            Product.findOneAndUpdate.mockResolvedValue({ _id: validProductId });

            // Mock de creación de orden
            const mockOrder = {
                _id: 'o_test',
                totalPrice: 200,
                populate: vi.fn().mockReturnThis()
            };
            Order.create.mockResolvedValue(mockOrder);
            Cart.updateOne.mockResolvedValue({});

            const response = await request(app)
                .post('/api/orders/checkout')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    shippingAddress: validAddrId,
                    paymentMethod: validPMId
                });

            if (response.status !== 201) console.log('Checkout Error:', response.body);
            expect(response.status).toBe(201);
            expect(Order.create).toHaveBeenCalled();
            expect(Cart.updateOne).toHaveBeenCalledWith({ user: validUserId }, { $set: { products: [] } });
        });
    });

    describe('GET /api/orders/:id (Owner Security)', () => {
        it('debe retornar 403 si un usuario intenta ver una orden de otro', async () => {
            const otherUserId = '65d100000000000000000099';
            const validOrderId = '65d100000000000000000005';
            const mockOrder = {
                _id: validOrderId,
                user: otherUserId,
            };

            const mockChain = {
                populate: vi.fn().mockReturnThis(),
                lean: vi.fn().mockResolvedValue(mockOrder)
            };
            Order.findById.mockReturnValue(mockChain);

            const response = await request(app)
                .get(`/api/orders/${validOrderId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(403);
            expect(response.body.message).toBe('Forbidden');
        });
    });
});
