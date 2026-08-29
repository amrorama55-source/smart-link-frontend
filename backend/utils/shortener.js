const { customAlphabet } = require('nanoid');
const QRCode = require('qrcode');

// Generate short code (7 characters, URL-safe)
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 7);

exports.generateShortCode = () => {
  return nanoid();
};

// Validate URL
exports.isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

// Generate QR Code
exports.generateQRCode = async (url) => {
  try {
    const qrCode = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 400
    });
    return qrCode;
  } catch (error) {
    console.error('QR Code generation error:', error);
    return null;
  }
};

// Parse User Agent
exports.parseUserAgent = (userAgent) => {
  const ua = userAgent || '';
  
  let device = 'Desktop';
  let browser = 'Unknown';
  let os = 'Unknown';
  let isBot = false;

  // Bot detection (First-line regex check)
  if (/bot|googlebot|crawler|spider|robot|crawling|facebookexternalhit|bingbot|yandex|baidu/i.test(ua)) {
    isBot = true;
  }

  // Device detection
  if (/mobile/i.test(ua)) device = 'Mobile';
  else if (/tablet|ipad/i.test(ua)) device = 'Tablet';

  // Browser detection
  if (/edg/i.test(ua)) browser = 'Edge';
  else if (/chrome/i.test(ua)) browser = 'Chrome';
  else if (/firefox/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua)) browser = 'Safari';
  else if (/opera/i.test(ua)) browser = 'Opera';

  // OS detection
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/mac/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/ios|iphone|ipad/i.test(ua)) os = 'iOS';

  return { device, browser, os, isBot };
};

// Validate custom alias
exports.isValidAlias = (alias) => {
  // 3-20 characters, alphanumeric and hyphens only
  const regex = /^[a-zA-Z0-9-_]{3,50}$/;
  
  // Reserved words
  const reserved = ['api', 'admin', 'dashboard', 'login', 'register', 'auth', 'health'];
  
  return regex.test(alias) && !reserved.includes(alias.toLowerCase());
};