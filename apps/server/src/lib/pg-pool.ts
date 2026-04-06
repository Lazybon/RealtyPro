import type { PoolConfig } from 'pg';

/**
 * Neon и другие облачные Postgres часто требуют TLS для `pg` Pool,
 * даже если в строке уже есть sslmode=require.
 * Логика дублирует packages/database (там же для web); сервер в проде должен
 * импортировать только скомпилированный .js из своего dist, не .ts из workspace.
 */
export function getPgPoolConfig(connectionString: string): PoolConfig {
  const forceSsl = process.env.DATABASE_SSL === 'true';
  const forceNoSsl = process.env.DATABASE_SSL === 'false';
  const hostLooksManaged =
    /neon\.tech|neon\.database|supabase\.co|\.pooler\.supabase\.com|amazonaws\.com/i.test(
      connectionString,
    );

  const useSsl =
    !forceNoSsl && (forceSsl || hostLooksManaged || connectionString.includes('sslmode=require'));

  return {
    connectionString,
    ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  };
}
