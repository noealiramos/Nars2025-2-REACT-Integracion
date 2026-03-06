import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { register, login } from '../../../src/controllers/authController.js';
import User from '../../../src/models/user.js';
import { createMockReqRes } from '../../testUtils.js';

vi.mock('bcrypt');
vi.mock('jsonwebtoken');
vi.mock('../../../src/models/user.js');

describe('authController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.JWT_SECRET = 'test_secret';
    });

    describe('register', () => {
        it('debe registrar un usuario nuevo exitosamente', async () => {
            const userData = {
                displayName: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };
            const { req, res, next } = createMockReqRes({ body: userData });

            User.findOne.mockReturnValue({ lean: () => vi.fn().mockResolvedValue(null)() });
            bcrypt.hash.mockResolvedValue('hashed_pass');
            User.create.mockResolvedValue({
                _id: 'user123',
                ...userData,
                active: true,
                createdAt: new Date()
            });
            jwt.sign.mockReturnValue('mock_token');

            await register(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'User registered successfully',
                token: 'mock_token'
            }));
        });

        it('debe retornar 409 si el email ya existe', async () => {
            const { req, res, next } = createMockReqRes({
                body: { email: 'exists@example.com', password: '123' }
            });

            User.findOne.mockReturnValue({ lean: () => vi.fn().mockResolvedValue({ _id: 'old' })() });

            await register(req, res, next);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ message: 'Email already registered' });
        });
    });

    describe('login', () => {
        it('debe loguear exitosamente con credenciales validas', async () => {
            const { req, res, next } = createMockReqRes({
                body: { email: 'test@example.com', password: 'password123' }
            });

            const mockUser = {
                _id: 'user123',
                email: 'test@example.com',
                active: true,
                hashPassword: 'hashed_password'
            };

            User.findOne.mockReturnValue({
                select: vi.fn().mockResolvedValue(mockUser)
            });
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mock_token');

            await login(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                token: 'mock_token'
            }));
        });

        it('debe retornar 400 si las credenciales son invalidas (user not found)', async () => {
            const { req, res, next } = createMockReqRes({
                body: { email: 'wrong@example.com', password: '123' }
            });

            User.findOne.mockReturnValue({
                select: vi.fn().mockResolvedValue(null)
            });

            await login(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });

        it('debe retornar 403 si el usuario esta desactivado', async () => {
            const { req, res, next } = createMockReqRes({
                body: { email: 'inactive@example.com', password: '123' }
            });

            User.findOne.mockReturnValue({
                select: vi.fn().mockResolvedValue({ active: false })
            });

            await login(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'User is deactivated' });
        });
    });
});
