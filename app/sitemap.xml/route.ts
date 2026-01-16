// app/sitemap/route.ts
import { NextResponse } from "next/server";

interface SitemapUrl {
  url: string;
  date: Date;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: string;
}

const BASE_URL = "https://www.iatioben.com.br";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toLastmod(d: Date) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function pad2n(n: number) {
  return String(n).padStart(2, "0");
}

function formatDateSlug(date: Date) {
  const dd = pad2n(date.getDate());
  const mm = pad2n(date.getMonth() + 1);
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function daysInMonth(year: number, month1to12: number) {
  return new Date(year, month1to12, 0).getDate();
}

function* iterateAllDatesOfYear(year: number) {
  for (let m = 1; m <= 12; m++) {
    const total = daysInMonth(year, m);
    for (let d = 1; d <= total; d++) {
      yield new Date(year, m - 1, d);
    }
  }
}

function getTodayInSaoPaulo(): Date {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const y = Number(parts.find((p) => p.type === "year")?.value);
  const m = Number(parts.find((p) => p.type === "month")?.value);
  const d = Number(parts.find((p) => p.type === "day")?.value);

  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) {
    return new Date();
  }

  return new Date(y, m - 1, d);
}

export async function GET(): Promise<NextResponse> {
  const todaySP = getTodayInSaoPaulo();
  const currentYear = todaySP.getFullYear();

  /**
   * Defina aqui os anos que você quer indexar.
   * Recomendo no mínimo: ano atual + ano anterior (histórico recente).
   * Ex.: const yearsToInclude = [currentYear - 1, currentYear];
   */
  const yearsToInclude = [currentYear];

  const sitemapUrls: SitemapUrl[] = [];

  // 1) HOME
  sitemapUrls.push({
    url: `${BASE_URL}/`,
    date: todaySP,
    changefreq: "daily",
    priority: "1.0",
  });

  // 2) HUB LITURGIA
  sitemapUrls.push({
    url: `${BASE_URL}/liturgia-diaria`,
    date: todaySP,
    changefreq: "daily",
    priority: "0.95",
  });

  // 2.1) LITURGIA: ano + meses + dias
  for (const year of yearsToInclude) {
    // ano
    sitemapUrls.push({
      url: `${BASE_URL}/liturgia-diaria/ano/${year}`,
      date: new Date(year, 0, 1),
      changefreq: "weekly",
      priority: "0.9",
    });

    // meses
    for (let m = 1; m <= 12; m++) {
      sitemapUrls.push({
        url: `${BASE_URL}/liturgia-diaria/ano/${year}/${pad2n(m)}`,
        date: new Date(year, m - 1, 1),
        changefreq: "weekly",
        priority: "0.85",
      });
    }

    // dias
    const todayKey = new Date(
      currentYear,
      todaySP.getMonth(),
      todaySP.getDate()
    ).getTime();

    for (const d of iterateAllDatesOfYear(year)) {
      const slug = formatDateSlug(d);

      const isCurrentYear = year === currentYear;
      const dateKey = new Date(year, d.getMonth(), d.getDate()).getTime();
      const isPast = isCurrentYear ? dateKey < todayKey : true;

      // Estratégia:
      // - datas futuras/próximas (ano atual) => weekly/daily (descoberta rápida)
      // - passado => monthly (não força crawl)
      const changefreq: SitemapUrl["changefreq"] =
        isCurrentYear && !isPast ? "weekly" : "monthly";

      const priority =
        isCurrentYear && !isPast ? "0.85" : "0.7";

      sitemapUrls.push({
        url: `${BASE_URL}/liturgia-diaria/${slug}`,
        date: d,
        changefreq,
        priority,
      });
    }
  }

  // 3) TERÇO
  const rosaryPages: Array<{
    path: string;
    priority: string;
    changefreq: SitemapUrl["changefreq"];
  }> = [
    { path: "/santo-terco", priority: "0.95", changefreq: "weekly" },
    { path: "/santo-terco/como-rezar-o-terco", priority: "0.92", changefreq: "weekly" },
    { path: "/santo-terco/misterios-gozosos", priority: "0.9", changefreq: "monthly" },
    { path: "/santo-terco/misterios-dolorosos", priority: "0.9", changefreq: "monthly" },
    { path: "/santo-terco/misterios-gloriosos", priority: "0.9", changefreq: "monthly" },
    { path: "/santo-terco/misterios-luminosos", priority: "0.9", changefreq: "monthly" },
  ];

  for (const p of rosaryPages) {
    sitemapUrls.push({
      url: `${BASE_URL}${p.path}`,
      date: todaySP,
      changefreq: p.changefreq,
      priority: p.priority,
    });
  }

  
  // 5) DEDUPE (mantém lastmod mais recente)
  const unique = new Map<string, SitemapUrl>();
  for (const item of sitemapUrls) {
    const existing = unique.get(item.url);
    if (!existing || existing.date < item.date) unique.set(item.url, item);
  }
  const urls = Array.from(unique.values());

  // 6) XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((item) => {
    const loc = escapeXml(item.url);
    const lastmod = toLastmod(item.date);
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
