import 'dotenv/config';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret';

/**
 * Create a simple JWT token (base64 encoded JSON)
 * @param {Object} payload - Token payload
 * @param {number} expiresIn - Expiration time in seconds (default: 24 hours)
 * @returns {string} - JWT token
 */
export function createToken(payload, expiresIn = 86400) {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const claims = {
    ...payload,
    iat: now,
    exp: now + expiresIn,
  };

  const headerEncoded = Buffer.from(JSON.stringify(header)).toString('base64url');
  const payloadEncoded = Buffer.from(JSON.stringify(claims)).toString('base64url');

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest('base64url');

  return `${headerEncoded}.${payloadEncoded}.${signature}`;
}

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} - Decoded payload or null if invalid
 */
export function verifyToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerEncoded, payloadEncoded, signatureProvided] = parts;

    const signature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${headerEncoded}.${payloadEncoded}`)
      .digest('base64url');

    if (signature !== signatureProvided) return null;

    const payload = JSON.parse(Buffer.from(payloadEncoded, 'base64url').toString());

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;

    return payload;
  } catch (error) {
    return null;
  }
}
