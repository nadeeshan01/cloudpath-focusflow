const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");

async function requireAuth(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
    }

    const token = authorizationHeader.substring("Bearer ".length);

    const payload = jwt.verify(token, env.jwtSecret);

    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists",
      });
    }

    req.user = user;

    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
}

module.exports = {
  requireAuth,
};