const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken, verifyApiKey } = require('../middleware/verifyToken');
const sanitizeUrl = require('../utils/safeUrl');

const authMiddleware = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  if (apiKey) {
    return verifyApiKey(req, res, next);
  }
  return verifyToken(req, res, next);
};

// Get bio settings (authenticated)
router.get('/settings', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('bioPage name');

    // إذا لم يكن bioPage موجود، أنشئه
    if (!user.bioPage) {
      user.bioPage = {
        username: '',
        displayName: user.name || '',
        bio: '',
        avatar: '',
        theme: 'default',
        socialLinks: [],
        customLinks: [],
        blocks: [],
        isPublic: true
      };
    }

    res.json({
      bioPage: {
        username: user.bioPage.username || '',
        displayName: user.bioPage.displayName || user.name || '',
        bio: user.bioPage.bio || '',
        avatar: user.bioPage.avatar || '',
        theme: user.bioPage.theme || 'default',
        socialLinks: user.bioPage.socialLinks || [],
        customLinks: user.bioPage.customLinks || [],
        blocks: user.bioPage.blocks || [],
        isPublic: user.bioPage.isPublic !== undefined ? user.bioPage.isPublic : true
      }
    });
  } catch (err) {
    console.error('Get bio settings error:', err);
    res.status(500).json({
      error: 'Server error',
      code: 'BIO_GET_500_V2',
      message: err.message
    });
  }
});

