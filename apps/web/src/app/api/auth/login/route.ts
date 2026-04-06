import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { getSessionOptions, SessionData } from "@/lib/auth";
import { getServerGraphqlUrl } from "@/lib/graphql-url";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email и пароль обязательны" },
        { status: 400 }
      );
    }

    const graphqlUrl = getServerGraphqlUrl();

    let graphqlResponse;
    try {
      graphqlResponse = await fetch(graphqlUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation Login($input: LoginInput!) {
              login(input: $input) {
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
            input: { email, password },
          },
        }),
      });
    } catch (networkError) {
      console.error("Network error during login:", graphqlUrl, networkError);
      return NextResponse.json(
        { error: "Не удалось подключиться к серверу авторизации" },
        { status: 503 }
      );
    }

    const data = await graphqlResponse.json();

    if (data.errors) {
      return NextResponse.json(
        { error: data.errors[0]?.message || "Ошибка входа" },
        { status: 401 }
      );
    }

    if (!data.data?.login?.user || !data.data?.login?.token) {
      return NextResponse.json(
        { error: "Неверный ответ от сервера авторизации" },
        { status: 500 }
      );
    }

    const { user, token } = data.data.login;

    const response = NextResponse.json({ success: true, user });
    
    const session = await getIronSession<SessionData>(request, response, getSessionOptions());
    session.userId = user.id;
    session.accessToken = token;
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
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
