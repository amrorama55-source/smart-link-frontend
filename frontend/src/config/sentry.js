import * as Sentry from "@sentry/react";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || "https://00be7a74068cbf9c946d2b15e884c1ed@o4511956436844544.ingest.us.sentry.io/4511956452179973";

export function initFrontendSentry() {
  if (import.meta.env.MODE === 'test') return;

  // Defer Sentry initialization until after page paint so initial load is instant
  const init = () => {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: import.meta.env.MODE || 'development',
      release: 'smart-link-frontend@1.0.0',
      integrations: [
        Sentry.browserTracingIntegration(),
      ],
      tracesSampleRate: import.meta.env.PROD ? 0.05 : 0.5,
    });
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(init, { timeout: 2000 });
  } else {
    setTimeout(init, 1000);
  }
}

export { Sentry };
