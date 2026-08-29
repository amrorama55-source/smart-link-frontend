const mongoose = require('mongoose');
const crypto = require('crypto');

// ==========================================
// Click Schema - مُحسّن مع Visitor Tracking
// ==========================================
const clickSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
    expires: 15552000 // Auto-delete clicks older than 180 days
  },

  // ✅ CRITICAL FIX: Visitor Identity
  visitorId: {
    type: String,
    required: true,
    index: true
  },
  clickId: {
    type: String,
    index: true
  },
  sessionId: String,

  // Network Info
  ip: {
    type: String,
    index: true
  },
  userAgent: String,
  referer: String,

  // Device Info
  device: {
    type: String,
    enum: ['Mobile', 'Tablet', 'Desktop', 'Unknown'],
    default: 'Unknown',
    index: true
  },
  browser: String,
  os: String,

  // Location Info
  country: {
    type: String,
    default: 'Unknown',
    index: true
  },
  city: String,
  region: String,

  // Analytics
  language: String,
  timezone: String,
  screenResolution: String,
  isMobile: {
    type: Boolean,
    index: true
  },
  isBot: {
    type: Boolean,
    default: false,
    index: true
  },

  // Advanced Accuracy Features
  fingerprint: {
    type: String,
    index: true
  },
  isDatacenter: {
    type: Boolean,
    index: true,
    default: false
  },

  // ✅ A/B Testing Data - Enhanced
  abVariant: String,
  abVariantIndex: Number,

  // ✅ NEW: Conversion Tracking
  converted: {
    type: Boolean,
    default: false
  },
  conversionValue: Number,
  conversionTime: Date,

  // Session Info
  isNewVisitor: Boolean,
  isReturningVisitor: Boolean,
  visitNumber: Number
}, {
  _id: false,
  timestamps: false
});

