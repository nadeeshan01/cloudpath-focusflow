const crypto = require('crypto');
const env = require('../config/env');

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

function signAccessToken(userId) {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64UrlEncode(
    JSON.stringify({
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    })
  );

  const signature = crypto
    .createHmac('sha256', env.jwtSecret)
    .update(`${header}.${payload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${header}.${payload}.${signature}`;
}

function verifyAccessToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', env.jwtSecret)
    .update(`${header}.${payload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  if (signature !== expectedSignature) return null;

  try {
    const decodedPayload = JSON.parse(base64UrlDecode(payload));
    if (decodedPayload.exp && decodedPayload.exp < Date.now() / 1000) {
      return null;
    }
    return decodedPayload;
  } catch {
    return null;
  }
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
};
