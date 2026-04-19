export const DEFAULT_API_URL = "http://localhost:3001/api";
export const DEFAULT_FRONTEND_URL = "http://localhost:5173";

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

export const resolveApiUrl = (value) => trimTrailingSlash(value || DEFAULT_API_URL);

export const resolveFrontendUrl = (value) => trimTrailingSlash(value || DEFAULT_FRONTEND_URL);

export const getRuntimeApiUrl = () => resolveApiUrl(import.meta.env.VITE_API_URL);
