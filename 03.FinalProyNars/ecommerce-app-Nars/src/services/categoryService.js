import { apiClient } from "./apiClient";

export const fetchCategories = async () => {
  const response = await apiClient("/categories");
  if (!response.success) {
    // Si falla el backend, intentamos devolver un array vacío o manejar el error
    throw new Error(response.error || "Error al obtener categorías");
  }
  return response.data;
};