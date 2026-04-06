import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getServerGraphqlUrl } from "@/lib/graphql-url";

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
    
    const graphqlResponse = await fetch(getServerGraphqlUrl(), {
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
