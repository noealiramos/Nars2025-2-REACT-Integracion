import { categoryApi } from "../api/categoryApi";
import { logger } from "../utils/logger";

export const fetchCategories = async () => {
  try {
    const data = await categoryApi.getAll();
    return Array.isArray(data) ? data : data.categories || [];
  } catch (error) {
    logger.error("categoryService", "Failed to fetch categories", error.response?.data || error.message);
    return [];
  }
};
