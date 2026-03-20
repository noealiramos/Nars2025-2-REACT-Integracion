import axios from "axios";
import { STORAGE_KEYS } from "../utils/storageHelpers";
import { logger } from "../utils/logger";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

let refreshPromise = null;

const isAuthRoute = (url = "") => url.includes("/auth/login") || url.includes("/auth/register") || url.includes("/auth/refresh") || url.includes("/auth/logout");

const clearStoredSession = () => {
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
  localStorage.removeItem(STORAGE_KEYS.userData);
};

const persistSessionTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) {
    localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
  }

  if (refreshToken) {
    localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
  }
};

const buildApiErrorMessage = (error) => {
  const status = error.response?.status;
  const message = error.response?.data?.message || error.response?.data?.error || error.message || "Unexpected API error";
  const method = error.config?.method?.toUpperCase() || "REQUEST";
  const url = error.config?.url || "unknown-url";

  return `${method} ${url} failed${status ? ` (${status})` : ""}: ${message}`;
};

const requestTokenRefresh = async () => {
  const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${API_URL}/auth/refresh`, { refreshToken })
      .then((response) => {
        const nextTokens = {
          accessToken: response.data?.accessToken,
          refreshToken: response.data?.refreshToken,
        };

        persistSessionTokens(nextTokens);
        logger.info("apiClient", "JWT refreshed successfully");
        return nextTokens.accessToken;
      })
      .catch((refreshError) => {
        logger.error("apiClient", "Refresh token flow failed", {
          status: refreshError.response?.status,
          message: refreshError.response?.data?.message || refreshError.message,
        });
        clearStoredSession();
        window.dispatchEvent(new Event("auth-error"));
        throw refreshError;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token a las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.accessToken);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar la renovación del token (401)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const requestUrl = originalRequest.url || "";

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute(requestUrl)) {
      originalRequest._retry = true;

      try {
        const accessToken = await requestTokenRefresh();
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        logger.warn("apiClient", "Retrying request after 401", { url: requestUrl });
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    logger.error("apiClient", buildApiErrorMessage(error), {
      status: error.response?.status,
      data: error.response?.data,
    });

    return Promise.reject(error);
  }
);
