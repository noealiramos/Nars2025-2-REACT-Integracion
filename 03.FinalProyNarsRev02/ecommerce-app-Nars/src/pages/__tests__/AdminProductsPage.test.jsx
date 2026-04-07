import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { UIProvider } from "../../contexts/UIContext";

const { getAllProductsMock, createProductMock, updateProductMock, removeProductMock, getAllCategoriesMock } = vi.hoisted(() => ({
  getAllProductsMock: vi.fn(),
  createProductMock: vi.fn(),
  updateProductMock: vi.fn(),
  removeProductMock: vi.fn(),
  getAllCategoriesMock: vi.fn(),
}));

vi.mock("../../api/productApi", () => ({
  productApi: {
    getAll: getAllProductsMock,
    create: createProductMock,
    update: updateProductMock,
    remove: removeProductMock,
  },
}));

vi.mock("../../api/categoryApi", () => ({
  categoryApi: {
    getAll: getAllCategoriesMock,
  },
}));

import { AdminProductsPage } from "../AdminProductsPage";

const product = {
  _id: "prod-1",
  name: "Anillo",
  description: "Producto base",
  price: 120,
  stock: 5,
  category: { _id: "cat-1", name: "General" },
  material: "Plata",
  design: "Simple",
  imagesUrl: ["https://example.com/a.jpg"],
};

const category = { _id: "cat-1", name: "General" };

const renderPage = () =>
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <UIProvider>
        <MemoryRouter>
          <AdminProductsPage />
        </MemoryRouter>
      </UIProvider>
    </QueryClientProvider>
  );

describe("AdminProductsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAllProductsMock.mockResolvedValue({ products: [product] });
    getAllCategoriesMock.mockResolvedValue({ categories: [category] });
    createProductMock.mockResolvedValue({ ...product, _id: "prod-2", name: "Nuevo" });
    updateProductMock.mockResolvedValue({ ...product, name: "Actualizado" });
    removeProductMock.mockResolvedValue({ status: "ok" });
  });

  it("lista productos existentes", async () => {
    renderPage();
    expect(await screen.findByTestId("admin-products-list")).toBeInTheDocument();
    expect(screen.getByText("Anillo")).toBeInTheDocument();
  });

  it("crea un producto nuevo", async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByTestId("admin-products-list");
    await user.type(screen.getByTestId("input-admin-name"), "Nuevo");
    await user.type(screen.getByTestId("admin-product-description"), "Descripcion nueva");
    await user.type(screen.getByTestId("input-admin-price"), "150");
    await user.type(screen.getByTestId("input-admin-stock"), "7");
    await user.selectOptions(screen.getByTestId("admin-product-category"), "cat-1");
    await user.click(screen.getByTestId("admin-save-product"));

    await waitFor(() => {
      expect(createProductMock).toHaveBeenCalledWith(expect.objectContaining({ name: "Nuevo", category: "cat-1" }));
    });
  });

  it("carga un producto en modo edicion y actualiza", async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByTestId("admin-edit-prod-1");
    await user.click(screen.getByTestId("admin-edit-prod-1"));
    expect(screen.getByTestId("input-admin-name")).toHaveValue("Anillo");

    await user.clear(screen.getByTestId("input-admin-name"));
    await user.type(screen.getByTestId("input-admin-name"), "Actualizado");
    await user.click(screen.getByTestId("admin-save-product"));

    await waitFor(() => {
      expect(updateProductMock).toHaveBeenCalledWith("prod-1", expect.objectContaining({ name: "Actualizado" }));
    });
  });

  it("elimina un producto", async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByTestId("admin-delete-prod-1");
    await user.click(screen.getByTestId("admin-delete-prod-1"));

    await waitFor(() => {
      expect(removeProductMock).toHaveBeenCalledWith("prod-1");
    });
  });
});
