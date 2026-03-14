import { categoryApi } from "../api/categoryApi";

export const fetchCategories = async () => {
  try {
    const data = await categoryApi.getAll();
    return Array.isArray(data) ? data : data.categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};