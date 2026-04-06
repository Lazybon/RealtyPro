/**
 * URL GraphQL для Route Handlers / серверного кода.
 *
 * Next может задать NEXT_PUBLIC_* пустой строкой при сборке; loadEnvConfig тогда
 * не перезаписывает ключ. Читаем fallback с диска (.env / .env.local).
 * Хост без схемы (railway.app) дополняем до https://
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadEnvConfig } from '@next/env';

let didLoadDotenv = false;
let diskEnvCache: Record<string, string> | null = null;

function ensureEnvLoaded() {
  if (didLoadDotenv) return;
  didLoadDotenv = true;
  const monorepoRoot = path.resolve(process.cwd(), '../..');
  loadEnvConfig(monorepoRoot);
  loadEnvConfig(process.cwd());
}

function parseDotenvFile(filePath: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!fs.existsSync(filePath)) return out;
  const text = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function mergeEnvFromDisk(): Record<string, string> {
  const merged: Record<string, string> = {};
  const monorepoRoot = path.resolve(process.cwd(), '../..');
  const dirs = [monorepoRoot, process.cwd()];
  for (const dir of dirs) {
    Object.assign(merged, parseDotenvFile(path.join(dir, '.env')));
    Object.assign(merged, parseDotenvFile(path.join(dir, '.env.local')));
  }
  return merged;
}

function getDiskEnv(): Record<string, string> {
  if (!diskEnvCache) diskEnvCache = mergeEnvFromDisk();
  return diskEnvCache;
}

/** Любая переменная из process (после loadEnvConfig) или с диска (.env / .env.local). Только для Node (Route Handlers). */
export function getMonorepoEnv(key: string): string | undefined {
  ensureEnvLoaded();
  const fromProc = process.env[key]?.trim();
  if (fromProc) return fromProc;
  const v = getDiskEnv()[key]?.trim();
  return v || undefined;
}

function stripQuotes(s: string): string {
  const t = s.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1).trim();
  }
  return t;
}

function pickGraphqlRaw(): string {
  const keys = ['INTERNAL_GRAPHQL_URL', 'GRAPHQL_URL', 'NEXT_PUBLIC_GRAPHQL_URL'] as const;

  const fromProcess = () => {
    for (const k of keys) {
      const v = process.env[k]?.trim();
      if (v) return v;
    }
    return '';
  };

  let raw = fromProcess();
  if (!raw) {
    const disk = getDiskEnv();
    for (const k of keys) {
      const v = disk[k]?.trim();
      if (v) {
        raw = v;
        break;
      }
    }
  }

  return stripQuotes(raw);
}

function toAbsoluteGraphqlUrl(raw: string): string {
  let s = raw.replace(/\/$/, '');
  if (!s) return '';

  if (!/^https?:\/\//i.test(s)) {
    s = `https://${s}`;
  }

  return s.endsWith('/graphql') ? s : `${s}/graphql`;
}

export function getServerGraphqlUrl(): string {
  ensureEnvLoaded();

  const url = toAbsoluteGraphqlUrl(pickGraphqlRaw());

  if (!url) {
    return 'http://localhost:4000/graphql';
  }

  if (
    process.env['VERCEL'] === '1' &&
    process.env['NODE_ENV'] === 'production' &&
    (url.includes('127.0.0.1') || url.includes('localhost'))
  ) {
    console.error(
      "[graphql-url] Задайте INTERNAL_GRAPHQL_URL или GRAPHQL_URL в Vercel → Environment Variables (Production).",
    );
  }

  return url;
}
