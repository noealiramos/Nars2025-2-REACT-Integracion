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
});
