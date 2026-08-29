// backend/utils/safeUrl.js
const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim().toLowerCase();
  
  // Prevent javascript: and data: URIs which can cause XSS
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:text/html') || trimmed.startsWith('vbscript:')) {
    return '';
  }
  
  return url.trim();
};

module.exports = sanitizeUrl;
