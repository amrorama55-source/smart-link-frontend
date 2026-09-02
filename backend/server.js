require('dotenv').config();

// Sentry must initialize before anything else to capture all errors
const { Sentry, initSentry } = require('./config/sentry');
initSentry();

// ⚠️ STARTUP CONFIGURATION WARNINGS
if (!process.env.LS_STARTER_MONTHLY_VARIANT_ID || process.env.LS_STARTER_MONTHLY_VARIANT_ID === 'STARTER_MONTHLY_ID_HERE') {
  console.warn('⚠️  WARNING: LS_STARTER_MONTHLY_VARIANT_ID is not set! Starter plan subscriptions will NOT work.');
  console.warn('   Fix: Set LS_STARTER_MONTHLY_VARIANT_ID in Render Environment Variables.');
}
if (!process.env.LS_STARTER_YEARLY_VARIANT_ID || process.env.LS_STARTER_YEARLY_VARIANT_ID === 'STARTER_YEARLY_ID_HERE') {
  console.warn('⚠️  WARNING: LS_STARTER_YEARLY_VARIANT_ID is not set! Starter yearly plan subscriptions will NOT work.');
  console.warn('   Fix: Set LS_STARTER_YEARLY_VARIANT_ID in Render Environment Variables.');
}

// 🔐 STRIPE MODE CHECK — Critical for production
if (process.env.NODE_ENV === 'production') {
  const stripeKey = process.env.STRIPE_SECRET_KEY || '';
  if (stripeKey.startsWith('sk_test_')) {
    console.error('🚨 CRITICAL SECURITY WARNING: Stripe is running in TEST MODE in production!');
    console.error('   Real customer payments will FAIL silently or be misdirected.');
    console.error('   Fix: Replace STRIPE_SECRET_KEY with your sk_live_... key from Stripe Dashboard.');
    console.error('   Render: Set STRIPE_SECRET_KEY=sk_live_... in Environment Variables tab.');
  } else if (!stripeKey) {
    console.error('🚨 CRITICAL: STRIPE_SECRET_KEY is not set! Payment routes will fail.');
  } else {
    console.log('✅ Stripe: Live mode detected — payments are REAL.');
  }
}


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cron = require('node-cron');
const cookieParser = require('cookie-parser');
const logger = require('./utils/logger');

// Config modules
const { corsOptions, allowedDomains } = require('./config/cors');
const { globalLimiter, authLimiter, createLinkLimiter, analyticsLimiter, conversionLimiter, paymentsLimiter, genericApiLimiter, rateLimitMiddleware } = require('./config/rateLimiter');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');



const app = express();

// --- Security: NoSQL & XSS sanitization ---
const mongoSanitize = require('express-mongo-sanitize');
const sanitizeHtml = require('sanitize-html');

app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    const sanitizeObject = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = sanitizeHtml(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        }
      }
    };
    sanitizeObject(req.body);
  }
  next();
});
app.use(mongoSanitize());

app.set('trust proxy', 1);

// --- Security headers ---
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "*"],
      connectSrc: ["'self'", "https:", "http://localhost:*", "ws://localhost:*"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", "https:"],
      formAction: ["'self'", "https://api.by-smartlink.com", "http://localhost:*"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));


app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(cookieParser());



app.use(rateLimitMiddleware(globalLimiter, 'Global rate limit exceeded'));

// Webhooks require raw body for HMAC signature validation — must come before body parser
app.use('/api/webhook', express.raw({ type: 'application/json' }), require('./routes/webhook'));

// Public extension routes — no CSRF required, IP-based rate limited
app.use('/api/public', express.json({ limit: '1mb' }), require('./routes/public'));

// AWS Strands Agents integration — no CSRF required for AI Agents testing
app.use('/api/aws-agent', express.json({ limit: '1mb' }), require('./routes/aws-agent'));

// CSRF protection
const csrfMiddleware = require('./middleware/csrf');
app.use(csrfMiddleware);

// Body parser
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
      throw new Error('Invalid JSON');
    }
  }
}));

app.use(express.urlencoded({
  extended: true,
  limit: '10mb',
  parameterLimit: 10000
}));

