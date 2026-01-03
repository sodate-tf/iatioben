// app/sitemap/route.ts (ou onde estiver seu GET do sitemap)
import { NextResponse } from "next/server";
import { getPublishedPostsForSitemapAction } from "@/app/adminTioBen/actions/postAction";

interface SitemapUrl {
  url: string;
  date: Date;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: string;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toLastmod(d: Date) {
  // recomendado pelo padrão do sitemap: YYYY-MM-DD
  return d.toISOString().slice(0, 10);
}

export async function GET(): Promise<NextResponse> {
  const baseUrl = "https://www.iatioben.com.br";
  const today = new Date();

  const formatDateUrl = (date: Date): string => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const sitemapUrls: SitemapUrl[] = [];

  // ✅ 1) HOME
  sitemapUrls.push({
    url: `${baseUrl}/`,
    date: today,
    changefreq: "daily",
    priority: "1.0",
  });

  // ✅ 2) LITURGIA (raiz + datas suportadas)
  sitemapUrls.push({
    url: `${baseUrl}/liturgia-diaria`,
    date: today,
    changefreq: "daily",
    priority: "0.95",
  });

  // somente o período suportado pela API (-3 até +14)
  for (let i = -3; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    sitemapUrls.push({
      url: `${baseUrl}/liturgia-diaria/${formatDateUrl(d)}`,
      date: d,
      changefreq: "daily",
      priority: "0.9",
    });
  }

  // ✅ 3) TERÇO (rotas existentes + HUB)
  const rosaryPages: Array<{
    path: string;
    priority: string;
    changefreq: SitemapUrl["changefreq"];
  }> = [
    { path: "/santo-terco", priority: "0.95", changefreq: "daily" },

    // HUB do Terço
    { path: "/santo-terco/como-rezar-o-terco", priority: "0.92", changefreq: "weekly" },

    // Páginas dos mistérios
    { path: "/santo-terco/misterios-gozosos", priority: "0.9", changefreq: "weekly" },
    { path: "/santo-terco/misterios-dolorosos", priority: "0.9", changefreq: "weekly" },
    { path: "/santo-terco/misterios-gloriosos", priority: "0.9", changefreq: "weekly" },
    { path: "/santo-terco/misterios-luminosos", priority: "0.9", changefreq: "weekly" },
  ];

  for (const p of rosaryPages) {
    sitemapUrls.push({
      url: `${baseUrl}${p.path}`,
      date: today,
      changefreq: p.changefreq,
      priority: p.priority,
    });
  }

  // ✅ 4) BLOG (posts publicados)
  try {
    const blogPosts = await getPublishedPostsForSitemapAction();

    for (const post of blogPosts) {
      const slug = typeof post.slug === "string" ? post.slug.trim() : "";
      if (!slug) continue;

      const updatedAtRaw = (post as any).updatedAt ?? (post as any).createdAt;
      const lastDate = updatedAtRaw ? new Date(updatedAtRaw) : today;

      sitemapUrls.push({
        url: `${baseUrl}/blog/${slug}`,
        date: lastDate,
        changefreq: "weekly",
        priority: "0.7",
      });
    }
  } catch (error) {
    console.error("[SITEMAP] Erro ao buscar posts:", error);
  }

  // ✅ 5) REMOVER DUPLICADOS (mantém o lastmod mais recente)
  const unique = new Map<string, SitemapUrl>();
  for (const item of sitemapUrls) {
    const existing = unique.get(item.url);
    if (!existing || existing.date < item.date) unique.set(item.url, item);
  }
  const urls = Array.from(unique.values());

  // ✅ 6) GERAR XML (corrigido e com escape)
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
