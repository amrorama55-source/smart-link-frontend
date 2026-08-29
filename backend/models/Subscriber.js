const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  name: String,
  source: {
    type: String,
    default: 'bio_page'
  },
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

// Ensure unique email per creator
subscriberSchema.index({ creatorId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Subscriber', subscriberSchema);
