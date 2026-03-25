import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CheckoutPage } from "../CheckoutPage";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../../contexts/CartContext", () => ({
  useCart: vi.fn(),
}));

vi.mock("../../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const renderPage = () =>
  render(
    <MemoryRouter>
      <CheckoutPage />
    </MemoryRouter>
  );

describe("CheckoutPage", () => {
  it("no navega mientras carga carrito", () => {
    useCart.mockReturnValue({
      items: [],
      totalPrice: 0,
      clearCart: vi.fn(),
      isLoading: true,
    });
    useAuth.mockReturnValue({ user: { displayName: "Test" } });

    renderPage();

    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("redirige si carrito vacío y no está cargando", () => {
    useCart.mockReturnValue({
      items: [],
      totalPrice: 0,
      clearCart: vi.fn(),
      isLoading: false,
    });
    useAuth.mockReturnValue({ user: { displayName: "Test" } });

    renderPage();

    expect(navigateMock).toHaveBeenCalledWith("/");
  });
});
