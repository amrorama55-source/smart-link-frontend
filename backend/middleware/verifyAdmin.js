const User = require('../models/User');

const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
    }

    const userId = req.user._id || req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const adminEmail = (process.env.ADMIN_EMAIL || 'smartlinkpro10@gmail.com').trim().toLowerCase();
    const userEmail = (user.email || '').trim().toLowerCase();

    // Strict check: only explicit admin email OR DB-level admin role/flag
    const isSystemAdmin =
      user.role === 'admin' ||
      user.isAdmin === true ||
      userEmail === adminEmail;

    // Auto-promote if matched by email but not yet flagged in DB
    if (isSystemAdmin && (!user.isAdmin || user.role !== 'admin')) {
      user.role = 'admin';
      user.isAdmin = true;
      await user.save().catch(() => {});
    }

    if (!isSystemAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access Restricted: You do not have system administrator privileges.'
      });
    }

    req.adminUser = user;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ error: 'Server error verifying admin access' });
  }
};

module.exports = { verifyAdmin };

