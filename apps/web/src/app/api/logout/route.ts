import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { getSessionOptions, SessionData } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const host = request.headers.get("host") || "localhost:5000";
  const protocol = host.includes("localhost") ? "http" : "https";
  
  const response = NextResponse.redirect(`${protocol}://${host}/`);
  
  const session = await getIronSession<SessionData>(request, response, getSessionOptions());
  session.destroy();
  
  return response;
}

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  
  const session = await getIronSession<SessionData>(request, response, getSessionOptions());
  session.destroy();
  
  return response;
}
