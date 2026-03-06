import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../contexts/CartContext';

// Mock de storageHelpers para no depender de localStorage real
vi.mock('../utils/storageHelpers', () => ({
    STORAGE_KEYS: { cart: 'cart' },
    readLocalJSON: vi.fn(() => []),
    writeLocalJSON: vi.fn(),
}));

describe('CartContext', () => {
    const product = { id: '1', name: 'Anillo Oro', price: 1000 };

    it('debería comenzar con un carrito vacío', () => {
        const { result } = renderHook(() => useCart(), {
            wrapper: CartProvider,
        });

        expect(result.current.items).toEqual([]);
        expect(result.current.totalItems).toBe(0);
        expect(result.current.totalPrice).toBe(0);
    });

    it('debería agregar un producto correctamente', () => {
        const { result } = renderHook(() => useCart(), {
            wrapper: CartProvider,
        });

        act(() => {
            result.current.addItem(product, 1);
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].id).toBe('1');
        expect(result.current.totalPrice).toBe(1000);
    });

    it('debería sumar cantidades si se agrega el mismo producto', () => {
        const { result } = renderHook(() => useCart(), {
            wrapper: CartProvider,
        });

        act(() => {
            result.current.addItem(product, 1);
            result.current.addItem(product, 2);
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].quantity).toBe(3);
        expect(result.current.totalPrice).toBe(3000);
    });

    it('debería eliminar un producto', () => {
        const { result } = renderHook(() => useCart(), {
            wrapper: CartProvider,
        });

        act(() => {
            result.current.addItem(product, 1);
        });

        act(() => {
            result.current.removeItem('1');
        });

        expect(result.current.items).toHaveLength(0);
    });
});
