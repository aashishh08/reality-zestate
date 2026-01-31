export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const validateRequest = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    req.validated = validated;
    next();
  } catch (error) {
    next({
      status: 400,
      message: error.message,
    });
  }
};
