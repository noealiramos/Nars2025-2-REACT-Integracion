import { fetchUsers } from "./userService";
import { STORAGE_KEYS } from "../utils/storageHelpers";

const validUsers = {
  "ali.ramos@mail.com": "123456",
  "george.lucas@mail.com": "123456",
  "max.ramos@mail.com": "123456",
  "noe.saldivar@mail.com": "123456"
};

export async function login(email, password) {
  if (!validUsers[email] || validUsers[email] !== password) {
    return {
      success: false,
      error: "Email o contraseña incorrectos",
    };
  }

  const users = await fetchUsers();
  const user = users.find((u) => u.email === email);

  if (user) {
    const token = btoa(`${email}:${Date.now()}`);
    const userWithLoginDate = { ...user, loginDate: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.authToken, token);
    localStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(userWithLoginDate));
    return { success: true, user: userWithLoginDate };
  }

  return {
    success: false,
    error: "Usuario no encontrado",
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