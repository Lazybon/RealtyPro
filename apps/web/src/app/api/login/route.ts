import { NextRequest, NextResponse } from "next/server";
import * as client from "openid-client";
import { getOidcConfig } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const config = await getOidcConfig();
  const host = request.headers.get("host") || "localhost:5000";
  const protocol = host.includes("localhost") ? "http" : "https";
  
  const authUrl = client.buildAuthorizationUrl(config, {
    redirect_uri: `${protocol}://${host}/api/callback`,
    scope: "openid email profile offline_access",
    prompt: "login consent",
  });
  
  return NextResponse.redirect(authUrl.href);
}
