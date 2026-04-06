import { getIronSession, SessionOptions, IronSession } from "iron-session";
import { cookies } from "next/headers";
import { getServerGraphqlUrl } from "@/lib/graphql-url";

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

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "realtypro_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
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
