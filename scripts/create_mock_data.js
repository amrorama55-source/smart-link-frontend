const mongoose = require('mongoose');
const User = require('../backend/models/User');
const Link = require('../backend/models/Link');
require('dotenv').config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: 'smartlinkpro10@gmail.com' });
    if (!user) {
      console.error('User not found: smartlinkpro10@gmail.com');
      process.exit(1);
    }

    console.log('Found user:', user._id);

    // 1. Create a "Golden Link" with all features enabled
    const shortCode = 'gold-' + Math.random().toString(36).substring(7);
    const link = new Link({
      userId: user._id,
      shortCode: shortCode,
      originalUrl: 'https://example.com/main',
      title: '💎 Smart Profit Campaign (Mock)',
      description: 'Testing Auto-Shield and Revenue Recovery',
      isActive: true,

      // A/B Test with Auto-Optimization
      abTest: {
        enabled: true,
        splitMethod: 'optimized',
        variants: [
          { name: 'Red Landing Page', url: 'https://example.com/red', weight: 40, clicks: 120, conversions: 5, conversionRate: 4.17 },
          { name: 'Blue Landing Page (Winner)', url: 'https://example.com/blue', weight: 60, clicks: 150, conversions: 18, conversionRate: 12.00 }
        ],
        autoOptimize: { enabled: true, minSampleSize: 100 },
        status: 'running'
      },

      // Auto-Shield
      autoShield: {
        enabled: true,
        protectPixels: true,
        blockScrapers: true,
        redirectBotTo: 'https://google.com'
      },

      // Language Rules
      languageRules: [
        { language: 'ar', targetUrl: 'https://example.com/arabic-version' },
        { language: 'en', targetUrl: 'https://example.com/english-version' }
      ],

      totalClicks: 270
    });

    // 2. Add Mock Clicks (Human vs Bot)
    const clicks = [];
    const now = new Date();

    // Add 200 Human Clicks
    for (let i = 0; i < 200; i++) {
      clicks.push({
        timestamp: new Date(now - Math.random() * 7 * 24 * 60 * 60 * 1000),
        visitorId: 'human-' + i,
        isBot: false,
        device: i % 2 === 0 ? 'Mobile' : 'Desktop',
        country: i % 3 === 0 ? 'SA' : (i % 3 === 1 ? 'AE' : 'US'),
        browser: 'Chrome',
        os: 'iOS'
      });
    }

    // Add 70 Bot Clicks (Wasted Budget)
    for (let i = 0; i < 70; i++) {
      clicks.push({
        timestamp: new Date(now - Math.random() * 7 * 24 * 60 * 60 * 1000),
        visitorId: 'bot-' + i,
        isBot: true,
        device: 'Desktop',
        country: 'Unknown',
        browser: 'HeadlessChrome',
        userAgent: 'Googlebot/2.1'
      });
    }

    link.clicks = clicks;
    await link.save();

    console.log('\n✅ Mock Golden Link Created!');
    console.log('Short Code:', shortCode);
    console.log('Preview URL:', `${process.env.BASE_URL}/${shortCode}`);
    console.log('Analytics URL:', `${process.env.FRONTEND_URL}/analytics/${shortCode}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();
