const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Link = require('../models/Link');
const AuditLog = require('../models/AuditLog');
const { verifyToken } = require('../middleware/verifyToken');
const { verifyAdmin } = require('../middleware/verifyAdmin');
const { logAuditAction } = require('../utils/auditLogger');
const { sendEmail } = require('../utils/email');


// Apply auth + admin verification to ALL admin routes
router.use(verifyToken, verifyAdmin);

/**
 * @openapi
 * /api/admin/stats:
 *   get:
 *     summary: System overview statistics for administrators
 *     tags: [Admin]
 */
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      bannedUsers,
      totalLinks,
      totalClicksResult,
      plansBreakdown
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isBanned: true }),
      Link.countDocuments(),
      Link.aggregate([{ $group: { _id: null, totalClicks: { $sum: '$totalClicks' } } }]),
      User.aggregate([{ $group: { _id: '$plan', count: { $sum: 1 } } }])
    ]);

    const totalClicks = totalClicksResult[0]?.totalClicks || 0;
    const plans = { free: 0, starter: 0, trial: 0, pro: 0, business: 0 };
    plansBreakdown.forEach(p => {
      if (p._id && plans[p._id] !== undefined) {
        plans[p._id] = p.count;
      }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        bannedUsers,
        totalLinks,
        totalClicks,
        plans
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     summary: Paginated list of users with search and filter
 *     tags: [Admin]
 */
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', plan = '', status = '' } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    if (plan) {
      query.plan = plan;
    }

    if (status === 'banned') {
      query.isBanned = true;
    } else if (status === 'active') {
      query.isBanned = { $ne: true };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -sessions')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query)
    ]);

    const formattedUsers = users.map(u => {
      const isSystemAdmin = u.email === 'smartlinkpro10@gmail.com' || u.role === 'admin' || u.isAdmin === true;
      return {
        ...u.toObject(),
        displayRole: isSystemAdmin ? 'admin' : 'user'
      };
    });

    res.json({
      success: true,
      users: formattedUsers,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Failed to fetch users list' });
  }
});

/**
 * @openapi
 * /api/admin/users/{userId}/ban:
 *   post:
 *     summary: Ban user account
 *     tags: [Admin]
 */
router.post('/users/:userId/ban', async (req, res) => {
  try {
    const { reason = 'Policy violation' } = req.body;
    const targetUser = await User.findById(req.params.userId);

    if (!targetUser) {
      return res.status(404).json({ error: 'Target user not found' });
    }

    if (targetUser.role === 'admin' || targetUser.isAdmin) {
      return res.status(400).json({ error: 'Cannot ban an administrator account' });
    }

    targetUser.isBanned = true;
    targetUser.bannedAt = new Date();
    targetUser.banReason = reason;
    await targetUser.save();

    logAuditAction({
      userId: req.user._id,
      action: 'PROFILE_UPDATE',
      details: `Banned user ${targetUser.email}. Reason: ${reason}`,
      req
    });

    res.json({
      success: true,
      message: `User ${targetUser.email} has been banned`,
      user: {
        id: targetUser._id,
        email: targetUser.email,
        isBanned: true,
        bannedAt: targetUser.bannedAt
      }
    });
  } catch (error) {
    console.error('Admin ban error:', error);
    res.status(500).json({ error: 'Failed to ban user' });
  }
});

/**
 * @openapi
 * /api/admin/users/{userId}/unban:
 *   post:
 *     summary: Lift user ban
 *     tags: [Admin]
 */
router.post('/users/:userId/unban', async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);

    if (!targetUser) {
      return res.status(404).json({ error: 'Target user not found' });
    }

    targetUser.isBanned = false;
    targetUser.bannedAt = undefined;
    targetUser.banReason = undefined;
    await targetUser.save();

    logAuditAction({
      userId: req.user._id,
      action: 'PROFILE_UPDATE',
      details: `Unbanned user ${targetUser.email}`,
      req
    });

    res.json({
      success: true,
      message: `User ${targetUser.email} has been unbanned`,
      user: {
        id: targetUser._id,
        email: targetUser.email,
        isBanned: false
      }
    });
  } catch (error) {
    console.error('Admin unban error:', error);
    res.status(500).json({ error: 'Failed to unban user' });
  }
});

/**
 * @openapi
 * /api/admin/audit-logs:
 *   get:
 *     summary: System-wide audit logs for admin
 *     tags: [Admin]
 */