// ==========================================
// Link Schema - مُحسّن
// ==========================================
const linkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        // ✅ التحقق من الصيغة
        return /^[a-z0-9-_]{3,50}$/.test(v);
      },
      message: 'Invalid shortCode format. Use 3-50 alphanumeric characters, hyphens, or underscores.'
    }
  },

  originalUrl: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        try {
          new URL(v);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Invalid URL format'
    }
  },

  title: { type: String, trim: true },
  description: { type: String, trim: true },

  // ✅ ENHANCED: Custom Domain with Verification
  customDomain: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(v);
      },
      message: 'Invalid domain format'
    }
  },

  // ✅ NEW: Domain Verification
  domainVerification: {
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationMethod: {
      type: String,
      enum: ['DNS', 'FILE', 'META'],
      default: 'DNS'
    },
    verifiedAt: Date,
    sslEnabled: { type: Boolean, default: false },
    sslIssuedAt: Date
  },

  // Security
  password: {
    type: String,
    select: false
  },

  // Status
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },

  expiresAt: {
    type: Date,
    index: true
  },

  // Analytics - Enhanced
  clicks: {
    type: [clickSchema],
    default: [],
    validate: {
      validator: function (clicks) {
        return clicks.length <= 10000;
      },
      message: 'Too many clicks stored. Consider archiving old data.'
    }
  },

  totalClicks: {
    type: Number,
    default: 0,
    index: true,
    min: 0
  },

  lastClickedAt: Date,

  // ✅ NEW: Visitor Tracking
  uniqueVisitors: {
    type: Number,
    default: 0
  },
  returningVisitors: {
    type: Number,
    default: 0
  },

  // Metadata
  tags: {
    type: [String],
    default: [],
    index: true
  },
  customMetadata: mongoose.Schema.Types.Mixed,

  // UTM Parameters
  utmSource: String,
  utmMedium: String,
  utmCampaign: String,

  // ✅ FIXED: A/B Testing with Proper Consistency
  abTest: {
    enabled: {
      type: Boolean,
      default: false
    },
    variants: [{
      url: {
        type: String,
        required: true,
        trim: true
      },
      name: {
        type: String,
        trim: true
      },
      weight: {
        type: Number,
        default: 50,
        min: 0,
        max: 100
      },
      clicks: {
        type: Number,
        default: 0,
        min: 0
      },
      // ✅ NEW: Conversion Tracking per Variant
      conversions: {
        type: Number,
        default: 0,
        min: 0
      },
      conversionRate: {
        type: Number,
        default: 0
      }
    }],
    splitMethod: {
      type: String,
      enum: ['random', 'weighted', 'optimized'],
      default: 'weighted'
    },
    // ✅ NEW: Auto-optimization settings
    autoOptimize: {
      enabled: { type: Boolean, default: false },
      minSampleSize: { type: Number, default: 100 },
      confidenceLevel: { type: Number, default: 0.95 }
    },
    // Test status
    status: {
      type: String,
      enum: ['draft', 'running', 'paused', 'completed'],
      default: 'running'
    },
    startedAt: Date,
    completedAt: Date,
    winner: {
      variantIndex: Number,
      confidence: Number
    }
  },

  // ✅ NEW: Geotargeting Rules (Includes City & ISP for Business Elite)
  geoRules: [{
    countries: [String],
    cities: [String],
    isps: [String],
    targetUrl: String,
    priority: { type: Number, default: 0 }
  }],

  // ✅ NEW: Device Targeting
  deviceRules: {
    mobile: String,
    desktop: String,
    tablet: String
  },

  // ✅ ENHANCED: OS Level Targeting (iOS, Android, Windows, Mac, Linux)
  osRules: {
    ios: String,
    android: String,
    windows: String,
    mac: String,
    linux: String
  },

  // ✅ ENHANCED: Language Targeting
  // e.g., [{ language: 'ar', targetUrl: '...' }]
  languageRules: [{
    language: String, // ISO 639-1 code (e.g., 'en', 'ar', 'fr')
    targetUrl: String
  }],

  // ✅ NEW: Link Scheduling
  schedule: {
    enabled: { type: Boolean, default: false },
    startDate: Date,
    endDate: Date,
    timezone: String,
    redirectAfterExpiry: String
  },

  // ✅ NEW: Retargeting Pixels
  pixels: [{
    platform: {
      type: String,
      enum: ['facebook', 'google', 'twitter', 'linkedin', 'tiktok']
    },
    pixelId: String,
    event: String
  }],

  // QR Code
  qrCode: String,

  // ✅ NEW: Webhooks Integration
  webhookUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        if (!v) return true;
        try {
          new URL(v);
          return v.startsWith('http://') || v.startsWith('https://');
        } catch {
          return false;
        }
      },
      message: 'Invalid webhook URL format'
    }
  },

  // ✅ NEW: Security & Automation
  autoShield: {
    enabled: { type: Boolean, default: false },
    redirectBotTo: String, // Optional: Redirect bots to a dead-end URL
    blockScrapers: { type: Boolean, default: true },
    protectPixels: { type: Boolean, default: true } // Don't fire pixels for bots
  },

  isSafe: {
    type: Boolean,
    default: true
  },
  lastSafetyCheck: Date,
  safetyCheckResults: {
    malware: Boolean,
    phishing: Boolean,
    spam: Boolean
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==========================================
// Optimized Indexes
// ==========================================
linkSchema.index({ userId: 1, createdAt: -1 });
linkSchema.index({ userId: 1, totalClicks: -1 });
linkSchema.index({ userId: 1, isActive: 1 });
linkSchema.index({ customDomain: 1, shortCode: 1 });
// expiresAt index is already handled in the field definition with index: true
linkSchema.index({ 'schedule.startDate': 1, 'schedule.endDate': 1 });
// clicks.visitorId index is already handled in clickSchema field definition
linkSchema.index({ 'clicks.abVariantIndex': 1 });

// ==========================================
// ✅ CRITICAL FIX: Visitor ID Generation
// ==========================================
const { nanoid } = require('nanoid');

linkSchema.methods.generateVisitorId = function (req) {
  // We use nanoid for a highly collision-resistant unique identifier
  // This is better than hashing the IP/User-Agent, which can result in collisions
  // for users on the same corporate network or VPN
  return nanoid(32);
};

// ==========================================
// ✅ CRITICAL FIX: A/B Variant Selection with Consistency
// ==========================================
linkSchema.methods.selectABVariant = function (visitorId) {
  if (!this.abTest?.enabled ||
    !this.abTest.variants ||
    this.abTest.variants.length === 0 ||
    this.abTest.status !== 'running') {
    return null;
  }

  const variants = this.abTest.variants;

  // ✅ استخدام hash ثابت من visitorId + linkId
  const hash = this.hashVisitor(visitorId);

  if (this.abTest.splitMethod === 'random') {
    // Random selection لكن ثابت للـ visitor نفسه
    const index = hash % variants.length;
    return {
      url: variants[index].url,
      index: index,
      name: variants[index].name || `Variant ${String.fromCharCode(65 + index)}`
    };
  }

  if (this.abTest.splitMethod === 'optimized' && this.abTest.autoOptimize?.enabled) {
    // Multi-Armed Bandit Algorithm
    return this.selectOptimizedVariant(hash, variants);
  }

  // Weighted selection - لكن ثابت للـ visitor نفسه
  const totalWeight = variants.reduce((sum, v) => sum + (v.weight || 50), 0);

  if (totalWeight === 0) {
    return {
      url: variants[0].url,
      index: 0,
      name: variants[0].name || 'Variant A'
    };
  }

  // استخدام hash للاختيار الموزون
  let threshold = hash % totalWeight;

  for (let i = 0; i < variants.length; i++) {
    threshold -= (variants[i].weight || 50);
    if (threshold < 0) {
      return {
        url: variants[i].url,
        index: i,
        name: variants[i].name || `Variant ${String.fromCharCode(65 + i)}`
      };
    }
  }

  // Fallback
  return {
    url: variants[0].url,
    index: 0,
    name: variants[0].name || 'Variant A'
  };
};

// ==========================================
// ✅ Hash Function for Visitor Consistency
// ==========================================
linkSchema.methods.hashVisitor = function (visitorId) {
  const str = `${this.shortCode}-${visitorId}`;
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash);
};

