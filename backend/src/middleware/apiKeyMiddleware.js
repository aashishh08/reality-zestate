export const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key is required',
    });
  }

  if (apiKey !== process.env.CRM_API_KEY) {
    return res.status(401).json({
      success: false,
      message: 'Invalid API key',
    });
  }

  next();
};

export default apiKeyMiddleware;