// Passport (Google OAuth)
const passport = require('passport');
require('./config/passport');
app.use(passport.initialize());

// Dev-only request logger
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use((req, res, next) => {
    const start = Date.now();
    console.log(`→ ${req.method} ${req.path}`);
    res.on('finish', () => {
      console.log(`← ${req.method} ${req.path} ${res.statusCode} (${Date.now() - start}ms)`);
    });
    next();
  });
}

// --- Database ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected — db:', mongoose.connection.name);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
mongoose.connection.on('error', (err) => console.error('MongoDB error:', err.message));

connectDB();

// --- Background workers & cron jobs ---
require('./jobs/analyticsWorker');

// Deactivate expired links (daily at midnight)
cron.schedule('0 0 * * *', async () => {
  try {
    const Link = require('./models/Link');
    const result = await Link.updateMany(
      { expiresAt: { $lt: new Date() }, isActive: true },
      { isActive: false }
    );
    logger.info(`Cron: deactivated ${result.modifiedCount} expired links`);
  } catch (error) {
    logger.error('Cron (expired links):', error.message);
  }
});

// Archive old click data (weekly on Sunday at 2 AM)
cron.schedule('0 2 * * 0', async () => {
  try {
    const Link = require('./models/Link');
    const links = await Link.find({ 'clicks.100': { $exists: true } });

    let archivedCount = 0;
    for (const link of links) {
      if (link.clicks.length > 5000) {
        await link.archiveOldClicks();
        archivedCount++;
      }
    }
    logger.info(`Cron: archived clicks for ${archivedCount} links`);
  } catch (error) {
    logger.error('Cron (archive clicks):', error.message);
  }
});

// Auto-optimize A/B tests (daily at 3 AM)
cron.schedule('0 3 * * *', async () => {
  try {
    const Link = require('./models/Link');
    const links = await Link.find({
      'abTest.enabled': true,
      'abTest.autoOptimize.enabled': true,
      'abTest.status': 'running'
    });

    let optimizedCount = 0;
    for (const link of links) {
      if (link.totalClicks >= (link.abTest.autoOptimize.minSampleSize || 100)) {
        await link.optimizeABTest();
        await link.save();
        optimizedCount++;
      }
    }
    logger.info(`Cron: auto-optimized ${optimizedCount} A/B tests`);
  } catch (error) {
    logger.error('Cron (A/B optimization):', error.message);
  }
});

// Trial email sequences & expiration checks
require('./jobs/checkTrialExpiry');

// robots.txt — block crawlers from the API subdomain
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send([
    '# SmartLink API',
    'User-agent: *',
    'Disallow: /',
  ].join('\n'));
});

// Health check
app.get('/health', (req, res) => {
  const healthcheck = { status: 'OK', timestamp: new Date().toISOString() };

  if (process.env.NODE_ENV === 'development') {
    healthcheck.uptime = process.uptime();
    healthcheck.environment = process.env.NODE_ENV;
    healthcheck.mongodb = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    healthcheck.memory = process.memoryUsage();
  }

  res.status(200).json(healthcheck);
});


// --- API Routes
// ========================================

// Authentication routes
app.use('/api/auth',
  rateLimitMiddleware(authLimiter, 'Too many login attempts'),
  require('./routes/auth')
);

// Links routes
app.use('/api/links',
  rateLimitMiddleware(createLinkLimiter, 'Too many link operations'),
  require('./routes/links')
);

// Analytics routes
app.use('/api/analytics',
  rateLimitMiddleware(analyticsLimiter, 'Too many analytics requests'),
  require('./routes/analytics')
);

// ✅ NEW: Conversion Tracking routes (lenient rate limit)
app.use('/api/conversions',
  rateLimitMiddleware(conversionLimiter, 'Too many conversion tracking requests'),
  require('./routes/conversions')
);

// ✅ NEW: Custom Domain Management routes
app.use('/api/domains',
  rateLimitMiddleware(createLinkLimiter, 'Too many domain operations'),
  require('./routes/domains')
);

// AI routes (Magic Builder only)
app.use('/api/ai', rateLimitMiddleware(genericApiLimiter, 'Too many AI requests'), require('./routes/ai'));



