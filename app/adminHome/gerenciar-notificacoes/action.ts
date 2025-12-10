"use server";

import { sql } from "@vercel/postgres";

// Envio manual (usa API)
export async function sendPushManual(data: any) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/push/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return await response.json();
}

// Agendamento
export async function schedulePushAction(data: any) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/push/schedule`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return await response.json();
}

// Buscar notificações agendadas
export async function getScheduledNotifications() {
  const { rows } = await sql`
    SELECT *
    FROM push_notifications
    WHERE scheduled_at IS NOT NULL
    ORDER BY scheduled_at ASC;
  `;
  return rows;
}

// Buscar notificações enviadas (últimas 50)
export async function getSentNotifications() {
  const { rows } = await sql`
    SELECT *
    FROM push_notifications
    WHERE sent_at IS NOT NULL
    ORDER BY sent_at DESC
    LIMIT 50;
  `;
  return rows;
}
