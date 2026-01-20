import { NextRequest, NextResponse } from "next/server";
import * as client from "openid-client";
import { getIronSession, SessionOptions } from "iron-session";

interface SessionData {
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

const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "realtypro_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
  },
};

let oidcConfig: Awaited<ReturnType<typeof client.discovery>> | null = null;

async function getOidcConfig() {
  if (!oidcConfig) {
    oidcConfig = await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  }
  return oidcConfig;
}

export async function GET(request: NextRequest) {
  const config = await getOidcConfig();
  const host = request.headers.get("host") || "localhost:5000";
  const protocol = host.includes("localhost") ? "http" : "https";
  
  const endSessionUrl = client.buildEndSessionUrl(config, {
    client_id: process.env.REPL_ID!,
    post_logout_redirect_uri: `${protocol}://${host}`,
  });
  
  const response = NextResponse.redirect(endSessionUrl.href);
  
  const session = await getIronSession<SessionData>(request, response, sessionOptions);
  session.destroy();
  
  return response;
}
