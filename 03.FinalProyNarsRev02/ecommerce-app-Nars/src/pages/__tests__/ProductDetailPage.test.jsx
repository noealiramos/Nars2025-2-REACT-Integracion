import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const { navigateMock, addItemMock, getProductByIdMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  addItemMock: vi.fn(),
  getProductByIdMock: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../../services/productService", () => ({
  getProductById: getProductByIdMock,
}));

vi.mock("../../contexts/CartContext", () => ({
  useCart: () => ({ addItem: addItemMock }),
}));

vi.mock("../../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { ProductDetailPage } from "../ProductDetailPage";
import { useAuth } from "../../contexts/AuthContext";

const baseProduct = {
  id: "prod-1",
  _id: "mongo-1",
  name: "Anillo QA",
  description: "Descripcion",
  price: 199,
  stock: 5,
  image: "/ring.jpg",
};

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/product/prod-1"]}>
      <Routes>
        <Route path="/product/:id" element={<ProductDetailPage />} />
      </Routes>
    </MemoryRouter>
  );

describe("ProductDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getProductByIdMock.mockResolvedValue(baseProduct);
  });

  it("permite agregar cuando hay auth y stock", async () => {
    const user = userEvent.setup();
    useAuth.mockReturnValue({ isAuthenticated: true });

    renderPage();

    const button = await screen.findByTestId("add-to-cart-detail");
    expect(button).toBeEnabled();
    expect(button).toHaveTextContent("Agregar al carrito");

    await user.click(button);

    expect(addItemMock).toHaveBeenCalledWith(baseProduct, 1);
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("oculta el CTA de carrito y ofrece login cuando no hay auth y si hay stock", async () => {
    const user = userEvent.setup();
    useAuth.mockReturnValue({ isAuthenticated: false });

    renderPage();

    await screen.findByText(baseProduct.name);
    expect(screen.queryByTestId("add-to-cart-detail")).not.toBeInTheDocument();
    const button = screen.getByTestId("login-to-buy-detail");

    await user.click(button);

    expect(navigateMock).toHaveBeenCalledWith("/login");
    expect(addItemMock).not.toHaveBeenCalled();
  });

  it("muestra agotado y bloquea agregado cuando stock es 0", async () => {
    const user = userEvent.setup();
    useAuth.mockReturnValue({ isAuthenticated: true });
    getProductByIdMock.mockResolvedValue({ ...baseProduct, stock: 0 });

    renderPage();

    await screen.findByText(baseProduct.name);
    expect(screen.queryByTestId("add-to-cart-detail")).not.toBeInTheDocument();
    expect(screen.getByTestId("stock-state-detail")).toHaveTextContent("Agotado");
    expect(screen.getByText("Stock disponible: 0")).toBeInTheDocument();

    expect(addItemMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("aplica coercion correcta para stock string disponible", async () => {
    useAuth.mockReturnValue({ isAuthenticated: true });
    getProductByIdMock.mockResolvedValue({ ...baseProduct, stock: "3" });

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("add-to-cart-detail")).toBeEnabled();
    });
    expect(screen.getByText("Stock disponible: 3")).toBeInTheDocument();
  });

  it("aplica coercion correcta para stock string agotado", async () => {
    useAuth.mockReturnValue({ isAuthenticated: true });
    getProductByIdMock.mockResolvedValue({ ...baseProduct, stock: "0" });

    renderPage();

    await waitFor(() => {
      expect(screen.queryByTestId("add-to-cart-detail")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Stock disponible: 0")).toBeInTheDocument();
  });

  it("trata stock undefined como no disponible", async () => {
    useAuth.mockReturnValue({ isAuthenticated: true });
    getProductByIdMock.mockResolvedValue({ ...baseProduct, stock: undefined });

    renderPage();

    await waitFor(() => {
      expect(screen.queryByTestId("add-to-cart-detail")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Stock disponible: 0")).toBeInTheDocument();
  });

  it("trata stock invalido como no disponible", async () => {
    useAuth.mockReturnValue({ isAuthenticated: true });
    getProductByIdMock.mockResolvedValue({ ...baseProduct, stock: "foo" });

    renderPage();

    await waitFor(() => {
      expect(screen.queryByTestId("add-to-cart-detail")).not.toBeInTheDocument();
    });
  });
});
