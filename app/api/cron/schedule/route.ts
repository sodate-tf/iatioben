// app/api/cron/scheduled/route.ts

import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { sendPushNotification } from "@/app/services/pushServices";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Busca notificações pendentes
    const { rows: pendentes } = await sql`
      SELECT * FROM push_notifications
      WHERE scheduled_at IS NOT NULL
      AND sent_at IS NULL
      AND scheduled_at <= NOW();
    `;

    if (pendentes.length === 0) {
      return NextResponse.json({ success: true, pending: 0 });
    }

    // Busca tokens uma única vez
    const { rows: tokens } = await sql`
      SELECT expo_token FROM push_tokens;
    `;

    for (const notif of pendentes) {
      for (const t of tokens) {
        await sendPushNotification({
          to: t.expo_token,
          title: notif.title,
          body: notif.body,
          data: {
            type: notif.type,
            ...(notif.payload ? JSON.parse(notif.payload) : {})
          }
        });
      }

      // Marca como enviada
      await sql`
        UPDATE push_notifications
        SET sent_at = NOW()
        WHERE id = ${notif.id};
      `;
    }

    return NextResponse.json({
      success: true,
      executed: pendentes.length,
      sentTo: tokens.length
    });
  } catch (error) {
    console.error("Erro cron scheduled:", error);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}
