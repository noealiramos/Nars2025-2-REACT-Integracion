import mongoose from 'mongoose';
import PaymentMethod from '../models/paymentMethod.js';

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

/** Nunca exponer campos sensibles por si alguien los selecciona explícitamente */
const sanitize = (pm) => {
  if (!pm) return pm;
  const obj = typeof pm.toObject === 'function' ? pm.toObject() : { ...pm };
  delete obj.cardNumber;
  delete obj.accountNumber;
  delete obj.token;
  return obj;
};

// --- DEBUG helper ---
const dbg = (ctx, err) => {
  const validation = err?.errors
    ? Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v?.message]))
    : undefined;

  console.error(`[paymentMethods:${ctx}]`, {
    name: err?.name,
    message: err?.message,
    code: err?.code,
    keyPattern: err?.keyPattern,
    keyValue: err?.keyValue,
    validation,
    stack: err?.stack?.split('\n').slice(0, 4).join('\n'),
  });
};

/**
 * GET /payment-methods (admin)
 * Lista métodos de pago con paginación.
 * Soporta ?active=true|false (por defecto: true)
 */
export const getPaymentMethods = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const filter = {};

    if (typeof req.query.active !== 'undefined') {
      filter.active = String(req.query.active).toLowerCase() === 'true';
    } else {
      filter.active = true;
    }

    const [total, items] = await Promise.all([
      PaymentMethod.countDocuments(filter),
      PaymentMethod.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    return res.json({
      data: items.map(sanitize),
      meta: buildMeta({ total, page, limit }),
    });
  } catch (error) {
    dbg('getPaymentMethods', error);
    return next(error);
  }
};

/**
 * GET /payment-methods/default/:userId
 */
export const getDefaultPaymentMethod = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const item = await PaymentMethod.findOne({ user: userId, isDefault: true, active: true }).lean();
    if (!item) return res.status(404).json({ message: 'Default payment method not found' });
    return res.json({ data: sanitize(item) });
  } catch (error) {
    dbg('getDefaultPaymentMethod', error);
    return next(error);
  }
};

/**
 * GET /payment-methods/user/:userId
 * Soporta ?active=true|false y paginación
 */
export const getPaymentMethodsByUser = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const { userId } = req.params;
    const filter = { user: userId };

    if (typeof req.query.active !== 'undefined') {
      filter.active = String(req.query.active).toLowerCase() === 'true';
    } else {
      filter.active = true;
    }

    const [total, items] = await Promise.all([
      PaymentMethod.countDocuments(filter),
      PaymentMethod.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    return res.json({
      data: items.map(sanitize),
      meta: buildMeta({ total, page, limit }),
    });
  } catch (error) {
    dbg('getPaymentMethodsByUser', error);
    return next(error);
  }
};

/**
 * GET /payment-methods/:id
 */
export const getPaymentMethodById = async (req, res, next) => {
  try {
    const doc = await PaymentMethod.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ message: 'Payment method not found' });

    return res.json({ data: sanitize(doc) });
  } catch (error) {
    dbg('getPaymentMethodById', error);
    return next(error);
  }
};

/**
 * POST /payment-methods
 * Body mínimo recomendado: { type, ... }  (user se toma del token si no viene)
 * Si isDefault=true, desmarca otros del mismo usuario.
 */