// Update bio settings (authenticated)
router.put('/settings', authMiddleware, async (req, res) => {
  try {
    console.log('📦 PUT /settings - Request Body Keys:', Object.keys(req.body));
    const { username, displayName, bio, avatar, theme, socialLinks, customLinks, blocks, isPublic } = req.body;

    console.log('🔍 Finding user:', req.user._id);
    const user = await User.findById(req.user._id);

    if (!user) {
      console.warn('❌ User not found');
      return res.status(404).json({
        error: 'User not found',
        code: 'BIO_PUT_USER_NOT_FOUND_V1',
        timestamp: new Date().toISOString()
      });
    }

    // Initialize bioPage if doesn't exist
    if (!user.bioPage) {
      console.log('👶 Initializing bioPage for user');
      user.bioPage = {
        username: '',
        displayName: '',
        bio: '',
        avatar: '',
        theme: 'default',
        socialLinks: [],
        customLinks: [],
        blocks: [],
        isPublic: true
      };
    }

    // Validate and update username
    if (username !== undefined) {
      console.log('✏️ Updating username to:', username);
      if (username && username.length > 0) {
        if (username.length < 3) {
          return res.status(400).json({ error: 'Username must be at least 3 characters' });
        }
        // 🛡️ SECURITY: Strict regex for username to prevent weird characters and spaces
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
          return res.status(400).json({ error: 'Username can only contain letters, numbers, hyphens, and underscores' });
        }
      }

      const currentUsername = user.bioPage.username || '';
      if (username && username.toLowerCase() !== currentUsername.toLowerCase()) {
        console.log('🕵️ Checking if username is taken:', username);
        const existingUser = await User.findOne({
          'bioPage.username': username.toLowerCase(),
          _id: { $ne: user._id }
        });

        if (existingUser) {
          console.warn('❌ Username taken:', username);
          return res.status(400).json({ error: 'Username is already taken' });
        }
      }

      user.bioPage.username = username ? username.toLowerCase() : '';
    }

    // Update other fields safely
    if (displayName !== undefined) user.bioPage.displayName = displayName;
    if (bio !== undefined) user.bioPage.bio = bio;
    if (avatar !== undefined) user.bioPage.avatar = sanitizeUrl(avatar);
    if (theme !== undefined) {
      console.log('🎨 Theme update:', theme);

      // 🛡️ Plan Enforcement: Restrict premium themes to Business Elite
      const premiumThemes = ['glass', 'sunset', 'sea', 'forest', 'cyber', 'luxury', 'rose', 'nordic', 'aurora', 'lavender', 'neon'];
      const isBusiness = req.user.plan === 'business' || req.user.role === 'admin';

      if (premiumThemes.includes(theme) && !isBusiness) {
        return res.status(403).json({
          error: 'Premium theme restricted',
          message: 'This theme is exclusive to Business Elite members. Upgrade to unlock premium designs!'
        });
      }

      user.bioPage.theme = theme;
    }

    if (socialLinks !== undefined) {
      // 🛡️ SECURITY: Prevent XSS in social links
      user.bioPage.socialLinks = socialLinks.map(link => {
        let safeUrl = sanitizeUrl(link.url || '');
        if (safeUrl && !safeUrl.startsWith('http://') && !safeUrl.startsWith('https://') && !safeUrl.startsWith('mailto:')) {
          safeUrl = 'https://' + safeUrl;
        }
        return { ...link, url: safeUrl };
      });
    }

    if (customLinks !== undefined && Array.isArray(customLinks)) {
      console.log('🔗 Updating links count:', customLinks.length);

      // 🛡️ Plan Enforcement: Bio Link Count Limits
      const isBusiness = req.user.plan === 'business' || req.user.role === 'admin';
      const isPro = req.user.plan === 'pro';
      const bioLinkLimit = isBusiness ? -1 : (isPro ? 100 : 5);

      if (bioLinkLimit !== -1 && customLinks.length > bioLinkLimit) {
        return res.status(403).json({
          error: 'Bio link limit reached',
          message: `Your current plan allows up to ${bioLinkLimit} links on your bio page. Upgrade to unlock more!`
        });
      }

      user.bioPage.customLinks = customLinks.map((link, index) => {
        // 🛡️ SECURITY: Prevent XSS in custom links
        let safeUrl = sanitizeUrl(link.url || '');
        if (safeUrl && !safeUrl.startsWith('http://') && !safeUrl.startsWith('https://') && !safeUrl.startsWith('mailto:')) {
          safeUrl = 'https://' + safeUrl;
        }

        return {
          title: link.title || '',
          url: safeUrl,
          icon: link.icon || '🔗',
          order: link.order !== undefined ? link.order : index,
          isActive: link.isActive !== undefined ? link.isActive : true
        };
      });
    }

    if (blocks !== undefined && Array.isArray(blocks)) {
      console.log('📦 Updating blocks count:', blocks.length);
      
      user.bioPage.blocks = blocks.map((block, index) => {
        let safeUrl = sanitizeUrl(block.url || '');
        if (safeUrl && !safeUrl.startsWith('http://') && !safeUrl.startsWith('https://') && !safeUrl.startsWith('mailto:')) {
          safeUrl = 'https://' + safeUrl;
        }

        return {
          type: block.type || 'link',
          title: block.title || '',
          url: safeUrl,
          content: block.content || '',
          icon: block.icon || '',
          order: block.order !== undefined ? block.order : index,
          isActive: block.isActive !== undefined ? block.isActive : true,
          settings: block.settings || {}
        };
      });
    }


    if (isPublic !== undefined) user.bioPage.isPublic = isPublic;

    console.log('💾 Saving user document...');
    try {
      await user.save();
    } catch (saveErr) {
      console.error('❌ Mongoose Save Error:', saveErr);
      return res.status(400).json({
        error: 'Validation failed',
        message: saveErr.message,
        code: 'BIO_PUT_VALIDATION_FAILED_V1',
        details: saveErr.errors ? Object.keys(saveErr.errors) : undefined
      });
    }
    res.json({
      message: 'Bio page updated successfully',
      bioPage: user.bioPage
    });
  } catch (err) {
    console.error('💥 GLOBAL Bio Update Error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message,
      code: 'BIO_PUT_GLOBAL_CATCH_V2', // Unique marker
      timestamp: new Date().toISOString()
    });
  }
});

