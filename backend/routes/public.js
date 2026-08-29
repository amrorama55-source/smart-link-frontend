// backend/routes/public.js
// Public API — WebMCP Agent Tools for Smart Link
// Supports optional Authorization header for authenticated users

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Link = require('../models/Link');
const User = require('../models/User');
const { generateShortCode, isValidUrl } = require('../utils/shortener');
const { checkUrlSafety } = require('../utils/urlSafety');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const jwt = require('jsonwebtoken');

const publicRateLimiter = new RateLimiterMemory({
  points: 15,
  duration: 3600,
  blockDuration: 3600
});

// Helper: resolve user from Bearer token or API key, fallback to extension user
async function resolveUser(req) {
  // Try Bearer token first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.slice(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id || decoded._id).select('_id email plan isBanned');
      if (user && !user.isBanned) return { userId: user._id, userEmail: user.email, authenticated: true };
    } catch { /* fall through */ }
  }

  // Try X-API-Key
  const apiKey = req.header('X-API-Key');
  if (apiKey) {
    const user = await User.findOne({ apiKey }).select('_id email isBanned');
    if (user && !user.isBanned) return { userId: user._id, userEmail: user.email, authenticated: true };
  }

  // Anonymous fallback: extension user
  const extensionUserId = process.env.EXTENSION_USER_ID;
  if (!extensionUserId) return null;
  try {
    return { userId: new mongoose.Types.ObjectId(extensionUserId), authenticated: false };
  } catch { return null; }
}

// Helper: generate unique short code
async function generateUniqueCode(customAlias) {
  if (customAlias) {
    const existing = await Link.findOne({ shortCode: customAlias.toLowerCase() });
    if (existing) throw new Error('Custom alias already taken. Please choose another.');
    return customAlias.toLowerCase();
  }
  let shortCode, isUnique = false;
  while (!isUnique) {
    shortCode = generateShortCode();
    const existing = await Link.findOne({ shortCode });
    if (!existing) isUnique = true;
  }
  return shortCode;
}