// ==========================================
// ✅ NEW: Multi-Armed Bandit for Auto-Optimization
// ==========================================
linkSchema.methods.selectOptimizedVariant = function (hash, variants) {
  const explorationRate = 0.1; // 10% exploration

  // حساب Thompson Sampling Score لكل variant
  const scores = variants.map((v, index) => {
    const conversions = v.conversions || 0;
    const clicks = v.clicks || 0;
    const conversionRate = clicks > 0 ? conversions / clicks : 0;

    // إضافة عشوائية للاستكشاف (لكن ثابت للـ visitor نفسه)
    const randomFactor = (hash % 100) / 1000; // 0-0.1

    return {
      index,
      score: conversionRate + (randomFactor * explorationRate),
      url: v.url,
      name: v.name || `Variant ${String.fromCharCode(65 + index)}`
    };
  });

  // اختيار أعلى score
  scores.sort((a, b) => b.score - a.score);

  return scores[0];
};

// ==========================================
// ✅ Enhanced Click Tracking
// ==========================================
linkSchema.methods.trackClick = async function (clickData) {
  try {
    // Prevent storing too many clicks
    if (this.clicks.length > 9900) {
      // Archive old clicks before removing
      await this.archiveOldClicks();
      this.clicks = this.clicks.slice(-5000);
    }

    // 🛡️ CLICK BOUNCE PROTECTION (30s window)
    // Ignore clicks from the same identity within 30 seconds
    const recentClick = this.clicks.find(c =>
      (c.visitorId === clickData.visitorId || c.fingerprint === clickData.fingerprint) &&
      (new Date() - new Date(c.timestamp)) < 30000
    );

    if (recentClick) {
      console.log('🛡️ Click bounced (Duplicate avoided within 30s):', clickData.visitorId);
      return this; // Silent skip
    }

    // Check if this is a returning visitor
    const visitorClicks = this.clicks.filter(c => c.visitorId === clickData.visitorId);
    clickData.isNewVisitor = visitorClicks.length === 0;
    clickData.isReturningVisitor = visitorClicks.length > 0;
    clickData.visitNumber = visitorClicks.length + 1;

    // Add click
    this.clicks.push(clickData);
    this.totalClicks += 1;
    this.lastClickedAt = new Date();

    // Update unique visitors count
    if (clickData.isNewVisitor) {
      this.uniqueVisitors = (this.uniqueVisitors || 0) + 1;
    } else if (clickData.isReturningVisitor) {
      this.returningVisitors = (this.returningVisitors || 0) + 1;
    }

    // Track A/B test variant clicks
    if (this.abTest?.enabled &&
      clickData.abVariantIndex !== undefined &&
      this.abTest.variants[clickData.abVariantIndex]) {
      this.abTest.variants[clickData.abVariantIndex].clicks += 1;

      // Update conversion rate
      const variant = this.abTest.variants[clickData.abVariantIndex];
      if (variant.clicks > 0) {
        variant.conversionRate = parseFloat(
          ((variant.conversions || 0) / variant.clicks * 100).toFixed(2)
        );
      }
    }

    // Auto-optimize if enabled
    if (this.abTest?.autoOptimize?.enabled &&
      this.totalClicks % 100 === 0 &&
      this.totalClicks >= this.abTest.autoOptimize.minSampleSize) {
      await this.optimizeABTest();
    }

    return await this.save();
  } catch (error) {
    console.error('❌ Track click error:', error);
    throw error;
  }
};

