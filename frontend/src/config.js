
const isLocal = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_URL = isLocal ? 'http://localhost:3000' : 'https://smartlinkapi-rryrycdl.b4a.run';

// Always use localhost for testing short links locally
export const SHORT_URL_BASE = isLocal ? 'http://localhost:3000' : 'https://smartlinkapi-rryrycdl.b4a.run';

// Frontend URL
export const FRONTEND_URL = isLocal ? 'http://localhost:5173' : 'https://www.by-smartlink.com';

console.log('🔗 Smart Link Dynamic Config:', {
  isLocal,
  apiUrl: API_URL,
  shortUrlBase: SHORT_URL_BASE
});