/**
 * Convierte a entero seguro. Si no es número, usa el fallback.
 */
const toInt = (value, fallback) => {
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? fallback : n;
};

/**
 * Lee page/limit desde req.query con límites y valores por defecto.
 * @param {import('express').Request} req
 * @param {number} defaultLimit Límite por defecto (ej. 10)
 * @returns {{ page: number, limit: number, skip: number }}
 */
export const getPagination = (req, defaultLimit = 10) => {
  const rawPage = toInt(req?.query?.page, 1);
  const rawLimit = toInt(req?.query?.limit, defaultLimit);

  const page = Math.max(rawPage, 1);
  const limit = Math.min(Math.max(rawLimit, 1), 100); // [1, 100]
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Construye metadatos de paginación uniformes para respuestas.
 * @param {{ page: number, limit: number, total: number }} params
 * @returns {{ total: number, totalPages: number, currentPage: number, hasNext: boolean, hasPrev: boolean, nextPage: number|null, prevPage: number|null }}
 */
export const buildMeta = ({ page, limit, total }) => {
  const totalSafe = Math.max(toInt(total, 0), 0);
  const totalPages = Math.max(1, Math.ceil(totalSafe / limit || 0));

  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    total: totalSafe,
    totalPages,
    currentPage: page,
    hasNext,
    hasPrev,
    nextPage: hasNext ? page + 1 : null,
    prevPage: hasPrev ? page - 1 : null,
  };
};
