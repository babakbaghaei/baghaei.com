import path from 'path';
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
  // Fix for monorepo structure with multiple lockfiles
  outputFileTracingRoot: path.join(process.cwd(), '../'),
  // Add empty turbopack config to satisfy Next.js 16 and silence root warning
  turbopack: {
    root: path.join(process.cwd(), '../'),
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