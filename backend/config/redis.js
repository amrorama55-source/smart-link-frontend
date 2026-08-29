const Redis = require('ioredis');

// Determine connection URL (Fallback to standard localhost if not provided)
// Render typically provides REDIS_URL when you attach a Redis instance
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Redis Client for standard operations (Caching)
const redisClient = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy(times) {
    // Only retry a few times to prevent infinite loops if Redis is completely down
    const delay = Math.min(times * 50, 2000);
    if (times > 5) {
      console.warn('⚠️ Redis connection failing. Proceeding without cache...');
      return null; 
    }
    return delay;
  }
});

redisClient.on('connect', () => {
  console.log('✅ Connected to Redis (Cache & Queues)');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Connection Error:', err.message);
});

module.exports = redisClient;
