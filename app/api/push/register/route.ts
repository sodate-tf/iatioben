// app/api/push/register/route.ts

import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// 👉 Essa rota NÃO precisa de export const config
// pois não lida com multipart nem upload

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Token obrigatório." },
        { status: 400 }
      );
    }

    // ✅ Evita duplicação automaticamente (token é UNIQUE)
    await sql`
      INSERT INTO push_tokens (expo_token)
      VALUES (${token})
      ON CONFLICT (expo_token) DO NOTHING;
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao registrar token de push:", error);

    return NextResponse.json(
      { error: "Falha ao registrar token." },
      { status: 500 }
    );
  }
}
