import * as Sentry from '@sentry/nestjs';

// Env-gated: with no SENTRY_DSN set, init is skipped entirely and the SDK is a
// no-op. Imported at the very top of main.ts so instrumentation is in place
// before the Nest app is created.
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0.1),
  });
}
