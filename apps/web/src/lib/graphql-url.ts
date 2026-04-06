/**
 * URL GraphQL для Route Handlers / серверного кода.
 *
 * Задавайте на Vercel (Production): INTERNAL_GRAPHQL_URL или GRAPHQL_URL — читаются в runtime.
 * Можно продублировать значение NEXT_PUBLIC_GRAPHQL_URL; без INTERNAL/GRAPHQL server routes
 * часто остаются на localhost.
 */
function stripQuotes(s: string): string {
  const t = s.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1).trim();
  }
  return t;
}

export function getServerGraphqlUrl(): string {
  const raw = stripQuotes(
    process.env.INTERNAL_GRAPHQL_URL ||
      process.env.GRAPHQL_URL ||
      process.env.NEXT_PUBLIC_GRAPHQL_URL ||
      "",
  ).replace(/\/$/, "");

  if (!raw) {
    return "http://localhost:4000/graphql";
  }

  const url = raw.endsWith("/graphql") ? raw : `${raw}/graphql`;

  if (
    process.env.VERCEL === "1" &&
    process.env.NODE_ENV === "production" &&
    (url.includes("127.0.0.1") || url.includes("localhost"))
  ) {
    console.error(
      "[graphql-url] Задайте INTERNAL_GRAPHQL_URL или GRAPHQL_URL в Vercel → Environment Variables (Production).",
    );
  }

  return url;
}
