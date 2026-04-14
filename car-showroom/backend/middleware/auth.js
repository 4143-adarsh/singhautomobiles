const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token and protect admin routes
 */
const authMiddleware = (req, res, next) => {
  // Get token from Authorization header (Bearer <token>)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user payload to request
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token. Please login again.',
    });
  }
};

module.exports = authMiddleware;
