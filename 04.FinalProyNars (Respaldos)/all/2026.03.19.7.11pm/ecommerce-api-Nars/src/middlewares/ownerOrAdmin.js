import mongoose from 'mongoose';

/**
 * Middleware para autorizar si el usuario es Admin o el dueño del recurso.
 *
 * @param {string|Object} options - Si es string: nombre del param que contiene el userId.
 *                                - Si es Objeto: { model: MongooseModel, paramName: 'id' }
 */
export default function ownerOrAdmin(options = 'userId') {
  return async (req, res, next) => {
    try {
      const authUserId = req.user?.id || req.user?.userId;
      const isAdmin = req.user?.role === 'admin';

      if (!authUserId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Si es ADMIN, pasa siempre
      if (isAdmin) {
        return next();
      }

      // CASO A: Comparar id del token con un parámetro de la URL (ej: /user/:userId)
      if (typeof options === 'string') {
        const userIdFromParam = req.params[options];
        if (userIdFromParam && String(authUserId) === String(userIdFromParam)) {
          return next();
        }
      }

      // CASO B: Consultar en DB si el recurso pertenece al usuario (ej: /orders/:id)
      if (options && typeof options === 'object' && options.model) {
        const resourceId = req.params[options.paramName || 'id'];

        if (!mongoose.Types.ObjectId.isValid(resourceId)) {
          return res.status(400).json({ message: `Invalid ${options.paramName || 'id'}` });
        }

        const doc = await options.model.findById(resourceId).select('user').lean();
        if (!doc) {
          return res.status(404).json({ message: 'Resource not found' });
        }

        // Se asume que el documento tiene un campo 'user' (ObjectId o String)
        if (doc.user && String(doc.user) === String(authUserId)) {
          return next();
        }
      }

      return res.status(403).json({ message: 'Forbidden' });
    } catch (error) {
      return next(error);
    }
  };
}


