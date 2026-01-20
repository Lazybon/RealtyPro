import { NextRequest, NextResponse } from "next/server";
import * as client from "openid-client";
import { getIronSession, SessionOptions } from "iron-session";
import { prisma } from "@/lib/prisma";

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
  
  try {
    const tokens = await client.authorizationCodeGrant(config, new URL(request.url), {
      expectedState: client.skipStateCheck,
    });
    
    const claims = tokens.claims();
    if (!claims || !claims.sub) {
      return NextResponse.redirect(`${protocol}://${host}/?error=no_claims`);
    }
    
    await prisma.user.upsert({
      where: { id: claims.sub },
      update: {
        email: claims.email as string | undefined,
        firstName: claims.first_name as string | undefined,
        lastName: claims.last_name as string | undefined,
        profileImageUrl: claims.profile_image_url as string | undefined,
        updatedAt: new Date(),
      },
      create: {
        id: claims.sub,
        email: claims.email as string | undefined,
        firstName: claims.first_name as string | undefined,
        lastName: claims.last_name as string | undefined,
        profileImageUrl: claims.profile_image_url as string | undefined,
      },
    });
    
    const response = NextResponse.redirect(`${protocol}://${host}/`);
    
    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    session.userId = claims.sub;
    session.accessToken = tokens.access_token;
    session.refreshToken = tokens.refresh_token;
    session.expiresAt = claims.exp;
    session.claims = {
      sub: claims.sub,
      email: claims.email as string | undefined,
      first_name: claims.first_name as string | undefined,
      last_name: claims.last_name as string | undefined,
      profile_image_url: claims.profile_image_url as string | undefined,
    };
    await session.save();
    
    return response;
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(`${protocol}://${host}/?error=auth_failed`);
  }
}
