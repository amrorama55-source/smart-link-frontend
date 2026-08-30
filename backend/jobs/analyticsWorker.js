const { Worker } = require('bullmq');
const redisClient = require('../config/redis');
const Link = require('../models/Link');
const { triggerWebhook } = require('../services/webhookService');

// Create the Analytics Worker
const analyticsWorker = new Worker('analytics-queue', async (job) => {
  const { linkId, trackingData, webhookUrl } = job.data;

  try {
    // 1. Process Analytics (Save to MongoDB)
    const freshLink = await Link.findById(linkId);
    if (!freshLink) {
      console.warn(`⚠️ Worker: Link ${linkId} not found. Skipping analytics.`);
      return;
    }

    await freshLink.trackClick(trackingData);

    // 🚀 Parallel Logging to ClickHouse for Real-Time Cinema Analytics
    const clickhouse = require('../utils/clickhouse');
    try {
      await clickhouse.insert({
        table: 'clicks',
        values: [{
          id: require('crypto').randomUUID(),
          symbol: freshLink.shortCode,
          country: trackingData.country || 'Unknown',
          device: trackingData.device || 'Desktop',
          referrer: trackingData.referrer || 'Direct',
          is_bot: trackingData.isBot ? 1 : 0,
          timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
        }],
        format: 'JSONEachRow'
      });
      if (process.env.NODE_ENV === 'development') {
        console.log(`🎬 ClickHouse: Logged click for link ${freshLink.shortCode}`);
      }
    } catch (chErr) {
      console.error('❌ ClickHouse insert failed:', chErr.message);
    }

    // 2. Trigger Webhook (if enabled)
    if (webhookUrl) {
      await triggerWebhook(webhookUrl, {
        shortCode: freshLink.shortCode,
        clickDetails: trackingData
      });
    }

    // 🚀 SPIKE MONITOR
    if (freshLink.totalClicks >= 1000 && freshLink.totalClicks % 500 === 0) {
      console.warn('⚠️ SECURITY ALERT: High traffic spike detected!');
      console.warn(`   Link: ${freshLink.shortCode}`);
      console.log(`   Total Clicks: ${freshLink.totalClicks}`);
    }

  } catch (error) {
    console.error('❌ Worker processing error:', error);
    throw error; // Let BullMQ handle retries
  }
}, { 
  connection: redisClient,
  concurrency: 50 // Process up to 50 clicks concurrently from the queue
});

analyticsWorker.on('completed', (job) => {
  // Silent success to prevent log spam in production
  if (process.env.NODE_ENV === 'development') {
    console.log(`✅ Job ${job.id} completed!`);
  }
});

analyticsWorker.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed with error ${err.message}`);
});

analyticsWorker.on('error', (err) => {
  console.error('❌ BullMQ Worker Error:', err.message);
});

module.exports = analyticsWorker;