// ══════════════════════════════════════════════════════════════
// POST /api/public/create-smart-link
// ── WebMCP Tool: create_marketing_link ──
// Creates a fully-configured marketing link with geo-targeting,
// device routing, UTM params, A/B testing, and bot protection.
// ══════════════════════════════════════════════════════════════
router.post('/create-smart-link', async (req, res) => {
  const clientIp = req.ip || req.connection?.remoteAddress || 'unknown';
  try {
    await publicRateLimiter.consume(clientIp);
  } catch {
    return res.status(429).json({ error: 'Rate limit exceeded', message: 'Up to 15 links per hour via WebMCP tools.' });
  }

  const userCtx = await resolveUser(req);
  if (!userCtx) return res.status(503).json({ error: 'Service not configured' });

  const {
    url,              // Main destination URL
    title,            // Link title/name
    customAlias,      // Custom short code (optional)
    utmSource,        // UTM source (e.g., "facebook")
    utmMedium,        // UTM medium (e.g., "cpc")
    utmCampaign,      // UTM campaign name
    geoRules,         // [{ countries: ["SA","AE"], targetUrl: "https://..." }]
    deviceRules,      // { mobile: "https://...", desktop: "https://..." }
    osRules,          // { ios: "https://...", android: "https://..." }
    languageRules,    // [{ language: "ar", targetUrl: "https://..." }]
    abVariants,       // [{ url: "https://...", name: "Variant A", weight: 50 }]
    enableBotProtection, // boolean
    pixels,           // [{ platform: "facebook", pixelId: "123" }]
    expiresAt         // ISO date string
  } = req.body;

  // Validate: need at least a main URL or A/B variants
  const hasAbTest = abVariants && Array.isArray(abVariants) && abVariants.length >= 2;
  if (!hasAbTest && !url) {
    return res.status(400).json({ error: 'url is required (or provide abVariants with at least 2 entries for A/B testing)' });
  }
  if (url && !isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL format. URL must start with http:// or https://' });
  }

  // Safety check on main URL
  if (url) {
    const safetyCheck = await checkUrlSafety(url);
    if (!safetyCheck.safe) {
      return res.status(403).json({ error: 'URL blocked', message: safetyCheck.reason || 'This URL has been flagged as potentially dangerous.' });
    }
  }

  try {
    const shortCode = await generateUniqueCode(customAlias);

    // Build UTM-appended URL if needed
    let finalUrl = url;
    if (url && (utmSource || utmMedium || utmCampaign)) {
      try {
        const urlObj = new URL(url);
        if (utmSource) urlObj.searchParams.set('utm_source', utmSource);
        if (utmMedium) urlObj.searchParams.set('utm_medium', utmMedium);
        if (utmCampaign) urlObj.searchParams.set('utm_campaign', utmCampaign);
        finalUrl = urlObj.toString();
      } catch { /* use original url */ }
    }

    const linkData = {
      originalUrl: finalUrl || 'https://www.by-smartlink.com',
      shortCode,
      userId: userCtx.userId,
      title: title || 'Smart Link (via WebMCP Agent)',
      source: 'webmcp',
      utmSource: utmSource || undefined,
      utmMedium: utmMedium || undefined,
      utmCampaign: utmCampaign || undefined,
    };

    // Geo-targeting rules
    if (geoRules && Array.isArray(geoRules) && geoRules.length > 0) {
      linkData.geoRules = geoRules.map(rule => ({
        countries: Array.isArray(rule.countries) ? rule.countries : [rule.country].filter(Boolean),
        targetUrl: rule.targetUrl,
        priority: rule.priority || 0
      })).filter(r => r.countries.length > 0 && r.targetUrl);
    }

    // Device routing
    if (deviceRules && typeof deviceRules === 'object') {
      linkData.deviceRules = {
        mobile: deviceRules.mobile || undefined,
        desktop: deviceRules.desktop || undefined,
        tablet: deviceRules.tablet || undefined
      };
    }

    // OS routing
    if (osRules && typeof osRules === 'object') {
      linkData.osRules = {
        ios: osRules.ios || undefined,
        android: osRules.android || undefined,
        windows: osRules.windows || undefined,
        mac: osRules.mac || undefined
      };
    }

    // Language targeting
    if (languageRules && Array.isArray(languageRules) && languageRules.length > 0) {
      linkData.languageRules = languageRules.filter(r => r.language && r.targetUrl);
    }

    // A/B Testing
    if (hasAbTest) {
      linkData.abTest = {
        enabled: true,
        variants: abVariants.map(v => ({
          url: v.url,
          name: v.name || `Variant ${v.url.slice(0, 30)}`,
          weight: v.weight || Math.floor(100 / abVariants.length),
          clicks: 0
        })),
        splitMethod: 'weighted',
        status: 'running',
        startedAt: new Date()
      };
    }

    // Bot Protection
    if (enableBotProtection) {
      linkData.autoShield = {
        enabled: true,
        blockScrapers: true,
        protectPixels: true
      };
    }

    // Tracking Pixels
    if (pixels && Array.isArray(pixels) && pixels.length > 0) {
      linkData.pixels = pixels.filter(p => p.platform && p.pixelId);
    }

    // Expiry
    if (expiresAt) {
      try { linkData.expiresAt = new Date(expiresAt); } catch { /* ignore */ }
    }

    const link = new Link(linkData);
    await link.save();

    const shortUrl = `https://www.by-smartlink.com/${shortCode}`;
    const dashboardUrl = userCtx.authenticated
      ? `https://www.by-smartlink.com/dashboard`
      : null;

    // Build human-readable summary of what was configured
    const features = [];
    if (linkData.geoRules?.length) features.push(`geo-targeting (${linkData.geoRules.length} rules)`);
    if (linkData.deviceRules?.mobile || linkData.deviceRules?.desktop) features.push('device routing');
    if (linkData.languageRules?.length) features.push(`language targeting (${linkData.languageRules.length} rules)`);
    if (linkData.abTest?.enabled) features.push(`A/B testing (${abVariants.length} variants)`);
    if (linkData.autoShield?.enabled) features.push('bot protection');
    if (utmSource || utmMedium || utmCampaign) features.push('UTM tracking');
    if (linkData.pixels?.length) features.push(`${linkData.pixels.length} tracking pixel(s)`);

    return res.status(201).json({
      success: true,
      shortUrl,
      shortCode,
      originalUrl: finalUrl,
      title: linkData.title,
      features: features.length > 0 ? features : ['basic redirect'],
      message: `✅ Smart Link created: ${shortUrl}${features.length > 0 ? ` with ${features.join(', ')}` : ''}`,
      dashboardUrl,
      authenticated: userCtx.authenticated
    });

  } catch (error) {
    console.error('WebMCP create-smart-link error:', error);
    if (error.message.includes('alias already taken')) {
      return res.status(409).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// ══════════════════════════════════════════════════════════════
// POST /api/public/shorten
// ── WebMCP Tool: shorten_url (simple, backward-compatible) ──
// ══════════════════════════════════════════════════════════════
router.post('/shorten', async (req, res) => {
  const clientIp = req.ip || req.connection?.remoteAddress || 'unknown';
  try {
    await publicRateLimiter.consume(clientIp);
  } catch {
    return res.status(429).json({ error: 'Too many requests', message: 'You can shorten up to 15 links per hour.' });
  }

  const { originalUrl, password } = req.body;
  if (!originalUrl) return res.status(400).json({ error: 'originalUrl is required' });
  if (!isValidUrl(originalUrl)) return res.status(400).json({ error: 'Invalid URL format' });

  const safetyCheck = await checkUrlSafety(originalUrl);
  if (!safetyCheck.safe) {
    return res.status(403).json({ error: 'URL blocked', message: safetyCheck.reason || 'URL flagged as dangerous.' });
  }

  const userCtx = await resolveUser(req);
  if (!userCtx) return res.status(503).json({ error: 'Service not configured' });

  try {
    const shortCode = await generateUniqueCode();
    const linkData = {
      originalUrl,
      shortCode,
      userId: userCtx.userId,
      title: '',
      source: 'webmcp'
    };

    if (password) {
      const bcrypt = require('bcryptjs');
      linkData.password = await bcrypt.hash(password, 10);
      linkData.isPasswordProtected = true;
    }

    const link = new Link(linkData);
    await link.save();

    const shortUrl = `https://www.by-smartlink.com/${shortCode}`;
    return res.status(201).json({ shortUrl, shortCode, originalUrl });
  } catch (error) {
    console.error('Public shorten error:', error);
    return res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// ══════════════════════════════════════════════════════════════
// GET /api/public/stats/:shortCode
// ── WebMCP Tool: get_link_stats ──
// ══════════════════════════════════════════════════════════════
router.get('/stats/:shortCode', async (req, res) => {
  try {
    const link = await Link.findOne({ shortCode: req.params.shortCode });
    if (!link) return res.status(404).json({ error: 'Link not found' });

    // Build country breakdown from clicks
    const countryMap = {};
    const deviceMap = {};
    let botClicks = 0;

    (link.clicks || []).forEach(click => {
      if (click.isBot) { botClicks++; return; }
      const c = click.country || 'Unknown';
      countryMap[c] = (countryMap[c] || 0) + 1;
      const d = click.device || 'Unknown';
      deviceMap[d] = (deviceMap[d] || 0) + 1;
    });

    const topCountries = Object.entries(countryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([country, clicks]) => ({ country, clicks }));

    const abResults = link.abTest?.enabled
      ? link.abTest.variants.map(v => ({
          name: v.name,
          clicks: v.clicks,
          weight: v.weight
        }))
      : null;

    return res.json({
      shortCode: link.shortCode,
      shortUrl: `https://www.by-smartlink.com/${link.shortCode}`,
      title: link.title,
      totalClicks: link.totalClicks || 0,
      humanClicks: (link.totalClicks || 0) - botClicks,
      botClicksBlocked: botClicks,
      topCountries,
      deviceBreakdown: deviceMap,
      abTestResults: abResults,
      createdAt: link.createdAt,
      message: `📊 Link /${link.shortCode} has ${link.totalClicks} total clicks (${botClicks} bots blocked).`
    });
  } catch (error) {
    console.error('Public stats error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
