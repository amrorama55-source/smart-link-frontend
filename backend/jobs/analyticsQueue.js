const { Queue } = require('bullmq');
const redisClient = require('../config/redis');

// Create the Analytics Queue
const analyticsQueue = new Queue('analytics-queue', {
  connection: redisClient,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: 1000, // Keep last 1000 failed jobs for debugging
    attempts: 3, // Retry up to 3 times on failure
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});

console.log('✅ Analytics Queue Initialized');

analyticsQueue.on('error', (err) => {
  console.error('❌ BullMQ Queue Error:', err.message);
});

module.exports = analyticsQueue;
