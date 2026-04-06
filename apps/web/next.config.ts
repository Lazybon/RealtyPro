import path from 'node:path';
import { loadEnvConfig } from '@next/env';
import type { NextConfig } from 'next';

// При `yarn dev` из apps/web Next по умолчанию не читает ../../.env — подтягиваем корень монорепы.
/** Next сначала грузит .env из apps/web и кэширует результат; без forceReload повторный loadEnvConfig(корень) молча игнорируется (SESSION_SECRET не попадает в middleware). */
const monorepoRoot = path.resolve(process.cwd(), '../..');
const loadDev = process.env.NODE_ENV !== 'production';
loadEnvConfig(monorepoRoot, loadDev, console, true);

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
