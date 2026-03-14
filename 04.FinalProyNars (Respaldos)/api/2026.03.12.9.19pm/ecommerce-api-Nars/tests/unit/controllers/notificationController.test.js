import { describe, it, expect, vi, beforeEach } from 'vitest';
import Notification from '../../../src/models/notification.js';
import {
    listNotifications,
    getNotificationByUser,
    getUnreadNotificationsByUser,
    getNotificationById,
    createNotification,
    updateNotification,
    markAsRead,
    markAllAsReadByUser,
    deleteNotification
} from '../../../src/controllers/notificationController.js';
import { createMockReqRes } from '../../testUtils.js';

vi.mock('../../../src/models/notification.js');

describe('notificationController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('listNotifications (admin)', () => {
        it('debe listar todas las notificaciones con filtros opcionales (200)', async () => {
            const { req, res, next } = createMockReqRes({
                query: { userId: 'u1', read: 'false', type: 'order' }
            });
            Notification.countDocuments.mockResolvedValue(1);
            Notification.find.mockReturnValue({
                sort: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                lean: vi.fn().mockResolvedValue([{ _id: 'n1' }])
            });

            await listNotifications(req, res, next);
            expect(Notification.find).toHaveBeenCalledWith({ user: 'u1', read: false, type: 'order' });
            expect(res.json).toHaveBeenCalled();
        });
    });

    describe('getNotificationByUser', () => {
        it('debe obtener notificaciones de un usuario específico (200)', async () => {
            const { req, res, next } = createMockReqRes({ params: { userId: 'u1' } });
            Notification.countDocuments.mockResolvedValue(0);
            Notification.find.mockReturnValue({ sort: vi.fn().mockReturnThis(), skip: vi.fn().mockReturnThis(), limit: vi.fn().mockReturnThis(), lean: vi.fn().mockResolvedValue([]) });

            await getNotificationByUser(req, res, next);
            expect(Notification.find).toHaveBeenCalledWith(expect.objectContaining({ user: 'u1' }));
            expect(res.json).toHaveBeenCalled();
        });
    });

    describe('getUnreadNotificationsByUser', () => {
        it('debe obtener solo las notificaciones no leídas (200)', async () => {
            const { req, res, next } = createMockReqRes({ params: { userId: 'u1' } });
            Notification.countDocuments.mockResolvedValue(0);
            Notification.find.mockReturnValue({ sort: vi.fn().mockReturnThis(), skip: vi.fn().mockReturnThis(), limit: vi.fn().mockReturnThis(), lean: vi.fn().mockResolvedValue([]) });

            await getUnreadNotificationsByUser(req, res, next);
            expect(Notification.find).toHaveBeenCalledWith({ user: 'u1', read: false });
            expect(res.json).toHaveBeenCalled();
        });
    });

    describe('getNotificationById', () => {
        it('debe retornar 404 si la notificación no existe', async () => {
            const { req, res, next } = createMockReqRes({ params: { id: 'n1' } });
            Notification.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) });
            await getNotificationById(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('createNotification', () => {
        it('debe crear una notificación exitosamente (201)', async () => {
            const { req, res, next } = createMockReqRes({ body: { user: 'u1', title: 'test' } });
            Notification.create.mockResolvedValue({ _id: 'n1', title: 'test' });
            await createNotification(req, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('markAsRead', () => {
        it('debe marcar una notificación como leída (200)', async () => {
            const { req, res, next } = createMockReqRes({ params: { id: 'n1' } });
            Notification.findByIdAndUpdate.mockResolvedValue({ _id: 'n1', read: true });

            await markAsRead(req, res, next);
            expect(Notification.findByIdAndUpdate).toHaveBeenCalledWith(
                'n1',
                expect.objectContaining({ $set: expect.objectContaining({ read: true }) }),
                expect.any(Object)
            );
            expect(res.json).toHaveBeenCalled();
        });
    });

    describe('markAllAsReadByUser', () => {
        it('debe marcar todas las notificaciones del usuario como leídas (200)', async () => {
            const { req, res, next } = createMockReqRes({ params: { userId: 'u1' } });
            Notification.updateMany.mockResolvedValue({ matchedCount: 5, modifiedCount: 5 });

            await markAllAsReadByUser(req, res, next);
            expect(Notification.updateMany).toHaveBeenCalledWith(
                { user: 'u1', read: { $ne: true } },
                expect.any(Object)
            );
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ modified: 5 }) }));
        });
    });

    describe('deleteNotification', () => {
        it('debe eliminar la notificación (200)', async () => {
            const { req, res, next } = createMockReqRes({ params: { id: 'n1' } });
            Notification.findByIdAndDelete.mockResolvedValue({ _id: 'n1' });
            await deleteNotification(req, res, next);
            expect(res.status).not.toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Notification deleted' }));
        });
    });
});
