import express from 'express';
import env from '../config/env.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import RefreshToken from '../models/refreshToken.js';

const router = express.Router();

router.use((req, res, next) => {
  if (env.NODE_ENV !== 'test' || !env.ENABLE_TEST_AUTH_TOOLS) {
    return res.status(404).json({ message: 'Route not found' });
  }

  return next();
});

router.post('/auth/test/revoke-refresh-tokens', authMiddleware, async (req, res, next) => {
  try {
    const authUserId = req.user?.id || req.user?.userId;

    if (!authUserId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await RefreshToken.updateMany(
      { user: authUserId, revoked: false },
      { $set: { revoked: true } }
    );

    return res.status(200).json({
      message: 'Refresh tokens revoked for authenticated user',
      revokedCount: result.modifiedCount || 0,
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
