import { STORAGE_KEYS } from "../utils/storageHelpers";
import { apiClient } from "./apiClient";

export async function login(email, password) {
  // Ahora llamamos al backend real en lugar de validar con datos locales
  const response = await apiClient("/auth/login", {
    body: { email, password },
  });

  if (!response.success) {
    return {
      success: false,
      error: response.error || "Email o contraseña incorrectos",
    };
  }

  // Se asume que el backend devuelve un objeto user y un token
  const { user, token } = response.data;

  if (user && token) {
    localStorage.setItem(STORAGE_KEYS.authToken, token);
    localStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(user));
    return { success: true, user };
  }

  return {
    success: false,
    error: "Estructura de respuesta inválida del servidor",
  };
}

export function logout() {
  localStorage.removeItem(STORAGE_KEYS.authToken);
  localStorage.removeItem(STORAGE_KEYS.userData);
}

export function getCurrentUser() {
  const userData = localStorage.getItem(STORAGE_KEYS.userData);
  return userData ? JSON.parse(userData) : null;
}

export function isAuthenticated() {
  const token = localStorage.getItem(STORAGE_KEYS.authToken);
  return token !== null;
}