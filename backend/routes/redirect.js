// routes/redirect.js - ENHANCED with Geographic & Device Targeting
// Safe integration - No changes to existing Password/Pixel/A/B logic

const Link = require('../models/Link');
const { parseUserAgent } = require('../utils/shortener');
const { getTrackingData } = require('../services/geolocation');
const bcrypt = require('bcryptjs');
const { checkUrlSafety } = require('../utils/urlSafety');
const redisClient = require('../config/redis');
const analyticsQueue = require('../jobs/analyticsQueue');
const logger = require('../utils/logger');

module.exports = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const password = req.body.password || req.query.password;


    // 1. Block file extensions (security scan attempts)
    const blockedExtensions = [
      '.php', '.asp', '.aspx', '.jsp', '.cgi', '.pl', '.py',
      '.sql', '.db', '.log', '.bak', '.zip', '.tar', '.gz',
      '.env', '.ini', '.conf', '.config', '.yml', '.yaml',
      '.json', '.xml', '.txt', '.ico', '.md'
    ];

    const hasBlockedExtension = blockedExtensions.some(ext =>
      shortCode.toLowerCase().endsWith(ext)
    );

    if (hasBlockedExtension) {
      return res.status(404).send('Not Found');
    }

    // 2. Block paths starting with dot or underscore (hidden files)
    if (shortCode.startsWith('.') || shortCode.startsWith('_')) {
      return res.status(404).send('Not Found');
    }

    // 3. Block common scanner patterns
    const scannerPatterns = [
      /backup/i, /config/i, /admin/i, /wp-/i, /wordpress/i,
      /phpmyadmin/i, /mysql/i, /database/i, /dump/i, /error/i,
      /debug/i, /test/i, /phpinfo/i, /info/i, /server/i,
      /credentials/i, /secret/i, /api[_-]?key/i, /aws/i, /azure/i,
      /docker/i, /\.git/i, /\.svn/i, /\.htaccess/i, /thumbs\.db/i
    ];

    const isScannerAttempt = scannerPatterns.some(pattern =>
      pattern.test(shortCode)
    );

    if (isScannerAttempt) {
      // Optional: Log suspicious IPs for blocking
      const suspiciousIP = req.headers['cf-connecting-ip'] ||
        req.headers['x-real-ip'] ||
        req.ip;
      logger.security('Scanner probe blocked — IP:', suspiciousIP, '| path:', shortCode);

      return res.status(404).send('Not Found');
    }

    // 4. Block path traversal attempts
    if (shortCode.includes('..') || shortCode.includes('//')) {
      return res.status(404).send('Not Found');
    }

    const staticFiles = [
      'favicon.ico', 'robots.txt', 'sitemap.xml', 'meta.json',
      'manifest.json', 'apple-touch-icon.png', 'apple-touch-icon-precomposed.png',
      '.well-known', 'ads.txt', 'app-ads.txt'
    ];

    const isStaticFile = staticFiles.some(file =>
      shortCode === file || shortCode.startsWith(file) ||
      shortCode.endsWith('.json') || shortCode.endsWith('.xml') ||
      shortCode.endsWith('.txt') || shortCode.endsWith('.ico') ||
      shortCode.startsWith('.')
    );

    if (isStaticFile) {
      return res.status(404).send('Not Found');
    }

    const cacheKey = `link:${shortCode}`;
    let link = null;

    try {
      const cachedLinkStr = await redisClient.get(cacheKey);
      if (cachedLinkStr) {
        const cachedData = JSON.parse(cachedLinkStr);
        link = new Link(cachedData);
        link.isNew = false;
      }
    } catch (redisErr) {
      logger.warn('Redis fetch failed:', redisErr.message);
    }

    if (!link) {
      // Find link and owner plan + ban status
      link = await Link.findOne({ shortCode })
        .select('+password')
        .populate('userId', 'plan isBanned globalWebhookUrl');
        
      if (link) {
        try {
          // Cache for 5 minutes (300 seconds)
          // Clone the object and remove password hash before caching
          const linkForCache = link.toObject();
          delete linkForCache.password;
          await redisClient.setex(cacheKey, 300, JSON.stringify(linkForCache));
        } catch (redisErr) {
          logger.warn('Redis save failed:', redisErr.message);
        }
      }
    }

    if (!link) {
      return res.status(404).send(generateErrorPage('404', 'Link Not Found', 'This link does not exist.'));
    }

    // 🚫 BANNED USER CHECK - Block all links from banned users
    if (link.userId?.isBanned) {
      return res.status(410).send(generateErrorPage('🚫', 'Content Removed', 'This link has been removed for violating our terms of service.'));
    }

    // Check if link is active
    if (!link.isActive) {
      return res.status(410).send(generateErrorPage('⚠️', 'Link Deactivated', 'This link has been deactivated.'));
    }

    // Check if expired
    if (link.expiresAt && new Date() > link.expiresAt) {
      if (link.schedule?.redirectAfterExpiry) {
        return res.redirect(302, link.schedule.redirectAfterExpiry);
      }

      return res.status(410).send(generateErrorPage('⏰', 'Link Expired', 'This link has expired.'));
    }

    // Check schedule with Timezone Support
    if (link.schedule?.enabled) {
      const { DateTime } = require('luxon');
      const userTz = link.schedule.timezone || 'UTC';
      const now = DateTime.now().setZone(userTz);

      const startDate = link.schedule.startDate ? DateTime.fromJSDate(new Date(link.schedule.startDate)).setZone(userTz) : null;
      const endDate = link.schedule.endDate ? DateTime.fromJSDate(new Date(link.schedule.endDate)).setZone(userTz) : null;

      if (startDate && now < startDate) {
        return res.status(403).send(generateErrorPage('🕐', 'Not Yet Active', `Available starting ${startDate.toLocaleString(DateTime.DATETIME_MED)} (${userTz}).`));
      }

      if (endDate && now > endDate) {
        if (link.schedule.redirectAfterExpiry) {
          return res.redirect(302, link.schedule.redirectAfterExpiry);
        }
        return res.status(410).send(generateErrorPage('⏰', 'Campaign Ended', `Ended on ${endDate.toLocaleString(DateTime.DATETIME_MED)} (${userTz}).`));
      }
    }

    // ============================================
    // 🔐 PASSWORD PROTECTION - CRITICAL (NO CHANGES)
    // ============================================
    if (link.password) {
      if (!password) {
        return res.status(200).send(generatePasswordForm(shortCode, null, req));
      }
      try {
        const isPasswordValid = await bcrypt.compare(password, link.password);
        if (!isPasswordValid) {
          return res.status(401).send(generatePasswordForm(shortCode, '❌ Invalid password. Please try again.', req));
        }
        console.log('🔐 ========================================');
      } catch (bcryptError) {
        logger.error('bcrypt error on link', shortCode, ':', bcryptError.message);
        return res.status(500).send(generatePasswordForm(shortCode, '⚠️ Error verifying password.', req));
      }
    }

    // ============================================
    // 🛡️ PLAN ENFORCEMENT & PREPARATION
    // ============================================
    const ownerPlan = link.userId?.plan || 'free';
    const isPro = ['pro', 'business', 'admin'].includes(ownerPlan);
    const isBusiness = ['business', 'admin'].includes(ownerPlan);
    const isPremium = isPro;

    // ============================================
    // 🛡️ ADVANCED TRAFFIC SHIELD & AD-FRAUD PROTECTION
    // ============================================
    const userAgent = req.headers['user-agent'] || '';
    const { device, os, isBot: userAgentIsBot } = parseUserAgent(userAgent);
    
    // Multi-signal bot detection: UA string + missing Accept-Language header
    const isKnownBot = userAgentIsBot || 
      /bot|googlebot|crawler|spider|robot|crawling|facebookexternalhit|bingbot|yandex|baidu|python|curl|wget|postman/i.test(userAgent) ||
      !req.headers['accept-language'];

    // 🚀 EARLY TRACKING FETCH (For Business Elite Features: City/ISP/Datacenter)
    let trackingData = null;
    let country = req.headers['cf-ipcountry'] || req.headers['x-vercel-ip-country'] || req.headers['x-country-code'];

    if (isBusiness || !country || country === 'Unknown') {
      trackingData = await getTrackingData(req, parseUserAgent);
      if (!country || country === 'Unknown') {
        country = trackingData.country || 'Unknown';
      }
    }

    if (link.autoShield?.enabled) {
      // 1. Basic Bot Protection
      if (isKnownBot) {
        if (link.autoShield.redirectBotTo) return res.redirect(302, link.autoShield.redirectBotTo);
        return res.status(404).send(generateErrorPage('🛡️', 'Verification Required', 'Our system detected automated activity. Please try again.'));
      }
      
      // 2. Advanced Ad-Fraud Datacenter Protection (Business Elite)
      if (isBusiness && trackingData && trackingData.isDatacenter) {
        logger.security('AutoShield: datacenter/VPN blocked — IP:', trackingData.ip);
        if (link.autoShield.redirectBotTo) return res.redirect(302, link.autoShield.redirectBotTo);
        return res.status(403).send(generateErrorPage('🛡️', 'Access Denied', 'Traffic from datacenters and VPNs is not allowed for this link.'));
      }
    }

    if (!isPremium) {
    }

    // Generate or retrieve Visitor ID (priority order: Cookie > IP/UA Hash)
    let visitorId = req.cookies?.sl_visitor_id;
    if (!visitorId) {
      visitorId = link.generateVisitorId(req);
      // Set the cookie for 1 year to ensure future accuracy
      res.cookie('sl_visitor_id', visitorId, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    }

    // ============================================
    // 🌍 ENHANCED GEOTARGETING (NEW - SAFE ADDITION)
    // ============================================
    let redirectUrl = link.originalUrl;

    // Apply geographic targeting rules (priority-based)
    if (isPro && link.geoRules && link.geoRules.length > 0) {
      // Sort rules by priority (highest first)
      const sortedRules = [...link.geoRules].sort((a, b) =>
        (b.priority || 0) - (a.priority || 0)
      );

      // Find first matching rule
      const matchedRule = sortedRules.find(rule => {
        // Business Elite: Match City or ISP
        if (isBusiness && trackingData) {
          if (rule.cities && rule.cities.length > 0 && rule.cities.includes(trackingData.city)) return true;
          // Note: ISP matching can be added here if getTrackingData returns isp
        }
        // Fallback to Country matching
        return rule.countries && rule.countries.includes(country);
      });

      if (matchedRule) {
        redirectUrl = matchedRule.targetUrl;
      } else {
      }
    }

    // ============================================
    // 📱 ENHANCED DEVICE TARGETING (NEW - SAFE ADDITION)
    // ============================================
    // Apply device targeting rules (overrides geo rules if set)
    if (isPro && link.deviceRules) {
      let deviceRuleApplied = false;

      if (device === 'Mobile' && link.deviceRules.mobile) {
        redirectUrl = link.deviceRules.mobile;
        deviceRuleApplied = true;
      } else if (device === 'Desktop' && link.deviceRules.desktop) {
        redirectUrl = link.deviceRules.desktop;
        deviceRuleApplied = true;
      } else if (device === 'Tablet' && link.deviceRules.tablet) {
        redirectUrl = link.deviceRules.tablet;
        deviceRuleApplied = true;
      }

      if (deviceRuleApplied) {
      }
    }

    // ============================================
    // 💻 ENHANCED OS TARGETING (NEW ENTERPRISE FEATURE)
    // ============================================
    // OS Targeting overrides basic device targeting
    if (isPro && link.osRules) {
      let osRuleApplied = false;
      const osLower = (os || '').toLowerCase();

      if (osLower.includes('ios') && link.osRules.ios) {
        redirectUrl = link.osRules.ios;
        osRuleApplied = true;
      } else if (osLower.includes('android') && link.osRules.android) {
        redirectUrl = link.osRules.android;
        osRuleApplied = true;
      } else if (osLower.includes('windows') && link.osRules.windows) {
        redirectUrl = link.osRules.windows;
        osRuleApplied = true;
      } else if (osLower.includes('mac') && link.osRules.mac) {
        redirectUrl = link.osRules.mac;
        osRuleApplied = true;
      } else if (osLower.includes('linux') && link.osRules.linux) {
        redirectUrl = link.osRules.linux;
        osRuleApplied = true;
      }

      if (osRuleApplied) {
      }
    }

    // ============================================
    // 🗣️ ENHANCED LANGUAGE TARGETING (NEW ENTERPRISE FEATURE)
    // ============================================
    // Language targeting overrides OS targeting
    const browserLang = (req.headers['accept-language'] || '').split(',')[0].split('-')[0].toLowerCase();

    if (isPro && link.languageRules && link.languageRules.length > 0) {
      const matchedLangRule = link.languageRules.find(rule =>
        rule.language && rule.language.toLowerCase() === browserLang
      );

      if (matchedLangRule && matchedLangRule.targetUrl) {
        redirectUrl = matchedLangRule.targetUrl;
      }
    }

    // ============================================
    // 🧪 A/B TESTING (EXISTING - NO CHANGES)
    // ============================================
    let abVariantIndex = null;
    let abVariantName = null;

    if (isBusiness && link.abTest?.enabled && link.abTest.status === 'running') {
      const selectedVariant = link.selectABVariant(visitorId);

      if (selectedVariant) {
        redirectUrl = selectedVariant.url;
        abVariantIndex = selectedVariant.index;
        abVariantName = selectedVariant.name;
      }
    }

    // ============================================
    // 🔗 S2S POSTBACK & MACRO REPLACEMENT (Enterprise)
    // ============================================
    const clickId = nanoid(24);
    
    // Replace standard tracking macros
    if (redirectUrl.includes('{clickid}') || redirectUrl.includes('{click_id}')) {
      redirectUrl = redirectUrl.replace(/\{click_?id\}/gi, clickId);
    }
    // Also support {visitorid} macro
    if (redirectUrl.includes('{visitorid}')) {
      redirectUrl = redirectUrl.replace(/\{visitorid\}/gi, visitorId);
    }
    // Final runtime guard: even legacy links must pass safety checks before redirect.
    const finalSafety = await checkUrlSafety(redirectUrl);
    if (!finalSafety.safe) {
      logger.security('Unsafe redirect blocked — shortCode:', shortCode, '| reason:', finalSafety.reason);
      return res.status(410).send(generateErrorPage('🚫', 'Unsafe Destination Blocked', finalSafety.reason));
    }

    // ============================================
    // 🚀 QUEUE ANALYTICS & WEBHOOKS
    // ============================================
    try {
      // Generate tracking data here before sending to queue
      // because req object cannot be serialized into the queue
      if (!trackingData) {
        trackingData = await getTrackingData(req, parseUserAgent);
      }
      trackingData.visitorId = visitorId;
      trackingData.clickId = clickId; // S2S Tracking
      trackingData.sessionId = req.cookies?.sl_session_id || visitorId;
      trackingData.isBot = isKnownBot;
      trackingData.converted = false;
      trackingData.conversionTime = null;
      trackingData.conversionValue = 0;

      if (abVariantIndex !== null) {
        trackingData.abVariant = abVariantName;
        trackingData.abVariantIndex = abVariantIndex;
      }

      const shouldSkipPixels = isKnownBot && link.autoShield?.protectPixels;

      // Add job to BullMQ queue
      await analyticsQueue.add('track-click', {
        linkId: link._id,
        trackingData,
        webhookUrl: link.userId?.globalWebhookUrl || link.webhookUrl || null
      });

      if (isBusiness && link.pixels && link.pixels.length > 0 && !shouldSkipPixels) {
        return res.send(generatePixelHTML(link.pixels, redirectUrl));
      }
    } catch (queueErr) {
      logger.error('Failed to queue analytics:', queueErr.message);
    }

    // Set visitor ID cookie for conversion tracking
    res.cookie('sl_visitor_id', visitorId, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: false, // Allow JS access for conversion tracking
      sameSite: 'lax'
    });
    console.log('🔗 ========================================');

    return res.redirect(302, redirectUrl);

  } catch (error) {
    console.error('❌ Redirect error:', error.message);
    console.error('Stack:', error.stack);
    return res.status(500).send(generateErrorPage('⚠️', 'Server Error', 'Something went wrong.'));
  }
};

