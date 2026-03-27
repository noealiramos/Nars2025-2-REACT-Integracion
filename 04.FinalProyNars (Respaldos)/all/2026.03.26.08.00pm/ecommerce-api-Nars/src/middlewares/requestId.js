import { randomUUID } from 'crypto';

const requestId = (req, res, next) => {
  const existing = req.headers['x-request-id'];
  const id = Array.isArray(existing) ? existing[0] : existing;
  req.requestId = id || randomUUID();
  req.id = req.requestId;
  res.setHeader('X-Request-Id', req.requestId);
  next();
};

export default requestId;
