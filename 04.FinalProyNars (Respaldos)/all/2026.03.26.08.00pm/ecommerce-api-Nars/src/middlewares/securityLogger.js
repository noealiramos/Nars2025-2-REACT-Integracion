import logger from './logger.js';

export const securityLogger = (action) => (req, _res, next) => {
  const user = req.user ? req.user.userId : 'Anonymous';
  const data = {
    ip: req.ip,
    method: req.method,
    url: req.originalUrl,
    userId: user,
    action: action,
    timestamp: new Date().toISOString()
  };

  logger.warn(`Security Event: ${action}`, data);
  if (next) next();
};

export const logFailedLogin = (email, ip, reason) => {
  logger.warn('Security Event: Login Failed', {
    email,
    ip,
    reason,
    timestamp: new Date().toISOString()
  });
};

export const logRateLimit = (req) => {
  logger.warn('Security Event: Rate Limit Tripped', {
    ip: req.ip,
    url: req.originalUrl,
    timestamp: new Date().toISOString()
  });
};