// ==========================================
// ✅ NEW: Track Conversion
// ==========================================
linkSchema.methods.trackConversion = async function (visitorId, variantIndex, value = null) {
  try {
    // Find the click
    const clickIndex = this.clicks.findIndex(c =>
      c.visitorId === visitorId &&
      c.abVariantIndex === variantIndex
    );

    if (clickIndex === -1) {
      throw new Error('Click not found for this visitor and variant');
    }

    // Update click
    this.clicks[clickIndex].converted = true;
    this.clicks[clickIndex].conversionTime = new Date();
    if (value) {
      this.clicks[clickIndex].conversionValue = value;
    }

    // Update variant
    if (this.abTest?.enabled && this.abTest.variants[variantIndex]) {
      this.abTest.variants[variantIndex].conversions =
        (this.abTest.variants[variantIndex].conversions || 0) + 1;

      // Update conversion rate
      const variant = this.abTest.variants[variantIndex];
      if (variant.clicks > 0) {
        variant.conversionRate = parseFloat(
          ((variant.conversions || 0) / variant.clicks * 100).toFixed(2)
        );
      }
    }

    await this.save();

    return {
      success: true,
      variantIndex,
      conversionRate: this.abTest.variants[variantIndex].conversionRate
    };
  } catch (error) {
    console.error('❌ Track conversion error:', error);
    throw error;
  }
};

// ==========================================
// ✅ NEW: Auto-optimize A/B Test
// ==========================================
linkSchema.methods.optimizeABTest = async function () {
  if (!this.abTest?.enabled || this.abTest.variants.length < 2) {
    return null;
  }

  const variants = this.abTest.variants.map((v, index) => {
    const clicks = v.clicks || 0;
    const conversions = v.conversions || 0;
    const conversionRate = clicks > 0 ? conversions / clicks : 0;

    return {
      index,
      clicks,
      conversions,
      conversionRate,
      score: conversionRate * Math.sqrt(clicks) // Weighted by sample size
    };
  });

  // Sort by score
  variants.sort((a, b) => b.score - a.score);

  // Check if we have statistical significance
  const winner = variants[0];
  const runnerUp = variants[1];

  if (winner.clicks >= 100 && runnerUp.clicks >= 100) {
    const zScore = this.calculateZScore(winner, runnerUp);
    const pValue = this.calculatePValue(zScore);

    if (pValue < 0.05) { // 95% confidence
      this.abTest.winner = {
        variantIndex: winner.index,
        confidence: (1 - pValue) * 100
      };

      // Adjust weights to favor winner
      this.abTest.variants = this.abTest.variants.map((v, i) => {
        if (i === winner.index) {
          v.weight = 70;
        } else {
          v.weight = Math.floor(30 / (this.abTest.variants.length - 1));
        }
        return v;
      });
    }
  }

  return {
    optimized: true,
    leader: winner,
    newWeights: this.abTest.variants.map(v => v.weight)
  };
};

