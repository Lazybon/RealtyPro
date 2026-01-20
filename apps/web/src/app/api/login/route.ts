import { NextRequest, NextResponse } from "next/server";
import * as client from "openid-client";
import { getOidcConfig } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const config = await getOidcConfig();
  const host = request.headers.get("host") || "localhost:5000";
  const protocol = host.includes("localhost") ? "http" : "https";
  
  const code_verifier = client.randomPKCECodeVerifier();
  const code_challenge = await client.calculatePKCECodeChallenge(code_verifier);
  
  const authUrl = client.buildAuthorizationUrl(config, {
    redirect_uri: `${protocol}://${host}/api/callback`,
    scope: "openid email profile offline_access",
    prompt: "login consent",
    code_challenge,
    code_challenge_method: "S256",
  });
  
  const response = NextResponse.redirect(authUrl.href);
  
  response.cookies.set("pkce_code_verifier", code_verifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10,
    path: "/",
  });
  
  return response;
}
