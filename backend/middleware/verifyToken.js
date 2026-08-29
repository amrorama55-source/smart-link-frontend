const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ✅ Helper: only log in development mode
const isDev = process.env.NODE_ENV !== 'production';
const devLog = (...args) => { if (isDev) console.log(...args); };
const devErr = (...args) => { if (isDev) console.error(...args); };

// Verify JWT Token
exports.verifyToken = async (req, res, next) => {
  try {
    // Prefer token from HttpOnly cookie; fallback to Authorization header
    const authHeader = req.header('Authorization');
    const tokenFromHeader = authHeader ? authHeader.replace('Bearer ', '') : null;
    const token = req.cookies?.token || tokenFromHeader;

    if (!token) {
      devLog('❌ verifyToken: No token provided — Path:', req.path);
      return res.status(401).json({
        error: 'Access denied',
        message: 'No authentication token provided.'
      });
    }

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in database
    const user = await User.findById(decoded.userId);

    if (!user) {
      // ⚠️ Log only the ID (not email) — safe for production logs
      console.warn('⚠️ verifyToken: User not found for ID:', decoded.userId);
      return res.status(404).json({
        error: 'User not found',
        message: 'Your account no longer exists. Please register again.',
        code: 'USER_NOT_FOUND'
      });
    }

    // 🚫 BANNED USER CHECK — Log user ID only, not email
    if (user.isBanned) {
      console.warn('🚫 verifyToken: Banned user attempted access — ID:', user._id.toString());
      return res.status(403).json({
        error: 'Account suspended',
        message: 'Your account has been suspended due to a policy violation.',
        code: 'ACCOUNT_BANNED'
      });
    }

    // ✅ Mark expired trial users (keep plan as 'trial' for lockout screen)
    if (user.plan === 'trial' && user.trialEndsAt && new Date() > new Date(user.trialEndsAt)) {
      if (!user.trialExpiredAt) {
        devLog('⏰ Trial expired — marking as expired (lockout active)');
        user.trialExpiredAt = new Date();
        await user.save();
      }
    }

    const isTrialActive = user.isTrialActive();

    // ✅ Set req.user with BOTH _id and userId for compatibility
    const effectiveWorkspaceId = user.role === 'member' && user.parentAccountId ? user.parentAccountId : user._id;

    req.user = {
      _id: user._id,
      userId: user._id,
      id: user._id,
      email: user.email,
      name: user.name,
      plan: user.plan || 'free',
      role: user.role || 'owner',
      parentAccountId: user.parentAccountId,
      workspaceId: effectiveWorkspaceId,
      isTrialActive: isTrialActive,
      limits: (user.plan === 'business' || user.plan === 'pro' || user.role === 'admin')
        ? { linksPerMonth: -1, apiRequestsPerDay: -1 }
        : (user.plan === 'starter' || isTrialActive)
          ? { linksPerMonth: 15, apiRequestsPerDay: 500 }
          : { linksPerMonth: 5, apiRequestsPerDay: 100 },
      isOAuthUser: !!user.googleId && !user.password,
      trialEndsAt: user.trialEndsAt
    };

    // Also set the full user document for advanced use
    req.userDoc = user;

    devLog('✅ verifyToken: Auth successful — Path:', req.path);
    next();
  } catch (error) {
    // ✅ Log error type only — no stack trace or user data in production
    if (process.env.NODE_ENV !== 'production') {
      console.error('❌ verifyToken error:', error.name, error.message);
    } else {
      console.warn('⚠️ verifyToken: Auth error —', error.name);
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Authentication token is invalid.'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Authentication token has expired. Please login again.'
      });
    }

    res.status(401).json({
      error: 'Authentication failed',
      message: 'Please login again.'
    });
  }
};

// Verify API Key
exports.verifyApiKey = async (req, res, next) => {
  try {
    const apiKey = req.header('X-API-Key');

    if (!apiKey) {
      return res.status(401).json({ error: 'API key required.' });
    }

    const user = await User.findOne({ apiKey });

    if (!user) {
      return res.status(401).json({ error: 'Invalid API key.' });
    }

    // 🚫 BANNED USER CHECK
    if (user.isBanned) {
      console.error('🚫 BANNED user attempted API access:', user.email);
      return res.status(403).json({
        error: 'Account suspended',
        message: 'Your account has been suspended due to a policy violation.',
        code: 'ACCOUNT_BANNED'
      });
    }
    const now = new Date();
    const lastReset = new Date(user.usage?.lastReset || now);
    const hoursSinceReset = (now - lastReset) / (1000 * 60 * 60);

    // Reset daily counter if 24 hours passed
    if (hoursSinceReset >= 24) {
      if (!user.usage) user.usage = {};
      user.usage.apiRequests = 0;
      user.usage.lastReset = now;
      await user.save();
    }

    // Check if limit exceeded
    const apiLimit = user.limits?.apiRequestsPerDay || 100;
    const currentUsage = user.usage?.apiRequests || 0;

    if (currentUsage >= apiLimit) {
      return res.status(429).json({
        error: 'API rate limit exceeded. Please try again later.'
      });
    }

    // Increment usage
    if (!user.usage) user.usage = { apiRequests: 0, lastReset: now };
    user.usage.apiRequests += 1;
    await user.save();

    // ✅ CRITICAL FIX: Auto-downgrade expired trial users to free (API KEY USERS)
    if (user.plan === 'trial' && user.trialEndsAt && new Date() > new Date(user.trialEndsAt)) {
      devLog('⏰ API KEY Trial expired — downgrading user ID:', user._id.toString());
      user.plan = 'free';
      if (!user.trialExpiredAt) user.trialExpiredAt = new Date();
      user.limits = { linksPerMonth: 5, apiRequestsPerDay: 100 };
      await user.save();
    }

    const isTrialActive = user.isTrialActive();

    // ✅ Set req.user with all IDs
    req.user = {
      _id: user._id,
      userId: user._id,
      id: user._id,
      email: user.email,
      name: user.name,
      plan: user.plan || 'free',
      isTrialActive: isTrialActive,
      limits: (user.plan === 'business' || isTrialActive || user.role === 'admin')
        ? { linksPerMonth: -1, apiRequestsPerDay: -1 }
        : user.plan === 'pro'
          ? { linksPerMonth: 1000, apiRequestsPerDay: 1000 }
          : user.limits || { linksPerMonth: 5, apiRequestsPerDay: 100 }
    };
    req.userDoc = user;

    next();
  } catch (error) {
    console.error('❌ API Key verification error:', error);
    res.status(401).json({ error: 'Authentication failed.' });
  }
};