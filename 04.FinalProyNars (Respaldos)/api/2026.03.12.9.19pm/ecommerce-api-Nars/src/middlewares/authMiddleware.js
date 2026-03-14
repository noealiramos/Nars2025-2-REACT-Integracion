import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const auth = req.headers['authorization'] || '';
  const parts = auth.split(' ');
  const isBearer = parts.length === 2 && /^Bearer$/i.test(parts[0]);
  const token = isBearer ? parts[1] : null;

  if (!token) return res.status(401).json({ message: 'Unauthorized: missing Bearer token' });
  if (!process.env.JWT_SECRET) return res.status(500).json({ message: 'Server misconfigured: JWT_SECRET missing' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err?.name === 'TokenExpiredError') return res.status(401).json({ message: 'Token expired' });
    if (err) return res.status(403).json({ message: 'Invalid token' });
    // Normaliza un id usable en controladores
    if (decoded?.userId && !decoded.id) decoded.id = decoded.userId;
    req.user = decoded;
    next();
  });
};

export default authMiddleware;
