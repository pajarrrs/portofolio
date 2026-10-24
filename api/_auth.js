const crypto = require('crypto');

function getSecret() {
  return (process.env.ADMIN_PASSWORD || 'admin123').trim();
}

function generateToken() {
  const secret = getSecret();
  // Valid for 7 days
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ exp: expiresAt })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifyToken(req) {
  const authHeader = req.headers['authorization'] || req.headers['x-admin-token'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();

  if (!token) return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payload, signature] = parts;
  const secret = getSecret();
  const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');

  if (signature !== expectedSignature) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.exp || Date.now() > data.exp) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

function verifyPassword(inputPassword) {
  const secret = getSecret();
  return String(inputPassword || '').trim() === secret;
}

module.exports = {
  generateToken,
  verifyToken,
  verifyPassword
};

