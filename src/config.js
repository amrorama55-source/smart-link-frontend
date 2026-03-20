
// frontend/src/config.js - FINAL CORRECT VERSION

export const API_URL = import.meta.env.VITE_API_URL || 'https://api.smart-link.website';

// ✅ SHORT_URL_BASE always matches the API (short links are served from the same domain)
export const SHORT_URL_BASE = import.meta.env.VITE_SHORT_URL_BASE
  ? (import.meta.env.VITE_SHORT_URL_BASE.startsWith('http://localhost')
      ? API_URL
      : import.meta.env.VITE_SHORT_URL_BASE)
  : API_URL;

// ✅ Frontend URL
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'https://www.smart-link.website';

console.log('🔗 Smart Link Config:', {
  apiUrl: API_URL,
  shortUrlBase: SHORT_URL_BASE
});