// ============================================
// 🔒 PASSWORD FORM (EXISTING - NO CHANGES)
// ============================================
function generatePasswordForm(shortCode, errorMessage = null, req) {
  const protocol = req.protocol || 'https';
  const host = req.get('host');
  const fullUrl = `${protocol}://${host}/${shortCode}`;
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>🔒 Password Protected Link</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="robots" content="noindex, nofollow">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .container {
          background: white;
          max-width: 440px;
          width: 100%;
          padding: 48px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .lock-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 28px;
          font-size: 36px;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
        
        h1 {
          color: #2d3748;
          font-size: 28px;
          text-align: center;
          margin-bottom: 12px;
          font-weight: 700;
        }
        
        .subtitle {
          color: #718096;
          text-align: center;
          margin-bottom: 32px;
          font-size: 15px;
        }
        
        .error-message {
          background: linear-gradient(135deg, #fee 0%, #fdd 100%);
          color: #c53030;
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          font-size: 14px;
          font-weight: 600;
          border-left: 4px solid #c53030;
          display: ${errorMessage ? 'flex' : 'none'};
          align-items: center;
          gap: 12px;
          animation: shake 0.4s;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        
        .input-group {
          margin-bottom: 20px;
        }
        
        .input-label {
          display: block;
          color: #4a5568;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        input[type="password"] {
          width: 100%;
          padding: 16px 18px;
          font-size: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          outline: none;
          transition: all 0.3s;
          background: #f7fafc;
        }
        
        input[type="password"]:focus {
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }
        
        button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 17px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .footer {
          margin-top: 28px;
          text-align: center;
          font-size: 13px;
          color: #a0aec0;
        }

        .info-box {
          background: #ebf4ff;
          border: 2px solid #bee3f8;
          border-radius: 12px;
          padding: 16px;
          margin-top: 20px;
          font-size: 13px;
          color: #2c5282;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="lock-icon">🔒</div>
        <h1>Password Protected</h1>
        <p class="subtitle">Enter the password to continue</p>
        
        ${errorMessage ? `
          <div class="error-message">
            <span>⚠️</span>
            <span>${errorMessage}</span>
          </div>
        ` : ''}
        
        <form id="passwordForm" method="POST" action="/${shortCode}">
          <input type="hidden" name="_csrf" id="csrfToken" value="">
          <div class="input-group">
            <label class="input-label">Password</label>
            <input 
              type="password" 
              name="password"
              id="passwordInput"
              placeholder="••••••••" 
              required 
              autofocus
              autocomplete="off"
            />
          </div>
          <button type="submit" id="submitBtn">
            <span id="btnText">🔓 Unlock Link</span>
            <span id="btnSpinner" style="display: none;" class="spinner"></span>
          </button>
        </form>

        <div class="info-box">
          💡 This password was set by the link owner
        </div>
        
        <script>
          const input = document.getElementById('passwordInput');
          const submitBtn = document.getElementById('submitBtn');
          const btnText = document.getElementById('btnText');
          const btnSpinner = document.getElementById('btnSpinner');

          const form = document.getElementById('passwordForm');
          
          // Read CSRF token from cookies and set it
          const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
          if (match) {
            document.getElementById('csrfToken').value = match[2];
          }

          form.addEventListener('submit', function() {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnSpinner.style.display = 'block';
          });

          ${errorMessage ? `
            setTimeout(() => {
              input.focus();
              input.select();
            }, 100);
          ` : ''}
        </script>
        
        <div class="footer">
          🔒 Protected by Smart Link | <a href="/abuse?shortCode=${shortCode}" style="color: #667eea; text-decoration: none;">Report Abuse</a>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ============================================
// ERROR PAGE (EXISTING - NO CHANGES)
// ============================================
function generateErrorPage(icon, title, message) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: system-ui; 
          text-align: center; 
          padding: 60px 20px; 
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container { 
          max-width: 500px; 
          background: white; 
          padding: 50px 40px; 
          border-radius: 20px; 
          box-shadow: 0 10px 40px rgba(0,0,0,0.1); 
        }
        .icon { font-size: 72px; margin-bottom: 20px; }
        h1 { color: #2d3748; font-size: 32px; margin: 20px 0; }
        p { color: #718096; font-size: 17px; margin-bottom: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">${icon}</div>
        <h1>${title}</h1>
        <p>${message}</p>
        <div style="margin-top: 40px; font-size: 14px; color: #a0aec0;">
          <a href="/abuse" style="color: #718096; text-decoration: underline;">Report this link</a>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ============================================
// TRACKING (ENHANCED - SAFE ADDITION)
// ============================================
// Updated to support Bot flagging
async function trackClick(link, req, visitorId, abVariantIndex, abVariantName, isBot = false) {
  try {
    const trackingData = await getTrackingData(req, parseUserAgent);
    trackingData.visitorId = visitorId;
    trackingData.sessionId = generateSessionId(req, visitorId);
    trackingData.isBot = isBot; // Explicitly pass the bot flag

    // Add A/B test info if applicable
    if (abVariantIndex !== null) {
      trackingData.abVariant = abVariantName;
      trackingData.abVariantIndex = abVariantIndex;
    }

    // Also track converted flag (for conversion tracking)
    trackingData.converted = false;
    trackingData.conversionTime = null;
    trackingData.conversionValue = 0;

    const freshLink = await Link.findById(link._id);
    if (freshLink) {
      await freshLink.trackClick(trackingData);
      // 🚀 SPIKE MONITOR: Alert if high traffic in short time
      // If link hits 1000 clicks, log a security alert for manual review
      if (freshLink.totalClicks >= 1000 && freshLink.totalClicks % 500 === 0) {
        logger.security('High traffic spike detected on link:', freshLink.shortCode, '— total clicks:', freshLink.totalClicks);
        }
    }
  } catch (error) {
    logger.error('Tracking error:', error.message);
  }
}

const { nanoid } = require('nanoid');

function generateSessionId(req, visitorId) {
  // Session IDs are temporary but need to be highly unique to the current active session
  // nanoid(16) provides plenty of entropy for a temporary session string
  return nanoid(16);
}

// ============================================
// PIXEL HTML (EXISTING - NO CHANGES)
// ============================================
function generatePixelHTML(pixels, redirectUrl) {
  const pixelScripts = pixels.map(pixel => {
    if (pixel.platform === 'facebook') {
      return `
        <script>
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixel.pixelId}');
          fbq('track', '${pixel.event || 'PageView'}');
        </script>
        <noscript>
          <img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixel.pixelId}&ev=${pixel.event || 'PageView'}&noscript=1"/>
        </noscript>
      `;
    }
    if (pixel.platform === 'google') {
      return `
        <script async src="https://www.googletagmanager.com/gtag/js?id=${pixel.pixelId}"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${pixel.pixelId}');
        </script>
      `;
    }
    if (pixel.platform === 'tiktok') {
      return `
        <script>
          !function (w, d, t) {
            w.TTP = w.TTP || []; w.TTP.push({ pixelId: "${pixel.pixelId}" });
            var s = d.createElement("script"); s.type = "text/javascript"; s.async = !0; s.src = "https://analytics.tiktok.com/i18n/pixel/sdk.js?sdkid=${pixel.pixelId}";
            var a = d.getElementsByTagName("script")[0]; a.parentNode.insertBefore(s, a)
          }(window, document, "script");
        </script>
      `;
    }
    if (pixel.platform === 'twitter' || pixel.platform === 'x') {
      return `
        <script>
          !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments)},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='//static.ads-twitter.com/uwt.js',a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
          twq('init','${pixel.pixelId}');
          twq('track','PageView');
        </script>
      `;
    }
    if (pixel.platform === 'linkedin') {
      return `
        <script type="text/javascript">
          _linkedin_partner_id = "${pixel.pixelId}";
          window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
          window._linkedin_data_partner_ids.push(_linkedin_partner_id);
        </script>
        <script type="text/javascript">
          (function(l) {
          if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
          window.lintrk.q=[]}
          var s = document.getElementsByTagName("script")[0];
          var b = document.createElement("script");
          b.type = "text/javascript";b.async = true;
          b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
          s.parentNode.insertBefore(b, s);})(window.lintrk);
        </script>
        <noscript>
          <img height="1" width="1" style="display:none;" alt="" src="https://px.ads.linkedin.com/collect/?pid=${pixel.pixelId}&fmt=gif" />
        </noscript>
      `;
    }
    return '';
  }).join('\n');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="refresh" content="2;url=${redirectUrl}">
      ${pixelScripts}
      <script>
        // Professional Tracking Layer
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        
        // Dynamic Pixel Injection for non-FB platforms
        ${pixels.map(p => {
    if (p.platform === 'google') return `gtag('config', '${p.pixelId}');`;
    if (p.platform === 'tiktok') return `ttq.load('${p.pixelId}'); ttq.page();`;
    if (p.platform === 'linkedin') return `_linkedin_partner_id = '${p.pixelId}';`;
    return '';
  }).join('\n')}
      </script>
      <style>
        body {
          font-family: system-ui;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .spinner {
          border: 4px solid rgba(255,255,255,0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      </style>
    </head>
    <body>
      <div>
        <div class="spinner"></div>
        <p>Redirecting...</p>
      </div>
      <script>
        setTimeout(() => window.location.href = "${redirectUrl}", 2000);
      </script>
    </body>
    </html>
  `;
}