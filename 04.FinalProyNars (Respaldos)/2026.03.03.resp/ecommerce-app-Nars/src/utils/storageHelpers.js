export const STORAGE_KEYS = {
  cart: "cart",
  authToken: "authToken",
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
    console.error("Error parsing JSON from localStorage for key:", key, error);
    return null;
  }
};

export const writeLocalJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error writing JSON to localStorage for key:", key, error);
  }
};

export const appendOrderToHistory = (order) => {
  const previous = readLocalJSON(STORAGE_KEYS.orders) || [];
  const next = [...previous, order];
  writeLocalJSON(STORAGE_KEYS.orders, next);
  writeLocalJSON(STORAGE_KEYS.lastOrder, order);
};