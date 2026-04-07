import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SiteHeader } from "../SiteHeader";
import { useCart } from "../../../contexts/CartContext";
import { useAuth } from "../../../contexts/AuthContext";

vi.mock("../../../contexts/CartContext", () => ({
  useCart: vi.fn(),
}));

vi.mock("../../../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const renderHeader = () =>
  render(
    <MemoryRouter>
      <SiteHeader />
    </MemoryRouter>
  );

describe("SiteHeader", () => {
  it("refleja el contador del carrito", () => {
    useCart.mockReturnValue({ totalItems: 3 });
    useAuth.mockReturnValue({ isAuthenticated: false, user: null, logout: vi.fn() });

    renderHeader();

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("muestra acceso a perfil cuando el usuario esta autenticado", () => {
    useCart.mockReturnValue({ totalItems: 0 });
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { displayName: "Jane Doe" },
      logout: vi.fn(),
    });

    renderHeader();

    expect(screen.getByTestId("nav-profile")).toHaveAttribute("href", "/profile");
    expect(screen.getByText("Hola,")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("muestra acceso admin cuando el usuario tiene rol admin", () => {
    useCart.mockReturnValue({ totalItems: 0 });
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { displayName: "Admin", role: "admin" },
      logout: vi.fn(),
    });

    renderHeader();

    expect(screen.getByTestId("nav-admin-products")).toHaveAttribute("href", "/admin/products");
    expect(screen.getByTestId("nav-admin-categories")).toHaveAttribute("href", "/admin/categories");
  });

  it("muestra acceso a wishlist cuando el usuario esta autenticado", () => {
    useCart.mockReturnValue({ totalItems: 0 });
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { displayName: "Jane Doe" },
      logout: vi.fn(),
    });

    renderHeader();

    expect(screen.getByTestId("nav-wishlist")).toHaveAttribute("href", "/wishlist");
  });
});
