import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'prisma/config';
import { getPgPoolConfig } from './src/pg-pool';

/**
 * Prisma запускается из `packages/database`, поэтому стандартный `.env` здесь не читается.
 * Подгружаем переменные из корня монорепозитория (как у остальных скриптов).
 */
function loadMonorepoEnv() {
  const repoRoot = path.resolve(__dirname, '../..');
  const loadFile = (file: string, override: boolean) => {
    if (!existsSync(file)) return;
    const text = readFileSync(file, 'utf8');
    for (const raw of text.split('\n')) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq <= 0) continue;
      const key = line.slice(0, eq).trim();
      if (!key) continue;
      let val = line.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (override || process.env[key] === undefined) {
        process.env[key] = val;
      }
    }
  };
  loadFile(path.join(repoRoot, '.env'), false);
  loadFile(path.join(repoRoot, '.env.local'), true);
}

loadMonorepoEnv();

/**
 * Команды Prisma CLI (db push, migrate) на Neon должны идти на direct endpoint,
 * не на ...-pooler... — иначе часто P1001 / блокировки.
 * В .env: DATABASE_URL = pooled (для приложения), DIRECT_URL = direct (для CLI).
 */
const prismaCliDatabaseUrl =
  process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim();

export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  migrate: {
    adapter: async () => {
      const { PrismaPg } = await import('@prisma/adapter-pg');
      const { Pool } = await import('pg');
      if (!prismaCliDatabaseUrl) {
        throw new Error('DATABASE_URL or DIRECT_URL must be set for Prisma CLI');
      }
      const pool = new Pool(getPgPoolConfig(prismaCliDatabaseUrl));
      return new PrismaPg(pool);
    },
  },
  datasource: {
    url: prismaCliDatabaseUrl,
  },
});
