/**
 * Centralized logger for Smart Link API.
 *
 * - logger.info  : dev-only informational messages
 * - logger.warn  : always-on warnings (non-critical)
 * - logger.error : always-on errors
 * - logger.security : always-on security events (bans, blocks, fraud)
 */
const isDev = process.env.NODE_ENV !== 'production';

const logger = {
  info:     (...args) => { if (isDev) console.log('[INFO]', ...args); },
  warn:     (...args) => console.warn('[WARN]', ...args),
  error:    (...args) => console.error('[ERROR]', ...args),
  security: (...args) => console.warn('[SECURITY]', ...args),
};

module.exports = logger;
