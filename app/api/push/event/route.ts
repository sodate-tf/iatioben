import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
  try {
    const { notificationId, eventType } = await request.json();

    if (!notificationId || !eventType) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    await sql`
      INSERT INTO push_events (notification_id, event_type)
      VALUES (${notificationId}, ${eventType});
    `;

    if (eventType === "opened") {
      await sql`
        UPDATE push_notifications
        SET opened_count = opened_count + 1
        WHERE id = ${notificationId};
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro tracking push:", error);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}
