const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  // OAuth IDs
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  appleId: {
    type: String,
    unique: true,
    sparse: true
  },

  // FIXED: Password is conditional - only required for non-OAuth users
  password: {
    type: String,
    required: function () {
      // Password مطلوب فقط إذا ما في OAuth IDs
      return !this.googleId && !this.appleId;
    },
    minlength: [8, 'Password must be at least 8 characters'],
    validate: {
      validator: function (v) {
        // إذا في OAuth, مش مشكلة إذا ما في password
        if (this.googleId || this.appleId) return true;
        // إذا ما في OAuth, لازم يكون في password
        return v && v.length >= 8;
      },
      message: 'Password is required for non-OAuth users'
    }
  },

  name: {
    type: String,
    required: true
  },

  plan: {
    type: String,
    enum: ['free', 'starter', 'trial', 'pro', 'business'],
    default: 'free'
  },

  apiKey: {
    type: String,
    unique: true,
    sparse: true
  },

  globalWebhookUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^(http|https):\/\/[^ "]+$/.test(v);
      },
      message: 'Invalid webhook URL'
    }
  },

  limits: {
    linksPerMonth: {
      type: Number,
      default: 5
    },
    apiRequestsPerDay: {
      type: Number,
      default: 100
    }
  },

  usage: {
    linksCreated: {
      type: Number,
      default: 0
    },
    apiRequests: {
      type: Number,
      default: 0
    },
    lastReset: {
      type: Date,
      default: Date.now
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  // Team & Sub-accounts (Agency Plan)
  role: {
    type: String,
    enum: ['owner', 'member', 'admin'],
    default: 'owner'
  },
  isAdmin: {
    type: Boolean,
    default: false,
    index: true
  },
  parentAccountId: {

    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Ban/Block - for phishing/abuse reports
  isBanned: {
    type: Boolean,
    default: false,
    index: true
  },
  bannedAt: Date,
  banReason: String,

  resetPasswordToken: String,
  resetPasswordExpires: Date,

  isEmailVerified: {
    type: Boolean,
    default: false
  },

  emailVerificationToken: String,
  emailVerificationExpires: Date,

  bioPage: {
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true
    },
    displayName: String,
    bio: String,
    avatar: String,
    theme: {
      type: String,
      default: 'default'
    },
    socialLinks: [{
      platform: String,
      url: String,
      icon: String
    }],
    customLinks: [{
      title: String,
      url: String,
      icon: String,
      order: Number,
      isActive: {
        type: Boolean,
        default: true
      }
    }],
    // ✅ NEW: Flexible Blocks System
    blocks: [{
      type: {
        type: String,
        enum: ['link', 'paywall', 'newsletter', 'file', 'social_feed', 'text', 'header'],
        default: 'link'
      },
      title: String,
      url: String,
      content: String, // For text blocks or description
      icon: String,
      order: Number,
      isActive: {
        type: Boolean,
        default: true
      },
      settings: mongoose.Schema.Types.Mixed // For block-specific settings (e.g., price, currency, fileUrl)
    }],
    isPublic: {
      type: Boolean,
      default: true
    },
    customStyles: {
      backgroundColor: String,
      buttonColor: String,
      textColor: String,
      fontFamily: String
    }
  },

  // ✅ Creator Payouts
  stripeConnect: {
    accountId: String,
    detailsSubmitted: { type: Boolean, default: false },
    chargesEnabled: { type: Boolean, default: false }
  },

  // Trial & Activation
  trialStartedAt: {
    type: Date,
    default: null
  },
  trialEndsAt: {
    type: Date,
    default: null
  },
  trialExpiredAt: {
    type: Date,
    default: null
  },
  trialConvertedAt: {
    type: Date,
    default: null
  },
  trialSource: {
    type: String,
    enum: ['registration', 'manual', 'upgrade'],
    default: null
  },
  activationChecklist: {
    createFirstLink: {
      completed: { type: Boolean, default: false },
      completedAt: Date
    },
    viewAnalytics: {
      completed: { type: Boolean, default: false },
      completedAt: Date
    },
    createCustomDomain: {
      completed: { type: Boolean, default: false },
      completedAt: Date
    }
  },

  // Session Management
  sessions: [{
    token: String,
    device: String,
    browser: String,
    os: String,
    ip: String,
    location: String,
    lastActivity: {
      type: Date,
      default: Date.now
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],

  // AppSumo
  appSumoCodes: [{
    type: String
  }],

  // Subscription & Payment
  subscription: {
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'trialing', 'incomplete'],
      default: null
    },
    // Legacy Stripe fields (kept for backwards compat)
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    // LemonSqueezy fields
    lemonSqueezyCustomerId: String,
    lemonSqueezySubscriptionId: String,
    lemonSqueezyOrderId: String,
    interval: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: null
    },
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false
    },
    canceledAt: Date
    // Note: trialStartedAt, trialEndsAt, trialExpiredAt, trialConvertedAt
    // are stored at the top-level user document (not duplicated here)
  }
});

// GUARD: Never auto-assign 'trial' plan — must be set explicitly
userSchema.pre('save', function (next) {
  // Only block if the plan was changed TO trial via automated code paths;
  // allow manual admin overrides by checking a flag.
  if (this.isModified('plan') && this.plan === 'trial' && !this.__allowTrial) {
    console.warn('⚠️ Attempt to auto-set plan to trial blocked for user:', this._id);
    this.plan = this._previousPlan || 'free';
  }
  if (this.isModified('plan')) {
    this._previousPlan = this.plan;
  }
  next();
});

// FIXED: Hash password before saving - only if password exists
userSchema.pre('save', async function (next) {
  // Skip if password is not modified or doesn't exist
  if (!this.password || !this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  // If user doesn't have a password (OAuth user), return false
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if user is OAuth user
userSchema.methods.isOAuthUser = function () {
  return !!(this.googleId || this.appleId);
};

// Check if user has password
userSchema.methods.hasPassword = function () {
  return !!this.password;
};

// Get OAuth provider
userSchema.methods.getOAuthProvider = function () {
  if (this.googleId) return 'google';
  if (this.appleId) return 'apple';
  return null;
};

// Check if trial is currently active (plan is 'trial' AND not expired)
userSchema.methods.isTrialActive = function () {
  if (this.plan !== 'trial') return false;
  if (!this.trialEndsAt) return false;
  return new Date() < new Date(this.trialEndsAt);
};

// Generate API Key
userSchema.methods.generateApiKey = function () {
  const crypto = require('crypto');
  this.apiKey = 'sk_' + crypto.randomBytes(32).toString('hex');
  return this.apiKey;
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (1 hour)
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;

  return resetToken;
};

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function () {
  const crypto = require('crypto');
  const verifyToken = crypto.randomBytes(32).toString('hex');

  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verifyToken)
    .digest('hex');

  // Set expire (24 hours)
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

  return verifyToken;
};

// Note: Basic indexes (unique: true) are already handled in schema field definitions
// to avoid "Duplicate schema index" warnings.

module.exports = mongoose.model('User', userSchema);