// models/ClickArchive.js - للحفاظ على البيانات القديمة
const mongoose = require('mongoose');

// استيراد Click Schema من Link Model
const clickSchema = new mongoose.Schema({
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  visitorId: { 
    type: String, 
    required: true,
    index: true
  },
  sessionId: String,
  ip: { type: String, index: true },
  userAgent: String,
  referer: String,
  device: { 
    type: String, 
    enum: ['Mobile', 'Tablet', 'Desktop', 'Unknown'],
    default: 'Unknown'
  },
  browser: String,
  os: String,
  country: { 
    type: String, 
    default: 'Unknown',
    index: true
  },
  city: String,
  region: String,
  language: String,
  timezone: String,
  screenResolution: String,
  isMobile: Boolean,
  isBot: { type: Boolean, default: false },
  abVariant: String,
  abVariantIndex: Number,
  converted: { type: Boolean, default: false },
  conversionValue: Number,
  conversionTime: Date,
  isNewVisitor: Boolean,
  isReturningVisitor: Boolean,
  visitNumber: Number
}, { 
  _id: false,
  timestamps: false
});

// Click Archive Schema
const clickArchiveSchema = new mongoose.Schema({
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link',
    required: true,
    index: true
  },
  
  // Metadata about the link (for reference)
  linkShortCode: {
    type: String,
    required: true,
    index: true
  },
  
  linkTitle: String,
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Archived clicks
  clicks: {
    type: [clickSchema],
    default: [],
    required: true
  },
  
  // Archive metadata
  archivedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  clicksCount: {
    type: Number,
    required: true
  },
  
  // Date range of archived clicks
  dateRange: {
    from: {
      type: Date,
      required: true
    },
    to: {
      type: Date,
      required: true
    }
  },
  
  // Summary statistics (for quick querying without loading all clicks)
  summary: {
    totalClicks: Number,
    uniqueVisitors: Number,
    conversions: Number,
    conversionRate: Number,
    
    // Device breakdown
    devices: {
      mobile: Number,
      desktop: Number,
      tablet: Number,
      unknown: Number
    },
    
    // Top countries
    topCountries: [{
      country: String,
      count: Number
    }],
    
    // A/B test data
    abTestData: {
      enabled: Boolean,
      variants: [{
        index: Number,
        name: String,
        clicks: Number,
        conversions: Number
      }]
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
clickArchiveSchema.index({ userId: 1, archivedAt: -1 });
clickArchiveSchema.index({ linkId: 1, archivedAt: -1 });
clickArchiveSchema.index({ 'dateRange.from': 1, 'dateRange.to': 1 });
clickArchiveSchema.index({ 'clicks.timestamp': 1 });

// Auto-expire archives after 2 years
clickArchiveSchema.index(
  { archivedAt: 1 }, 
  { expireAfterSeconds: 63072000 } // 2 years
);

// ==========================================
// Methods
// ==========================================

// Get analytics from archived clicks
clickArchiveSchema.methods.getAnalytics = function() {
  const clicks = this.clicks;
  
  return {
    totalClicks: clicks.length,
    dateRange: {
      from: this.dateRange.from,
      to: this.dateRange.to
    },
    
    // Visitor metrics
    uniqueVisitors: new Set(clicks.map(c => c.visitorId)).size,
    returningVisitors: clicks.filter(c => c.isReturningVisitor).length,
    newVisitors: clicks.filter(c => c.isNewVisitor).length,
    
    // Conversion metrics
    conversions: clicks.filter(c => c.converted).length,
    conversionRate: clicks.length > 0 
      ? parseFloat((clicks.filter(c => c.converted).length / clicks.length * 100).toFixed(2))
      : 0,
    totalRevenue: clicks
      .filter(c => c.converted && c.conversionValue)
      .reduce((sum, c) => sum + c.conversionValue, 0),
    
    // Device breakdown
    devices: {
      mobile: clicks.filter(c => c.device === 'Mobile').length,
      desktop: clicks.filter(c => c.device === 'Desktop').length,
      tablet: clicks.filter(c => c.device === 'Tablet').length,
      unknown: clicks.filter(c => c.device === 'Unknown').length
    },
    
    // Top countries
    topCountries: this.getTopCountries(10),
    
    // Bot traffic
    botClicks: clicks.filter(c => c.isBot).length,
    botPercentage: clicks.length > 0
      ? parseFloat((clicks.filter(c => c.isBot).length / clicks.length * 100).toFixed(2))
      : 0,
    
    // A/B test data
    abTestData: this.summary?.abTestData || null
  };
};

// Get top countries from archived clicks
clickArchiveSchema.methods.getTopCountries = function(limit = 10) {
  const countryCounts = {};
  
  this.clicks.forEach(click => {
    const country = click.country || 'Unknown';
    countryCounts[country] = (countryCounts[country] || 0) + 1;
  });
  
  return Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([country, count]) => ({
      country,
      clicks: count,
      percentage: parseFloat((count / this.clicks.length * 100).toFixed(2))
    }));
};

// ==========================================
// Static Methods
// ==========================================

// Get all archives for a link
clickArchiveSchema.statics.getForLink = async function(linkId, options = {}) {
  const { limit = 10, skip = 0 } = options;
  
  return await this.find({ linkId })
    .sort({ archivedAt: -1 })
    .limit(limit)
    .skip(skip)
    .select('-clicks'); // Don't include individual clicks by default
};

// Get combined analytics (current + archived)
clickArchiveSchema.statics.getCombinedAnalytics = async function(linkId) {
  const Link = require('./Link');
  const link = await Link.findById(linkId);
  
  if (!link) {
    throw new Error('Link not found');
  }
  
  // Get current analytics
  const currentAnalytics = link.getAnalytics();
  
  // Get archived analytics
  const archives = await this.find({ linkId });
  
  const archivedAnalytics = archives.map(archive => archive.getAnalytics());
  
  // Combine
  const combined = {
    current: currentAnalytics,
    archived: archivedAnalytics,
    total: {
      clicks: currentAnalytics.totalClicks + 
        archivedAnalytics.reduce((sum, a) => sum + a.totalClicks, 0),
      uniqueVisitors: currentAnalytics.uniqueVisitors + 
        archivedAnalytics.reduce((sum, a) => sum + a.uniqueVisitors, 0),
      conversions: currentAnalytics.conversions + 
        archivedAnalytics.reduce((sum, a) => sum + a.conversions, 0)
    }
  };
  
  return combined;
};

// Create archive from link clicks
clickArchiveSchema.statics.createFromLink = async function(link, clicksToArchive) {
  if (!clicksToArchive || clicksToArchive.length === 0) {
    throw new Error('No clicks to archive');
  }
  
  // Calculate summary statistics
  const uniqueVisitors = new Set(clicksToArchive.map(c => c.visitorId)).size;
  const conversions = clicksToArchive.filter(c => c.converted).length;
  
  const deviceCounts = {
    mobile: clicksToArchive.filter(c => c.device === 'Mobile').length,
    desktop: clicksToArchive.filter(c => c.device === 'Desktop').length,
    tablet: clicksToArchive.filter(c => c.device === 'Tablet').length,
    unknown: clicksToArchive.filter(c => c.device === 'Unknown').length
  };
  
  const countryCounts = {};
  clicksToArchive.forEach(click => {
    const country = click.country || 'Unknown';
    countryCounts[country] = (countryCounts[country] || 0) + 1;
  });
  
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([country, count]) => ({ country, count }));
  
  // A/B test summary
  let abTestData = { enabled: false };
  if (link.abTest?.enabled) {
    abTestData = {
      enabled: true,
      variants: link.abTest.variants.map((v, i) => ({
        index: i,
        name: v.name,
        clicks: clicksToArchive.filter(c => c.abVariantIndex === i).length,
        conversions: clicksToArchive.filter(c => c.abVariantIndex === i && c.converted).length
      }))
    };
  }
  
  // Get date range
  const timestamps = clicksToArchive.map(c => new Date(c.timestamp));
  const dateRange = {
    from: new Date(Math.min(...timestamps)),
    to: new Date(Math.max(...timestamps))
  };
  
  // Create archive
  const archive = new this({
    linkId: link._id,
    linkShortCode: link.shortCode,
    linkTitle: link.title,
    userId: link.userId,
    clicks: clicksToArchive,
    clicksCount: clicksToArchive.length,
    dateRange,
    summary: {
      totalClicks: clicksToArchive.length,
      uniqueVisitors,
      conversions,
      conversionRate: clicksToArchive.length > 0
        ? parseFloat((conversions / clicksToArchive.length * 100).toFixed(2))
        : 0,
      devices: deviceCounts,
      topCountries,
      abTestData
    }
  });
  
  await archive.save();
  
  console.log(`✅ Created archive for ${link.shortCode}: ${clicksToArchive.length} clicks`);
  
  return archive;
};

// ==========================================
// Pre-save Middleware
// ==========================================
clickArchiveSchema.pre('save', function(next) {
  // Ensure clicksCount matches
  if (this.clicks && this.clicks.length !== this.clicksCount) {
    this.clicksCount = this.clicks.length;
  }
  next();
});

module.exports = mongoose.model('ClickArchive', clickArchiveSchema);