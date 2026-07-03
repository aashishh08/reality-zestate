import jwt from 'jsonwebtoken';

/**
 * Attempts to authenticate the request but never blocks it.
 * Sets req.user when a valid Bearer token is present; otherwise leaves it
 * undefined. Used on public routes that need to reveal extra data (e.g.
 * unpublished properties) to authenticated admins only.
 */
export const optionalAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // Invalid/expired token on a public route — treat as anonymous rather than failing.
  }

  next();
};

export default optionalAuthMiddleware;
