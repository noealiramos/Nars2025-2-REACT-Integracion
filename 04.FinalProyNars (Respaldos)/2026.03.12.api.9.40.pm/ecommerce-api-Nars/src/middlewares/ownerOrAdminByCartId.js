import mongoose from 'mongoose';
import Cart from '../models/cart.js';

// Permite modificar/eliminar un carrito solo si el usuario autenticado es el dueño o es admin
const ownerOrAdminByCartId = async (req, res, next) => {
  try {
    const authUserId = req.user?.id || req.user?.userId;     // tomado del token por authMiddleware
    const isAdminRole = req.user?.role === 'admin';
    const { id } = req.params;

    if (!authUserId) return res.status(401).json({ message: 'Unauthorized' });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid cart id' });
    }

    const cart = await Cart.findById(id).select('user').lean();
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    const isOwner = String(cart.user) === String(authUserId);
    if (!isOwner && !isAdminRole) {
      return res.status(403).json({ message: 'Forbidden: you can only modify your own cart' });
    }

    return next();
  } catch (e) {
    return next(e);
  }
};

export default ownerOrAdminByCartId;