// Bio routes
app.use('/api/bio', rateLimitMiddleware(genericApiLimiter, 'Too many Bio requests'), require('./routes/bio'));

// Settings routes
app.use('/api/settings', rateLimitMiddleware(genericApiLimiter, 'Too many Settings requests'), require('./routes/settings'));

// Payments routes — rate limited to prevent Stripe abuse
app.use('/api/payments', rateLimitMiddleware(paymentsLimiter, 'Too many payment requests. Please try again later.'), require('./routes/payments'));

// Team Management (Agency Plan)
app.use('/api/team', rateLimitMiddleware(genericApiLimiter, 'Too many Team requests'), require('./routes/team'));

// Admin Dashboard routes
app.use('/api/admin', require('./routes/admin'));

// Abuse routes
app.use('/abuse', require('./routes/abuse'));
app.use('/api/abuse', require('./routes/abuse'));
app.use('/api/appsumo', rateLimitMiddleware(genericApiLimiter, 'Too many requests'), require('./routes/appsumo'));


// ========================================
// ✅ ENHANCED: Redirect Route (Short URL)
// Raw OpenAPI JSON spec (for tooling integrations)
app.get('/api/docs/spec.json', (req, res) => res.json(swaggerSpec));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Smart Link API Docs',
  swaggerOptions: { persistAuthorization: true }
}));


// Sentry verification test route
app.get('/api/debug/sentry-test', (req, res) => {
  throw new Error('Test Sentry Exception from Smart Link API');
});

// ========================================
// Redirect Route (Short URL)
// ========================================
// Must come after specific /api/ routes so it doesn't intercept /api/* paths
const redirectHandler = require('./routes/redirect');
app.all('/:shortCode', typeof redirectHandler === 'function' ? redirectHandler : redirectHandler.handler || redirectHandler);


// Sentry error handler — must be before any other error handlers
Sentry.setupExpressErrorHandler(app);


// --- 404 Handler ---


app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    suggestion: 'Check API documentation at /api/docs'
  });
});

// ========================================
// Global Error Handler
// ========================================
app.use((err, req, res, next) => {
  console.error('🔴 Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid input data',
      details: errors
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID',
      message: `Invalid ${err.path}: ${err.value}`
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid Token',
      message: 'Authentication token is invalid'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token Expired',
      message: 'Authentication token has expired'
    });
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      error: 'Duplicate Entry',
      message: `${field} already exists`
    });
  }

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Access from your origin is not allowed'
    });
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid JSON payload'
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : err.message,
    message: process.env.NODE_ENV === 'development'
      ? err.message
      : 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      type: err.name
    })
  });
});

// ========================================
// Graceful Shutdown
// ========================================
const gracefulShutdown = async (signal) => {
  console.log(`\n⚠️ ${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    console.log('✅ HTTP server closed');

    try {
      await mongoose.connection.close(false);
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error closing MongoDB connection:', err);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error('⚠️ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  console.error('🔴 Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔴 Unhandled Rejection:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

// ========================================
// Start Server
// ========================================
const PORT = process.env.PORT || 3000;
const HOST = process.env.IP || '0.0.0.0';
let server;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, HOST, () => {
    console.log('');
    console.log('🚀 ========================================');
    console.log(`🚀 Smart Link API v2.0`);
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✅ Trust Proxy: Enabled`);
    console.log(`📡 CORS: ${allowedDomains.length} domains`);
    console.log('');
    console.log('📚 Features:');
    console.log('   ✅ A/B Testing with Auto-optimization');
    console.log('   ✅ Custom Domains with DNS Verification');
    console.log('   ✅ Conversion Tracking');
    console.log('   ✅ Geotargeting');
    console.log('   ✅ Retargeting Pixels');
    console.log('   ✅ Real-time Analytics');
    console.log('');
    console.log('📖 API Docs: http://localhost:' + PORT + '/api/docs');
    console.log('🏥 Health Check: http://localhost:' + PORT + '/health');
    console.log('🚀 ========================================');
    console.log('');
  });

  server.on('error', (error) => {
    if (error.syscall !== 'listen') throw error;

    switch (error.code) {
      case 'EACCES':
        console.error(`❌ Port ${PORT} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`❌ Port ${PORT} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });
}

module.exports = app;