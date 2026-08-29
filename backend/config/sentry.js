const Sentry = require('@sentry/node');

const SENTRY_DSN = process.env.SENTRY_DSN || 'https://b8c64cec809473d33f006048018acfad@o4511956436844544.ingest.us.sentry.io/4511956455718912';


function initSentry() {
  if (process.env.NODE_ENV === 'test') return; // don't track in tests

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    release: `smart-link-api@2.0.0`,

    // Performance monitoring — capture 10% of requests in production
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Don't send user PII (email, IP) to Sentry
    sendDefaultPii: false,

    // Ignore common noise errors
    ignoreErrors: [
      'Not allowed by CORS',
      'Too many requests',
      'Authentication token is invalid',
      'Authentication token has expired',
    ],

    beforeSend(event) {
      // Strip any accidentally included sensitive data
      if (event.request) {
        delete event.request.cookies;
        if (event.request.headers) {
          delete event.request.headers['authorization'];
          delete event.request.headers['x-api-key'];
          delete event.request.headers['cookie'];
        }
      }
      return event;
    }
  });

  console.log(`Sentry initialized — env: ${process.env.NODE_ENV || 'development'}`);
}

module.exports = { Sentry, initSentry };
