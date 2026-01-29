import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

const GRAPHQL_URL = process.env.INTERNAL_GRAPHQL_URL || "http://localhost:4000/graphql";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session.userId || !session.accessToken) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Все поля обязательны" },
        { status: 400 }
      );
    }

    const graphqlResponse = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": session.userId,
      },
      body: JSON.stringify({
        query: `
          mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
            changePassword(currentPassword: $currentPassword, newPassword: $newPassword)
          }
        `,
        variables: {
          currentPassword,
          newPassword,
        },
      }),
    });

    const data = await graphqlResponse.json();

    if (data.errors) {
      return NextResponse.json(
        { error: data.errors[0]?.message || "Ошибка смены пароля" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
