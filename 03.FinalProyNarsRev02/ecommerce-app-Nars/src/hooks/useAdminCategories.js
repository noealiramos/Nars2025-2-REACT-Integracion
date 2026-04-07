import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../api/categoryApi";
import { useUI } from "../contexts/UIContext";

export function useAdminCategories() {
  const queryClient = useQueryClient();
  const { dispatch } = useUI();

  const categoriesQuery = useQuery({
    queryKey: ["admin-categories"],
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
    isLoading: categoriesQuery.isLoading,
    isError: categoriesQuery.isError,
    refetch: categoriesQuery.refetch,
    saveCategory: saveCategoryMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    isSaving: saveCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
  };
}
