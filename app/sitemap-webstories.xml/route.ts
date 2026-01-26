// app/sitemap-webstories.xml/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Ajuste aqui o alcance do sitemap
const PAST_DAYS = 180;   // inclui stories dos últimos 180 dias
const FUTURE_DAYS = 14;  // inclui próximos 14 dias (opcional)

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toIso(d: Date) {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
}

function isoToSlug(iso: string) {
  // YYYY-MM-DD -> DD-MM-YYYY
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

function xmlEscape(s: string) {
  return (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildUrlset(urls: Array<{ loc: string; lastmod?: string }>) {
  const body = urls
    .map(
      (u) => `
  <url>
    <loc>${xmlEscape(u.loc)}</loc>
    ${u.lastmod ? `<lastmod>${xmlEscape(u.lastmod)}</lastmod>` : ""}
  </url>`.trim()
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

export async function GET() {
  const site =
    (process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.SITE_URL ||
      "https://www.iatioben.com.br").replace(/\/$/, "");

  // Base “hoje” em horário local do servidor; para estabilidade, travamos ao meio-dia.
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);

  const urls: Array<{ loc: string; lastmod: string }> = [];

  for (let i = -PAST_DAYS; i <= FUTURE_DAYS; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);

    const iso = toIso(d);
    const slugDate = isoToSlug(iso);

    // ✅ Liturgia diária (ajuste se mudar o padrão)
    const loc = `${site}/web-stories/liturgia-${slugDate}/`;

    urls.push({ loc, lastmod: iso });
  }

  const xml = buildUrlset(urls);

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // cache bom para Vercel/CDN
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
