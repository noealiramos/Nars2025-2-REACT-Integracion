import { vi } from 'vitest';

/**
 * Crea objetos req, res y next simulados para Express.
 */
export const createMockReqRes = (overrides = {}) => {
    const req = {
        body: {},
        params: {},
        query: {},
        headers: {},
        user: null,
        ...overrides,
    };
    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        send: vi.fn().mockReturnThis(),
        cookie: vi.fn().mockReturnThis(),
    };
    const next = vi.fn();
    return { req, res, next };
};
