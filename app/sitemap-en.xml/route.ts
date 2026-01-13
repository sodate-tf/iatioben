// app/sitemap-en.xml/route.ts
import { NextResponse } from "next/server";

const SITE_URL = "https://www.iatioben.com.br";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * EN day slugs: MM-DD-YYYY (matches /en/daily-mass-readings/[data])
 */
function slugFromDateUS(d: Date) {
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  const yyyy = d.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
}

function isoDate(d: Date) {
  // YYYY-MM-DD
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  return `${yyyy}-${mm}-${dd}`;
}

function urlNode(
  loc: string,
  lastmod?: string,
  changefreq?: string,
  priority?: string
) {
  return [
    "<url>",
    `<loc>${loc}</loc>`,
    lastmod ? `<lastmod>${lastmod}</lastmod>` : "",
    changefreq ? `<changefreq>${changefreq}</changefreq>` : "",
    priority ? `<priority>${priority}</priority>` : "",
    "</url>",
  ]
    .filter(Boolean)
    .join("");
}

/**
 * Get "today" in America/Sao_Paulo to avoid year mismatch around midnight UTC.
 */
function getTodaySaoPauloYMD() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const yyyy = Number(parts.find((p) => p.type === "year")?.value);
  const mm = Number(parts.find((p) => p.type === "month")?.value);
  const dd = Number(parts.find((p) => p.type === "day")?.value);

  if (!Number.isFinite(yyyy) || !Number.isFinite(mm) || !Number.isFinite(dd)) {
    const now = new Date();
    return { yyyy: now.getFullYear(), mm: now.getMonth() + 1, dd: now.getDate() };
  }

  return { yyyy, mm, dd };
}

export async function GET() {
  // Use Sao Paulo date for consistent year boundaries
  const year = 2026;

  // normalize base dates to midday to reduce DST edge cases
  const start = new Date(year, 0, 1, 12, 0, 0);
  const end = new Date(year + 1, 0, 1, 12, 0, 0);

  const now = new Date();
  const urls: string[] = [];

  // --- EN Static pages ---
  urls.push(
    urlNode(`${SITE_URL}/en`, isoDate(now), "daily", "1.0"),
    urlNode(`${SITE_URL}/en/how-to-use-the-liturgy`, isoDate(now), "monthly", "0.9"),
    urlNode(`${SITE_URL}/en/liturgical-year`, isoDate(now), "monthly", "0.9"),
    urlNode(`${SITE_URL}/en/mass-readings-guide`, isoDate(now), "monthly", "0.9"),
    urlNode(`${SITE_URL}/en/pray-with-the-liturgy-in-5-minutes`, isoDate(now), "monthly", "0.9"),
    urlNode(`${SITE_URL}/en/daily-mass-readings-vs-gospel-of-the-day`, isoDate(now), "monthly", "0.9")
  );

  // --- Hubs ---
  urls.push(
    urlNode(`${SITE_URL}/en/daily-mass-readings`, isoDate(now), "daily", "0.8"),
    urlNode(`${SITE_URL}/en/daily-mass-readings/year/${year}`, isoDate(now), "weekly", "0.7")
  );

  // --- Month hubs (1..12) ---
  for (let m = 1; m <= 12; m++) {
    urls.push(
      urlNode(
        `${SITE_URL}/en/daily-mass-readings/year/${year}/${pad2(m)}`,
        isoDate(now),
        "weekly",
        "0.6"
      )
    );
  }

  // --- All daily pages for the year (MM-DD-YYYY) ---
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    const slug = slugFromDateUS(d);
    const lastmod = isoDate(d);

    urls.push(
      urlNode(
        `${SITE_URL}/en/daily-mass-readings/${slug}`,
        lastmod,
        "weekly",
        "0.5"
      )
    );
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls.join("") +
    `</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