// ==========================================
// ✅ Statistical Significance Helpers
// ==========================================
linkSchema.methods.calculateZScore = function (a, b) {
  const p1 = a.conversionRate;
  const p2 = b.conversionRate;
  const n1 = a.clicks;
  const n2 = b.clicks;

  const pooledP = (a.conversions + b.conversions) / (n1 + n2);
  const se = Math.sqrt(pooledP * (1 - pooledP) * (1 / n1 + 1 / n2));

  return se > 0 ? (p1 - p2) / se : 0;
};

linkSchema.methods.calculatePValue = function (zScore) {
  // Approximation of normal CDF
  const z = Math.abs(zScore);
  const t = 1 / (1 + 0.2316419 * z);
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

  return 2 * prob; // Two-tailed test
};

// ==========================================
// ✅ NEW: Archive Old Clicks
// ==========================================
linkSchema.methods.archiveOldClicks = async function () {
  if (this.clicks.length <= 5000) return;

  try {
    const ClickArchive = require('./ClickArchive');
    const toArchive = this.clicks.slice(0, this.clicks.length - 5000);

    await ClickArchive.create({
      linkId: this._id,
      clicks: toArchive,
      archivedAt: new Date()
    });

    console.log(`✅ Archived ${toArchive.length} clicks for link ${this.shortCode}`);
  } catch (error) {
    console.error('❌ Archive clicks error:', error);
    // Don't throw - archiving is not critical
  }
};

// ==========================================
// ✅ Enhanced: Custom Domain Verification
// ==========================================
linkSchema.methods.generateDomainVerificationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');

  if (!this.domainVerification) {
    this.domainVerification = {};
  }

  this.domainVerification.verificationToken = token;
  this.domainVerification.isVerified = false;

  return token;
};

linkSchema.methods.verifyDomain = async function (method = 'DNS') {
  const dns = require('dns').promises;
  const domain = this.customDomain;

  if (!domain || !this.domainVerification?.verificationToken) {
    throw new Error('Domain or verification token not set');
  }

  try {
    if (method === 'DNS') {
      // Check for TXT record
      const txtRecords = await dns.resolveTxt(`_verification.${domain}`);
      const found = txtRecords.some(record =>
        record[0].includes(this.domainVerification.verificationToken)
      );

      if (!found) {
        throw new Error('Verification token not found in DNS records');
      }
    }

    // Mark as verified
    this.domainVerification.isVerified = true;
    this.domainVerification.verifiedAt = new Date();
    this.domainVerification.verificationMethod = method;

    await this.save();

    return { verified: true, method, verifiedAt: this.domainVerification.verifiedAt };
  } catch (error) {
    console.error('Domain verification failed:', error);
    throw error;
  }
};

// ==========================================
// Virtual Properties - FIXED
// ==========================================
linkSchema.virtual('clickRate').get(function () {
  const daysSinceCreation = Math.max(1,
    (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)
  );
  return parseFloat((this.totalClicks / daysSinceCreation).toFixed(2));
});

linkSchema.virtual('fullUrl').get(function () {
  if (this.customDomain && this.domainVerification?.isVerified) {
    return `https://${this.customDomain}/${this.shortCode}`;
  }
  return `${process.env.BASE_URL || 'http://localhost:5000'}/${this.shortCode}`;
});

// ✅ CRITICAL FIX: Safe access to clicks array
linkSchema.virtual('conversionRate').get(function () {
  if (!this.abTest?.enabled) return 0;

  // ✅ Safe check for clicks array
  if (!this.clicks || !Array.isArray(this.clicks)) return 0;

  const totalConversions = this.clicks.filter(c => c && c.converted).length;
  return this.totalClicks > 0
    ? parseFloat((totalConversions / this.totalClicks * 100).toFixed(2))
    : 0;
});

