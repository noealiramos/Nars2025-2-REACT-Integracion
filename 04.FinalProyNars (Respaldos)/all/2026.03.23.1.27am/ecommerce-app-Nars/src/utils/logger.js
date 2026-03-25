const APP_PREFIX = "[RamdiApp]";

const shouldLogDebug = import.meta.env.DEV;

const print = (method, scope, message, meta) => {
  const prefix = scope ? `${APP_PREFIX} ${scope}` : APP_PREFIX;

  if (meta === undefined) {
    console[method](`${prefix}: ${message}`);
    return;
  }

  console[method](`${prefix}: ${message}`, meta);
};

export const logger = {
  debug(scope, message, meta) {
    if (!shouldLogDebug) return;
    print("debug", scope, message, meta);
  },
  info(scope, message, meta) {
    print("info", scope, message, meta);
  },
  warn(scope, message, meta) {
    print("warn", scope, message, meta);
  },
  error(scope, message, meta) {
    print("error", scope, message, meta);
  },
};
