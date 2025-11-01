import { NextResponse } from "next/server";
import { getPublishedPostsForSitemapAction } from "@/app/adminTioBen/actions/postAction";

// Tipagem
interface SitemapUrl {
  url: string;
  date: Date;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: string;
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

  // 1️⃣ Página principal
  sitemapUrls.push({
    url: `${baseUrl}/`,
    date: today,
    changefreq: "daily",
    priority: "1.0",
  });

  // 2️⃣ Liturgia diária: 3 dias antes e 14 depois
  for (let i = -3; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    sitemapUrls.push({
      url: `${baseUrl}/liturgia-diaria/${formatDateUrl(d)}`,
      date: d,
      changefreq: "daily",
      priority: "0.8",
    });
  }

  // 3️⃣ Posts do blog
  try {
    const blogPosts = await getPublishedPostsForSitemapAction();
    for (const post of blogPosts) {
      if (typeof post.slug === "string" && post.slug.trim().length > 0) {
        sitemapUrls.push({
          url: `${baseUrl}/blog/${post.slug}`,
          date: new Date(post.updatedAt ?? post.updatedAt ?? today),
          changefreq: "daily",
          priority: "0.7",
        });
      }
    }
  } catch (error) {
    console.error("[SITEMAP] Erro ao buscar posts:", error);
  }

  // 4️⃣ Gerar XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${sitemapUrls
  .map(
    (item) => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.date.toISOString()}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
