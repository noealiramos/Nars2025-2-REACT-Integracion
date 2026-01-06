import axios from "axios";

const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:4000/api/";

export const http = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 8000,
});

http.interceptors.request.use(
  (config) => {
    // Siempre intentar agregar el token si existe
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

http.interceptors.response.use(
  (res) => res,
  (err) => {
    // Manejar errores de autenticación
    if (err.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      // Opcional: redirigir al login
      // window.location.href = '/login';
    }

    const message =
      err.response?.data?.message || err.message || "Error de red";
    return Promise.reject(new Error(message));
  }
);