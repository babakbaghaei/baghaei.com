import { withSentryConfig } from '@sentry/nextjs';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Allow next/image to load admin-uploaded images served from the backend
  // (/uploads) in dev and production.
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'https', hostname: 'baghaei.com' },
      { protocol: 'https', hostname: '**.baghaei.com' },
    ],
  },
  // Root the standalone output at the app dir so `.next/standalone/server.js`
  // is NOT nested under a subpath — the Docker runner runs `node server.js`
  // from /app. (Pointing this at the parent nests it under /app/app/server.js.)
  outputFileTracingRoot: process.cwd(),
  // Turbopack drives dev+build. Its root MUST equal outputFileTracingRoot or
  // Next 16 warns and the standalone trace root is ambiguous — pin both to the
  // frontend dir so `.next/standalone/server.js` lands at /app (Docker runner).
  turbopack: {
    root: process.cwd(),
  },
};

// Compose plugins: next-intl always; Sentry only when a DSN is configured, so
// builds without Sentry are completely unaffected. Source-map upload also needs
// SENTRY_ORG / SENTRY_PROJECT / SENTRY_AUTH_TOKEN; without them upload is skipped.
const withIntl = withNextIntl(nextConfig);

export default process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(withIntl, {
      silent: true,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    })
  : withIntl;