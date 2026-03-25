import { logger } from "./logger";

export const STORAGE_KEYS = {
  cart: "cart",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  authToken: "accessToken", // Alias para compatibilidad parcial
  userData: "userData",
  lastOrder: "lastOrder",
  orders: "orders"
};

export const readLocalJSON = (key) => {
  const rawValue = localStorage.getItem(key);
  if (!rawValue) return null;
  try {
    return JSON.parse(rawValue);
  } catch (error) {
    logger.warn("storage", `Failed to parse localStorage key ${key}`, error.message);
    return null;
  }
};

export const writeLocalJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    logger.warn("storage", `Failed to persist localStorage key ${key}`, error.message);
  }
};

export const appendOrderToHistory = (order) => {
  const previous = readLocalJSON(STORAGE_KEYS.orders) || [];
  const next = [...previous, order];
  writeLocalJSON(STORAGE_KEYS.orders, next);
  writeLocalJSON(STORAGE_KEYS.lastOrder, order);
};
