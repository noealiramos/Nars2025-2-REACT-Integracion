import users from "../data/users";
import { STORAGE_KEYS } from "../utils/storageHelpers";

/**
 * Simula una validación de credenciales.
 * En un entorno real, esto se haría en el backend.
 */
const MOCK_PASSWORD = "123456";

export async function login(email, password) {
  // Simulación de retraso de red
  await new Promise((resolve) => setTimeout(resolve, 800));

  const user = users.find((u) => u.email === email);

  if (!user || password !== MOCK_PASSWORD) {
    return {
      success: false,
      error: "Email o contraseña incorrectos",
    };
  }

  if (!user.active) {
    return {
      success: false,
      error: "Esta cuenta está desactivada",
    };
  }

  // Generamos un "token" algo más complejo (simulado)
  const tokenPayload = {
    sub: user.id,
    email: user.email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24h
  };

  const token = btoa(JSON.stringify(tokenPayload)).replace(/=/g, "");
  const userWithLoginDate = { ...user, loginDate: new Date().toISOString() };

  localStorage.setItem(STORAGE_KEYS.authToken, token);
  localStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(userWithLoginDate));

  return { success: true, user: userWithLoginDate };
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
  if (!token) return false;

  try {
    // Verificación básica del token (expiración)
    const payload = JSON.parse(atob(token));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch (e) {
    return false;
  }
}