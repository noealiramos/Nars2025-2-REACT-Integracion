import { apiClient } from "./apiClient";

export const authApi = {
  me: async () => {
    const response = await apiClient.get("/users/me");
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  },

  logout: async (refreshToken) => {
    const response = await apiClient.post("/auth/logout", { refreshToken });
    return response.data;
  },

  refresh: async (refreshToken) => {
    const response = await apiClient.post("/auth/refresh", { refreshToken });
    return response.data;
  },
};
