const AuditLog = require('../models/AuditLog');

/**
 * Non-blocking audit logger helper
 */
async function logAuditAction({ userId, action, details = '', req = null }) {
  try {
    if (!userId || !action) return;

    let ipAddress = '';
    let userAgent = '';

    if (req) {
      ipAddress = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
                req.headers['x-real-ip'] ||
                req.ip ||
                '';
      userAgent = req.headers['user-agent'] || '';
    }

    await AuditLog.create({
      userId,
      action,
      details,
      ipAddress,
      userAgent
    });
  } catch (err) {
    // Audit logging should never break the request flow
    console.error('AuditLog error:', err.message);
  }
}

module.exports = { logAuditAction };
