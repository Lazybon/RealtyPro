import path from 'node:path';
import { loadEnvConfig } from '@next/env';
import type { NextConfig } from 'next';

// При `yarn dev` из apps/web Next по умолчанию не читает ../../.env — подтягиваем корень монорепы.
const monorepoRoot = path.resolve(process.cwd(), '../..');
loadEnvConfig(monorepoRoot);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@repo/shared-graphql', '@repo/config'],
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '*.vercel.app',
    '*.replit.dev',
    '*.worf.replit.dev',
    '*.picard.replit.dev',
    '*.kirk.replit.dev',
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
