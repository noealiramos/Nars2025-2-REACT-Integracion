import Review from '../models/review.js';
import { getPagination } from '../utils/pagination.js';

/**
 * OPTIONAL (admin): listado paginado con filtros por query (?product, ?user, ?rating, ?sort, ?order)
 */
async function getReviews(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req, 10);

    const filter = {};
    if (req.query.product) filter.product = req.query.product;
    if (req.query.user) filter.user = req.query.user;
    if (req.query.rating) filter.rating = Number(req.query.rating);

    const sortField = req.query.sort || 'createdAt';
    const sortOrder = (req.query.order || 'desc').toLowerCase() === 'desc' ? -1 : 1;
    const sort = { [sortField]: sortOrder };

    const [reviews, totalResults] = await Promise.all([
      Review.find(filter)
        .populate('user', 'displayName email _id')
        .populate('product', 'name _id')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalResults / limit) || 1;

    return res.status(200).json({
      reviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /reviews/product/:productId
 */
async function getProductReviews(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req, 10);
    const { productId } = req.params;

    const filter = { product: productId };

    const sortField = req.query.sort || 'createdAt';
    const sortOrder = (req.query.order || 'desc').toLowerCase() === 'desc' ? -1 : 1;
    const sort = { [sortField]: sortOrder };

    const [reviews, totalResults] = await Promise.all([
      Review.find(filter)
        .populate('user', 'displayName email _id')
        .populate('product', 'name _id')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalResults / limit) || 1;

    return res.status(200).json({
      reviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /reviews/my-reviews   (usa req.user.id/userId)
 */
async function getUserReviews(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req, 10);
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: missing user in request' });
    }

    const filter = { user: userId };

    const sortField = req.query.sort || 'createdAt';
    const sortOrder = (req.query.order || 'desc').toLowerCase() === 'desc' ? -1 : 1;
    const sort = { [sortField]: sortOrder };

    const [reviews, totalResults] = await Promise.all([
      Review.find(filter)
        .populate('user', 'displayName email _id')
        .populate('product', 'name _id')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalResults / limit) || 1;

    return res.status(200).json({
      reviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /reviews   (user desde auth)
 * body validado en routes: { product, rating, comment? }
 */
async function createReview(req, res, next) {
  try {
    const authUserId = req.user?.id || req.user?.userId;
    const { user: bodyUser, product, rating, comment } = req.body;

    const user = authUserId || bodyUser;
    if (!user || !product || rating == null) {
      return res.status(400).json({ error: 'user (implícito), product y rating son obligatorios' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'rating debe estar entre 1 y 5' });
    }

    // Evitar duplicado por usuario/producto (defensa extra al índice único)
    const existing = await Review.findOne({ user, product }).lean();
    if (existing) {
      return res.status(409).json({ message: 'Ya existe una reseña para este producto por este usuario' });
    }

    const review = await Review.create({ user, product, rating, comment: comment || '' });
    await review.populate('user', 'displayName email _id');
    await review.populate('product', 'name _id');

    return res.status(201).json(review);
  } catch (error) {
    // Si activas el índice único, captura el 11000
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'Ya existe una reseña para este producto por este usuario' });
    }
    return next(error);
  }
}

/**
 * PUT /reviews/:reviewId
 * (solo dueño o admin)
 */
async function updateReview(req, res, next) {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Reseña no encontrada' });

    const isAdmin = req.user?.role === 'admin';
    const sameUser = String(review.user) === String(req.user?.id || req.user?.userId);
    if (!isAdmin && !sameUser) return res.status(403).json({ message: 'Forbidden' });

    const updateData = {};
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'rating debe estar entre 1 y 5' });
      }
      updateData.rating = rating;
    }
    if (comment !== undefined) updateData.comment = comment;

    const updated = await Review.findByIdAndUpdate(reviewId, updateData, { new: true })
      .populate('user', 'displayName email _id')
      .populate('product', 'name _id');

    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
}

/**
 * DELETE /reviews/:reviewId
 * (solo dueño o admin)
 */
async function deleteReview(req, res, next) {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId).lean();
    if (!review) return res.status(404).json({ message: 'Reseña no encontrada' });

    const isAdmin = req.user?.role === 'admin';
    const sameUser = String(review.user) === String(req.user?.id || req.user?.userId);
    if (!isAdmin && !sameUser) return res.status(403).json({ message: 'Forbidden' });

    await Review.findByIdAndDelete(reviewId);
    return res.status(200).json({
      status: 'success',
      message: 'Reseña eliminada correctamente',
      data: { _id: reviewId },
    });
  } catch (error) {
    return next(error);
  }
}

export {
  getReviews,         // opcional (admin)
  getProductReviews,  // usado por tus rutas
  getUserReviews,     // usado por tus rutas
  createReview,
  updateReview,
  deleteReview,
};
