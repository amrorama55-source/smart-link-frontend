const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'USER_LOGIN',
      'USER_LOGOUT',
      'PASSWORD_CHANGE',
      'PROFILE_UPDATE',
      'LINK_CREATED',
      'LINK_UPDATED',
      'LINK_DELETED',
      'DOMAIN_ADDED',
      'DOMAIN_REMOVED',
      'API_KEY_GENERATED',
      'DATA_EXPORTED',
      'SYSTEM_SETTINGS_UPDATE',
      'PLAN_CHANGED',
      'USER_BANNED',
      'USER_UNBANNED'
    ]
  },
  details: {
    type: String,
    default: ''
  },
  ipAddress: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '180d' // Auto-delete logs after 180 days
  }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
