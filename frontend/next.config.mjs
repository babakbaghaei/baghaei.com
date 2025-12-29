import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Fix for monorepo structure with multiple lockfiles
  outputFileTracingRoot: path.join(process.cwd(), '../'),
  // Add empty turbopack config to satisfy Next.js 16 and silence root warning
  turbopack: {
    root: path.join(process.cwd(), '../'),
  },
};

export default nextConfig;