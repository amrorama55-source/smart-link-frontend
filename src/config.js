
// frontend/src/config.js - FINAL CORRECT VERSION

export const API_URL = import.meta.env.VITE_API_URL || 'https://api.smart-link.website/api';

export const SHORT_URL_BASE = import.meta.env.VITE_SHORT_URL_BASE || 'https://api.smart-link.website';

// ✅ Frontend URL
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'https://www.smart-link.website';

console.log('🔗 Smart Link Config:', {
  apiUrl: API_URL,
  shortUrlBase: SHORT_URL_BASE
});