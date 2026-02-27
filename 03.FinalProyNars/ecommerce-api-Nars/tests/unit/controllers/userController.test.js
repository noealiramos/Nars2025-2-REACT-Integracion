import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserProfile, getAllUsers, updateUser } from '../../../src/controllers/userController.js';
import User from '../../../src/models/user.js';
import { createMockReqRes } from '../../testUtils.js';

vi.mock('../../../src/models/user.js');

describe('userController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getUserProfile', () => {
        it('debe retornar el perfil si el usuario existe', async () => {
            const { req, res, next } = createMockReqRes({ user: { id: 'user123' } });
            const mockUser = { _id: 'user123', displayName: 'Test', hashPassword: '...' };

            User.findById.mockReturnValue({
                lean: () => vi.fn().mockResolvedValue(mockUser)()
            });

            await getUserProfile(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.not.objectContaining({ hashPassword: '...' })
            }));
        });

        it('debe retornar 404 si el usuario no existe', async () => {
            const { req, res, next } = createMockReqRes({ user: { id: 'nonexistent' } });
            User.findById.mockReturnValue({ lean: () => vi.fn().mockResolvedValue(null)() });

            await getUserProfile(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getAllUsers', () => {
        it('debe retornar lista de usuarios con paginacion', async () => {
            const { req, res, next } = createMockReqRes({ query: { page: '1', limit: '10' } });
            const mockUsers = [{ _id: '1' }, { _id: '2' }];

            User.countDocuments.mockResolvedValue(2);
            User.find.mockReturnValue({
                sort: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                lean: () => vi.fn().mockResolvedValue(mockUsers)()
            });

            await getAllUsers(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                data: mockUsers,
                meta: expect.anything()
            }));
        });
    });

    describe('updateUser', () => {
        it('debe actualizar campos especificos por el admin', async () => {
            const { req, res, next } = createMockReqRes({
                params: { userId: '123' },
                body: { role: 'admin', active: false }
            });
            const updatedUser = { _id: '123', role: 'admin', active: false };

            User.findByIdAndUpdate.mockReturnValue({
                lean: () => vi.fn().mockResolvedValue(updatedUser)()
            });

            await updateUser(req, res, next);

            expect(res.status).not.toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ data: updatedUser });
        });

        it('debe retornar 409 si el email esta duplicado durante el update', async () => {
            const { req, res, next } = createMockReqRes({
                params: { userId: '123' },
                body: { email: 'duplicate@test.com' }
            });

            User.findByIdAndUpdate.mockImplementation(() => {
                const error = new Error('Duplicate key');
                error.code = 11000;
                error.keyPattern = { email: 1 };
                throw error;
            });

            await updateUser(req, res, next);
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ message: 'Email already registered' });
        });
    });
});
