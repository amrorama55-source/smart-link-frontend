const express = require('express');
const router = express.Router();
const Link = require('../models/Link');
const User = require('../models/User');

router.get('/setup-demo', async (req, res) => {
  try {
    const email = 'smartlinkpro10@gmail.com';
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const shortCode = 'demo-gold-' + Math.random().toString(36).substring(7);
    
    // Create Mock Clicks
    const clicks = [];
    const now = new Date();

    // 220 Human Clicks
    for (let i = 0; i < 220; i++) {
      clicks.push({
        timestamp: new Date(now - Math.random() * 5 * 24 * 60 * 60 * 1000),
        visitorId: 'h-' + i,
        isBot: false,
        device: i % 3 === 0 ? 'Mobile' : 'Desktop',
        country: i % 4 === 0 ? 'SA' : (i % 4 === 1 ? 'AE' : (i % 4 === 2 ? 'EG' : 'US')),
        browser: 'Chrome',
        os: i % 3 === 0 ? 'iOS' : 'Windows'
      });
    }

    // 80 Bot Clicks (30% loss)
    for (let i = 0; i < 80; i++) {
      clicks.push({
        timestamp: new Date(now - Math.random() * 5 * 24 * 60 * 60 * 1000),
        visitorId: 'b-' + i,
        isBot: true,
        device: 'Desktop',
        country: 'Unknown',
        browser: 'Headless'
      });
    }

    const demoLink = new Link({
      userId: user._id,
      shortCode: shortCode,
      originalUrl: 'https://smart-link.website',
      title: '💎 Premium Ad Campaign (Demo)',
      description: 'AI-Optimized link for video demo',
      isActive: true,
      totalClicks: 300,
      clicks: clicks,
      abTest: {
        enabled: true,
        splitMethod: 'optimized',
        variants: [
          { name: 'Video Ad A', url: 'https://smart-link.website/v1', weight: 30, clicks: 140, conversions: 8, conversionRate: 5.7 },
          { name: 'Video Ad B (Winner)', url: 'https://smart-link.website/v2', weight: 70, clicks: 160, conversions: 24, conversionRate: 15.0 }
        ],
        autoOptimize: { enabled: true, minSampleSize: 100 },
        status: 'completed',
        winner: { variantIndex: 1, confidence: 99.8 }
      },
      autoShield: {
        enabled: true,
        protectPixels: true,
        blockScrapers: true
      },
      languageRules: [
        { language: 'ar', targetUrl: 'https://smart-link.website/ar' },
        { language: 'en', targetUrl: 'https://smart-link.website/en' }
      ]
    });

    await demoLink.save();
    
    res.json({
      success: true,
      message: 'Demo data created successfully',
      shortCode: shortCode,
      analyticsUrl: `/analytics/${shortCode}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
