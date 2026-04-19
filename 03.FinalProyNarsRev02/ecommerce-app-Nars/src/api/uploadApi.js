import { apiClient } from "./apiClient";

export const uploadApi = {
  uploadProductImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data?.data || response.data;
  },
};
