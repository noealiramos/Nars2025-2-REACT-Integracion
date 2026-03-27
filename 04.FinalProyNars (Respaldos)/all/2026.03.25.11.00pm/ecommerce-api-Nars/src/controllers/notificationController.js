import Notification from '../models/notification.js';

/** Helpers de paginación */
const parsePagination = (req) => {
  const page = Math.max(parseInt(req.query.page ?? '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit ?? '10', 10), 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};
const buildMeta = ({ total, page, limit }) => {
  const totalPages = Math.ceil(total / limit) || 1;
  return { total, totalPages, currentPage: page, hasNext: page < totalPages, hasPrev: page > 1 };
};

/**
 * GET /notifications  (admin o filtros por query)
 * Filtros opcionales: ?userId=... & ?read=true|false & ?type=...
 */
export const listNotifications = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const filter = {};
    if (req.query.userId) filter.user = req.query.userId;
    if (typeof req.query.read !== 'undefined') filter.read = String(req.query.read).toLowerCase() === 'true';
    if (req.query.type) filter.type = req.query.type;

    const [total, items] = await Promise.all([
      Notification.countDocuments(filter),
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    return res.json({ data: items, meta: buildMeta({ total, page, limit }) });
  } catch (error) { return next(error); }
};

/** Alias para tu ruta /notifications (admin) */
export const getNotifications = listNotifications;

/**
 * GET /notifications/user/:userId  (listado por usuario)
 * Filtros opcionales: ?read=true|false & ?type=...
 */
export const getNotificationByUser = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const { userId } = req.params;
    const filter = { user: userId };
    if (typeof req.query.read !== 'undefined') filter.read = String(req.query.read).toLowerCase() === 'true';
    if (req.query.type) filter.type = req.query.type;

    const [total, items] = await Promise.all([
      Notification.countDocuments(filter),
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    return res.json({ data: items, meta: buildMeta({ total, page, limit }) });
  } catch (error) { return next(error); }
};

/**
 * GET /notifications/unread/:userId  (no leídas por usuario)
 * Soporta paginación ?page&limit
 */
export const getUnreadNotificationsByUser = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const { userId } = req.params;
    const filter = { user: userId, read: false };

    const [total, items] = await Promise.all([
      Notification.countDocuments(filter),
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    return res.json({ data: items, meta: buildMeta({ total, page, limit }) });
  } catch (error) { return next(error); }
};

/**
 * GET /notifications/:id
 */
export const getNotificationById = async (req, res, next) => {
  try {
    const doc = await Notification.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ message: 'Notification not found' });
    return res.json({ data: doc });
  } catch (error) { return next(error); }
};

/**
 * POST /notifications
 * Body típico:
 * { "user": "<userId>", "title": "...", "message": "...", "type": "order", "data": { ... } }
 */
export const createNotification = async (req, res, next) => {
  try {
    const payload = req.body ?? {};
    const created = await Notification.create(payload);
    return res.status(201).json({ data: created });
  } catch (error) { return next(error); }
};

/**
 * PUT /notifications/:id
 */
export const updateNotification = async (req, res, next) => {
  try {
    const payload = req.body ?? {};
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { $set: payload },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Notification not found' });
    return res.json({ data: updated });
  } catch (error) { return next(error); }
};

/**
 * PATCH /notifications/:id/mark-read
 * (tu ruta usa "mark-read"; aquí solo usamos :id)
 */
export const markAsRead = async (req, res, next) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { $set: { read: true, readAt: new Date() } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Notification not found' });
    return res.json({ data: updated });
  } catch (error) { return next(error); }
};

/**
 * PATCH /notifications/user/:userId/mark-all-read
 * (tu ruta usa :userId, no query)
 */
export const markAllAsReadByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    const result = await Notification.updateMany(
      { user: userId, read: { $ne: true } },
      { $set: { read: true, readAt: new Date() } }
    );

    const matched = result.matchedCount ?? result.n ?? 0;
    const modified = result.modifiedCount ?? result.nModified ?? 0;

    return res.json({ message: 'Notifications marked as read', data: { matched, modified } });
  } catch (error) { return next(error); }
};

/** Versión por query (si algún día la usas) */
export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    const result = await Notification.updateMany(
      { user: userId, read: { $ne: true } },
      { $set: { read: true, readAt: new Date() } }
    );

    const matched = result.matchedCount ?? result.n ?? 0;
    const modified = result.modifiedCount ?? result.nModified ?? 0;

    return res.json({ message: 'Notifications marked as read', data: { matched, modified } });
  } catch (error) { return next(error); }
};

/**
 * DELETE /notifications/:id
 */
export const deleteNotification = async (req, res, next) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Notification not found' });
    return res.json({ message: 'Notification deleted' });
  } catch (error) { return next(error); }
};
