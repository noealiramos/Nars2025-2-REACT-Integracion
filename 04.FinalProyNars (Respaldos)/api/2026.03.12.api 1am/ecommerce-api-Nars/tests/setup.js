import { vi, afterEach } from 'vitest';

// Limpiar todos los mocks después de cada prueba para evitar interferencias
afterEach(() => {
    vi.clearAllMocks();
});
