// app/api/cron/liturgy/route.ts

import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { sendPushNotification } from "@/app/services/pushServices";

export const dynamic = "force-dynamic"; // garante execução no server

export async function GET() {
  try {
    // Busca tokens
    const { rows: tokens } = await sql`
      SELECT expo_token FROM push_tokens;
    `;

    // Envia push de liturgia
    for (const t of tokens) {
      await sendPushNotification({
        to: t.expo_token,
        title: "Liturgia do Dia",
        body: "A liturgia de hoje já está disponível.",
        data: { type: "liturgy" }
      });
    }

    return NextResponse.json({ success: true, sent: tokens.length });
  } catch (error) {
    console.error("Erro cron liturgia:", error);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}
