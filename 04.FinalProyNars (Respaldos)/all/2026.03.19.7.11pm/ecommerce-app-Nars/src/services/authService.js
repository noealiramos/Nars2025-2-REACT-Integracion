import { authApi } from "../api/authApi";
import { STORAGE_KEYS } from "../utils/storageHelpers";
import { logger } from "../utils/logger";

export async function login(email, password) {
  try {
    const data = await authApi.login(email, password);
    
    // El backend devuelve { accessToken, refreshToken, user }
    if (data.accessToken) {
      localStorage.setItem(STORAGE_KEYS.accessToken, data.accessToken);
      localStorage.setItem(STORAGE_KEYS.refreshToken, data.refreshToken);
      localStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(data.user));
      return { success: true, user: data.user };
    }

    return {
      success: false,
      error: "Error inesperado al iniciar sesión",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Email o contraseña incorrectos",
    };
  }
}

export async function logout() {
  try {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
    if (refreshToken) {
      await authApi.logout(refreshToken);
    }
  } catch (error) {
    logger.warn("authService", "Logout API request failed", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });
  } finally {
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    localStorage.removeItem(STORAGE_KEYS.userData);
  }
}

export function getCurrentUser() {
  const userData = localStorage.getItem(STORAGE_KEYS.userData);
  return userData ? JSON.parse(userData) : null;
}

export function isAuthenticated() {
  const token = localStorage.getItem(STORAGE_KEYS.accessToken);
  return !!token;
}
