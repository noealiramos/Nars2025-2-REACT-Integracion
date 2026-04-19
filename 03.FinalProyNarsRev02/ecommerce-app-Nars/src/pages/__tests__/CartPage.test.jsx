import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartPage } from "../CartPage";
import { useCart } from "../../contexts/CartContext";

vi.mock("../../contexts/CartContext", () => ({
  useCart: vi.fn(),
}));

const renderPage = () =>
  render(
    <MemoryRouter>
      <CartPage />
    </MemoryRouter>
  );

describe("CartPage", () => {
  it("renderiza estado loading", () => {
    useCart.mockReturnValue({
      items: [],
      totalPrice: 0,
      updateQuantity: vi.fn(),
      removeItem: vi.fn(),
      clearCart: vi.fn(),
      isLoading: true,
      error: null,
      isGuestMode: false,
    });

    renderPage();
    expect(screen.getByText(/Cargando carrito/i)).toBeInTheDocument();
  });

  it("renderiza estado error", () => {
    useCart.mockReturnValue({
      items: [],
      totalPrice: 0,
      updateQuantity: vi.fn(),
      removeItem: vi.fn(),
      clearCart: vi.fn(),
      isLoading: false,
      error: "Algo falló",
      isGuestMode: false,
    });

    renderPage();
    expect(screen.getByText(/Algo falló/i)).toBeInTheDocument();
  });

  it("renderiza carrito vacío", () => {
    useCart.mockReturnValue({
      items: [],
      totalPrice: 0,
      updateQuantity: vi.fn(),
      removeItem: vi.fn(),
      clearCart: vi.fn(),
      isLoading: false,
      error: null,
      isGuestMode: false,
    });

    renderPage();
    expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
  });

  it("renderiza items correctamente", () => {
    useCart.mockReturnValue({
      items: [
        {
          id: "p1",
          name: "Anillo",
          price: 120,
          quantity: 2,
          image: "img",
        },
      ],
      totalPrice: 240,
      updateQuantity: vi.fn(),
      removeItem: vi.fn(),
      clearCart: vi.fn(),
      isLoading: false,
      error: null,
      isGuestMode: false,
    });

    renderPage();
    expect(screen.getByText(/Tienes 1 producto/i)).toBeInTheDocument();
    expect(screen.getByText(/Anillo/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Envío/i).length).toBeGreaterThan(0);
    expect(screen.getByText("$99.00")).toBeInTheDocument();
    expect(screen.getByText("$339.00")).toBeInTheDocument();
    expect(screen.queryByText(/IVA/i)).not.toBeInTheDocument();
  });

  it("renderiza estado invitado cuando el carrito no forma parte del flujo autenticado", () => {
    useCart.mockReturnValue({
      items: [],
      totalPrice: 0,
      updateQuantity: vi.fn(),
      removeItem: vi.fn(),
      clearCart: vi.fn(),
      isLoading: false,
      error: null,
      isGuestMode: true,
    });

    renderPage();
    expect(screen.getByText(/Inicia sesión para usar tu carrito/i)).toBeInTheDocument();
  });
});
