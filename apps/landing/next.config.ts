import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '*.vercel.app',
    '*.replit.dev',
    '*.worf.replit.dev',
    '*.picard.replit.dev',
    '*.kirk.replit.dev',
  ],
};

export default nextConfig;
