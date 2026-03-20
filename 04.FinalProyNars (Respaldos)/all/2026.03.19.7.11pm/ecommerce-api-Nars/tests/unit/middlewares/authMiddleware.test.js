import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import authMiddleware from '../../../src/middlewares/authMiddleware.js';
import { createMockReqRes } from '../../testUtils.js';

vi.mock('jsonwebtoken');

describe('authMiddleware', () => {
    const secret = 'test_secret';

    beforeEach(() => {
        process.env.JWT_SECRET = secret;
        vi.clearAllMocks();
    });

    it('debe retornar 401 si no hay token', () => {
        const { req, res, next } = createMockReqRes();

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: missing Bearer token' });
        expect(next).not.toHaveBeenCalled();
    });

    it('debe retornar 401 si el formato Bearer es incorrecto', () => {
        const { req, res, next } = createMockReqRes({
            headers: { authorization: 'InvalidFormat abc' }
        });

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('debe retornar 500 si JWT_SECRET no esta configurado', () => {
        delete process.env.JWT_SECRET;
        const { req, res, next } = createMockReqRes({
            headers: { authorization: 'Bearer abc' }
        });

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server misconfigured: JWT_SECRET missing' });
    });

    it('debe llamar a next() y setear req.user si el token es valido', () => {
        const mockUser = { userId: '123', role: 'admin' };
        const { req, res, next } = createMockReqRes({
            headers: { authorization: 'Bearer valid_token' }
        });

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, mockUser);
        });

        authMiddleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('valid_token', secret, expect.any(Function));
        expect(req.user).toEqual(expect.objectContaining(mockUser));
        expect(req.user.id).toBe('123'); // Verifica normalizacion
        expect(next).toHaveBeenCalled();
    });

    it('debe retornar 401 si el token ha expirado', () => {
        const { req, res, next } = createMockReqRes({
            headers: { authorization: 'Bearer expired_token' }
        });

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback({ name: 'TokenExpiredError' });
        });

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Token expired' });
    });

    it('debe retornar 403 si el token es invalido', () => {
        const { req, res, next } = createMockReqRes({
            headers: { authorization: 'Bearer invalid_token' }
        });

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error('Invalid'));
        });

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    });
});
