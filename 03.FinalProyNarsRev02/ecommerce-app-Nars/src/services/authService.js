import { authApi } from "../api/authApi";
import { STORAGE_KEYS } from "../utils/storageHelpers";
import { logger } from "../utils/logger";

function parseJwtPayload(token) {
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = parseJwtPayload(token);

  if (!payload?.exp) return true;

  return payload.exp * 1000 <= Date.now();
}

export async function login(email, password) {
  try {
    const data = await authApi.login(email, password);
    
    if (data.accessToken) {
      persistAuthSession(data);
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

export function persistAuthSession(data) {
  localStorage.setItem(STORAGE_KEYS.accessToken, data.accessToken);
  localStorage.setItem(STORAGE_KEYS.refreshToken, data.refreshToken);
  localStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(data.user));
}

export function clearAuthSession() {
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
  localStorage.removeItem(STORAGE_KEYS.userData);
}

export function hasPersistedSession() {
  const accessToken = localStorage.getItem(STORAGE_KEYS.accessToken);
  const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
  const userData = localStorage.getItem(STORAGE_KEYS.userData);

  return Boolean(accessToken || refreshToken || userData);
}

export async function bootstrapSession() {
  if (!hasPersistedSession()) {
    return { success: false, user: null };
  }

  const accessToken = localStorage.getItem(STORAGE_KEYS.accessToken);
  const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
  const currentUser = getCurrentUser();

  if (accessToken && isTokenExpired(accessToken) && currentUser && refreshToken) {
    logger.info("authService", "Skipping bootstrap /users/me revalidation for expired access token; keeping session until refresh flow runs");
    return {
      success: true,
      user: currentUser,
      deferred: true,
    };
  }

  try {
    const data = await authApi.me();
    const user = data?.data || data?.user || null;

    if (!user) {
      clearAuthSession();
      return { success: false, user: null };
    }

    const persistedUser = {
      ...currentUser,
      ...user,
      id: user.id || user._id || currentUser?.id || currentUser?._id,
    };

    localStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(persistedUser));

    return {
      success: true,
      user: persistedUser,
    };
  } catch (error) {
    clearAuthSession();
    return {
      success: false,
      user: null,
      error,
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
    clearAuthSession();
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
