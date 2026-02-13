// app/sitemap-webstories.xml/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  // ✅ Ano vigente (ex: 2026). Ano que vem vira 2027 automaticamente.
  const year = new Date().getFullYear();

  // ✅ Intervalo completo do ano vigente (inclui bissexto automaticamente)
  // Usando UTC pra evitar "pular dia" por timezone/DST.
  const start = new Date(Date.UTC(year, 0, 1, 12, 0, 0)); // 01/01
  const end = new Date(Date.UTC(year, 11, 31, 12, 0, 0)); // 31/12

  const urls: Array<{ loc: string; lastmod: string }> = [];

  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    // Monta ISO usando UTC (estável)
    const iso = `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(
      d.getUTCDate()
    )}`;

    const slugDate = isoToSlug(iso);

    // ✅ Web Story diária
    const loc = `${site}/web-stories/liturgia-${slugDate}/`;

    urls.push({ loc, lastmod: iso });
  }

  const xml = buildUrlset(urls);

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
