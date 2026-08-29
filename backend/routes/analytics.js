// routes/analytics.js - Smart Link Analytics Engine
const express = require('express');
const router = express.Router();
const Link = require('../models/Link');
const { verifyToken, verifyApiKey } = require('../middleware/verifyToken');
const authenticate = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  if (apiKey) return verifyApiKey(req, res, next);
  return verifyToken(req, res, next);
};
router.get('/dashboard/stats', authenticate, async (req, res) => {
  try {
    const links = await Link.find({ userId: (req.user.workspaceId || req.user._id) });

    const now = new Date();
    const isBusiness = req.user.plan === 'business' || req.user.role === 'admin';
    const hasFullAnalytics = isBusiness || req.user.plan === 'pro';

    // 🛡️ ENFORCEMENT: Only Pro/Business/ActiveTrial see more than 24h
    const analyticsLimit = hasFullAnalytics
      ? new Date(0) // All time
      : new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24h for Free or Expired Trial

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Ensure date limits don't exceed analyticsLimit for free users
    const effectiveWeekAgo = new Date(Math.max(weekAgo, analyticsLimit));
    const effectiveMonthAgo = new Date(Math.max(monthAgo, analyticsLimit));

    let allClicks = [];
    const hourlyDistribution = new Array(24).fill(0);
    const dailyDistribution = {};

    const stats = {
      totalLinks: links.length,
      activeLinks: links.filter(l => l.isActive).length,
      totalClicks: 0,
      clicksToday: 0,
      clicksThisWeek: 0,
      clicksThisMonth: 0,
      topLinks: [],
      topCountries: {},
      topCities: {}, // إضافة المدن
      deviceBreakdown: { Mobile: 0, Desktop: 0, Tablet: 0, Unknown: 0 },
      totalUniqueVisitors: 0,
      averageClicksPerLink: 0,
      mostActiveHour: null,
      peakDay: null,
      botTrafficPercentage: 0,
      clickTrend: 'stable',
      // A/B Testing Stats (Pro Feature)
      totalABTests: links.filter(l => l.abTest?.enabled).length,
      activeABTests: links.filter(l => l.abTest?.enabled && l.isActive).length
    };

    links.forEach(link => {
      link.clicks.forEach(click => {
        const timestamp = new Date(click.timestamp);

        // 🛡️ ENFORCEMENT: Filter out data older than the plan limit
        if (timestamp < analyticsLimit) return;

        allClicks.push({ ...click.toObject ? click.toObject() : click, timestamp });

        stats.totalClicks++;

        if (timestamp >= today) stats.clicksToday++;
        if (timestamp >= effectiveWeekAgo) stats.clicksThisWeek++;
        if (timestamp >= effectiveMonthAgo) stats.clicksThisMonth++;

        const country = click.country || 'Unknown';
        stats.topCountries[country] = (stats.topCountries[country] || 0) + 1;

        // 🛡️ ENFORCEMENT: City data Business Elite Only
        if (isBusiness) {
          const city = click.city || 'Unknown';
          stats.topCities[city] = (stats.topCities[city] || 0) + 1;
        }

        const device = click.device || 'Unknown';
        if (stats.deviceBreakdown[device] !== undefined) {
          stats.deviceBreakdown[device]++;
        } else {
          stats.deviceBreakdown.Unknown++;
        }

        const hour = timestamp.getHours();
        hourlyDistribution[hour]++;

        const day = timestamp.toISOString().split('T')[0];
        dailyDistribution[day] = (dailyDistribution[day] || 0) + 1;
      });
    });

    stats.totalUniqueVisitors = new Set(allClicks.map(c => c.visitorId || c.ip)).size;
    stats.averageClicksPerLink = stats.totalLinks > 0
      ? parseFloat((stats.totalClicks / stats.totalLinks).toFixed(2))
      : 0;

    const maxHourClicks = Math.max(...hourlyDistribution);
    stats.mostActiveHour = maxHourClicks > 0 ? hourlyDistribution.indexOf(maxHourClicks) : null;

    const sortedDays = Object.entries(dailyDistribution)
      .sort(([, a], [, b]) => b - a);
    stats.peakDay = sortedDays.length > 0
      ? { date: sortedDays[0][0], clicks: sortedDays[0][1] }
      : null;

    const botClicks = allClicks.filter(c => c.isBot).length;
    stats.botTrafficPercentage = allClicks.length > 0
      ? parseFloat((botClicks / allClicks.length * 100).toFixed(2))
      : 0;

    const mobileClicks = allClicks.filter(c => c.device === 'Mobile').length;
    stats.mobilePercentage = allClicks.length > 0
      ? parseFloat((mobileClicks / allClicks.length * 100).toFixed(1))
      : 0;

    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const lastWeekClicks = allClicks.filter(c =>
      c.timestamp >= effectiveWeekAgo && c.timestamp < weekAgo
    ).length;

    if (stats.clicksThisWeek > lastWeekClicks * 1.1) {
      stats.clickTrend = 'up';
    } else if (stats.clicksThisWeek < lastWeekClicks * 0.9) {
      stats.clickTrend = 'down';
    }

    stats.topLinks = links
      .map(l => {
        // 🛡️ ENFORCEMENT: Recalculate totalClicks based on plan limit
        const filteredClickCount = !hasFullAnalytics
          ? l.clicks.filter(c => new Date(c.timestamp) >= analyticsLimit).length
          : l.totalClicks;

        return {
          shortCode: l.shortCode,
          title: l.title || 'Untitled',
          totalClicks: filteredClickCount,
          clickRate: l.clickRate,
          lastClickedAt: l.lastClickedAt,
          hasABTest: l.abTest?.enabled || false
        };
      })
      .sort((a, b) => b.totalClicks - a.totalClicks)
      .slice(0, 5);

    stats.topCountries = Object.entries(stats.topCountries)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([country, count]) => ({
        country,
        count,
        percentage: parseFloat((count / stats.totalClicks * 100).toFixed(1))
      }));

    // إضافة Top Cities للـ Response (Business Only)
    // Top Cities (Business Elite Only)
    stats.topCities = isBusiness ? Object.entries(stats.topCities)
      .filter(([city]) => city !== 'Unknown')
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([city, count]) => ({
        city,
        name: city, // Required for component compatibility
        count,
        percentage: stats.totalClicks > 0 ? parseFloat((count / stats.totalClicks * 100).toFixed(1)) : 0
      })) : [];

    // Profit Intelligence Insights
    const profitInsights = calculateProfitInsights(allClicks, links);

    // Track Activation Progress: View Analytics
    if (req.userDoc && !req.userDoc.activationChecklist?.viewAnalytics?.completed) {
      if (!req.userDoc.activationChecklist) req.userDoc.activationChecklist = {};
      req.userDoc.activationChecklist.viewAnalytics = {
        completed: true,
        completedAt: new Date()
      };
      await req.userDoc.save();
    }

    res.json({
      success: true,
      stats: {
        ...stats,
        profitInsights,
        smartInsights: generateSmartInsights(allClicks)
      },
      activationChecklist: req.userDoc?.activationChecklist || {}
    });

  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics'
    });
  }
});

