// backend/middleware/csrf.js
const crypto = require('crypto');
const { getCsrfCookieOptions } = require('../utils/authCookies');

const csrfMiddleware = (req, res, next) => {
  // ✅ Skip CSRF in local development to prevent browser port mismatch cookie issues
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  // Methods that don't change state are allowed
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    // Generate a CSRF token if one doesn't exist, and set it as a cookie
    if (!req.cookies['XSRF-TOKEN']) {
      const csrfToken = crypto.randomBytes(32).toString('hex');
      res.cookie('XSRF-TOKEN', csrfToken, getCsrfCookieOptions());
      req.csrfToken = csrfToken;
    }
    return next();
  }

  // ✅ Skip CSRF for requests with API Key (programmatic access)
  if (req.headers['x-api-key']) {
    return next();
  }

  // ✅ Skip CSRF for Chrome/Firefox extension origins
  // Extensions cannot receive Set-Cookie headers, so token exchange is impossible.
  // Extension requests cannot be CSRF-ed by definition (no cross-site context).
  const origin = req.headers['origin'] || '';
  if (
    origin.startsWith('chrome-extension://') ||
    origin.startsWith('moz-extension://') ||
    origin.startsWith('safari-web-extension://')
  ) {
    return next();
  }

  // ✅ Skip CSRF for public extension endpoint
  if (req.originalUrl && req.originalUrl.startsWith('/api/public/')) {
    return next();
  }

  // For all other POST/PUT/DELETE, verify the CSRF token
  const headerToken = req.headers['x-csrf-token'];
  const bodyToken = req.body && req.body._csrf;
  const providedToken = headerToken || bodyToken;
  const cookieToken = req.cookies['XSRF-TOKEN'];

  if (!providedToken || !cookieToken || providedToken !== cookieToken) {
    return res.status(403).json({ error: 'CSRF token validation failed' });
  }

  next();
};

module.exports = csrfMiddleware;
