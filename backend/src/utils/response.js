export const successResponse = (data, message = 'Success', statusCode = 200) => {
  return {
    success: true,
    message,
    data,
  };
};

export const errorResponse = (message, statusCode = 500, errors = null) => {
  return {
    success: false,
    message,
    ...(errors && { errors }),
  };
};

export const paginatedResponse = (data, total, limit, offset, message = 'Success') => {
  return {
    success: true,
    message,
    data,
    pagination: {
      total,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      pages: Math.ceil(total / limit),
    },
  };
};

export default {
  successResponse,
  errorResponse,
  paginatedResponse,
};
