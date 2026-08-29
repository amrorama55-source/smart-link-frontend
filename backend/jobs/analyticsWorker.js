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

module.exports = analyticsWorker;
