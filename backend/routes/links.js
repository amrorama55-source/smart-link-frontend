const express = require('express');
const router = express.Router();
const Link = require('../models/Link');
const SecurityLog = require('../models/SecurityLog');
const { verifyToken, verifyApiKey } = require('../middleware/verifyToken');
const {
  generateShortCode,
  isValidUrl,
  generateQRCode,
  isValidAlias
} = require('../utils/shortener');
const { checkUrlSafety } = require('../utils/urlSafety');
const { linkDto } = require('../utils/dto');
const redisClient = require('../config/redis');

// Authentication middleware
const authenticate = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  if (apiKey) {
    return verifyApiKey(req, res, next);
  }
  return verifyToken(req, res, next);
};

/**
 * @swagger
 * tags:
 *   name: Links
 *   description: URL shortening and link management
 */

/**
 * @swagger
 * /api/links:
 *   post:
 *     summary: Create a new short link
 *     tags: [Links]
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalUrl
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/my-very-long-landing-page-url
 *               title:
 *                 type: string
 *                 example: Summer Campaign 2026
 *               customAlias:
 *                 type: string
 *                 example: summer26
 *                 description: Custom short code (Pro plan)
 *               password:
 *                 type: string
 *                 example: secret123
 *                 description: Password-protect this link (Pro plan)
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 description: Auto-deactivate link after this date
 *     responses:
 *       201:
 *         description: Link created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 link:
 *                   $ref: '#/components/schemas/Link'
 *       400:
 *         description: Invalid URL or input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized — missing or invalid token
 */
