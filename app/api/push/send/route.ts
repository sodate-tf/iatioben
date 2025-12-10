// app/api/push/send/route.ts

import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { sendPushNotification } from "@/app/services/pushServices"; 
// ↑ Vamos criar isso também se você quiser

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, body: message, type, payload } = body;

    if (!title || !message || !type) {
      return NextResponse.json(
        { error: "Título, mensagem e tipo são obrigatórios." },
        { status: 400 }
      );
    }

    // 👉 Busca todos os tokens registrados
    const { rows } = await sql`
      SELECT expo_token FROM push_tokens;
    `;

    // 👉 Envia a notificação para cada token
    for (const row of rows) {
      await sendPushNotification({
        to: row.expo_token,
        title,
        body: message,
        data: {
          type,
          ...(payload || {})
        }
      });
    }

    // 👉 Registra envio no histórico
    await sql`
      INSERT INTO push_notifications (
        title,
        body,
        type,
        payload,
        sent_at
      )
      VALUES (
        ${title},
        ${message},
        ${type},
        ${payload ? JSON.stringify(payload) : null},
        NOW()
      );
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar push manual:", error);

    return NextResponse.json(
      { error: "Falha ao enviar notificação." },
      { status: 500 }
    );
  }
}
