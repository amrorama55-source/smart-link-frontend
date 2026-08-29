const mongoose = require('mongoose');

const appSumoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  isRedeemed: {
    type: Boolean,
    default: false,
    index: true
  },
  redeemedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  redeemedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AppSumoCode', appSumoCodeSchema);
