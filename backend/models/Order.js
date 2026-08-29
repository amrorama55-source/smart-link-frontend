const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  customerEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  productId: String, // Lemon Squeezy Product ID
  variantId: String, // Lemon Squeezy Variant ID
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'cancelled'],
    default: 'pending'
  },
  amount: Number,
  currency: String,
  blockId: String, // ID of the block in creator's bioPage
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
