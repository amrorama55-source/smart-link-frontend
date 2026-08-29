const logger = require('../utils/logger');

const allowedDomains = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://www.by-smartlink.com',
  'https://by-smartlink.com'
];

if (process.env.CORS_EXTRA_ORIGINS) {
  const extraOrigins = process.env.CORS_EXTRA_ORIGINS.split(',').map(o => o.trim());
  allowedDomains.push(...extraOrigins);
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedDomains.includes(origin) ||
      origin.endsWith('.by-smartlink.com') ||
      origin.startsWith('chrome-extension://') ||
      origin.startsWith('moz-extension://')
    ) {
      return callback(null, true);
    }
    logger.info('CORS blocked:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Requested-With', 'X-CSRF-Token'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600
};

module.exports = { corsOptions, allowedDomains };
