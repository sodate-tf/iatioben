// app/sitemap-en.xml/route.ts
import { NextResponse } from "next/server";

const SITE_URL = "https://www.iatioben.com.br";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function slugFromDate(d: Date) {
  const dd = pad2(d.getDate());
  const mm = pad2(d.getMonth() + 1);
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function isoDate(d: Date) {
  // YYYY-MM-DD
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  return `${yyyy}-${mm}-${dd}`;
}

function urlNode(loc: string, lastmod?: string, changefreq?: string, priority?: string) {
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

export async function GET() {
  const now = new Date();
  const year = now.getFullYear();

  // normalize base dates to midday to reduce DST edge cases
  const start = new Date(year, 0, 1, 12, 0, 0);
  const end = new Date(year + 1, 0, 1, 12, 0, 0);

  const urls: string[] = [];

  // --- EN Static pages (your structure in the screenshot) ---
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

  // --- All daily pages for the year (dd-mm-yyyy) ---
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    const slug = slugFromDate(d);
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
      // Cache ok; ajuste se quiser mais agressivo
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
