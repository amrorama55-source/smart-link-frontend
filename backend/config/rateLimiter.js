const { RateLimiterMemory } = require('rate-limiter-flexible');

const globalLimiter     = new RateLimiterMemory({ points: 500,  duration: 60, blockDuration: 60  });
const authLimiter       = new RateLimiterMemory({ points: 50,   duration: 60, blockDuration: 120 });
const createLinkLimiter = new RateLimiterMemory({ points: 100,  duration: 60, blockDuration: 60  });
const analyticsLimiter  = new RateLimiterMemory({ points: 200,  duration: 60, blockDuration: 60  });
const conversionLimiter = new RateLimiterMemory({ points: 1000, duration: 60, blockDuration: 30  });
const paymentsLimiter   = new RateLimiterMemory({ points: 20,   duration: 60, blockDuration: 300 });
const genericApiLimiter  = new RateLimiterMemory({ points: 100,  duration: 60, blockDuration: 60  });

const rateLimitMiddleware = (limiter, message = 'Too many requests') => {
  return async (req, res, next) => {
    try {
      const key =
        req.headers.authorization ||
        req.headers['x-forwarded-for']?.split(',')[0].trim() ||
        req.headers['x-real-ip'] ||
        req.ip ||
        req.connection?.remoteAddress ||
        'unknown';

      await limiter.consume(key);
      next();
    } catch (rejRes) {
      const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
      res.set('Retry-After', String(secs));
      res.status(429).json({
        error: message,
        retryAfter: secs,
        resetAt: new Date(Date.now() + rejRes.msBeforeNext).toISOString()
      });
    }
  };
};

module.exports = {
  globalLimiter,
  authLimiter,
  createLinkLimiter,
  analyticsLimiter,
  conversionLimiter,
  paymentsLimiter,
  genericApiLimiter,
  rateLimitMiddleware
};