export const createPaymentMethod = async (req, res, next) => {
  try {
    const payload = { ...(req.body ?? {}) };

    const isBank = payload.type === 'bank_transfer';

    // Evitar “mass assignment” de campos sensibles (permitimos accountNumber SOLO en bank_transfer)
    const forbidden = ['cardNumber', 'token'];
    if (!isBank) forbidden.push('accountNumber');
    if (Object.keys(payload).some((k) => forbidden.includes(k))) {
      return res.status(400).json({ message: 'Sensitive fields are not allowed via API' });
    }

    const authUserId = req.user?.id || req.user?.userId;
    const isAdmin = req.user?.role === 'admin';

    if (!payload.user) payload.user = authUserId;
    if (!payload.user) return res.status(400).json({ message: 'user is required' });
    if (!isAdmin && String(payload.user) !== String(authUserId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (payload.user && payload.isDefault === true) {
      await PaymentMethod.updateMany(
        { user: payload.user, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    if (typeof payload.active === 'undefined') payload.active = true;

    const created = await PaymentMethod.create(payload);
    return res.status(201).json({ data: sanitize(created) });
  } catch (error) {
    dbg('createPaymentMethod', error);
    // Mapear validaciones del esquema a 400
    if (error?.name === 'ValidationError' || /required/i.test(error?.message || '')) {
      return res.status(400).json({ error: error.message });
    }
    if (error?.code === 11000) {
      return res.status(409).json({ error: 'Duplicate key' });
    }
    return next(error);
  }
};

/**
 * PUT /payment-methods/:id
 * PATCH /payment-methods/:id
 * - Dueño o admin
 * - accountNumber solo permitido si (tipo final === bank_transfer)
 * - Si isDefault=true, desmarca los demás del usuario
 * - Usa .save() para disparar hooks de validación/limpieza del modelo
 */
export const updatePaymentMethod = async (req, res, next) => {
  try {
    const pmId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(pmId)) {
      return res.status(400).json({ message: 'Invalid paymentMethodId' });
    }

    const pm = await PaymentMethod.findById(pmId);
    if (!pm) return res.status(404).json({ message: 'Payment method not found' });

    // Permisos: dueño o admin
    const authUserId = req.user?.id || req.user?.userId;
    const isAdmin = req.user?.role === 'admin';
    if (!isAdmin && String(pm.user) !== String(authUserId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const payload = { ...(req.body ?? {}) };

    // No permitir cambiar de dueño
    if ('user' in payload && String(payload.user) !== String(pm.user)) {
      return res.status(400).json({ message: 'Changing payment method owner is not allowed' });
    }

    // Sensibles (accountNumber solo si tipo final = bank_transfer)
    const finalType = payload.type ?? pm.type;
    const willBeBank = finalType === 'bank_transfer';
    const forbidden = ['cardNumber', 'token'];
    if (!willBeBank) forbidden.push('accountNumber');
    for (const k of Object.keys(payload)) {
      if (forbidden.includes(k)) {
        return res.status(400).json({ message: 'Sensitive fields are not allowed via API' });
      }
    }

    // Un solo default por usuario
    if (payload.isDefault === true) {
      await PaymentMethod.updateMany(
        { user: pm.user, _id: { $ne: pm._id }, isDefault: true },
        { $set: { isDefault: false } }
      );
      pm.isDefault = true;
    } else if (payload.isDefault === false) {
      pm.isDefault = false;
    }

    // Asignar campos permitidos (PUT/PATCH)
    const assignable = [
      'type', 'paypalEmail',
      'bankName', 'accountNumber',
      'brand', 'last4', 'cardHolderName', 'expiryDate',
      'active',
    ];
    for (const key of assignable) if (key in payload) pm[key] = payload[key];

    // Guardar para disparar pre('validate') y pre('save') (limpia campos por tipo)
    await pm.save();

    const out = await PaymentMethod.findById(pm._id).lean();
    return res.json({ data: sanitize(out) });
  } catch (err) {
    dbg('updatePaymentMethod', err);
    if (err?.name === 'ValidationError' || err?.name === 'Error' || /required/i.test(err?.message || '')) {
      return res.status(400).json({ error: err.message });
    }
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'Another default payment method already exists for this user' });
    }
    return next(err);
  }
};

/**
 * PATCH /payment-methods/:id/set-default
 * Marca este método como predeterminado y desmarca los demás del usuario.
 * También lo activa si estuviera inactivo.
 */
export const setDefaultPaymentMethod = async (req, res, next) => {
  try {
    const pm = await PaymentMethod.findById(req.params.id);
    if (!pm) return res.status(404).json({ message: 'Payment method not found' });

    const isAdmin = req.user?.role === 'admin';
    const sameUser = String(pm.user) === String(req.user?.id || req.user?.userId);
    if (!isAdmin && !sameUser) return res.status(403).json({ message: 'Forbidden' });

    await PaymentMethod.updateMany(
      { user: pm.user, _id: { $ne: pm._id }, isDefault: true },
      { $set: { isDefault: false } }
    );

    const updated = await PaymentMethod.findByIdAndUpdate(
      pm._id,
      { $set: { isDefault: true, active: true } },
      { new: true }
    );

    return res.json({ data: sanitize(updated) });
  } catch (error) {
    dbg('setDefaultPaymentMethod', error);
    return next(error);
  }
};

/**
 * PATCH /payment-methods/:id/deactivate
 * Soft delete: active=false e isDefault=false
 */
export const deactivatePaymentMethod = async (req, res, next) => {
  try {
    const pm = await PaymentMethod.findById(req.params.id);
    if (!pm) return res.status(404).json({ message: 'Payment method not found' });

    const isAdmin = req.user?.role === 'admin';
    const sameUser = String(pm.user) === String(req.user?.id || req.user?.userId);
    if (!isAdmin && !sameUser) return res.status(403).json({ message: 'Forbidden' });

    const updated = await PaymentMethod.findByIdAndUpdate(
      pm._id,
      { $set: { active: false, isDefault: false } },
      { new: true }
    );

    return res.json({ data: sanitize(updated) });
  } catch (error) {
    dbg('deactivatePaymentMethod', error);
    return next(error);
  }
};
