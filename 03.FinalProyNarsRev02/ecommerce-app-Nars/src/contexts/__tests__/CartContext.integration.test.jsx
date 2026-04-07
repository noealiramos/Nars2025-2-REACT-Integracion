import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { CartProvider, useCart } from "../CartContext";
import { cartApi } from "../../api/cartApi";
import { useAuth } from "../AuthContext";
import { UIProvider } from "../UIContext";

vi.mock("../../api/cartApi", () => ({
  cartApi: {
    getCurrent: vi.fn(),
    addProduct: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock("../AuthContext", () => ({
  useAuth: vi.fn(),
}));

const wrapper = ({ children }) => (
  <UIProvider>
    <CartProvider>{children}</CartProvider>
  </UIProvider>
);

describe("CartContext integration", () => {
  const authState = { isAuthenticated: false };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useAuth.mockImplementation(() => authState);
  });

  it("mantiene carrito vacio cuando no está autenticado", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
    expect(cartApi.getCurrent).not.toHaveBeenCalled();
  });

  it("usa backend como fuente de verdad cuando está autenticado", async () => {
    authState.isAuthenticated = true;
    cartApi.getCurrent.mockResolvedValue({
      _id: "c1",
      products: [
        {
          product: { _id: "p1", name: "Anillo", price: 120, imagesUrl: ["img"] },
          quantity: 1,
        },
      ],
    });

    const { result } = renderHook(() => useCart(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(cartApi.getCurrent).toHaveBeenCalled();
    expect(result.current.items[0]).toMatchObject({
      id: "p1",
      name: "Anillo",
      price: 120,
      quantity: 1,
    });
  });

  it("carga carrito backend al iniciar sesión sin depender de persistencia local", async () => {
    cartApi.getCurrent.mockResolvedValue({ _id: "c1", products: [] });

    const { rerender } = renderHook(() => useCart(), { wrapper });

    authState.isAuthenticated = true;
    rerender();

    await waitFor(() => expect(cartApi.getCurrent).toHaveBeenCalledTimes(1));
    expect(cartApi.addProduct).not.toHaveBeenCalled();
  });

  it("expone estado error cuando falla la carga", async () => {
    authState.isAuthenticated = true;
    cartApi.getCurrent.mockRejectedValue(new Error("fail"));

    const { result } = renderHook(() => useCart(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe("fail");
  });

  it("no elimina el carrito persistente en backend al logout", async () => {
    authState.isAuthenticated = true;
    cartApi.getCurrent.mockResolvedValue({
      _id: "c1",
      products: [{ product: { _id: "p1", name: "Item", price: 10 }, quantity: 1 }],
    });

    const { result, rerender } = renderHook(() => useCart(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    authState.isAuthenticated = false;
    rerender();

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(cartApi.update).not.toHaveBeenCalled();
    expect(cartApi.remove).not.toHaveBeenCalled();
    expect(result.current.items).toHaveLength(0);
  });

  it("actualiza cantidades y totales con backend", async () => {
    authState.isAuthenticated = true;
    cartApi.getCurrent.mockResolvedValue({
      _id: "c1",
      products: [{ product: { _id: "p1", name: "Item", price: 10, stock: 5 }, quantity: 1 }],
    });
    cartApi.update.mockResolvedValue({
      _id: "c1",
      products: [{ product: { _id: "p1", name: "Item", price: 10, stock: 5 }, quantity: 3 }],
    });

    const { result } = renderHook(() => useCart(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.updateQuantity("p1", 3);
    });

    expect(cartApi.update).toHaveBeenCalled();
    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalPrice).toBe(30);
  });
});
