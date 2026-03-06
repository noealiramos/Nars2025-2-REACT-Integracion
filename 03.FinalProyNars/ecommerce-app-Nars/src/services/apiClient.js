import { STORAGE_KEYS } from "../utils/storageHelpers";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function apiClient(endpoint, { body, ...customConfig } = {}) {
    const token = localStorage.getItem(STORAGE_KEYS.authToken);

    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const config = {
        method: body ? "POST" : "GET",
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    let data;
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // Si la respuesta no tiene contenido (ej. 204 No Content)
        if (response.status === 204) {
            return { success: true };
        }

        data = await response.json();

        if (!response.ok) {
            // Lanzar error si la respuesta no es OK
            throw new Error(data.message || data.error || "Ocurrió un error en la solicitud");
        }

        return { success: true, data };
    } catch (err) {
        return {
            success: false,
            error: err.message || "Error de conexión con el servidor",
        };
    }
}
