export const getPaginationParams = (query = {}) => {
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  const offset = Math.max(parseInt(query.offset, 10) || 0, 0);

  return {
    limit,
    offset,
    page: Math.floor(offset / limit) + 1,
  };
};

export const formatPaginatedResponse = (data, total, limit, offset) => {
  const page = Math.floor(offset / limit) + 1;
  const pages = Math.ceil(total / limit);

  return {
    success: true,
    data,
    pagination: {
      total,
      limit,
      offset,
      page,
      pages,
      hasNextPage: page < pages,
      hasPrevPage: page > 1,
    },
  };
};

export default {
  getPaginationParams,
  formatPaginatedResponse,
};
