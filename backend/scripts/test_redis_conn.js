require('dotenv').config();
const Redis = require('ioredis');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
console.log('🔌 Connecting to Redis at:', redisUrl);

const redisClient = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy(times) {
    console.log(`Retry attempt: ${times}`);
    if (times > 3) {
      return null; // Stop
    }
    return 100;
  }
});

redisClient.on('connect', () => {
  console.log('✅ Connected to Redis successfully!');
  redisClient.disconnect();
  process.exit(0);
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Error:', err.message);
  redisClient.disconnect();
  process.exit(0);
});

// Timeout fail
setTimeout(() => {
  console.log('❌ Timeout connecting to Redis!');
  redisClient.disconnect();
  process.exit(0);
}, 5000);