router.post('/', authenticate, async (req, res) => {

  console.log('🏁 POST /api/links - REQUEST RECEIVED');
  try {
    const {
      originalUrl,
      customAlias,
      title,
      description,
      tags,
      expiresAt,
      password,
      customDomain,
      abTest,
      pixels,
      geoRules,
      autoShield,
      languageRules
    } = req.body;

    let willUseABTest = false;
    if (abTest && abTest.enabled && abTest.variants && abTest.variants.length >= 2) {
      willUseABTest = true;
    }

    if (!willUseABTest) {
      if (!originalUrl) {
        return res.status(400).json({
          error: 'Original URL is required (or enable A/B Testing with at least 2 variants)'
        });
      }

      if (!isValidUrl(originalUrl)) {
        return res.status(400).json({ error: 'Invalid URL format' });
      }

      // 🛡️ PHISHING CHECK: Scan URL before allowing creation
      const safetyCheck = await checkUrlSafety(originalUrl);
      if (!safetyCheck.safe) {
        console.warn('🚫 PHISHING BLOCKED:', originalUrl, '- User:', req.user.email);
        try {
          await SecurityLog.create({
            userId: req.user._id || req.user.id || 'unknown',
            userEmail: req.user.email || 'unknown',
            maliciousUrl: originalUrl,
            reason: safetyCheck.reason,
            ipAddress: req.ip || req.connection?.remoteAddress
          });
        } catch (err) { console.error('Failed to log security event', err); }

        return res.status(403).json({
          error: 'URL blocked',
          message: safetyCheck.reason
        });
      }
    } else {
      if (originalUrl && !isValidUrl(originalUrl)) {
        return res.status(400).json({ error: 'Invalid URL format' });
      }
      if (originalUrl) {
        const safetyCheck = await checkUrlSafety(originalUrl);
        if (!safetyCheck.safe) {
          console.warn('🚫 PHISHING BLOCKED:', originalUrl, '- User:', req.user.email);
          try {
            await SecurityLog.create({
              userId: req.user._id || req.user.id || 'unknown',
              userEmail: req.user.email || 'unknown',
              maliciousUrl: originalUrl,
              reason: safetyCheck.reason,
              ipAddress: req.ip || req.connection?.remoteAddress
            });
          } catch (err) { console.error('Failed to log security event', err); }

          return res.status(403).json({
            error: 'URL blocked',
            message: safetyCheck.reason
          });
        }
      }
    }

    // FIX: -1 means unlimited (trial & business plans)
    const userLimits = req.user.limits || { linksPerMonth: 5 };
    const monthlyLimit = userLimits.linksPerMonth;

    // Only check limit if it's NOT -1 (unlimited)
    if (monthlyLimit !== -1 && monthlyLimit !== null && monthlyLimit !== undefined) {
      const effectiveLimit = monthlyLimit || 5;

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const linksThisMonth = await Link.countDocuments({
        userId: req.user._id,
        createdAt: { $gte: firstDayOfMonth }
      });

      if (linksThisMonth >= effectiveLimit) {
        return res.status(429).json({
          error: 'Monthly link limit reached',
          limit: effectiveLimit,
          used: linksThisMonth
        });
      }
    }

    // 🛡️ ENFORCEMENT: Daily Link Limit (Anti-Spam)
    const userPlan = req.user.plan || 'free';
    const isTrialActive = req.user.isTrialActive;
    
    let dailyLimit = 5; // Starter/Free
    if (userPlan === 'pro' || (userPlan === 'trial' && isTrialActive)) {
      dailyLimit = 50;
    } else if (userPlan === 'business' || userPlan === 'admin') {
      dailyLimit = 200;
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const linksToday = await Link.countDocuments({
      userId: req.user._id,
      createdAt: { $gte: startOfDay }
    });

    if (linksToday >= dailyLimit) {
      console.warn('🚦 DAILY LIMIT REACHED:', req.user.email, `(${linksToday}/${dailyLimit})`);
      return res.status(429).json({
        error: 'Daily link limit reached',
        message: `For security reasons, you can only create ${dailyLimit} links per day on your current plan. Please try again tomorrow.`,
        limit: dailyLimit,
        used: linksToday
      });
    }

    let shortCode;
    if (customAlias) {
      if (!isValidAlias(customAlias)) {
        return res.status(400).json({
          error: 'Invalid alias. Use 3-50 alphanumeric characters, hyphens, or underscores.'
        });
      }

      const existing = await Link.findOne({
        $or: [{ shortCode: customAlias }, { customAlias }]
      });

      if (existing) {
        return res.status(409).json({ error: 'Alias already taken' });
      }

      shortCode = customAlias;
    } else {
      let isUnique = false;
      while (!isUnique) {
        shortCode = generateShortCode();
        const existing = await Link.findOne({ shortCode });
        if (!existing) isUnique = true;
      }
    }

    let plainPassword = undefined;
    if (password) {
      if (password.length < 4) {
        return res.status(400).json({
          error: 'Password must be at least 4 characters long.'
        });
      }

      console.log('🔐 [CREATE] Password received:', password);
      console.log('🔐 [CREATE] Password will be hashed by pre(save) hook');

      plainPassword = password;
    }

    // Helper to check if trial is active OR user is on pro/business/admin
    const hasProAccess = ['pro', 'business', 'admin'].includes(userPlan);
    const hasBusinessAccess = ['business', 'admin'].includes(userPlan);

    if (customDomain) {
      if (!hasProAccess) {
        return res.status(403).json({
          error: 'Premium feature restricted',
          message: (userPlan === 'trial' && !isTrialActive)
            ? 'Your trial has ended. Upgrade to Pro or Business to use custom domains.'
            : 'Custom domains require a PRO or BUSINESS plan. Start your trial to unlock!'
        });
      }
      const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
      if (!domainRegex.test(customDomain)) {
        return res.status(400).json({
          error: 'Invalid domain format. Please provide a valid domain (e.g., example.com).'
        });
      }

      const existingDomainLink = await Link.findOne({
        customDomain: customDomain.toLowerCase(),
        userId: { $ne: req.user._id }
      });

      if (existingDomainLink) {
        return res.status(409).json({
          error: 'This domain is already in use by another user.'
        });
      }
    }

    let abTestConfig = null;
    if (abTest && abTest.enabled) {
      if (!hasBusinessAccess) {
        return res.status(403).json({
          error: 'Premium feature restricted',
          message: (userPlan === 'trial' && !isTrialActive)
            ? 'Your trial has ended. Upgrade to Business Elite to use A/B Testing.'
            : 'A/B Testing requires a BUSINESS plan. Upgrade to unlock!'
        });
      }
      console.log('🧪 Processing A/B Test:', JSON.stringify(abTest, null, 2));

      if (!abTest.variants || !Array.isArray(abTest.variants)) {
        return res.status(400).json({
          error: 'A/B Testing requires variants array.'
        });
      }

      if (abTest.variants.length < 2) {
        return res.status(400).json({
          error: 'A/B Testing requires at least 2 variants.'
        });
      }

      if (abTest.variants.length > 5) {
        return res.status(400).json({
          error: 'A/B Testing supports up to 5 variants maximum.'
        });
      }

      for (let i = 0; i < abTest.variants.length; i++) {
        const variant = abTest.variants[i];

        if (!variant.name || !variant.name.trim()) {
          return res.status(400).json({
            error: `Variant ${i + 1}: Name is required`,
            variantIndex: i
          });
        }

        if (!variant.url || !variant.url.trim()) {
          return res.status(400).json({
            error: `Variant ${i + 1} (${variant.name}): URL is required`,
            variantIndex: i
          });
        }

        if (!isValidUrl(variant.url.trim())) {
          return res.status(400).json({
            error: `Variant ${i + 1} (${variant.name}): Invalid URL format. Must start with http:// or https://`,
            variantIndex: i
          });
        }

        // 🛡️ PHISHING CHECK: Scan each A/B variant URL
        const variantSafety = await checkUrlSafety(variant.url.trim());
        if (!variantSafety.safe) {
          console.warn('🚫 PHISHING BLOCKED (A/B variant):', variant.url, '- User:', req.user.email);
          try {
            await SecurityLog.create({
              userId: req.user._id || req.user.id || 'unknown',
              userEmail: req.user.email || 'unknown',
              maliciousUrl: variant.url.trim(),
              reason: variantSafety.reason,
              ipAddress: req.ip || req.connection?.remoteAddress
            });
          } catch (err) { console.error('Failed to log security event', err); }

          return res.status(403).json({
            error: `Variant ${i + 1} (${variant.name}): URL blocked - ${variantSafety.reason}`,
            variantIndex: i
          });
        }

        const weight = parseFloat(variant.weight);
        if (isNaN(weight) || weight < 0 || weight > 100) {
          return res.status(400).json({
            error: `Variant ${i + 1} (${variant.name}): Weight must be between 0 and 100`,
            variantIndex: i
          });
        }

        variant.name = variant.name.trim();
        variant.url = variant.url.trim();
        variant.weight = weight;
        variant.clicks = 0;
        variant.conversions = 0;
        variant.conversionRate = 0;
      }

      if (abTest.splitMethod === 'weighted') {
        let totalWeight = abTest.variants.reduce((sum, v) => sum + v.weight, 0);

        console.log('📊 Total Weight Before Normalization:', totalWeight);

        if (totalWeight === 0) {
          return res.status(400).json({
            error: 'All variant weights cannot be zero'
          });
        }

        if (Math.abs(totalWeight - 100) > 0.1) {
          const scale = 100 / totalWeight;
          abTest.variants.forEach(v => {
            v.weight = Math.round(v.weight * scale * 10) / 10;
          });

          totalWeight = abTest.variants.reduce((sum, v) => sum + v.weight, 0);
          if (Math.abs(totalWeight - 100) > 0.1) {
            const diff = 100 - totalWeight;
            abTest.variants[0].weight = Math.round((abTest.variants[0].weight + diff) * 10) / 10;
          }

          console.log('✅ Normalized Weights:', abTest.variants.map(v => v.weight));
        }
      }

      abTestConfig = {
        enabled: true,
        variants: abTest.variants,
        splitMethod: abTest.splitMethod || 'weighted',
        status: 'running',
        startedAt: new Date(),
        autoOptimize: abTest.autoOptimize || {
          enabled: false,
          minSampleSize: 100,
          confidenceLevel: 0.95
        }
      };
    }

    const hasTargeting = (geoRules && geoRules.length > 0) ||
      (req.body.deviceRules && Object.values(req.body.deviceRules).some(v => v)) ||
      (req.body.schedule && req.body.schedule.enabled);

    if (hasTargeting) {
      if (!hasProAccess) {
        return res.status(403).json({
          error: 'Premium feature restricted',
          message: 'Advanced targeting (Geo/Device/Schedule) requires a PRO or BUSINESS plan.'
        });
      }
    }

    const link = new Link({
      originalUrl: originalUrl || (abTestConfig?.variants[0]?.url || ''),
      shortCode,
      customAlias: customAlias || undefined,
      title: title || '',
      description: description || '',
      tags: tags || [],
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      password: plainPassword,
      customDomain: customDomain ? customDomain.toLowerCase() : undefined,
      abTest: abTestConfig || undefined,
      geoRules: hasProAccess ? (geoRules || []).map(r => ({ ...r, cities: hasBusinessAccess ? r.cities : [], isps: hasBusinessAccess ? r.isps : [] })) : [],
      deviceRules: hasProAccess ? (req.body.deviceRules || {}) : {},
      schedule: hasProAccess ? (req.body.schedule || { enabled: false }) : { enabled: false },
      pixels: hasBusinessAccess ? (pixels || []) : [],
      autoShield: hasProAccess ? (autoShield || { enabled: false }) : { enabled: false },
      languageRules: hasProAccess ? (languageRules || []) : [],
      userId: req.user._id
    });

    const baseUrl = customDomain ? `https://${customDomain}` : process.env.BASE_URL;
    const shortUrl = `${baseUrl}/${shortCode}`;
    link.qrCode = await generateQRCode(shortUrl);

    console.log('🔐 [CREATE] Before save - password:', link.password);
    console.log('🔐 [CREATE] Password starts with $2:', link.password?.startsWith('$2'));

    await link.save();

    console.log('🔐 [CREATE] After save - password:', link.password?.substring(0, 20) + '...');
    console.log('🔐 [CREATE] Password is now hashed:', link.password?.startsWith('$2'));

    // Track Activation Progress: Create First Link
    if (req.userDoc && !req.userDoc.activationChecklist?.createFirstLink?.completed) {
      if (!req.userDoc.activationChecklist) req.userDoc.activationChecklist = {};
      req.userDoc.activationChecklist.createFirstLink = {
        completed: true,
        completedAt: new Date()
      };
      await req.userDoc.save();
    }

    console.log('✅ Link Created:', {
      shortCode: link.shortCode,
      hasOriginalUrl: !!originalUrl,
      abTestEnabled: link.abTest?.enabled,
      variantsCount: link.abTest?.variants?.length
    });

    res.status(201).json({
      message: 'Link created successfully',
      link: linkDto(link)
    });
  } catch (error) {
    console.error('❌ Create link error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});
router.post('/force-reset-password/:shortCode', authenticate, async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({ error: 'Not found' });
    }

    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({
        error: 'Password must be at least 4 characters long.'
      });
    }

    const link = await Link.findOne({
      shortCode: req.params.shortCode,
      userId: req.user._id
    });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await Link.updateOne(
      { _id: link._id },
      { $set: { password: hashedPassword } }
    );

    console.log('🔐 Password force-reset for:', link.shortCode);

    return res.json({
      success: true,
      message: 'Password reset successfully',
      shortCode: link.shortCode,
      newPasswordHash: hashedPassword.substring(0, 30) + '...'
    });
  } catch (error) {
    console.error('Force reset error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/links:
 *   get:
 *     summary: Get all links for the authenticated user
 *     tags: [Links]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by title or original URL
 *       - in: query
 *         name: tag
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated list of links
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 links:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Link'
 *                 total:
 *                   type: integer
 *                   example: 47
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 pages:
 *                   type: integer
 *                   example: 3
 */
router.get('/', authenticate, async (req, res) => {

  try {
    const { page = 1, limit = 10, search, tag } = req.query;

    const query = { userId: req.user._id };

    if (search) {
      query.$or = [
        { originalUrl: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { shortCode: { $regex: search, $options: 'i' } }
      ];
    }

    if (tag) {
      query.tags = tag;
    }

    const links = await Link.find(query)
      .select('-clicks')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Link.countDocuments(query);

    const isBusiness = req.user.plan === 'business' || req.user.role === 'admin';
    const hasFullAnalytics = isBusiness || req.user.plan === 'pro';
    const analyticsLimit = hasFullAnalytics ? new Date(0) : new Date(Date.now() - 24 * 60 * 60 * 1000);

    const linksWithUrl = links.map(link => {
      const baseUrl = link.customDomain ? `https://${link.customDomain}` : process.env.BASE_URL;

      // 🛡️ ENFORCEMENT: Filter totalClicks for list view
      let filteredClickCount = link.totalClicks;
      if (!hasFullAnalytics && link.clicks) {
        filteredClickCount = link.clicks.filter(c => new Date(c.timestamp) >= analyticsLimit).length;
      }

      const dto = linkDto(link);
      dto.totalClicks = filteredClickCount;
      dto.shortUrl = `${baseUrl}/${link.shortCode}`;
      return dto;
    });

    res.json({
      links: linksWithUrl,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('❌ Get links error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/:shortCode', authenticate, async (req, res) => {
  try {
    const link = await Link.findOne({
      shortCode: req.params.shortCode,
      userId: req.user._id
    }); // Removed .select('-clicks') to allow filter logic

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    const isBusiness = req.user.plan === 'business' || req.user.role === 'admin';
    const hasFullAnalytics = isBusiness || req.user.plan === 'pro';
    const analyticsLimit = hasFullAnalytics ? new Date(0) : new Date(Date.now() - 24 * 60 * 60 * 1000);

    // 🛡️ ENFORCEMENT: Filter metrics for free users
    let filteredClickCount = link.totalClicks;
    if (!hasFullAnalytics && link.clicks) {
      filteredClickCount = link.clicks.filter(c => new Date(c.timestamp) >= analyticsLimit).length;
    }

    const baseUrl = link.customDomain ? `https://${link.customDomain}` : process.env.BASE_URL;
    const dto = linkDto(link, { includeAnalytics: hasFullAnalytics });
    dto.totalClicks = filteredClickCount;
    dto.shortUrl = `${baseUrl}/${link.shortCode}`;

    res.json({
      success: true,
      link: dto
    });
  } catch (error) {
    console.error('❌ Get link error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.put('/:shortCode', authenticate, async (req, res) => {
  try {
    const { title, description, tags, isActive, expiresAt, password, customDomain, abTest, pixels, geoRules, deviceRules, schedule, autoShield, languageRules } = req.body;

    const link = await Link.findOne({
      shortCode: req.params.shortCode,
      userId: req.user._id
    });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    const userPlan = req.user.plan || 'free';
    const isTrialActive = req.user.isTrialActive;
    const hasProAccess = ['pro', 'business', 'admin'].includes(userPlan);
    const hasBusinessAccess = ['business', 'admin'].includes(userPlan);

    // 🛡️ Plan Enforcement
    const hasTargetingInUpdate = (req.body.geoRules && req.body.geoRules.length > 0) ||
      (req.body.deviceRules && Object.values(req.body.deviceRules).some(v => v)) ||
      (req.body.schedule && req.body.schedule.enabled);

    if ((customDomain && customDomain !== '' && customDomain !== undefined) ||
      hasTargetingInUpdate) {
      if (!hasProAccess) {
        return res.status(403).json({
          error: 'Premium feature restricted',
          message: (userPlan === 'trial' && !isTrialActive)
            ? 'Your trial has ended. Please upgrade your plan.'
            : 'This feature requires a PRO or BUSINESS plan.'
        });
      }
    }

    if (abTest && abTest.enabled) {
      if (!hasBusinessAccess) {
        return res.status(403).json({
          error: 'Premium feature restricted',
          message: (userPlan === 'trial' && !isTrialActive)
            ? 'Your trial has ended. Please upgrade your plan.'
            : 'A/B Testing requires a BUSINESS plan.'
        });
      }
    }

    if (pixels && pixels.length > 0) {
      if (!hasBusinessAccess) {
        return res.status(403).json({
          error: 'Premium feature restricted',
          message: 'Retargeting Pixels require a BUSINESS plan.'
        });
      }
    }

    if (title !== undefined) link.title = title;
    if (description !== undefined) link.description = description;
    if (tags !== undefined) link.tags = tags;
    if (isActive !== undefined) link.isActive = isActive;
    if (expiresAt !== undefined) link.expiresAt = expiresAt ? new Date(expiresAt) : null;

    if (password !== undefined) {
      if (password === '' || password === null) {
        link.password = undefined;
        console.log('🔐 [UPDATE] Password removed');
      } else {
        if (password.length < 4) {
          return res.status(400).json({
            error: 'Password must be at least 4 characters long.'
          });
        }

        console.log('🔐 [UPDATE] New password received:', password);
        link.password = password;
      }
    }

    if (customDomain !== undefined) {
      if (customDomain === '' || customDomain === null) {
        link.customDomain = undefined;
      } else {
        const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
        if (!domainRegex.test(customDomain)) {
          return res.status(400).json({
            error: 'Invalid domain format.'
          });
        }

        const existingDomainLink = await Link.findOne({
          customDomain: customDomain.toLowerCase(),
          userId: { $ne: req.user._id },
          _id: { $ne: link._id }
        });

        if (existingDomainLink) {
          return res.status(409).json({
            error: 'This domain is already in use by another user.'
          });
        }

        link.customDomain = customDomain.toLowerCase();
      }
    }

    if (abTest !== undefined) {
      if (abTest === null || (abTest.enabled === false)) {
        link.abTest = { enabled: false, variants: [], splitMethod: 'weighted' };
      } else if (abTest.enabled) {
        if (!abTest.variants || !Array.isArray(abTest.variants) || abTest.variants.length < 2) {
          return res.status(400).json({
            error: 'A/B Testing requires at least 2 variants.'
          });
        }

        if (abTest.variants.length > 5) {
          return res.status(400).json({
            error: 'A/B Testing supports up to 5 variants maximum.'
          });
        }

        for (let i = 0; i < abTest.variants.length; i++) {
          const variant = abTest.variants[i];

          if (!variant.name || !variant.name.trim()) {
            return res.status(400).json({
              error: `Variant ${i + 1}: Name is required`,
              variantIndex: i
            });
          }

          if (!variant.url || !variant.url.trim()) {
            return res.status(400).json({
              error: `Variant ${i + 1} (${variant.name}): URL is required`,
              variantIndex: i
            });
          }

          if (!isValidUrl(variant.url.trim())) {
            return res.status(400).json({
              error: `Variant ${i + 1} (${variant.name}): Invalid URL format`,
              variantIndex: i
            });
          }

          // 🛡️ SECURITY PATCH: Check URL safety when updating A/B tests
          const { checkUrlSafety } = require('../utils/urlSafety');
          const variantSafety = await checkUrlSafety(variant.url.trim());
          if (!variantSafety.safe) {
            console.warn('🚫 PHISHING BLOCKED (A/B variant update):', variant.url, '- User:', req.user.email);
            try {
              await SecurityLog.create({
                userId: req.user._id || req.user.id || 'unknown',
                userEmail: req.user.email || 'unknown',
                maliciousUrl: variant.url.trim(),
                reason: variantSafety.reason,
                ipAddress: req.ip || req.connection?.remoteAddress
              });
            } catch (err) { console.error('Failed to log security event', err); }

            return res.status(403).json({
              error: `Variant ${i + 1} (${variant.name}): URL blocked - ${variantSafety.reason}`,
              variantIndex: i
            });
          }

          const weight = parseFloat(variant.weight);
          if (isNaN(weight) || weight < 0 || weight > 100) {
            return res.status(400).json({
              error: `Variant ${i + 1} (${variant.name}): Weight must be between 0 and 100`,
              variantIndex: i
            });
          }

          variant.name = variant.name.trim();
          variant.url = variant.url.trim();
          variant.weight = weight;

          if (link.abTest?.enabled && link.abTest.variants[i]) {
            variant.clicks = link.abTest.variants[i].clicks || 0;
            variant.conversions = link.abTest.variants[i].conversions || 0;
            variant.conversionRate = link.abTest.variants[i].conversionRate || 0;
          } else {
            variant.clicks = 0;
            variant.conversions = 0;
            variant.conversionRate = 0;
          }
        }

        if (abTest.splitMethod === 'weighted') {
          let totalWeight = abTest.variants.reduce((sum, v) => sum + v.weight, 0);

          if (totalWeight === 0) {
            return res.status(400).json({
              error: 'All variant weights cannot be zero'
            });
          }

          if (Math.abs(totalWeight - 100) > 0.1) {
            const scale = 100 / totalWeight;
            abTest.variants.forEach(v => {
              v.weight = Math.round(v.weight * scale * 10) / 10;
            });

            totalWeight = abTest.variants.reduce((sum, v) => sum + v.weight, 0);
            if (Math.abs(totalWeight - 100) > 0.1) {
              const diff = 100 - totalWeight;
              abTest.variants[0].weight = Math.round((abTest.variants[0].weight + diff) * 10) / 10;
            }
          }
        }

        link.abTest = {
          enabled: true,
          variants: abTest.variants,
          splitMethod: abTest.splitMethod || 'weighted',
          status: link.abTest?.status || 'running',
          startedAt: link.abTest?.startedAt || new Date(),
          autoOptimize: abTest.autoOptimize || link.abTest?.autoOptimize || {
            enabled: false,
            minSampleSize: 100,
            confidenceLevel: 0.95
          },
          winner: link.abTest?.winner
        };
      }
    }

    if (pixels !== undefined) {
      link.pixels = hasBusinessAccess ? (pixels || []) : [];
    }

    if (geoRules !== undefined) {
      link.geoRules = hasProAccess ? (geoRules || []).map(r => ({ ...r, cities: hasBusinessAccess ? r.cities : [], isps: hasBusinessAccess ? r.isps : [] })) : [];
    }

    if (deviceRules !== undefined) {
      link.deviceRules = hasProAccess ? (deviceRules || {}) : {};
    }

    if (schedule !== undefined) {
      link.schedule = hasProAccess ? (schedule || { enabled: false }) : { enabled: false };
    }

    if (autoShield !== undefined) {
      link.autoShield = hasProAccess ? (autoShield || { enabled: false }) : { enabled: false };
    }

    if (languageRules !== undefined) {
      link.languageRules = hasProAccess ? (languageRules || []) : [];
    }

    if (password !== undefined || customDomain !== undefined) {
      const baseUrl = link.customDomain ? `https://${link.customDomain}` : process.env.BASE_URL;
      const shortUrl = `${baseUrl}/${link.shortCode}`;
      link.qrCode = await generateQRCode(shortUrl);
    }

    await link.save();

    // ⚡ Invalidate cache so changes take effect immediately
    try {
      await redisClient.del(`link:${link.shortCode}`);
    } catch (redisErr) {
      console.error('⚠️ Failed to invalidate cache on update:', redisErr.message);
    }

    const baseUrl = link.customDomain ? `https://${link.customDomain}` : process.env.BASE_URL;
    const dto = linkDto(link);
    dto.shortUrl = `${baseUrl}/${link.shortCode}`;

    res.json({
      message: 'Link updated successfully',
      link: dto
    });
  } catch (error) {
    console.error('❌ Update link error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.delete('/:shortCode', authenticate, async (req, res) => {
  try {
    const link = await Link.findOneAndDelete({
      shortCode: req.params.shortCode,
      userId: req.user._id
    });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // ⚡ Invalidate cache
    try {
      await redisClient.del(`link:${req.params.shortCode}`);
    } catch (redisErr) {
      console.error('⚠️ Failed to invalidate cache on delete:', redisErr.message);
    }

    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('❌ Delete link error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/debug-password/:shortCode', authenticate, async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({ error: 'Not found' });
    }

    const link = await Link.findOne({
      shortCode: req.params.shortCode,
      userId: req.user._id
    }).select('+password');

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    const bcrypt = require('bcryptjs');
    const testPasswords = ['1234', '123456', 'RAosa#002', 'test123', 'password'];
    const results = [];

    for (const testPass of testPasswords) {
      const isMatch = await bcrypt.compare(testPass, link.password);
      results.push({ password: testPass, matches: isMatch });
    }

    res.json({
      shortCode: link.shortCode,
      hasPassword: !!link.password,
      passwordHash: link.password ? link.password.substring(0, 30) + '...' : null,
      hashStartsWith$2: link.password ? link.password.startsWith('$2') : false,
      testResults: results,
      correctPassword: results.find(r => r.matches)?.password || 'None matched'
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
});
router.post('/fix-password/:shortCode', authenticate, async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({ error: 'Not found' });
    }

    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({
        error: 'Password must be at least 4 characters long.'
      });
    }

    const link = await Link.findOne({
      shortCode: req.params.shortCode,
      userId: req.user._id
    });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await Link.updateOne(
      { _id: link._id },
      { $set: { password: hashedPassword } }
    );

    const updatedLink = await Link.findById(link._id).select('+password');
    const testMatch = await bcrypt.compare(newPassword, updatedLink.password);

    return res.json({
      success: true,
      message: 'Password updated successfully!',
      shortCode: link.shortCode,
      verificationTest: testMatch ? 'PASSED ✅' : 'FAILED ❌'
    });
  } catch (error) {
    console.error('Fix password error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;