import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createOrder, checkoutFromCart } from '../../../src/controllers/orderController.js';
import Order from '../../../src/models/order.js';
import Product from '../../../src/models/product.js';
import Cart from '../../../src/models/cart.js';
import ShippingAddress from '../../../src/models/shippingAddress.js';
import PaymentMethod from '../../../src/models/paymentMethod.js';
import { createMockReqRes } from '../../testUtils.js';

vi.mock('../../../src/models/order.js');
vi.mock('../../../src/models/product.js');
vi.mock('../../../src/models/cart.js');
vi.mock('../../../src/models/shippingAddress.js');
vi.mock('../../../src/models/paymentMethod.js');

describe('orderController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createOrder', () => {
        it('debe retornar 404 si la direccion de envio no existe', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u123' },
                body: {
                    products: [{ productId: 'p1', quantity: 1 }],
                    shippingAddress: 'addr123',
                    paymentMethod: 'pm123'
                }
            });

            ShippingAddress.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) });
            PaymentMethod.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue({ user: 'u123' }) });

            await createOrder(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Shipping address not found' }));
        });

        it('debe calcular el precio total sumando subtotal y shippingCost', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u123' },
                body: {
                    products: [{ productId: 'p1', quantity: 2 }],
                    shippingAddress: 'addr123',
                    paymentMethod: 'pm123',
                    shippingCost: 50
                }
            });

            ShippingAddress.findById.mockReturnValue({ lean: () => vi.fn().mockResolvedValue({ user: 'u123' })() });
            PaymentMethod.findById.mockReturnValue({ lean: () => vi.fn().mockResolvedValue({ user: 'u123', active: true })() });
            Product.find.mockReturnValue({ lean: () => vi.fn().mockResolvedValue([{ _id: 'p1', price: 100 }])() });

            Order.create.mockResolvedValue({
                populate: vi.fn().mockReturnThis()
            });

            await createOrder(req, res, next);

            expect(Order.create).toHaveBeenCalledWith(expect.objectContaining({
                totalPrice: 250 // (100 * 2) + 50
            }));
        });
    });

    describe('checkoutFromCart - Stock Rollback Logic', () => {
        it('debe realizar rollback de stock si un producto intermedio falla por falta de existencias', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u123' },
                body: { shippingAddress: 'addr1', paymentMethod: 'pm1' }
            });

            // Mocks de validación inicial
            ShippingAddress.findById.mockReturnValue({ lean: () => vi.fn().mockResolvedValue({ user: 'u123' })() });
            PaymentMethod.findById.mockReturnValue({ lean: () => vi.fn().mockResolvedValue({ user: 'u123', active: true })() });

            // Carrito con 2 productos
            Cart.findOne.mockReturnValue({
                lean: () => vi.fn().mockResolvedValue({
                    products: [
                        { product: 'p1', quantity: 5 },
                        { product: 'p2', quantity: 10 }
                    ]
                })()
            });

            // Productos con stock suficiente inicialmente
            Product.find.mockReturnValue({
                lean: () => vi.fn().mockResolvedValue([
                    { _id: 'p1', price: 10, stock: 100 },
                    { _id: 'p2', price: 20, stock: 100 }
                ])()
            });

            // Simular que p1 se decrementa bien, pero p2 falla entre el find y el update (concurrencia sim)
            Product.findOneAndUpdate
                .mockResolvedValueOnce({ _id: 'p1' }) // p1 ok
                .mockResolvedValueOnce(null);         // p2 falla (stock insuficiente o no encontrado)

            await checkoutFromCart(req, res, next);

            // Verificamos el rollback: p1 debe ser incrementado de nuevo
            expect(Product.updateOne).toHaveBeenCalledWith(
                { _id: 'p1' },
                { $inc: { stock: 5 } }
            );
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Insufficient stock for product p2' }));
        });
    });
});
