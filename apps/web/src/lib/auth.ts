import * as client from "openid-client";
import { getIronSession, SessionOptions, IronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  userId?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
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

let oidcConfig: Awaited<ReturnType<typeof client.discovery>> | null = null;

export async function getOidcConfig() {
  if (!oidcConfig) {
    oidcConfig = await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  }
  return oidcConfig;
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session.userId || !session.claims) {
    return null;
  }
  
  const now = Math.floor(Date.now() / 1000);
  if (session.expiresAt && now > session.expiresAt) {
    if (session.refreshToken) {
      try {
        const config = await getOidcConfig();
        const tokenResponse = await client.refreshTokenGrant(config, session.refreshToken);
        session.accessToken = tokenResponse.access_token;
        session.refreshToken = tokenResponse.refresh_token;
        session.expiresAt = tokenResponse.claims()?.exp;
        session.claims = tokenResponse.claims() as SessionData["claims"];
        await session.save();
      } catch {
        await session.destroy();
        return null;
      }
    } else {
      await session.destroy();
      return null;
    }
  }
  
  return {
    id: session.userId,
    email: session.claims?.email,
    firstName: session.claims?.first_name,
    lastName: session.claims?.last_name,
    profileImageUrl: session.claims?.profile_image_url,
  };
}
