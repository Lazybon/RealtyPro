import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/auth";

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000";

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email и пароль обязательны" },
        { status: 400 }
      );
    }

    const graphqlResponse = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation Register($input: RegisterInput!) {
            register(input: $input) {
              user {
                id
                email
                firstName
                lastName
                profileImageUrl
              }
              token
            }
          }
        `,
        variables: {
          input: { email, password, firstName, lastName },
        },
      }),
    });

    const data = await graphqlResponse.json();

    if (data.errors) {
      return NextResponse.json(
        { error: data.errors[0]?.message || "Ошибка регистрации" },
        { status: 400 }
      );
    }

    const { user, token } = data.data.register;

    const response = NextResponse.json({ success: true, user });
    
    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    session.userId = user.id;
    session.claims = {
      sub: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      profile_image_url: user.profileImageUrl,
    };
    await session.save();

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
