const jwt = require('jsonwebtoken');
const env = require('../config/env');

function signAccessToken(userId) {
  return jwt.sign(
    {
      sub: userId,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    }
  );
}

function verifyAccessToken(token) {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch {
    return null;
  }
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
};
