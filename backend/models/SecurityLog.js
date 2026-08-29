const mongoose = require('mongoose');

const securityLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  userEmail: {
    type: String,
    required: true
  },
  maliciousUrl: {
    type: String,
    required: true
  },
  threatType: {
    type: String,
    default: 'MALWARE_OR_PHISHING'
  },
  reason: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '90d' // Automatically delete logs after 90 days to save space
  }
});

module.exports = mongoose.model('SecurityLog', securityLogSchema);