router.get('/audit-logs', async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('userId', 'email name')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      logs
    });
  } catch (error) {
    console.error('Admin audit logs error:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

/**
 * @openapi
 * /api/admin/broadcast-email:
 *   post:
 *     summary: Broadcast email campaign to all active users
 *     tags: [Admin]
 */
router.post('/broadcast-email', async (req, res) => {
  try {
    const { subject, bodyHtml, testOnly } = req.body;
    if (!subject || !bodyHtml) {
      return res.status(400).json({ error: 'Subject and bodyHtml are required' });
    }

    if (testOnly) {
      const result = await sendEmail({
        to: req.user.email,
        subject: `[TEST] ${subject}`,
        html: bodyHtml
      });
      return res.json({ success: true, message: `Test email sent to ${req.user.email}`, result });
    }

    const users = await User.find({ isBanned: { $ne: true } }).select('email name');

    // Respond to the frontend immediately to prevent timeouts
    res.json({
      success: true,
      message: `Broadcast started in the background for ${users.length} users. You can monitor progress in the Audit Logs tab shortly.`
    });

    // Run the sending loop asynchronously in the background
    (async () => {
      let sentCount = 0;
      let failedCount = 0;

      for (const user of users) {
        if (!user.email) continue;
        const formattedHtml = bodyHtml.replace(/{{name}}/g, user.name || 'there');
        const result = await sendEmail({
          to: user.email,
          subject,
          html: formattedHtml
        });
        if (result.success) {
          sentCount++;
        } else {
          failedCount++;
        }
      }

      logAuditAction({
        userId: req.user._id,
        action: 'SYSTEM_SETTINGS_UPDATE',
        details: `Broadcast email completed. Sent to ${sentCount} users (Failed: ${failedCount}). Subject: ${subject}`,
        req
      });
    })().catch(err => {
      console.error('Background broadcast error:', err);
    });
  } catch (error) {
    console.error('Broadcast email error:', error);
    res.status(500).json({ error: 'Failed to send broadcast email' });
  }
});

/**
 * @openapi
 * /api/admin/growth-stats:
 *   get:
 *     summary: Daily new users and links for the last 30 days
 *     tags: [Admin]
 */
router.get('/growth-stats', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [usersGrowth, linksGrowth] = await Promise.all([
      User.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }},
        { $sort: { _id: 1 } }
      ]),
      Link.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }},
        { $sort: { _id: 1 } }
      ])
    ]);

    res.json({ success: true, usersGrowth, linksGrowth });
  } catch (error) {
    console.error('Growth stats error:', error);
    res.status(500).json({ error: 'Failed to fetch growth stats' });
  }
});

/**
 * @openapi
 * /api/admin/top-users:
 *   get:
 *     summary: Top 10 most active users by links and clicks
 *     tags: [Admin]
 */
router.get('/top-users', async (req, res) => {
  try {
    const topByLinks = await Link.aggregate([
      { $group: { _id: '$userId', linkCount: { $sum: 1 }, totalClicks: { $sum: '$totalClicks' } } },
      { $sort: { linkCount: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $project: {
        linkCount: 1,
        totalClicks: 1,
        email: '$user.email',
        name: '$user.name',
        plan: '$user.plan'
      }}
    ]);

    res.json({ success: true, topUsers: topByLinks });
  } catch (error) {
    console.error('Top users error:', error);
    res.status(500).json({ error: 'Failed to fetch top users' });
  }
});

/**
 * @openapi
 * /api/admin/users/{userId}/plan:
 *   patch:
 *     summary: Manually change a user's subscription plan
 *     tags: [Admin]
 */
router.patch('/users/:userId/plan', async (req, res) => {
  try {
    const { plan } = req.body;
    const validPlans = ['free', 'starter', 'trial', 'pro', 'business'];

    if (!plan || !validPlans.includes(plan)) {
      return res.status(400).json({ error: `Invalid plan. Must be one of: ${validPlans.join(', ')}` });
    }

    const targetUser = await User.findById(req.params.userId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const previousPlan = targetUser.plan;
    targetUser.plan = plan;
    await targetUser.save();

    logAuditAction({
      userId: req.user._id,
      action: 'PLAN_CHANGED',
      details: `Admin changed plan for ${targetUser.email}: ${previousPlan} → ${plan}`,
      req
    });

    res.json({
      success: true,
      message: `Plan updated from ${previousPlan} to ${plan} for ${targetUser.email}`,
      user: { id: targetUser._id, email: targetUser.email, plan: targetUser.plan }
    });
  } catch (error) {
    console.error('Change plan error:', error);
    res.status(500).json({ error: 'Failed to change user plan' });
  }
});

/**
 * @openapi
 * /api/admin/users/{userId}/links:
 *   get:
 *     summary: Get all links created by a specific user
 *     tags: [Admin]
 */
router.get('/users/:userId/links', async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId).select('email name');
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const links = await Link.find({ userId: req.params.userId })
      .select('shortCode originalUrl title totalClicks isActive createdAt')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      user: { email: targetUser.email, name: targetUser.name },
      links,
      total: links.length
    });
  } catch (error) {
    console.error('User links error:', error);
    res.status(500).json({ error: 'Failed to fetch user links' });
  }
});

/**
 * @openapi
 * /api/admin/export/users:
 *   get:
 *     summary: Export all users as a CSV file
 *     tags: [Admin]
 */
router.get('/export/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('email name plan isBanned createdAt lastLoginAt')
      .sort({ createdAt: -1 });

    const csvHeader = 'Email,Name,Plan,Status,Joined,Last Login\n';
    const csvRows = users.map(u => {
      const status = u.isBanned ? 'Banned' : 'Active';
      const joined = u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '';
      const lastLogin = u.lastLoginAt ? new Date(u.lastLoginAt).toISOString().split('T')[0] : '';
      const name = (u.name || '').replace(/,/g, ' ');
      return `${u.email},${name},${u.plan || 'free'},${status},${joined},${lastLogin}`;
    }).join('\n');

    const csv = csvHeader + csvRows;

    logAuditAction({
      userId: req.user._id,
      action: 'DATA_EXPORTED',
      details: `Admin exported users CSV (${users.length} users)`,
      req
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="smart-link-users-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csv);
  } catch (error) {
    console.error('Export users error:', error);
    res.status(500).json({ error: 'Failed to export users' });
  }
});

module.exports = router;
