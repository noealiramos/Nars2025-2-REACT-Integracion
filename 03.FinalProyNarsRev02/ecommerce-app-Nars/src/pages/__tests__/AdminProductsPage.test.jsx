import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { UIProvider } from "../../contexts/UIContext";

const { getAllProductsMock, createProductMock, updateProductMock, removeProductMock, getAllCategoriesMock, uploadProductImageMock } = vi.hoisted(() => ({
  getAllProductsMock: vi.fn(),
  createProductMock: vi.fn(),
  updateProductMock: vi.fn(),
  removeProductMock: vi.fn(),
  getAllCategoriesMock: vi.fn(),
  uploadProductImageMock: vi.fn(),
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

vi.mock("../../api/uploadApi", () => ({
  uploadApi: {
    uploadProductImage: uploadProductImageMock,
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
const paginatedProductsResponse = ({ products, currentPage = 1, totalPages = 1, totalResults = products.length, hasNext = false, hasPrev = false }) => ({
  products,
  pagination: {
    currentPage,
    totalPages,
    totalResults,
    hasNext,
    hasPrev,
  },
});

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
    getAllProductsMock.mockImplementation(async (params = {}) => {
      if (params.page === 2) {
        return paginatedProductsResponse({
          products: [{ ...product, _id: "prod-2", name: "Collar" }],
          currentPage: 2,
          totalPages: 2,
          totalResults: 2,
          hasNext: false,
          hasPrev: true,
        });
      }

      return paginatedProductsResponse({
        products: [product],
        currentPage: 1,
        totalPages: 2,
        totalResults: 2,
        hasNext: true,
        hasPrev: false,
      });
    });
    getAllCategoriesMock.mockResolvedValue({ categories: [category] });
    createProductMock.mockResolvedValue({ ...product, _id: "prod-2", name: "Nuevo" });
    updateProductMock.mockResolvedValue({ ...product, name: "Actualizado" });
    removeProductMock.mockResolvedValue({ status: "ok" });
    uploadProductImageMock.mockResolvedValue({ imageUrl: "https://example.com/uploaded.jpg", publicId: "cloudinary-1" });
  });

  it("lista productos existentes", async () => {
    renderPage();
    expect(await screen.findByTestId("admin-products-list")).toBeInTheDocument();
    expect(screen.getByText("Anillo")).toBeInTheDocument();
    expect(screen.getByTestId("admin-product-image-prod-1")).toHaveAttribute("src", "https://example.com/a.jpg");
    expect(getAllProductsMock).toHaveBeenCalledWith({ page: 1, limit: 10 });
    expect(screen.getByTestId("admin-products-pagination-text")).toHaveTextContent("Pagina 1 de 2");
    expect(screen.queryByText(/URL lista:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/puedes pegar una URL manual/i)).not.toBeInTheDocument();
  });

  it("permite navegar a la siguiente pagina", async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByTestId("admin-products-list");
    await user.click(screen.getByTestId("admin-products-next"));

    await waitFor(() => {
      expect(getAllProductsMock).toHaveBeenLastCalledWith({ page: 2, limit: 10 });
    });

    expect(await screen.findByText("Collar")).toBeInTheDocument();
    expect(screen.getByTestId("admin-products-pagination-text")).toHaveTextContent("Pagina 2 de 2");
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

  it("retrocede de pagina si se elimina el ultimo producto visible", async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByTestId("admin-products-list");
    await user.click(screen.getByTestId("admin-products-next"));
    expect(await screen.findByText("Collar")).toBeInTheDocument();

    await user.click(screen.getByTestId("admin-delete-prod-2"));

    await waitFor(() => {
      expect(getAllProductsMock).toHaveBeenLastCalledWith({ page: 1, limit: 10 });
    });
  });

  it("sube una imagen y usa la URL retornada", async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByTestId("admin-products-list");
    const file = new File(["img"], "product.png", { type: "image/png" });

    await user.upload(screen.getByTestId("admin-product-file"), file);
    await user.click(screen.getByTestId("admin-upload-image"));

    await waitFor(() => {
      expect(uploadProductImageMock).toHaveBeenCalledWith(file);
    });

    expect(await screen.findByText(/Imagen subida correctamente/)).toBeInTheDocument();
    expect(screen.getByTestId("input-admin-image")).toHaveValue("https://example.com/uploaded.jpg");
  });
});