// Get Comprehensive Analytics - A/B Testing Pro Feature
router.get('/:shortCode', authenticate, async (req, res) => {
  try {
    const { days } = req.query;

    const link = await Link.findOne({
      shortCode: req.params.shortCode,
      userId: (req.user.workspaceId || req.user._id)
    });

    if (!link) {
      return res.status(404).json({
        success: false,
        error: 'Link not found'
      });
    }

    console.log('📊 Fetching analytics for:', link.shortCode);
    console.log('📊 A/B Test enabled?', link.abTest?.enabled);

    // Date filtering & Plan Enforcement
    let dateLimit = null;
    const isBusiness = req.user.plan === 'business' || req.user.role === 'admin';
    const hasFullAnalytics = isBusiness || req.user.plan === 'pro';

    if (!hasFullAnalytics) {
      console.log('🛡️ Restricting analytics to last 24 hours');
      dateLimit = new Date();
      dateLimit.setHours(dateLimit.getHours() - 24);
    } else if (days && !isNaN(parseInt(days))) {
      dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - parseInt(days));
    }

    const relevantClicks = dateLimit
      ? link.clicks.filter(c => new Date(c.timestamp) >= dateLimit)
      : link.clicks;

    console.log('📊 Total clicks:', link.clicks.length);
    console.log('📊 Relevant clicks:', relevantClicks.length);

    // طباعة عينة من الـ clicks لفحص المدن
    if (relevantClicks.length > 0) {
      console.log('📊 Sample click data:', {
        city: relevantClicks[0].city,
        country: relevantClicks[0].country,
        ip: relevantClicks[0].ip
      });
    }

    const analytics = calculateAnalytics(link, relevantClicks, isBusiness);

    // A/B Test Analytics - PRO Feature
    let abTestAnalytics = { enabled: false };

    if (link.abTest?.enabled && link.abTest.variants && link.abTest.variants.length > 0) {
      console.log('🧪 Processing A/B Test data (PRO feature)...');
      console.log('🧪 Variants count:', link.abTest.variants.length);

      const totalABClicks = relevantClicks.filter(c =>
        c.abVariantIndex !== undefined && c.abVariantIndex !== null
      ).length;

      console.log('🧪 Total A/B clicks:', totalABClicks);

      abTestAnalytics = {
        enabled: true,
        splitMethod: link.abTest.splitMethod || 'weighted',
        totalTestClicks: totalABClicks,
        variants: link.abTest.variants.map((variant, index) => {
          const variantClicks = relevantClicks.filter(c => c.abVariantIndex === index).length;

          console.log(`🧪 Variant ${index} (${variant.name}): ${variantClicks} clicks`);

          return {
            index,
            name: variant.name || `Variant ${String.fromCharCode(65 + index)}`,
            url: variant.url,
            weight: variant.weight || 50,
            totalClicks: variant.clicks || 0,
            clicksInRange: variantClicks,
            percentage: totalABClicks > 0
              ? parseFloat((variantClicks / totalABClicks * 100).toFixed(1))
              : 0,
            conversionRate: link.totalClicks > 0
              ? parseFloat((variantClicks / link.totalClicks * 100).toFixed(1))
              : 0
          };
        })
      };

      // Determine winner
      const sortedVariants = [...abTestAnalytics.variants]
        .sort((a, b) => b.clicksInRange - a.clicksInRange);

      if (sortedVariants[0] && sortedVariants[0].clicksInRange > 0) {
        abTestAnalytics.winner = {
          index: sortedVariants[0].index,
          name: sortedVariants[0].name,
          clicks: sortedVariants[0].clicksInRange
        };
        console.log('🏆 Winner:', abTestAnalytics.winner.name);
      }

    } else {
      console.log('ℹ️ No A/B Test enabled for this link');
    }

    res.json({
      success: true,
      analytics: {
        ...analytics,
        dateRange: days ? `Last ${days} days` : 'All time',
        abTest: abTestAnalytics, // Always available
        profitInsights: calculateProfitInsights(relevantClicks, [link]), // Per-link profit insights
        smartInsights: generateSmartInsights(relevantClicks), // NEW Insight Layer
        link: {
          shortCode: link.shortCode,
          originalUrl: link.originalUrl,
          title: link.title,
          description: link.description,
          createdAt: link.createdAt,
          isActive: link.isActive,
          expiresAt: link.expiresAt
        }
      }
    });

  } catch (error) {
    console.error('❌ Analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    });
  }
});
router.post('/compare', authenticate, async (req, res) => {
  try {
    const { shortCodes, days = 30 } = req.body;

    if (!shortCodes || !Array.isArray(shortCodes) || shortCodes.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'shortCodes array is required and must not be empty'
      });
    }

    if (shortCodes.length > 10) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 10 links can be compared at once'
      });
    }

    const links = await Link.find({
      shortCode: { $in: shortCodes },
      userId: (req.user.workspaceId || req.user._id)
    });

    if (links.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No links found'
      });
    }

    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - parseInt(days));

    const comparison = links.map(link => {
      const clicks = link.clicks.filter(c => new Date(c.timestamp) >= dateLimit);
      const uniqueIPs = new Set(clicks.map(c => c.ip));
      const countries = new Set(clicks.map(c => c.country));

      return {
        shortCode: link.shortCode,
        title: link.title || 'Untitled',
        originalUrl: link.originalUrl,
        totalClicks: link.totalClicks,
        clicksInRange: clicks.length,
        uniqueVisitors: uniqueIPs.size,
        countries: countries.size,
        clickRate: link.clickRate,
        hasABTest: link.abTest?.enabled || false, // Show A/B test status
        deviceBreakdown: {
          mobile: clicks.filter(c => c.device === 'Mobile').length,
          desktop: clicks.filter(c => c.device === 'Desktop').length,
          tablet: clicks.filter(c => c.device === 'Tablet').length
        },
        mobilePercentage: clicks.length > 0
          ? parseFloat((clicks.filter(c => c.isMobile).length / clicks.length * 100).toFixed(1))
          : 0
      };
    });

    res.json({
      success: true,
      comparison,
      dateRange: `Last ${days} days`,
      totalLinksCompared: comparison.length
    });

  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to compare links'
    });
  }
});
router.get('/:shortCode/export', authenticate, async (req, res) => {
  try {
    // Check plan eligibility (Business Elite or Trial only)
    if (req.user.plan !== 'business' && req.user.plan !== 'trial') {
      return res.status(403).json({
        success: false,
        error: 'Premium feature restricted',
        message: 'Analytical data export is a Business Elite feature. Start your trial to access it!'
      });
    }

    const { format = 'json' } = req.query;

    const link = await Link.findOne({
      shortCode: req.params.shortCode,
      userId: (req.user.workspaceId || req.user._id)
    });

    if (!link) {
      return res.status(404).json({
        success: false,
        error: 'Link not found'
      });
    }

    const analytics = calculateAnalytics(link, link.clicks);

    if (format === 'csv') {
      let csv = 'Date,Hour,Device,Browser,OS,Country,City,IP,Is Mobile,Is Bot,AB Variant\n';
      link.clicks.forEach(click => {
        const timestamp = new Date(click.timestamp);
        csv += `${timestamp.toISOString()},${timestamp.getHours()},${click.device},${click.browser},${click.os},${click.country},${click.city || 'N/A'},${click.ip},${click.isMobile},${click.isBot},${click.abVariantIndex !== undefined ? click.abVariantIndex : 'N/A'}\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${link.shortCode}-analytics.csv"`);
      return res.send(csv);
    }

    res.json({
      success: true,
      analytics,
      exportedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export analytics'
    });
  }
});

/**
 * Helper Function: Calculate Profit Intelligence (The Gold)
 * @param {Array} clicks - Array of click objects
 * @param {Array} links - Array of link documents
 * @returns {Object} - Profit metrics
 */
function calculateProfitInsights(clicks, links) {
  const estimatedCPC = 0.50; // Assume $0.50 average CPC
  const botClicks = clicks.filter(c => c.isBot || c.isDatacenter).length;
  const humanClicks = clicks.length - botClicks;

  // 1. Wasted Budget (Money lost to bots)
  const wastedBudget = parseFloat((botClicks * estimatedCPC).toFixed(2));

  // 2. Saved Budget (Money saved by filtering/blocking bots if enabled)
  // Here we assume detection = saving opportunity
  const savedBudget = wastedBudget;

  // 3. Conversion Optimization Lift (A/B Testing Gold)
  let totalPotentialLift = 0;
  links.forEach(link => {
    if (link.abTest?.enabled && link.abTest.variants?.length > 1) {
      const variants = link.abTest.variants;
      const best = [...variants].sort((a, b) => (b.conversionRate || 0) - (a.conversionRate || 0))[0];
      const avg = variants.reduce((sum, v) => sum + (v.conversionRate || 0), 0) / variants.length;
      
      if (best.conversionRate > avg) {
        // Potential lift is the difference between best and average
        totalPotentialLift += (best.conversionRate - avg);
      }
    }
  });

  // 4. Efficiency Score (Human vs Total)
  const efficiencyScore = clicks.length > 0 
    ? Math.round((humanClicks / clicks.length) * 100) 
    : 100;

  return {
    estimatedCPC,
    wastedBudget,
    savedBudget,
    efficiencyScore,
    potentialLift: parseFloat(totalPotentialLift.toFixed(2)),
    humanClicks,
    botClicks,
    currency: 'USD',
    insightMessage: wastedBudget > 0 
      ? `System detected $${wastedBudget} in ad fraud. Blocking these bots increases your ROI by ${100 - efficiencyScore}%.`
      : "Your traffic is 100% human. Excellent quality!"
  };
}

/**
 * Helper Function: Generate Actionable Smart Insights (Insight Layer)
 * @param {Array} clicks - Array of click objects
 * @returns {Array} - Array of insight objects
 */
function generateSmartInsights(clicks) {
  const insights = [];
  if (!clicks || clicks.length === 0) return insights;

  // 1. Bot Traffic Security Alert
  const botClicks = clicks.filter(c => c.isBot || c.isDatacenter).length;
  const botPercentage = (botClicks / clicks.length) * 100;
  
  if (botPercentage > 40) {
    insights.push({ type: 'danger', icon: '🚨', title: 'High Security Alert', message: `Over ${botPercentage.toFixed(0)}% of your traffic is from bots. Please check your traffic sources immediately.` });
  } else if (botPercentage > 15) {
    insights.push({ type: 'warning', icon: '⚠️', title: 'Security Warning', message: `About ${botPercentage.toFixed(0)}% of your traffic is from bots. Consider enabling bot filtering to reduce wasted budget.` });
  }

  // Filter out bots for performance metrics
  const humanClicks = clicks.filter(c => !c.isBot && !c.isDatacenter);
  if (humanClicks.length === 0) return insights;

  // Aggregate stats by Country and Device
  const countryStats = {};
  const deviceStats = { Mobile: { clicks: 0, conv: 0 }, Desktop: { clicks: 0, conv: 0 }, Tablet: { clicks: 0, conv: 0 } };
  let totalConversions = 0;

  humanClicks.forEach(c => {
    const country = c.country || 'Unknown';
    if (!countryStats[country]) countryStats[country] = { clicks: 0, conversions: 0 };
    countryStats[country].clicks++;
    
    const device = c.device || 'Unknown';
    if (deviceStats[device]) {
      deviceStats[device].clicks++;
    }

    if (c.converted) {
      countryStats[country].conversions++;
      if (deviceStats[device]) deviceStats[device].conv++;
      totalConversions++;
    }
  });

  // 2. Budget Bleed Alert (High traffic, 0 conversions)
  const bleedingCountries = Object.entries(countryStats)
    .filter(([name, stats]) => name !== 'Unknown' && stats.clicks > 50 && stats.conversions === 0)
    .sort((a, b) => b[1].clicks - a[1].clicks);

  if (bleedingCountries.length > 0) {
    const worstCountry = bleedingCountries[0][0];
    const lostClicks = bleedingCountries[0][1].clicks;
    insights.push({ type: 'warning', icon: '💸', title: 'Budget Bleed Detected', message: `Traffic from (${worstCountry}) generated ${lostClicks} clicks but 0 conversions. Consider pausing campaigns in this country to stop budget bleed.` });
  }

  // 3. Country Performance Comparison
  if (totalConversions > 0) {
    const validCountries = Object.entries(countryStats)
      .filter(([name, stats]) => name !== 'Unknown' && stats.clicks >= 10)
      .map(([name, stats]) => ({ name, clicks: stats.clicks, conversions: stats.conversions, rate: (stats.conversions / stats.clicks) * 100 }))
      .sort((a, b) => b.rate - a.rate);

    if (validCountries.length >= 2) {
      const best = validCountries[0];
      const second = validCountries[1];

      if (best.rate > 0 && second.rate > 0) {
        const multiplier = (best.rate / second.rate).toFixed(1);
        if (parseFloat(multiplier) >= 1.5) {
          insights.push({ type: 'success', icon: '💡', title: 'Smart Insight (Geo)', message: `Traffic from ${best.name} converts ${multiplier}x better than ${second.name}. We recommend focusing your ad budget there!` });
        }
      }
    }

    // 4. Device Insight
    const mobileRate = deviceStats.Mobile.clicks > 10 ? (deviceStats.Mobile.conv / deviceStats.Mobile.clicks) * 100 : 0;
    const desktopRate = deviceStats.Desktop.clicks > 10 ? (deviceStats.Desktop.conv / deviceStats.Desktop.clicks) * 100 : 0;

    if (mobileRate > desktopRate * 1.5 && desktopRate > 0) {
      insights.push({ type: 'info', icon: '📱', title: 'Device Insight', message: `Mobile users are converting significantly better than Desktop users. Consider running Mobile-only campaigns.` });
    } else if (desktopRate > mobileRate * 1.5 && mobileRate > 0) {
      insights.push({ type: 'info', icon: '💻', title: 'Device Insight', message: `Desktop users are converting significantly better than Mobile users.` });
    }
  } else {
    insights.push({ type: 'info', icon: '🌱', title: 'Waiting for Conversions', message: `Your link is getting clicks, but no conversions have been recorded yet. Make sure you've implemented the conversion tracking pixel.` });
  }

  return insights.slice(0, 4);
}

/**
 * Helper Function: Calculate Analytics
 * ✅ Now respects Business Elite restrictions for city-level data
 */
function calculateAnalytics(link, clicks, isBusiness = false) {
  const analytics = {
    totalClicks: clicks.length, // Force use of range-limited clicks
    clicksInRange: clicks.length,
    lastClickedAt: clicks.length > 0 ? clicks[0].timestamp : null,
    clicksByDate: {},
    clicksByHour: {},
    clicksByDayOfWeek: {},
    clicksByDevice: {},
    clicksByBrowser: {},
    clicksByOS: {},
    clicksByCountry: {},
    clicksByCity: {},
    clicksByLanguage: {},
    topReferrers: {},
    uniqueVisitors: new Set(),
    visitorIds: new Set(),
    returningVisitors: 0,
    botClicks: 0,
    datacenterClicks: 0,
    mobilePercentage: 0,
    sessionIds: new Set()
  };

  const ipCount = {};
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  clicks.forEach(click => {
    const timestamp = new Date(click.timestamp);

    const visitorKey = click.visitorId || click.ip;
    analytics.uniqueVisitors.add(visitorKey);
    ipCount[visitorKey] = (ipCount[visitorKey] || 0) + 1;

    const date = timestamp.toISOString().split('T')[0];
    const hour = timestamp.getHours();
    const dayOfWeek = daysOfWeek[timestamp.getDay()];

    analytics.clicksByDate[date] = (analytics.clicksByDate[date] || 0) + 1;
    analytics.clicksByHour[hour] = (analytics.clicksByHour[hour] || 0) + 1;
    analytics.clicksByDayOfWeek[dayOfWeek] = (analytics.clicksByDayOfWeek[dayOfWeek] || 0) + 1;

    const device = click.device || 'Unknown';
    const browser = click.browser || 'Unknown';
    const os = click.os || 'Unknown';

    analytics.clicksByDevice[device] = (analytics.clicksByDevice[device] || 0) + 1;
    analytics.clicksByBrowser[browser] = (analytics.clicksByBrowser[browser] || 0) + 1;
    analytics.clicksByOS[os] = (analytics.clicksByOS[os] || 0) + 1;

    const country = click.country || 'Unknown';
    analytics.clicksByCountry[country] = (analytics.clicksByCountry[country] || 0) + 1;

    // تحسين معالجة المدن
    if (click.city && click.city.trim() !== '') {
      const city = click.city.trim();
      analytics.clicksByCity[city] = (analytics.clicksByCity[city] || 0) + 1;
      console.log('🏙️ City recorded:', city); // للتشخيص
    } else {
      console.log('⚠️ Click without city data:', click.ip);
    }

    if (click.language) {
      analytics.clicksByLanguage[click.language] = (analytics.clicksByLanguage[click.language] || 0) + 1;
    }

    let referer = click.referer || 'Direct';
    if (referer !== 'Direct') {
      try {
        const url = new URL(referer);
        referer = url.hostname.replace('www.', '');
      } catch (e) {
        referer = referer.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0];
      }
    }
    analytics.topReferrers[referer] = (analytics.topReferrers[referer] || 0) + 1;

    if (click.isBot) analytics.botClicks++;
    if (click.isDatacenter) analytics.datacenterClicks++;
    if (click.isMobile) analytics.mobilePercentage++;
    if (click.sessionId) analytics.sessionIds.add(click.sessionId);
  });

  analytics.returningVisitors = Object.values(ipCount).filter(c => c > 1).length;
  analytics.mobilePercentage = clicks.length > 0
    ? parseFloat((analytics.mobilePercentage / clicks.length * 100).toFixed(1))
    : 0;

  const sortByValue = (obj, limit = null) => {
    const sorted = Object.entries(obj)
      .sort(([, a], [, b]) => b - a)
      .map(([label, count]) => ({
        label,
        count,
        percentage: clicks.length > 0
          ? parseFloat((count / clicks.length * 100).toFixed(1))
          : 0
      }));

    return limit ? sorted.slice(0, limit) : sorted;
  };

  // إضافة console.log لفحص المدن
  console.log('🏙️ Total cities found:', Object.keys(analytics.clicksByCity).length);
  console.log('🏙️ Cities:', Object.keys(analytics.clicksByCity));

  return {
    totalClicks: analytics.totalClicks,
    clicksInRange: analytics.clicksInRange,
    lastClickedAt: analytics.lastClickedAt,
    uniqueVisitors: analytics.uniqueVisitors.size,
    returningVisitors: analytics.returningVisitors,
    mobilePercentage: analytics.mobilePercentage,
    botClicks: analytics.botClicks,
    botPercentage: clicks.length > 0
      ? parseFloat((analytics.botClicks / clicks.length * 100).toFixed(1))
      : 0,
    datacenterClicks: analytics.datacenterClicks,
    sessionCount: analytics.sessionIds.size,
    humanClickPercentage: clicks.length > 0
      ? parseFloat(((clicks.length - analytics.botClicks - analytics.datacenterClicks) / clicks.length * 100).toFixed(1))
      : 0,

    clicksByDate: sortByValue(analytics.clicksByDate),
    clicksByHour: sortByValue(analytics.clicksByHour),
    clicksByDayOfWeek: sortByValue(analytics.clicksByDayOfWeek),

    clicksByDevice: sortByValue(analytics.clicksByDevice),
    clicksByBrowser: sortByValue(analytics.clicksByBrowser, 10),
    clicksByOS: sortByValue(analytics.clicksByOS, 10),

    clicksByCountry: sortByValue(analytics.clicksByCountry, 15),
    clicksByCity: isBusiness ? sortByValue(analytics.clicksByCity, 10) : [], // Top 10 Cities (Business Only)

    clicksByLanguage: sortByValue(analytics.clicksByLanguage, 10),
    topReferrers: sortByValue(analytics.topReferrers, 10)
  };
}

module.exports = router;