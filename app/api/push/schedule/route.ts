// app/api/push/schedule/route.ts

import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { title, body: message, type, payload, scheduledAt } = body;

    // ✅ Validações mínimas
    if (!title || !message || !type || !scheduledAt) {
      return NextResponse.json(
        { error: "Título, mensagem, tipo e data de agendamento são obrigatórios." },
        { status: 400 }
      );
    }

    // ✅ Insere no banco já no padrão Neon
    await sql`
      INSERT INTO push_notifications (
        title,
        body,
        type,
        payload,
        scheduled_at
      )
      VALUES (
        ${title},
        ${message},
        ${type},
        ${payload ? JSON.stringify(payload) : null},
        ${scheduledAt}
      );
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao agendar notificação:", error);

    return NextResponse.json(
      { error: "Falha ao agendar notificação." },
      { status: 500 }
    );
  }
}
