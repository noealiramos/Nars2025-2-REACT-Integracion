import bcrypt from 'bcrypt';
import User from '../models/user.js';
import { getPagination, buildMeta } from '../utils/pagination.js';

/** Perfil del usuario autenticado */
export const getUserProfile = async (req, res, next) => {
  try {
    const authId = req.user?.id || req.user?.userId;
    const user = await User.findById(authId).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    delete user.hashPassword;
    return res.status(200).json({ data: user });
  } catch (error) {
    return next(error);
  }
};

/** Listado (admin) con paginación y filtros */
export const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req, 10);
    const filter = {};
    if (typeof req.query.active !== 'undefined') {
      filter.active = String(req.query.active).toLowerCase() === 'true';
    }
    if (req.query.role) filter.role = req.query.role;
    if (req.query.q) {
      const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
      if (q) {
        filter.$or = [
          { displayName: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
          { phone: { $regex: q, $options: 'i' } },
        ];
      }
    }

    const [total, items] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    items.forEach(u => delete u.hashPassword);
    return res.status(200).json({ data: items, meta: buildMeta({ page, limit, total }) });
  } catch (error) {
    return next(error);
  }
};

/** Detalle por id (admin) */
export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    delete user.hashPassword;
    return res.json({ data: user });
  } catch (error) {
    return next(error);
  }
};

/** Actualiza SU propio perfil */
export const updateUserProfile = async (req, res, next) => {
  try {
    const authId = req.user?.id || req.user?.userId;
    const { displayName, phone, avatar } = req.body;
    const update = {};
    if (typeof displayName !== 'undefined') update.displayName = displayName;
    if (typeof phone !== 'undefined') update.phone = phone;
    if (typeof avatar !== 'undefined') update.avatar = avatar;

    const updated = await User.findByIdAndUpdate(authId, { $set: update }, { new: true, runValidators: true }).lean();
    if (!updated) return res.status(404).json({ message: 'User not found' });
    delete updated.hashPassword;
    return res.json({ data: updated });
  } catch (error) {
    return next(error);
  }
};

/** Cambia contraseña (propia) */
export const changePassword = async (req, res, next) => {
  try {
    const authId = req.user?.id || req.user?.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(authId).select('+hashPassword');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ok = await bcrypt.compare(currentPassword, user.hashPassword);
    if (!ok) return res.status(400).json({ message: 'Current password is incorrect' });

    const saltRounds = 10;
    user.hashPassword = await bcrypt.hash(newPassword, saltRounds);
    await user.save();

    return res.json({ message: 'Password updated' });
  } catch (error) {
    return next(error);
  }
};

/** Actualiza datos de un usuario (admin) */
export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { displayName, email, phone, role, active, avatar } = req.body;
    const update = {};
    if (typeof displayName !== 'undefined') update.displayName = displayName;
    if (typeof email !== 'undefined') update.email = email.toLowerCase();
    if (typeof phone !== 'undefined') update.phone = phone;
    if (typeof role !== 'undefined') update.role = role;
    if (typeof active !== 'undefined') update.active = active;
    if (typeof avatar !== 'undefined') update.avatar = avatar;

    const updated = await User.findByIdAndUpdate(userId, { $set: update }, { new: true, runValidators: true }).lean();
    if (!updated) return res.status(404).json({ message: 'User not found' });
    delete updated.hashPassword;
    return res.json({ data: updated });
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.email) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    return next(error);
  }
};

/** Desactiva su propia cuenta */
export const deactivateUser = async (req, res, next) => {
  try {
    const authId = req.user?.id || req.user?.userId;
    const updated = await User.findByIdAndUpdate(authId, { $set: { active: false } }, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: 'User not found' });
    delete updated.hashPassword;
    return res.json({ data: updated });
  } catch (error) {
    return next(error);
  }
};

/** Alterna estado activo (admin) */
export const toggleUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.active = !user.active;
    await user.save();
    const out = user.toObject();
    delete out.hashPassword;
    return res.json({ data: out });
  } catch (error) {
    return next(error);
  }
};

/** Elimina usuario (admin) */
export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const deleted = await User.findByIdAndDelete(userId).lean();
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    return res.json({ message: 'User deleted' });
  } catch (error) {
    return next(error);
  }
};

/** Búsqueda rápida (admin) */
export const searchUser = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req, 10);
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (!q) return res.status(400).json({ message: 'q is required' });
    const filter = {
      $or: [
        { displayName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
      ],
    };
    const [total, items] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);
    items.forEach(u => delete u.hashPassword);
    return res.json({ data: items, meta: buildMeta({ page, limit, total }) });
  } catch (error) {
    return next(error);
  }
};
