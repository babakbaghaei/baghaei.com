import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add empty turbopack config to satisfy Next.js 16
  turbopack: {},
};

export default nextConfig;
