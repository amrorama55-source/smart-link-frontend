// services/geolocation.js - FIXED: Now saves city data!

/**
 * Get client's real IP address
 */
const getClientIP = (req) => {
  const ip = (
    req.headers['cf-connecting-ip'] ||
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.ip ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    'Unknown'
  );

  // Clean IPv6 format
  const cleanIP = ip.replace('::ffff:', '');
  console.log('🔍 Detected IP:', cleanIP);
  return cleanIP;
};

/**
 * Check if IP is localhost or private
 */
const isPrivateIP = (ip) => {
  const privatePatterns = [
    '::1',
    '127.0.0.1',
    'localhost',
    /^192\.168\./,
    /^10\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
    'Unknown'
  ];

  return privatePatterns.some(pattern => {
    if (typeof pattern === 'string') {
      return ip === pattern || ip.includes(pattern);
    }
    return pattern.test(ip);
  });
};

const geoip = require('geoip-lite');

/**
 * Get detailed location from IP using local database
 */
const getLocationFromIP = (ip) => {
  console.log('🌍 Starting local geolocation for IP:', ip);

  // Handle private IPs
  if (isPrivateIP(ip)) {
    console.log('🏠 Private/Local IP detected -> Using default JO');
    return {
      country: process.env.DEFAULT_COUNTRY || 'JO',
      countryName: 'Jordan (Default)',
      city: null,
      region: null,
      timezone: null,
      isPrivate: true
    };
  }

  const geo = geoip.lookup(ip);
  if (geo) {
    console.log(`✅ Local Country found: ${geo.country}`);
    return {
      country: geo.country,
      countryName: geo.country,
      city: geo.city || 'Unknown',
      region: geo.region || 'Unknown',
      timezone: geo.timezone || 'Unknown',
      isPrivate: false
    };
  }

  console.log('❌ Geolocation failed -> Unknown');
  return {
    country: 'Unknown',
    countryName: 'Unknown',
    city: null,
    region: null,
    timezone: null,
    isPrivate: false
  };
};

/**
 * Check if user agent is a bot using the industry-standard isbot library
 * This is much more accurate than a simple regex list.
 */
const isbot = require('is-bot');

const isBot = (userAgent) => {
  if (!userAgent) return true;
  return isbot(userAgent);
};

/**
 * Heuristic check for Datacenter/VPN IP ranges
 */
const isDatacenterIP = (ip, req) => {
  const dcHeaders = [
    'x-vultr-ip', 'x-digitalocean-ip', 'x-aws-ip',
    'x-heroku-ip', 'x-google-ip'
  ];

  const hasDCHeader = dcHeaders.some(h => req.headers[h]);
  if (hasDCHeader) return true;

  const dcPatterns = [
    /^20\.([0-9]+)\./, // Azure
    /^52\.([0-9]+)\./, // AWS
    /^34\.([0-9]+)\./, // Google Cloud
    /^104\.([0-9]+)\./, // Cloudflare
    /^159\.([0-9]+)\./, // DigitalOcean
  ];

  return dcPatterns.some(pattern => pattern.test(ip));
};

/**
 * Generate a Browser Fingerprint from Request Headers
 */
const getFingerprint = (req) => {
  const crypto = require('crypto');

  // Create a stronger fingerprint using multiple header signals
  const components = [
    req.headers['user-agent'] || 'none',
    req.headers['accept-language'] || 'none',
    req.headers['accept-encoding'] || 'none',
    req.headers['accept'] || 'none',
    req.headers['sec-ch-ua-platform'] || 'none',
    req.headers['sec-ch-ua-mobile'] || 'none',
    req.headers['sec-ch-ua'] || 'none',
    req.headers['sec-fetch-site'] || 'none',
    req.headers['sec-fetch-mode'] || 'none',
    req.headers['sec-fetch-dest'] || 'none'
  ];

  return crypto
    .createHash('sha256')
    .update(components.join('|'))
    .digest('hex');
};

/**
 * Get comprehensive tracking data
 * ✅ FAST: Uses local geoip-lite instead of external APIs!
 */
const getTrackingData = async (req, parseUserAgent) => {
  const userAgent = req.headers['user-agent'] || '';
  const ip = getClientIP(req);

  console.log('📊 Building tracking data for IP:', ip);

  const { device, browser, os } = parseUserAgent(userAgent);
  const location = getLocationFromIP(ip);

  let country = req.headers['cf-ipcountry'];
  if (!country || country === 'XX') {
    country = location.country;
  } else {
    console.log('✅ Using Cloudflare country:', country);
  }

  const trackingData = {
    timestamp: new Date(),
    ip,
    userAgent,
    referer: req.headers.referer || req.headers.referrer || 'Direct',
    device,
    browser,
    os,
    isMobile: device === 'Mobile',
    isBot: isBot(userAgent),
    country,
    city: location.city || 'Unknown',
    region: location.region || 'Unknown',
    timezone: location.timezone || 'Unknown',
    fingerprint: getFingerprint(req),
    isDatacenter: isDatacenterIP(ip, req),
    language: req.headers['accept-language']?.split(',')[0].split('-')[0].toLowerCase() || 'Unknown'
  };

  console.log('✅ Final tracking data ready with local db');
  return trackingData;
};

module.exports = {
  getClientIP,
  isPrivateIP,
  getLocationFromIP,
  isBot,
  getTrackingData
};