import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const {
  useAdminCategoriesMock,
} = vi.hoisted(() => ({
  useAdminCategoriesMock: vi.fn(),
}));

let saveCategoryMock;
let deleteCategoryMock;

vi.mock("../../hooks/useAdminCategories", () => ({
  useAdminCategories: useAdminCategoriesMock,
}));

import { AdminCategoriesPage } from "../AdminCategoriesPage";

const pageOneCategories = [
  { _id: "cat-1", name: "Anillos", description: "Desc 1", parentCategory: null },
];

const pageTwoCategories = [
  { _id: "cat-2", name: "Pulseras", description: "Desc 2", parentCategory: null },
];

const allParentOptions = [
  { _id: "cat-1", name: "Anillos" },
  { _id: "cat-2", name: "Pulseras" },
  { _id: "cat-3", name: "Collares" },
];

const renderPage = () =>
  render(
    <MemoryRouter>
      <AdminCategoriesPage />
    </MemoryRouter>
  );

describe("AdminCategoriesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    saveCategoryMock = vi.fn().mockResolvedValue({});
    deleteCategoryMock = vi.fn().mockResolvedValue({});

    useAdminCategoriesMock.mockImplementation((page = 1) => ({
      categories: page === 2 ? pageTwoCategories : pageOneCategories,
      pagination: {
        currentPage: page,
        totalPages: 2,
        totalResults: 2,
        hasNext: page < 2,
        hasPrev: page > 1,
      },
      parentOptions: allParentOptions,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      saveCategory: saveCategoryMock,
      deleteCategory: deleteCategoryMock,
      isSaving: false,
      isDeleting: false,
    }));
  });

  it("renderiza lista y paginacion visible", async () => {
    renderPage();

    const list = screen.getByTestId("admin-categories-list");
    expect(list).toBeInTheDocument();
    expect(within(list).getByText("Anillos")).toBeInTheDocument();
    expect(screen.getByTestId("admin-categories-pagination-text")).toHaveTextContent("Pagina 1 de 2");
    expect(screen.getByTestId("admin-categories-prev")).toBeDisabled();
  });

  it("permite navegar a la siguiente pagina", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByTestId("admin-categories-next"));

    await waitFor(() => {
      expect(useAdminCategoriesMock).toHaveBeenLastCalledWith(2);
    });

    expect(within(screen.getByTestId("admin-categories-list")).getByText("Pulseras")).toBeInTheDocument();
    expect(screen.getByTestId("admin-categories-pagination-text")).toHaveTextContent("Pagina 2 de 2");
  });

  it("mantiene parentOptions completas aunque cambie la pagina", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByTestId("admin-categories-next"));

    expect(within(screen.getByTestId("admin-categories-list")).getByText("Pulseras")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Collares" })).toBeInTheDocument();
  });

  it("retrocede de pagina si se elimina el ultimo elemento visible", async () => {
    const user = userEvent.setup();
    deleteCategoryMock = vi.fn().mockResolvedValue({});

    useAdminCategoriesMock.mockImplementation((page = 1) => ({
      categories: page === 2 ? pageTwoCategories : pageOneCategories,
      pagination: {
        currentPage: page,
        totalPages: 2,
        totalResults: 2,
        hasNext: page < 2,
        hasPrev: page > 1,
      },
      parentOptions: allParentOptions,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      saveCategory: saveCategoryMock,
      deleteCategory: deleteCategoryMock,
      isSaving: false,
      isDeleting: false,
    }));

    renderPage();

    await user.click(screen.getByTestId("admin-categories-next"));
    expect(within(screen.getByTestId("admin-categories-list")).getByText("Pulseras")).toBeInTheDocument();

    await user.click(screen.getByTestId("admin-category-delete-cat-2"));

    await waitFor(() => {
      expect(deleteCategoryMock).toHaveBeenCalledWith("cat-2");
      expect(useAdminCategoriesMock).toHaveBeenLastCalledWith(1);
    });
  });

  it("envia imageURL null cuando el campo queda vacio al crear", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByTestId("input-admin-category-name"), "Nueva categoria");
    await user.type(screen.getByTestId("admin-category-description"), "Descripcion de prueba");
    await user.click(screen.getByTestId("admin-save-category"));

    await waitFor(() => {
      expect(saveCategoryMock).toHaveBeenCalledWith({
        id: null,
        payload: expect.objectContaining({
          name: "Nueva categoria",
          description: "Descripcion de prueba",
          imageURL: null,
        }),
      });
    });
  });
});
