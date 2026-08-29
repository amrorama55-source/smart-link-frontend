// backend/routes/conversions.js
// Complete Conversion Tracking System

const express = require('express');
const router = express.Router();
const Link = require('../models/Link');
const { verifyToken, verifyApiKey } = require('../middleware/verifyToken');

// Authentication middleware
const authenticate = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  if (apiKey) return verifyApiKey(req, res, next);
  return verifyToken(req, res, next);
};
router.post('/:shortCode/track', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const { visitorId, value, event } = req.body;

    // Validation
    if (!visitorId) {
      return res.status(400).json({
        error: 'visitorId is required',
        message: 'Please provide a valid visitor ID'
      });
    }
    console.log('   Short Code:', shortCode);
    console.log('   Visitor ID:', visitorId.substring(0, 16) + '...');
    console.log('   Event:', event || 'conversion');
    console.log('   Value:', value || 0);

    // Find link
    const link = await Link.findOne({ shortCode, isActive: true });

    if (!link) {
      return res.status(404).json({
        error: 'Link not found',
        message: 'The smart link does not exist or has been deactivated'
      });
    }

    // Find the most recent click from this visitor
    const clickIndex = link.clicks
      .map((c, i) => ({ click: c, index: i }))
      .reverse()
      .find(({ click }) => click.visitorId === visitorId);

    if (!clickIndex) {
      return res.status(404).json({
        error: 'No click found for this visitor',
        message: 'The visitor must click the smart link before conversion can be tracked',
        visitorId: visitorId.substring(0, 16) + '...'
      });
    }

    const click = clickIndex.click;
    const index = clickIndex.index;

    // Check if already converted
    if (click.converted) {
      return res.status(400).json({
        error: 'Conversion already tracked',
        message: 'This visitor has already converted',
        conversion: {
          variantIndex: click.abVariantIndex,
          variantName: click.abVariant,
          convertedAt: click.conversionTime,
          value: click.conversionValue
        }
      });
    }
    link.clicks[index].converted = true;
    link.clicks[index].conversionTime = new Date();
    link.clicks[index].conversionValue = value || 0;

    // Update A/B test variant if applicable
    if (link.abTest?.enabled && click.abVariantIndex !== undefined) {
      const variantIndex = click.abVariantIndex;

      if (link.abTest.variants[variantIndex]) {
        link.abTest.variants[variantIndex].conversions =
          (link.abTest.variants[variantIndex].conversions || 0) + 1;

        // Update conversion rate
        const variant = link.abTest.variants[variantIndex];
        if (variant.clicks > 0) {
          variant.conversionRate = parseFloat(
            ((variant.conversions || 0) / variant.clicks * 100).toFixed(2)
          );
        }
      }
    }

    await link.save();
    console.log('   Variant:', click.abVariant || 'Default');
    console.log('   Value: $' + (value || 0));
    res.json({
      success: true,
      message: 'Conversion tracked successfully',
      conversion: {
        shortCode,
        visitorId: visitorId.substring(0, 16) + '...',
        variantIndex: click.abVariantIndex,
        variantName: click.abVariant || 'Default',
        value: value || 0,
        event: event || 'conversion',
        trackedAt: new Date(),
        country: click.country,
        device: click.device
      },
      abTest: link.abTest?.enabled ? {
        variants: link.abTest.variants.map((v, i) => ({
          name: v.name,
          conversions: v.conversions || 0,
          conversionRate: v.conversionRate || 0
        }))
      } : null
    });

  } catch (error) {
    console.error('❌ Conversion tracking error:', error);
    res.status(500).json({
      error: 'Failed to track conversion',
      message: error.message
    });
  }
});
// Ex: GET /api/conversions/postback?clickid=xyz123&payout=10.50&event=purchase
router.get('/postback', async (req, res) => {
  try {
    const { clickid, click_id, payout, value, event } = req.query;
    const finalClickId = clickid || click_id;
    const finalValue = parseFloat(payout || value || 0);

    if (!finalClickId) {
      return res.status(400).json({ error: 'clickid is required' });
    }

    console.log(`📡 S2S Postback received for clickId: ${finalClickId}`);

    // We need to find the link that contains this clickId.
    // In MongoDB, searching through arrays across all documents can be slow, 
    // but clickId is indexed if we added index: true to clickSchema.
    const link = await Link.findOne({ 'clicks.clickId': finalClickId });

    if (!link) {
      return res.status(404).json({ error: 'Click ID not found or expired' });
    }

    const clickIndex = link.clicks.findIndex(c => c.clickId === finalClickId);
    
    if (clickIndex === -1) {
      return res.status(404).json({ error: 'Click ID not found in link' });
    }

    const click = link.clicks[clickIndex];

    if (click.converted) {
      return res.status(200).json({ message: 'Conversion already tracked for this click' });
    }

    // Mark as converted
    link.clicks[clickIndex].converted = true;
    link.clicks[clickIndex].conversionTime = new Date();
    link.clicks[clickIndex].conversionValue = finalValue;

    // Update AB Test conversions if needed
    if (link.abTest?.enabled && click.abVariantIndex !== undefined) {
      const variantIndex = click.abVariantIndex;
      if (link.abTest.variants[variantIndex]) {
        link.abTest.variants[variantIndex].conversions = 
          (link.abTest.variants[variantIndex].conversions || 0) + 1;
        
        const variant = link.abTest.variants[variantIndex];
        if (variant.clicks > 0) {
          variant.conversionRate = parseFloat(((variant.conversions || 0) / variant.clicks * 100).toFixed(2));
        }
      }
    }

    await link.save();
    // Return 200 OK text for affiliate networks (they usually prefer plain text or simple JSON)
    res.status(200).json({ success: true, message: 'Postback tracked' });

  } catch (error) {
    console.error('❌ S2S Postback error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/:shortCode/stats', authenticate, async (req, res) => {
  try {
    const { shortCode } = req.params;
    const { days = 30 } = req.query;

    const link = await Link.findOne({
      shortCode,
      userId: req.user.workspaceId
    });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // Check plan eligibility
    if (req.user.plan === 'free') {
      return res.status(403).json({
        error: 'Premium feature restricted',
        message: 'Conversion analytics are only available on Pro and Business plans.'
      });
    }

    // Filter by date range
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const relevantClicks = link.clicks.filter(c =>
      new Date(c.timestamp) >= cutoffDate
    );

    // Calculate stats
    const totalClicks = relevantClicks.length;
    const conversions = relevantClicks.filter(c => c.converted);
    const totalConversions = conversions.length;
    const totalRevenue = conversions.reduce((sum, c) => sum + (c.conversionValue || 0), 0);

    const conversionRate = totalClicks > 0
      ? parseFloat((totalConversions / totalClicks * 100).toFixed(2))
      : 0;

    const averageValue = totalConversions > 0
      ? parseFloat((totalRevenue / totalConversions).toFixed(2))
      : 0;

    // A/B Test conversion stats
    let abTestStats = null;
    if (link.abTest?.enabled) {
      abTestStats = {
        variants: link.abTest.variants.map((v, i) => {
          const variantClicks = relevantClicks.filter(c => c.abVariantIndex === i);
          const variantConversions = variantClicks.filter(c => c.converted);
          const variantRevenue = variantConversions.reduce((sum, c) => sum + (c.conversionValue || 0), 0);

          return {
            index: i,
            name: v.name,
            clicks: variantClicks.length,
            conversions: variantConversions.length,
            conversionRate: variantClicks.length > 0
              ? parseFloat((variantConversions.length / variantClicks.length * 100).toFixed(2))
              : 0,
            revenue: variantRevenue,
            averageValue: variantConversions.length > 0
              ? parseFloat((variantRevenue / variantConversions.length).toFixed(2))
              : 0
          };
        }),
        winner: link.abTest.winner
      };
    }

    res.json({
      success: true,
      stats: {
        dateRange: `Last ${days} days`,
        totalClicks,
        totalConversions,
        conversionRate,
        totalRevenue,
        averageValue,
        conversions: conversions.map(c => ({
          timestamp: c.timestamp,
          value: c.conversionValue || 0,
          variant: c.abVariant,
          country: c.country,
          device: c.device
        })),
        abTest: abTestStats
      }
    });

  } catch (error) {
    console.error('❌ Conversion stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch conversion stats',
      message: error.message
    });
  }
});
router.get('/top/converting', authenticate, async (req, res) => {
  try {
    const { limit = 10, days = 30 } = req.query;

    // Check plan eligibility
    if (req.user.plan === 'free') {
      return res.status(403).json({
        error: 'Premium feature restricted',
        message: 'Conversion tracking is a premium feature.'
      });
    }

    const links = await Link.find({ userId: req.user.workspaceId });

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const linkStats = links.map(link => {
      const relevantClicks = link.clicks.filter(c =>
        new Date(c.timestamp) >= cutoffDate
      );

      const conversions = relevantClicks.filter(c => c.converted);
      const conversionRate = relevantClicks.length > 0
        ? (conversions.length / relevantClicks.length * 100)
        : 0;

      const revenue = conversions.reduce((sum, c) => sum + (c.conversionValue || 0), 0);

      return {
        shortCode: link.shortCode,
        title: link.title || 'Untitled',
        clicks: relevantClicks.length,
        conversions: conversions.length,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
        revenue,
        hasABTest: link.abTest?.enabled || false
      };
    });

    // Sort by conversion rate
    linkStats.sort((a, b) => b.conversionRate - a.conversionRate);

    res.json({
      success: true,
      topLinks: linkStats.slice(0, parseInt(limit)),
      dateRange: `Last ${days} days`
    });

  } catch (error) {
    console.error('❌ Top converting links error:', error);
    res.status(500).json({
      error: 'Failed to fetch top converting links',
      message: error.message
    });
  }
});
router.get('/:shortCode/tracking-code', authenticate, async (req, res) => {
  try {
    const { shortCode } = req.params;

    const link = await Link.findOne({
      shortCode,
      userId: req.user.workspaceId
    });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    const trackingCode = `
<!-- Smart Link Conversion Tracking -->
<script>
(function() {
  // Get visitor ID from localStorage or generate new one
  function getVisitorId() {
    let visitorId = localStorage.getItem('sl_visitor_id');
    if (!visitorId) {
      visitorId = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('sl_visitor_id', visitorId);
    }
    return visitorId;
  }

  // Track conversion function
  window.smartLinkTrackConversion = function(options) {
    options = options || {};
    
    const data = {
      visitorId: getVisitorId(),
      value: options.value || 0,
      event: options.event || 'conversion'
    };

    fetch('${baseUrl}/api/conversions/${shortCode}/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      console.log('✅ Conversion tracked:', result);
      if (options.callback) options.callback(result);
    })
    .catch(error => {
      console.error('❌ Conversion tracking error:', error);
      if (options.errorCallback) options.errorCallback(error);
    });
  };

  console.log('Smart Link Conversion Tracking loaded for: ${shortCode}');
})();
</script>

<!-- Usage Examples:
  
  Basic conversion:
  smartLinkTrackConversion();

  Conversion with value:
  smartLinkTrackConversion({ value: 29.99 });

  Conversion with custom event:
  smartLinkTrackConversion({ event: 'purchase', value: 99.99 });

  Conversion with callback:
  smartLinkTrackConversion({ 
    value: 49.99,
    callback: function(result) {
      console.log('Success:', result);
    }
  });
-->
`;

    res.type('text/javascript').send(trackingCode);

  } catch (error) {
    console.error('❌ Tracking code error:', error);
    res.status(500).json({
      error: 'Failed to generate tracking code',
      message: error.message
    });
  }
});

module.exports = router;