// app/sitemap.xml.tsx
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const baseUrl = "https://www.iatioben.com.br";
  const today = new Date();

  // Formata data para dd-mm-yyyy
  const formatDate = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  // Gera URLs de liturgia: 3 dias antes até 14 dias depois
  const liturgiaUrls: string[] = [];
  for (let i = -3; i <= 14; i++) {
    const d = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    liturgiaUrls.push(`${baseUrl}/liturgia-diaria/${formatDate(d)}`);
  }

  const urls = [
    `${baseUrl}/`, // Página principal
    ...liturgiaUrls,
  ];

  // Gera XML do sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${today.toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${url === baseUrl + "/" ? "1.0" : "0.8"}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
