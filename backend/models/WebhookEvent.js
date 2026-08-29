const mongoose = require('mongoose');

const webhookEventSchema = new mongoose.Schema({
    eventId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    eventName: {
        type: String,
        required: true
    },
    processed: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'error'],
        default: 'pending'
    },
    errorDetails: {
        type: String
    },
    payload: {
        type: mongoose.Schema.Types.Mixed
    },
    createdAt: { 
        type: Date, 
        default: Date.now,
        expires: '30d' // Automatically delete document 30 days after creation
    }
}, { timestamps: true });

module.exports = mongoose.model('WebhookEvent', webhookEventSchema);
