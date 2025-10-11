import { NextResponse } from "next/server";
import { getPublishedPostsForSitemapAction } from "@/app/adminTioBen/actions/postAction"; // Ajuste o caminho conforme sua estrutura

// Tipagem para a rota sitemap
interface SitemapUrl {
  url: string;
  date: Date;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: "1.0" | "0.9" | "0.8" | "0.7" | "0.6" | "0.5" | "0.4" | "0.3" | "0.2" | "0.1" | "0.0";
}

export async function GET(): Promise<NextResponse> {
  const baseUrl: string = "https://www.iatioben.com.br";
  const today: Date = new Date();

  // Função auxiliar para formatar datas no padrão dd-mm-yyyy para as URLs de liturgia
  const formatDateUrl = (date: Date): string => {
    const dd: string = String(date.getDate()).padStart(2, "0");
    const mm: string = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy: number = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const sitemapUrls: SitemapUrl[] = [];

  // 1. URLs estáticas (Home)
  sitemapUrls.push({
    url: `${baseUrl}/`,
    date: today,
    changefreq: "daily",
    priority: "1.0",
  });

  // 2. URLs da liturgia: de 3 dias antes até 14 dias depois
  for (let i = -3; i <= 14; i++) {
    const d: Date = new Date(today);
    d.setDate(today.getDate() + i);

    sitemapUrls.push({
      url: `${baseUrl}/liturgia-diaria/${formatDateUrl(d)}`,
      date: d,
      changefreq: "daily",
      priority: "0.8",
    });
  }

  // 3. URLs dos posts do blog (Busca Assíncrona e Tipada)
  try {
    const blogPosts = await getPublishedPostsForSitemapAction();
    
    blogPosts.forEach((post) => {
      // Validação de dados de postagem: o slug deve existir e ser uma string válida
      if (typeof post.slug === 'string' && post.slug.length > 0) {
        sitemapUrls.push({
          url: `${baseUrl}/blog/${post.slug}`,
          date: post.updatedAt,
          changefreq: "daily",
          priority: "0.7",
        });
      }
    });
  } catch (error) {
    // Logar o erro, mas permitir que o sitemap seja gerado sem os posts
    console.error("Falha ao adicionar posts do blog ao sitemap:", error);
  }

  // Gera XML do sitemap
  const sitemap: string = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapUrls
    .map(
      (item: SitemapUrl) => `<url>
    <loc>${item.url}</loc>
    <lastmod>${item.date.toISOString()}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
    )
    .join("\n")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}