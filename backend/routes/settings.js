const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Link = require('../models/Link');
const { verifyToken } = require('../middleware/verifyToken');
const { parseUserAgent } = require('../utils/shortener');
const { userDto } = require('../utils/dto');

// Get user settings/profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -sessions');

    res.json({
      user: userDto(user)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, email, bio, avatar } = req.body; // Added bio and avatar
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update name
    if (name !== undefined) {
      if (name.trim().length < 2) {
        return res.status(400).json({ error: 'Name must be at least 2 characters' });
      }
      user.name = name.trim();
    }

    // Update email
    if (email !== undefined && email !== user.email) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Check if email is already taken
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      user.email = email.toLowerCase();
      user.isEmailVerified = false; // Require re-verification

      // Generate new verification token
      const verificationToken = user.generateEmailVerificationToken();
      await user.save();

      // Send verification email (async)
      const { sendVerificationEmail } = require('../utils/email');
      sendVerificationEmail(user.email, verificationToken, user.name).catch(err =>
        console.error('Failed to send verification email:', err)
      );
    }

    // Update bio & avatar
    if (!user.bioPage) user.bioPage = {};
    if (bio !== undefined) user.bioPage.bio = bio;
    if (avatar !== undefined) {
      user.avatar = avatar; // Update top-level avatar
      user.bioPage.avatar = avatar; // Keep in sync with bioPage
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: userDto(user)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Change password
router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get active sessions
router.get('/sessions', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('sessions');

    // Filter active sessions and sort by last activity
    const activeSessions = user.sessions
      .filter(session => session.isActive)
      .sort((a, b) => b.lastActivity - a.lastActivity);

    res.json({ sessions: activeSessions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Revoke session
router.delete('/sessions/:token', verifyToken, async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findById(req.user._id);

    // Find and deactivate session
    const session = user.sessions.find(s => s.token === token);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    session.isActive = false;
    await user.save();

    res.json({ message: 'Session revoked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Revoke all other sessions
router.post('/sessions/revoke-all', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const currentToken = req.header('Authorization')?.replace('Bearer ', '');

    // Deactivate all sessions except current one
    user.sessions.forEach(session => {
      if (session.token !== currentToken) {
        session.isActive = false;
      }
    });

    await user.save();

    res.json({ message: 'All other sessions revoked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete account
router.delete('/account', verifyToken, async (req, res) => {
  try {
    const { password, confirmDelete } = req.body;

    if (!confirmDelete) {
      return res.status(400).json({ error: 'Please confirm account deletion' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify password for non-OAuth users
    if (!user.isOAuthUser()) {
      if (!password) {
        return res.status(400).json({ error: 'Password is required to delete your account' });
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Password is incorrect' });
      }
    }

    const userId = user._id;

    // Cascade delete all user data
    const ClickArchive = require('../models/ClickArchive');
    const SecurityLog = require('../models/SecurityLog');

    await Promise.all([
      Link.deleteMany({ userId }),         // Delete all links
      ClickArchive.deleteMany({ userId }), // Delete click archives
      SecurityLog.deleteMany({ userId }),  // Delete security logs
    ]);

    // Remove from team members arrays of other users
    if (user.parentAccountId) {
      await User.updateOne(
        { _id: user.parentAccountId },
        { $pull: { teamMembers: userId } }
      );
    }

    // Delete all sub-accounts if owner
    if (user.teamMembers?.length > 0) {
      await User.deleteMany({ _id: { $in: user.teamMembers } });
    }

    // Finally delete user account
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account and all associated data deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Get subscription details
router.get('/subscription', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('plan subscription limits');

    res.json({
      plan: user.plan,
      subscription: user.subscription || {
        status: null,
        currentPeriodStart: null,
        currentPeriodEnd: null
      },
      limits: user.limits
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update subscription (ADMIN ONLY - plan changes come from LemonSqueezy webhook)
router.put('/subscription', verifyToken, async (req, res) => {
  try {
    // ✅ SECURITY FIX: Only admins can manually change plans
    // Regular users must upgrade through LemonSqueezy checkout
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Plan changes must be made through the billing portal. Please use the upgrade button on the Pricing page.'
      });
    }

    const { plan } = req.body;

    if (!['free', 'starter', 'pro', 'business'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const user = await User.findById(req.user._id);

    // Update plan
    user.plan = plan;

    // Update limits based on plan
    if (plan === 'free') {
      user.limits.linksPerMonth = 5;
      user.limits.apiRequestsPerDay = 100;
    } else if (plan === 'starter') {
      user.limits.linksPerMonth = 15;
      user.limits.apiRequestsPerDay = 500;
    } else if (plan === 'pro') {
      user.limits.linksPerMonth = -1; // Unlimited
      user.limits.apiRequestsPerDay = 1000;
    } else if (plan === 'business') {
      user.limits.linksPerMonth = -1; // Unlimited
      user.limits.apiRequestsPerDay = -1; // Unlimited
    }

    // Update subscription status
    if (plan === 'free') {
      user.subscription = {
        status: null,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        canceledAt: null
      };
    }

    await user.save();

    res.json({
      message: 'Subscription updated successfully',
      plan: user.plan,
      limits: user.limits
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/settings/subscription/portal
// Returns the LemonSqueezy customer portal URL
// ─────────────────────────────────────────────────────────────
router.get('/subscription/portal', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('subscription plan');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const subscriptionId = user.subscription?.lemonSqueezySubscriptionId;
    if (!subscriptionId) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Payment provider not configured' });

    const response = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/vnd.api+json',
        }
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error('LemonSqueezy API error:', errBody);
      return res.status(502).json({ error: 'Failed to fetch subscription from payment provider' });
    }

    const data = await response.json();
    const portalUrl = data?.data?.attributes?.urls?.customer_portal;

    if (!portalUrl) return res.status(502).json({ error: 'Customer portal URL not available' });

    res.json({ portalUrl });
  } catch (error) {
    console.error('Portal URL error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/settings/subscription/cancel
// Cancels the subscription at period end via LemonSqueezy API
// ─────────────────────────────────────────────────────────────
router.post('/subscription/cancel', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('subscription plan');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const subscriptionId = user.subscription?.lemonSqueezySubscriptionId;
    if (!subscriptionId) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    if (user.subscription?.cancelAtPeriodEnd) {
      return res.status(400).json({ error: 'Subscription is already set to cancel at period end' });
    }

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Payment provider not configured' });

    // DELETE cancels at period end in LemonSqueezy
    const response = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/vnd.api+json',
        }
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error('LemonSqueezy cancel error:', errBody);
      return res.status(502).json({ error: 'Failed to cancel subscription' });
    }

    // Update local DB immediately (webhook will also fire)
    user.subscription.cancelAtPeriodEnd = true;
    user.subscription.canceledAt        = new Date();
    user.subscription.status            = 'canceled';
    await user.save();

    res.json({
      message: 'Subscription cancelled. You retain access until the end of your billing period.',
      cancelAtPeriodEnd: true,
      currentPeriodEnd: user.subscription.currentPeriodEnd
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/settings/subscription/invoices
// Returns invoice list from LemonSqueezy
// ─────────────────────────────────────────────────────────────
router.get('/subscription/invoices', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('subscription');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const subscriptionId = user.subscription?.lemonSqueezySubscriptionId;
    if (!subscriptionId) return res.json({ invoices: [] });

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Payment provider not configured' });

    const response = await fetch(
      `https://api.lemonsqueezy.com/v1/subscription-invoices?filter[subscription_id]=${subscriptionId}&sort=-created_at`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/vnd.api+json',
        }
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error('LemonSqueezy invoices error:', errBody);
      return res.status(502).json({ error: 'Failed to fetch invoices' });
    }

    const data = await response.json();
    const invoices = (data?.data || []).map(inv => ({
      id:         inv.id,
      status:     inv.attributes?.status,
      total:      inv.attributes?.total,
      currency:   inv.attributes?.currency,
      createdAt:  inv.attributes?.created_at,
      invoiceUrl: inv.attributes?.urls?.invoice_url,
    }));

    res.json({ invoices });
  } catch (error) {
    console.error('Invoices error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Track session on login (helper function to be called from auth route)
router.post('/sessions/track', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }

    const userAgent = req.headers['user-agent'] || '';
    const { device, browser, os } = parseUserAgent(userAgent);
    const ip = req.ip || req.connection.remoteAddress;

    // Check if session already exists
    const existingSession = user.sessions.find(s => s.token === token && s.isActive);

    if (existingSession) {
      // Update last activity
      existingSession.lastActivity = new Date();
    } else {
      // Create new session
      user.sessions.push({
        token,
        device,
        browser,
        os,
        ip,
        location: req.headers['cf-ipcountry'] || 'Unknown',
        lastActivity: new Date(),
        isActive: true
      });
    }

    // Keep only last 10 active sessions
    const activeSessions = user.sessions.filter(s => s.isActive);
    if (activeSessions.length > 10) {
      const sorted = activeSessions.sort((a, b) => b.lastActivity - a.lastActivity);
      sorted.slice(10).forEach(s => {
        s.isActive = false;
      });
    }

    await user.save();

    res.json({ message: 'Session tracked' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/settings/api-key/generate
// Generates a new API key for the user
// ─────────────────────────────────────────────────────────────
router.post('/api-key/generate', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Generate a secure API key
    const crypto = require('crypto');
    const newApiKey = 'sl_' + crypto.randomBytes(24).toString('hex');
    
    user.apiKey = newApiKey;
    await user.save();

    res.json({
      message: 'API Key generated successfully',
      apiKey: newApiKey // Send the full key ONCE
    });
  } catch (error) {
    console.error('API Key generation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/settings/webhook
// Sets the global webhook URL
// ─────────────────────────────────────────────────────────────
router.post('/webhook', verifyToken, async (req, res) => {
  try {
    const { url } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (url && !/^(http|https):\/\/[^ "]+$/.test(url)) {
      return res.status(400).json({ error: 'Invalid webhook URL format' });
    }

    user.globalWebhookUrl = url || undefined;
    await user.save();

    res.json({
      message: 'Global webhook updated successfully',
      webhookUrl: user.globalWebhookUrl || null
    });
  } catch (error) {
    console.error('Webhook update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────

// GET /api/settings/export-user-data (GDPR Data Export)
// Exports all links, user profile, settings, and clicks in JSON format
// ─────────────────────────────────────────────────────────────
router.get('/export-user-data', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;
    const user = await User.findById(userId).select('-password -sessions');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const links = await Link.find({ userId: user._id });

    const exportData = {
      exportDate: new Date().toISOString(),
      complianceNotice: 'GDPR Data Subject Access Request Export',
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        createdAt: user.createdAt
      },
      settings: {
        customDomains: user.customDomains || [],
        bioPage: user.bioPage || {},
        globalWebhookUrl: user.globalWebhookUrl || null
      },
      linksCount: links.length,
      links: links.map(l => ({
        shortCode: l.shortCode,
        shortUrl: l.shortUrl,
        originalUrl: l.originalUrl,
        title: l.title,
        totalClicks: l.totalClicks,
        hasPassword: !!l.password,
        createdAt: l.createdAt
      }))
    };

    // Log the data export event for audit compliance
    const { logAuditAction } = require('../utils/auditLogger');
    logAuditAction({
      userId: user._id,
      action: 'DATA_EXPORTED',
      details: `Exported data package containing ${links.length} links`,
      req
    });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="smartlink-user-data-${user._id}.json"`);
    res.send(JSON.stringify(exportData, null, 2));
  } catch (error) {
    console.error('GDPR export error:', error);
    res.status(500).json({ error: 'Failed to generate data export' });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/settings/audit-logs
// Retrieves recent security and account audit events
// ─────────────────────────────────────────────────────────────
router.get('/audit-logs', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;
    const AuditLog = require('../models/AuditLog');

    const logs = await AuditLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      logs
    });
  } catch (error) {
    console.error('Audit logs fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

module.exports = router;













