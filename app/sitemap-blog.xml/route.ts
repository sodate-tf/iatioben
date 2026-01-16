// app/sitemap-blog.xml/route.ts
import { NextResponse } from "next/server";
import { getPublishedPostsForSitemapAction } from "@/app/adminTioBen/actions/postAction";

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
  return d.toISOString().slice(0, 10);
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

function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function toCategorySlug(name: string) {
  return normalize(name).replace(/\s+/g, "-");
}

// ✅ Mapa real (UUID -> nome)
const CATEGORY_BY_ID: Record<string, string> = {
  "388b79e9-4a3a-4f9a-968c-2737cff74cce": "Liturgia",
  "7e0577dc-36c8-4f9d-b476-97af9dc1a077": "Homilia",
  "81f79787-be83-420f-b214-6b243da21cda": "Notícias",
  "ae6cd3b7-dbc9-4df2-bf7c-c372d6b7fe5a": "Cotidiano",
  "ba7adc02-de35-4405-b3f3-7391947d6281": "Santos",
  "da37f657-b94e-485f-be57-468815d712bd": "Terço",
};

export async function GET(): Promise<NextResponse> {
  const todaySP = getTodayInSaoPaulo();

  const sitemapUrls: SitemapUrl[] = [];

  // 1) Páginas “fixas” do blog
  sitemapUrls.push(
    {
      url: `${BASE_URL}/blog`,
      date: todaySP,
      changefreq: "daily",
      priority: "0.9",
    },
    {
      url: `${BASE_URL}/blog/posts`,
      date: todaySP,
      changefreq: "daily",
      priority: "0.8",
    }
  );

  // 2) Categorias (somente as “reais”)
  const categoryNames = Array.from(new Set(Object.values(CATEGORY_BY_ID)));
  for (const name of categoryNames) {
    const slug = toCategorySlug(name);
    sitemapUrls.push({
      url: `${BASE_URL}/blog/categoria/${slug}`,
      date: todaySP,
      changefreq: "daily",
      priority: "0.75",
    });
  }

  // 3) Posts
  try {
    const blogPosts = await getPublishedPostsForSitemapAction();

    for (const post of blogPosts) {
      const slug = typeof post.slug === "string" ? post.slug.trim() : "";
      if (!slug) continue;

      const updatedAtRaw = (post as any).updatedAt ?? (post as any).createdAt;
      const publishRaw = (post as any).publishDate ?? (post as any).createdAt;

      const lastDate = updatedAtRaw ? new Date(updatedAtRaw) : publishRaw ? new Date(publishRaw) : todaySP;

      sitemapUrls.push({
        url: `${BASE_URL}/blog/${slug}`,
        date: lastDate,
        changefreq: "weekly",
        priority: "0.7",
      });
    }
  } catch (error) {
    console.error("[SITEMAP-BLOG] Erro ao buscar posts:", error);
  }

  // 4) Dedupe (mantém lastmod mais recente)
  const unique = new Map<string, SitemapUrl>();
  for (const item of sitemapUrls) {
    const existing = unique.get(item.url);
    if (!existing || existing.date < item.date) unique.set(item.url, item);
  }

  const urls = Array.from(unique.values());

  // 5) XML
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