// ==========================================
// Enhanced Analytics Method - FIXED
// ==========================================
linkSchema.methods.getAnalytics = function (days = null) {
  // ✅ Safe access to clicks
  let clicks = this.clicks || [];

  if (days) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    clicks = clicks.filter(click => click && click.timestamp >= cutoffDate);
  }

  const uniqueVisitorIds = new Set(clicks.map(c => c.visitorId).filter(Boolean));
  const mobileCount = clicks.filter(c => c && c.isMobile).length;
  const botCount = clicks.filter(c => c && c.isBot).length;
  const conversions = clicks.filter(c => c && c.converted).length;

  return {
    totalClicks: this.totalClicks || 0,
    clicksInRange: clicks.length,
    lastClick: this.lastClickedAt || null,
    averagePerDay: this.clickRate || 0,

    // Visitor metrics
    uniqueVisitors: this.uniqueVisitors || 0,
    uniqueVisitorsInRange: uniqueVisitorIds.size,
    returningVisitors: clicks.filter(c => c && c.isReturningVisitor).length,
    newVisitors: clicks.filter(c => c && c.isNewVisitor).length,

    // Conversion metrics
    conversions,
    conversionRate: clicks.length > 0
      ? parseFloat((conversions / clicks.length * 100).toFixed(2))
      : 0,
    averageConversionValue: conversions > 0
      ? clicks.filter(c => c && c.converted && c.conversionValue)
        .reduce((sum, c) => sum + c.conversionValue, 0) / conversions
      : 0,

    // Geographic
    uniqueCountries: [...new Set(clicks.map(c => c && c.country).filter(Boolean))].length,
    uniqueCities: [...new Set(clicks.map(c => c && c.city).filter(Boolean))].length,

    // Device breakdown
    devices: {
      mobile: clicks.filter(c => c && c.device === 'Mobile').length,
      desktop: clicks.filter(c => c && c.device === 'Desktop').length,
      tablet: clicks.filter(c => c && c.device === 'Tablet').length,
      unknown: clicks.filter(c => c && c.device === 'Unknown').length
    },

    // Percentages
    mobilePercentage: clicks.length > 0 ?
      parseFloat((mobileCount / clicks.length * 100).toFixed(2)) : 0,
    botPercentage: clicks.length > 0 ?
      parseFloat((botCount / clicks.length * 100).toFixed(2)) : 0,

    // A/B Test Results
    abTestResults: this.abTest?.enabled ? {
      status: this.abTest.status || 'running',
      variants: (this.abTest.variants || []).map((v, i) => ({
        name: v.name || `Variant ${String.fromCharCode(65 + i)}`,
        clicks: v.clicks || 0,
        conversions: v.conversions || 0,
        conversionRate: v.conversionRate || 0,
        percentage: this.totalClicks > 0 ?
          parseFloat(((v.clicks || 0) / this.totalClicks * 100).toFixed(2)) : 0
      })),
      winner: this.abTest.winner || null
    } : null
  };
};
// ==========================================
// Pre-save Middleware
// ==========================================
linkSchema.pre('save', async function (next) {
  try {
    if (this.isModified()) {
      this.updatedAt = new Date();
    }

    const reserved = ['api', 'admin', 'dashboard', 'login', 'signup', 'auth', 'analytics'];
    if (this.isNew && reserved.includes(this.shortCode)) {
      return next(new Error('This alias is reserved'));
    }

    // ✅ Hash password if modified
    if (this.isModified('password') && this.password) {
      const bcrypt = require('bcryptjs');

      if (!this.password.startsWith('$2')) {
        console.log('🔐 Hashing password for link:', this.shortCode);
        this.password = await bcrypt.hash(this.password, 10);
      }
    }

    next();
  } catch (error) {
    console.error('❌ Password hashing error:', error);
    next(error);
  }
});

// ==========================================
// Static Methods
// ==========================================
linkSchema.statics.getMostClicked = async function (userId, limit = 10) {
  return await this.find({
    userId,
    isActive: true
  })
    .sort({ totalClicks: -1 })
    .limit(limit)
    .select('shortCode originalUrl title totalClicks lastClickedAt customDomain');
};

linkSchema.statics.findByDomainAndCode = async function (domain, shortCode) {
  return await this.findOne({
    customDomain: domain,
    shortCode: shortCode,
    isActive: true,
    'domainVerification.isVerified': true
  });
};

module.exports = mongoose.model('Link', linkSchema);