// Check username availability (public)
router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;

    if (username.length < 3) {
      return res.json({ available: false, reason: 'Username too short' });
    }

    const existingUser = await User.findOne({
      'bioPage.username': username.toLowerCase()
    });

    res.json({ available: !existingUser });
  } catch (err) {
    console.error('Check username error:', err);
    res.status(500).json({
      error: 'Server error',
      code: 'BIO_CHECK_USER_500_V2',
      message: err.message
    });
  }
});

// Get public bio page (public route)
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;

    console.log('🔍 Looking for bio page:', username);

    const user = await User.findOne({
      'bioPage.username': username.toLowerCase(),
      'bioPage.isPublic': true
    }).select('bioPage name');

    if (!user || !user.bioPage || !user.bioPage.username) {
      return res.status(404).json({ error: 'Bio page not found' });
    }

    console.log('✅ Bio page found for:', username);

    // Filter only active links
    const activeLinks = (user.bioPage.customLinks || [])
      .filter(link => link.isActive)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    // Filter and sort blocks
    const activeBlocks = (user.bioPage.blocks || [])
      .filter(block => block.isActive)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    res.json({
      bioPage: {
        username: user.bioPage.username,
        displayName: user.bioPage.displayName || user.name,
        bio: user.bioPage.bio || '',
        avatar: user.bioPage.avatar || '',
        theme: user.bioPage.theme || 'default',
        socialLinks: user.bioPage.socialLinks || [],
        customLinks: activeLinks,
        blocks: activeBlocks
      }
    });
  } catch (err) {
    console.error('Get public bio page error:', err);
    res.status(500).json({
      error: 'Server error',
      code: 'BIO_PUBLIC_GET_500_V2',
      message: err.message
    });
  }
});

const { RateLimiterMemory } = require('rate-limiter-flexible');

// 🛡️ SECURITY: Rate limiter for bio interactions (prevent click/view fraud)
const bioInteractionLimiter = new RateLimiterMemory({
  points: 20, // max 20 interaction tracking requests
  duration: 60, // per 60 seconds per IP
});

// Track bio page view (Rate Limited)
router.post('/:username/view', async (req, res) => {
  try {
    const ip = req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.socket.remoteAddress;
    await bioInteractionLimiter.consume(ip);

    // Future: implement tracking logic in User/Bio model here
    res.json({ success: true, message: 'View tracked securely' });
  } catch (rejRes) {
    res.status(429).json({ error: 'Too many interactions from this IP, please try again later' });
  }
});

// Track bio link click (Rate Limited)
router.post('/:username/click', async (req, res) => {
  try {
    const ip = req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.socket.remoteAddress;
    await bioInteractionLimiter.consume(ip);

    // Future: implement tracking logic in User/Bio model here
    res.json({ success: true, message: 'Click tracked securely' });
  } catch (rejRes) {
    res.status(429).json({ error: 'Too many interactions from this IP, please try again later' });
  }
});

const Subscriber = require('../models/Subscriber');

// Subscribe to newsletter (Public)
router.post('/:username/subscribe', async (req, res) => {
  try {
    const { username } = req.params;
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const creator = await User.findOne({ 'bioPage.username': username.toLowerCase() });
    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    // Check if block exists and is active
    const newsletterBlock = (creator.bioPage.blocks || []).find(b => b.type === 'newsletter' && b.isActive);
    if (!newsletterBlock) {
      return res.status(400).json({ error: 'Newsletter subscription is not available for this creator' });
    }

    try {
      await Subscriber.create({
        creatorId: creator._id,
        email,
        name,
        source: 'bio_page'
      });
    } catch (dbErr) {
      if (dbErr.code === 11000) {
        return res.status(400).json({ error: 'You are already subscribed to this creator' });
      }
      throw dbErr;
    }

    res.json({ success: true, message: 'Subscribed successfully!' });
  } catch (err) {
    console.error('Newsletter subscription error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
