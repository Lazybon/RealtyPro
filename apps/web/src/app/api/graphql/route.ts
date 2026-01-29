import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

const GRAPHQL_URL = process.env.INTERNAL_GRAPHQL_URL || "http://localhost:4000/graphql";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    
    const session = await getSession();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    if (session.userId) {
      headers["x-user-id"] = session.userId;
    }
    
    const graphqlResponse = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers,
      body,
    });

    const data = await graphqlResponse.text();
    
    return new NextResponse(data, {
      status: graphqlResponse.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("GraphQL proxy error:", error);
    return NextResponse.json(
      { errors: [{ message: "Failed to connect to GraphQL server" }] },
      { status: 503 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "GraphQL endpoint - use POST requests" },
    { status: 200 }
  );
}
