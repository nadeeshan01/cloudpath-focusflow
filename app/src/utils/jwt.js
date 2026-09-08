const jwt = require("jsonwebtoken");
const env = require("../config/env");

function signAccessToken(userId) {
  return jwt.sign(
    {
      sub: userId,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    },
  );
}

module.exports = {
  signAccessToken,
};