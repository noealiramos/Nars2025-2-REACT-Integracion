import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

const {
  fetchProductsPaginatedMock,
  searchProductsPaginatedMock,
  addItemMock,
  dispatchMock,
} = vi.hoisted(() => ({
  fetchProductsPaginatedMock: vi.fn(),
  searchProductsPaginatedMock: vi.fn(),
  addItemMock: vi.fn(),
  dispatchMock: vi.fn(),
}));

vi.mock("../../services/productService", () => ({
  fetchProductsPaginated: fetchProductsPaginatedMock,
  searchProductsPaginated: searchProductsPaginatedMock,
}));

vi.mock("../../contexts/CartContext", () => ({
  useCart: () => ({ addItem: addItemMock }),
}));

vi.mock("../../contexts/UIContext", () => ({
  useUI: () => ({ dispatch: dispatchMock }),
}));

vi.mock("../../components/organisms/ProductList", () => ({
  ProductList: ({ products }) => (
    <div data-testid="product-list-mock">
      {products.map((product) => (
        <span key={product.id}>{product.name}</span>
      ))}
    </div>
  ),
}));

import { HomePage } from "../HomePage";

const createProducts = (prefix, count) =>
  Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index + 1}`,
    name: `${prefix} ${index + 1}`,
    price: 100 + index,
  }));

const renderPage = (initialEntry = "/") => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <HomePage />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchProductsPaginatedMock.mockResolvedValue({
      products: createProducts("Producto", 10),
      pagination: {
        currentPage: 1,
        totalPages: 3,
        totalResults: 21,
        hasNext: true,
        hasPrev: false,
      },
    });
    searchProductsPaginatedMock.mockResolvedValue({
      products: createProducts("Busqueda", 2),
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalResults: 2,
        hasNext: false,
        hasPrev: false,
      },
    });
  });

  it("renderiza productos y controles de paginacion para Home", async () => {
    renderPage();

    expect(await screen.findByTestId("product-list-mock")).toBeInTheDocument();
    expect(fetchProductsPaginatedMock).toHaveBeenCalledWith({ page: 1, limit: 10 });
    expect(screen.getByTestId("home-pagination-text")).toHaveTextContent("Pagina 1 de 3");
    expect(screen.getByTestId("home-pagination-prev")).toBeDisabled();
    expect(screen.getByTestId("home-pagination-next")).not.toBeDisabled();
  });

  it("permite navegar a la siguiente pagina", async () => {
    const user = userEvent.setup();

    fetchProductsPaginatedMock
      .mockResolvedValueOnce({
        products: createProducts("Producto", 10),
        pagination: {
          currentPage: 1,
          totalPages: 3,
          totalResults: 21,
          hasNext: true,
          hasPrev: false,
        },
      })
      .mockResolvedValueOnce({
        products: createProducts("Pagina 2", 10),
        pagination: {
          currentPage: 2,
          totalPages: 3,
          totalResults: 21,
          hasNext: true,
          hasPrev: true,
        },
      });

    renderPage();

    await screen.findByTestId("product-list-mock");
    await user.click(screen.getByTestId("home-pagination-next"));

    await waitFor(() => {
      expect(fetchProductsPaginatedMock).toHaveBeenLastCalledWith({ page: 2, limit: 10 });
    });

    expect(await screen.findByText("Pagina 2 1")).toBeInTheDocument();
    expect(screen.getByTestId("home-pagination-text")).toHaveTextContent("Pagina 2 de 3");
    expect(screen.getByTestId("home-pagination-prev")).not.toBeDisabled();
  });

  it("usa la variante paginada de busqueda sin romper el flujo", async () => {
    renderPage("/?search=anillo");

    expect(await screen.findByTestId("product-list-mock")).toBeInTheDocument();
    expect(searchProductsPaginatedMock).toHaveBeenCalledWith("anillo", { page: 1, limit: 10 });
    expect(fetchProductsPaginatedMock).not.toHaveBeenCalled();
    expect(screen.queryByTestId("home-pagination")).not.toBeInTheDocument();
  });
});
