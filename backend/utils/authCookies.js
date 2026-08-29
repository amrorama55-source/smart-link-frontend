// backend/utils/authCookies.js

// Auth cookie options (HttpOnly, Secure, SameSite)
const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // true in production
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // none requires secure
  domain: process.env.NODE_ENV === 'production' ? '.by-smartlink.com' : undefined,
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// CSRF Token cookie options (Readable by Javascript, NOT HttpOnly)
const getCsrfCookieOptions = () => ({
  httpOnly: false, // MUST be false so frontend can read it
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  domain: process.env.NODE_ENV === 'production' ? '.by-smartlink.com' : undefined,
  // Same maxAge as auth cookie or session length
});

const setAuthCookies = (res, token) => {
  res.cookie('token', token, getAuthCookieOptions());
};

const clearAuthCookies = (res) => {
  res.clearCookie('token', getAuthCookieOptions());
  res.clearCookie('XSRF-TOKEN', getCsrfCookieOptions());
};

module.exports = {
  getAuthCookieOptions,
  getCsrfCookieOptions,
  setAuthCookies,
  clearAuthCookies
};
