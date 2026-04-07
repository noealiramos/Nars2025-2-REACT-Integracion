import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const { navigateMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
}));
const { addToWishlistMock } = vi.hoisted(() => ({
  addToWishlistMock: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../../../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../../hooks/useWishlistActions", () => ({
  useWishlistActions: () => ({
    addToWishlist: addToWishlistMock,
    isMutating: false,
  }),
}));

import { ProductCard } from "../ProductCard";
import { useAuth } from "../../../contexts/AuthContext";

const baseProduct = {
  id: "prod-1",
  _id: "mongo-1",
  name: "Anillo QA",
  price: 199,
  stock: 5,
  image: "/ring.jpg",
};

const renderCard = (product = baseProduct, onAddToCart = vi.fn()) =>
  render(
    <MemoryRouter>
      <ProductCard product={product} onAddToCart={onAddToCart} />
    </MemoryRouter>
  );

describe("ProductCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    addToWishlistMock.mockResolvedValue({ products: [] });
  });

  it("habilita el CTA y permite agregar cuando hay auth y stock", async () => {
    const user = userEvent.setup();
    const onAddToCart = vi.fn();
    useAuth.mockReturnValue({ isAuthenticated: true });

    renderCard(baseProduct, onAddToCart);

    const button = screen.getByTestId("add-to-cart-prod-1");
    expect(button).toBeEnabled();
    expect(button).toHaveTextContent("Agregar al carrito");

    await user.click(button);

    expect(onAddToCart).toHaveBeenCalledWith(baseProduct);
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("oculta el CTA de carrito y ofrece login cuando no hay auth pero si stock", async () => {
    const user = userEvent.setup();
    const onAddToCart = vi.fn();
    useAuth.mockReturnValue({ isAuthenticated: false });

    renderCard(baseProduct, onAddToCart);

    expect(screen.queryByTestId("add-to-cart-prod-1")).not.toBeInTheDocument();
    const button = screen.getByTestId("login-to-buy-prod-1");
    expect(button).toHaveTextContent("Inicia sesion para comprar");

    await user.click(button);

    expect(navigateMock).toHaveBeenCalledWith("/login");
    expect(onAddToCart).not.toHaveBeenCalled();
  });

  it("muestra agotado y bloquea accion cuando stock es 0", async () => {
    const onAddToCart = vi.fn();
    useAuth.mockReturnValue({ isAuthenticated: true });

    renderCard({ ...baseProduct, stock: 0 }, onAddToCart);

    expect(screen.queryByTestId("add-to-cart-prod-1")).not.toBeInTheDocument();
    expect(screen.getByTestId("stock-state-prod-1")).toHaveTextContent("Agotado");

    expect(onAddToCart).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("aplica coercion correcta para stock string", () => {
    useAuth.mockReturnValue({ isAuthenticated: true });

    const { rerender } = render(
      <MemoryRouter>
        <ProductCard product={{ ...baseProduct, stock: "3" }} onAddToCart={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("add-to-cart-prod-1")).toBeEnabled();

    rerender(
      <MemoryRouter>
        <ProductCard product={{ ...baseProduct, stock: "0" }} onAddToCart={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.queryByTestId("add-to-cart-prod-1")).not.toBeInTheDocument();
    expect(screen.getByTestId("stock-state-prod-1")).toHaveTextContent("Agotado");
  });

  it("trata stock undefined o invalido como no disponible", () => {
    useAuth.mockReturnValue({ isAuthenticated: true });

    const { rerender } = render(
      <MemoryRouter>
        <ProductCard product={{ ...baseProduct, stock: undefined }} onAddToCart={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.queryByTestId("add-to-cart-prod-1")).not.toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <ProductCard product={{ ...baseProduct, stock: "abc" }} onAddToCart={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.queryByTestId("add-to-cart-prod-1")).not.toBeInTheDocument();
    expect(screen.getByTestId("stock-state-prod-1")).toHaveTextContent("Agotado");
  });

  it("agrega a wishlist cuando el usuario esta autenticado", async () => {
    const user = userEvent.setup();
    useAuth.mockReturnValue({ isAuthenticated: true });

    renderCard(baseProduct, vi.fn());

    await user.click(screen.getByTestId("add-to-wishlist-prod-1"));

    expect(addToWishlistMock).toHaveBeenCalledWith("prod-1");
  });

  it("redirige a login al intentar wishlist sin auth", async () => {
    const user = userEvent.setup();
    useAuth.mockReturnValue({ isAuthenticated: false });

    renderCard(baseProduct, vi.fn());

    await user.click(screen.getByTestId("add-to-wishlist-prod-1"));

    expect(navigateMock).toHaveBeenCalledWith("/login");
    expect(addToWishlistMock).not.toHaveBeenCalled();
  });
});
