
// frontend/src/config.js - FINAL CORRECT VERSION

export const API_URL = import.meta.env.VITE_API_URL || 'https://api.by-smartlink.com';

// ✅ Always use the real production domain regardless of any env var
export const SHORT_URL_BASE = 'https://api.by-smartlink.com';

// ✅ Frontend URL
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'https://www.by-smartlink.com';

console.log('🔗 Smart Link Config:', {
  apiUrl: API_URL,
  shortUrlBase: SHORT_URL_BASE
});