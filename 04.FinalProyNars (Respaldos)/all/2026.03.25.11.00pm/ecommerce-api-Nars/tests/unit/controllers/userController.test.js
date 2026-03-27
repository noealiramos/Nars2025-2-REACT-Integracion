import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcrypt';
import User from '../../../src/models/user.js';
import {
    getUserProfile,
    getAllUsers,
    changePassword,
    updateUser,
    toggleUserStatus,
    searchUser
} from '../../../src/controllers/userController.js';
import { createMockReqRes } from '../../testUtils.js';

vi.mock('../../../src/models/user.js');
vi.mock('bcrypt');

describe('userController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getUserProfile', () => {
        it('debe retornar el perfil sin el hash de la contraseña (200)', async () => {
            const { req, res, next } = createMockReqRes({ user: { id: 'u1' } });
            User.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue({ _id: 'u1', hashPassword: 'abc', displayName: 'Ali' }) });

            await getUserProfile(req, res, next);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.not.objectContaining({ hashPassword: 'abc' }) }));
        });
    });

    describe('getAllUsers (admin)', () => {
        it('debe listar usuarios con filtros de rol y búsqueda (200)', async () => {
            const { req, res, next } = createMockReqRes({
                query: { role: 'admin', q: 'test' }
            });
            User.countDocuments.mockResolvedValue(1);
            User.find.mockReturnValue({
                sort: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                lean: vi.fn().mockResolvedValue([{ _id: 'u1', displayName: 'Tester' }])
            });

            await getAllUsers(req, res, next);
            expect(User.find).toHaveBeenCalledWith(expect.objectContaining({ role: 'admin' }));
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('changePassword', () => {
        it('debe actualizar la contraseña si la actual es correcta (200)', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u1' },
                body: { currentPassword: 'old', newPassword: 'new' }
            });
            const mockUser = {
                hashPassword: 'hashed_old',
                save: vi.fn().mockResolvedValue(true)
            };
            User.findById.mockReturnValue({ select: vi.fn().mockResolvedValue(mockUser) });
            bcrypt.compare.mockResolvedValue(true);
            bcrypt.hash.mockResolvedValue('hashed_new');

            await changePassword(req, res, next);
            expect(mockUser.hashPassword).toBe('hashed_new');
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Password updated' }));
        });

        it('debe retornar 400 si la contraseña actual es incorrecta', async () => {
            const { req, res, next } = createMockReqRes({
                user: { id: 'u1' },
                body: { currentPassword: 'wrong', newPassword: 'new' }
            });
            User.findById.mockReturnValue({ select: vi.fn().mockResolvedValue({ hashPassword: 'hashed' }) });
            bcrypt.compare.mockResolvedValue(false);

            await changePassword(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('updateUser (admin)', () => {
        it('debe permitir actualizar rol y estado (200)', async () => {
            const { req, res, next } = createMockReqRes({
                params: { userId: 'u1' },
                body: { role: 'admin', active: false }
            });
            User.findByIdAndUpdate.mockReturnValue({ lean: vi.fn().mockResolvedValue({ _id: 'u1', role: 'admin' }) });

            await updateUser(req, res, next);
            expect(User.findByIdAndUpdate).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalled();
        });
    });

    describe('toggleUserStatus', () => {
        it('debe conmutar el campo active (200)', async () => {
            const { req, res, next } = createMockReqRes({ params: { userId: 'u1' } });
            const mockUser = {
                active: true,
                save: vi.fn().mockResolvedValue(true),
                toObject: vi.fn().mockReturnValue({ _id: 'u1', active: false })
            };
            User.findById.mockResolvedValue(mockUser);

            await toggleUserStatus(req, res, next);
            expect(mockUser.active).toBe(false);
            expect(res.json).toHaveBeenCalled();
        });
    });

    describe('searchUser', () => {
        it('debe buscar usuarios por múltiples campos (200)', async () => {
            const { req, res, next } = createMockReqRes({ query: { q: 'ali' } });
            User.countDocuments.mockResolvedValue(1);
            User.find.mockReturnValue({
                sort: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                lean: vi.fn().mockResolvedValue([{ email: 'ali@test.com' }])
            });

            await searchUser(req, res, next);
            expect(res.json).toHaveBeenCalled();
        });
    });
});
