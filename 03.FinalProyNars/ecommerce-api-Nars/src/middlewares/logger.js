const logger = (req, res, next) => {
  const start = Date.now();
  const dateTime = new Date();
  const rid = req.requestId || '-';
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${dateTime.toISOString()} | ${rid} | ${req.method} ${req.originalUrl} | ${res.statusCode} | ${ms}ms`);
  });
  next();
}

export default logger;
