export default function ownerOrAdmin(paramName = 'userId') {
  return (req, res, next) => {
    const userFromToken = req.user?.id || req.user?.userId;
    const isAdmin = req.user?.role === 'admin';
    const isOwner = userFromToken && String(userFromToken) === String(req.params[paramName]);
    if (isAdmin || isOwner) return next();
    return res.status(403).json({ message: 'Forbidden' });
  };
}


