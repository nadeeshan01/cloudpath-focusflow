const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');

async function requireAuth(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is required',
      });
    }

    const token = authorizationHeader.substring('Bearer '.length);
    const payload = verifyAccessToken(token);

    if (!payload || !payload.sub) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token',
      });
    }

    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account no longer exists',
      });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
    });
  }
}

async function optionalAuth(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader?.startsWith('Bearer ')) {
    const token = authorizationHeader.substring('Bearer '.length);
    const payload = verifyAccessToken(token);

    if (payload && payload.sub) {
      try {
        const user = await User.findById(payload.sub);
        if (user) {
          req.user = user;
          return next();
        }
      } catch {
        // fall through
      }
    }
  }

  req.user = null;
  return next();
}

module.exports = {
  requireAuth,
  optionalAuth,
};
