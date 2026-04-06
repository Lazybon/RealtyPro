import { getIronSession, SessionOptions, IronSession } from "iron-session";
import { cookies } from "next/headers";
import { getMonorepoEnv, getServerGraphqlUrl } from "@/lib/graphql-url";

export interface SessionData {
  userId?: string;
  accessToken?: string;
  claims?: {
    sub: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    profile_image_url?: string;
  };
}

let sessionOptionsCache: SessionOptions | null = null;

export function getSessionOptions(): SessionOptions {
  if (sessionOptionsCache) return sessionOptionsCache;

  const password = getMonorepoEnv("SESSION_SECRET");
  if (!password || password.length < 32) {
    throw new Error(
      "SESSION_SECRET отсутствует или короче 32 символов. Добавь в RealtyPro/.env.local (корень монорепы).",
    );
  }

  sessionOptionsCache = {
    password,
    cookieName: "realtypro_session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7,
    },
  };
  return sessionOptionsCache;
}

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, getSessionOptions());
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session.userId || !session.claims || !session.accessToken) {
    return null;
  }

  let createdAt: string | null = null;
  try {
    const graphqlUrl = getServerGraphqlUrl();
    const res = await fetch(graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": session.userId,
      },
      body: JSON.stringify({
        query: `query { me { createdAt } }`,
      }),
    });
    const json = await res.json();
    if (json.data?.me?.createdAt) {
      createdAt = json.data.me.createdAt;
    }
  } catch {
    /* ignore: optional profile freshness when API is down */
  }

  return {
    id: session.userId,
    email: session.claims?.email,
    firstName: session.claims?.first_name,
    lastName: session.claims?.last_name,
    profileImageUrl: session.claims?.profile_image_url,
    createdAt,
  };
}
