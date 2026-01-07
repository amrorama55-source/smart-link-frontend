// src/utils/rateLimiter.js
class RateLimiter {
  constructor(maxAttempts, windowMs) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.attempts = new Map();
  }

  isAllowed(key) {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    
    // Remove old attempts
    const recentAttempts = userAttempts.filter(
      time => now - time < this.windowMs
    );
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }
}

// Usage:
const loginLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 min

const handleLogin = async () => {
  if (!loginLimiter.isAllowed(email)) {
    setError('Too many login attempts. Please wait 15 minutes.');
    return;
  }
  // proceed with login
};