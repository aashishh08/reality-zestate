/**
 * Utility helper functions
 */

/**
 * Validate UUID format
 */
export const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Pagination helper
 */
export const getPaginationParams = (page = 1, limit = 10, maxLimit = 100) => {
  const cleanPage = Math.max(1, parseInt(page, 10) || 1);
  const cleanLimit = Math.min(Math.max(1, parseInt(limit, 10) || 10), maxLimit);
  const offset = (cleanPage - 1) * cleanLimit;

  return {
    page: cleanPage,
    limit: cleanLimit,
    offset,
  };
};

/**
 * Format pagination response
 */
export const formatPaginatedResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Trim object strings
 */
export const trimObjectStrings = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;

  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key] = typeof value === 'string' ? value.trim() : value;
    return acc;
  }, {});
};

/**
 * Generate random string
 */
export const generateRandomString = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default {
  isValidUUID,
  getPaginationParams,
  formatPaginatedResponse,
  trimObjectStrings,
  generateRandomString,
};
