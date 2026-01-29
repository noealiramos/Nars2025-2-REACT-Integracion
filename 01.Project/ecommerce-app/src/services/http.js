import axios from "axios";

const APP_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const http = axios.create({
  baseURL: APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 8000,
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
