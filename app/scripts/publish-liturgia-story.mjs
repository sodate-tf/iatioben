import path from "node:path";
import { readText, writeText, ensureDir, applyTemplate } from "./lib/utils.mjs";
import { renderPagesHtml } from "./lib/render-amp-story.mjs";

const isoDate = process.argv[2];
if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
  console.error("Uso: node scripts/publish-liturgia-story.mjs YYYY-MM-DD");
  process.exit(1);
}

const SITE_URL = process.env.SITE_URL || "https://www.iatioben.com.br";
const STORY_API_URL =
  process.env.STORY_LITURGIA_API_URL ||
  `${SITE_URL.replace(/\/$/, "")}/api/web-stories/liturgia/${isoDate}`;

const templatePath = path.resolve("scripts/templates/amp-story.template.html");
const template = await readText(templatePath);

// 1) Buscar JSON do story via API
const story = await fetchJson(STORY_API_URL);

// 2) Renderizar HTML AMP
const pagesHtml = renderPagesHtml(story);
const jsonLd = buildJsonLd(story);

const html = applyTemplate(template, {
  lang: story.lang,
  title: story.title,
  description: story.description,
  canonicalUrl: story.canonicalUrl,
  storyUrl: story.storyUrl,
  publisherName: story.publisherName,
  publisherLogoSrc: story.publisherLogoSrc,
  posterSrc: story.poster?.src,
  pagesHtml,
  jsonLd: JSON.stringify(jsonLd)
});

// 3) Publicar em /public/web-stories/<slug>/index.html
const outDir = path.resolve("public", "web-stories", story.slug);
await ensureDir(outDir);

await writeText(path.join(outDir, "index.html"), html);
await writeText(path.join(outDir, "story.json"), JSON.stringify(story, null, 2));

console.log(`OK: publicado ${story.storyUrl}`);
console.log(`Arquivos: ${outDir}/index.html e story.json`);

async function fetchJson(url) {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Falha ao buscar Story JSON ${res.status}: ${url}\n${txt.slice(0, 300)}`);
  }
  return res.json();
}

function buildJsonLd(story) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.description,
    image: [story.poster?.src].filter(Boolean),
    mainEntityOfPage: story.storyUrl,
    publisher: {
      "@type": "Organization",
      name: story.publisherName,
      logo: { "@type": "ImageObject", url: story.publisherLogoSrc }
    }
  };
}
