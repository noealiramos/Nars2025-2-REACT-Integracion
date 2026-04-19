import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../api/categoryApi";
import { useUI } from "../contexts/UIContext";

export function useAdminCategories(page = 1) {
  const queryClient = useQueryClient();
  const { dispatch } = useUI();
  const pageSize = 10;

  const categoriesQuery = useQuery({
    queryKey: ["admin-categories", page],
    queryFn: () => categoryApi.getAll({ page, limit: pageSize, sort: "name", order: "asc" }),
  });

  const parentOptionsQuery = useQuery({
    queryKey: ["admin-categories-parent-options"],
    queryFn: () => categoryApi.getAll({ limit: 100, sort: "name", order: "asc" }),
  });

  const invalidateCategories = () => queryClient.invalidateQueries({ queryKey: ["admin-categories"] });

  const saveCategoryMutation = useMutation({
    mutationFn: async ({ id, payload }) => (id ? categoryApi.update(id, payload) : categoryApi.create(payload)),
    onSuccess: async (_data, variables) => {
      dispatch({
        type: "SHOW_MESSAGE",
        payload: { type: "success", text: variables.id ? "Categoría actualizada correctamente." : "Categoría creada correctamente." },
      });
      await invalidateCategories();
    },
    onError: (error) => {
      dispatch({
        type: "SHOW_MESSAGE",
        payload: { type: "error", text: error.response?.data?.message || "No pudimos guardar la categoría." },
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: categoryApi.remove,
    onSuccess: async () => {
      dispatch({ type: "SHOW_MESSAGE", payload: { type: "success", text: "Categoría eliminada correctamente." } });
      await invalidateCategories();
    },
    onError: (error) => {
      dispatch({
        type: "SHOW_MESSAGE",
        payload: { type: "error", text: error.response?.data?.message || "No pudimos eliminar la categoría." },
      });
    },
  });

  return {
    categories: Array.isArray(categoriesQuery.data?.categories) ? categoriesQuery.data.categories : [],
    pagination: categoriesQuery.data?.pagination || {
      currentPage: page,
      totalPages: 1,
      totalResults: 0,
      hasNext: false,
      hasPrev: false,
    },
    parentOptions: Array.isArray(parentOptionsQuery.data?.categories) ? parentOptionsQuery.data.categories : [],
    isLoading: categoriesQuery.isLoading,
    isError: categoriesQuery.isError || parentOptionsQuery.isError,
    refetch: categoriesQuery.refetch,
    saveCategory: saveCategoryMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    isSaving: saveCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
  };
}
