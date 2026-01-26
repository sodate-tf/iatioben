// app/web-stories/[slug]/route.ts
import { NextRequest } from "next/server";
import { fetchLiturgiaByIsoDate } from "@/lib/liturgia/api";
import { buildLiturgiaStory } from "@/app/lib/web-stories/liturgia-story-builder";
import { buildTercoStoryJson } from "@/app/lib/web-stories/terco-story-builder";
import type { StoryPage } from "@/app/lib/web-stories/story-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** ✅ Tipo mínimo comum (Liturgia e Terço) para o renderer AMP */
type StoryJsonCommon = {
  lang: string;
  date: string; // yyyy-mm-dd
  title: string;
  description: string;
  canonicalUrl: string;
  storyUrl: string;

  publisherName: string;
  publisherLogoSrc: string;

  poster: { src: string; alt: string; width?: number; height?: number };

  pages: StoryPage[];
};

function htmlEscape(s: string) {
  return (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** ✅ valida YYYY-MM-DD e garante que a data existe */
function isValidIsoDate(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d, 12, 0, 0);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

function parseSlug(slug: string): { kind: "liturgia" | "terco"; isoDate: string } | null {
  // esperado: liturgia-26-01-2026  OU  terco-26-01-2026
  const m = slug.match(/^(liturgia|terco)-(\d{2})-(\d{2})-(\d{4})$/);
  if (!m) return null;

  const [, kind, dd, mm, yyyy] = m;
  const isoDate = `${yyyy}-${mm}-${dd}`;

  if (!isValidIsoDate(isoDate)) return null;

  return { kind: kind as "liturgia" | "terco", isoDate };
}

function renderPagesHtml(story: StoryJsonCommon) {
  const pages = story.pages ?? [];
  return pages
    .map((p, idx) => {
      const pageNumber = idx + 1;
      const id = htmlEscape(p.id || `p${pageNumber}`);
      const themeClass = p.theme === "light" ? "theme-light" : "theme-dark";

      const bgSrc = htmlEscape(p.background?.src || story.poster?.src || "");
      const bgAlt = htmlEscape(p.background?.alt || story.poster?.alt || story.title || "Background");

      const heading = htmlEscape(p.heading || "");
      const subheading = p.subheading ? htmlEscape(p.subheading) : "";
      const reference = p.reference ? htmlEscape(p.reference) : "";
      const text = p.text ? htmlEscape(p.text) : "";
      const quote = p.quote ? htmlEscape(p.quote) : "";
      const refrain = p.refrain ? htmlEscape(p.refrain) : "";
      const prayer = p.prayer ? htmlEscape(p.prayer) : "";

      const bullets = Array.isArray(p.bullets) ? p.bullets.slice(0, 5) : [];
      const bulletsHtml = bullets.length
        ? `<ul class="bullets">${bullets.map((b) => `<li>${htmlEscape(String(b))}</li>`).join("")}</ul>`
        : "";

      const ctaHtml =
        p.cta?.url
          ? `<a class="btn" href="${htmlEscape(p.cta.url)}">${htmlEscape(p.cta.label || "Abrir")}</a>`
          : "";

      return `
<amp-story-page id="${id}" class="${themeClass}">
  <amp-story-grid-layer template="fill">
    <amp-img src="${bgSrc}" width="1080" height="1920" layout="responsive" alt="${bgAlt}"></amp-img>
  </amp-story-grid-layer>

  <amp-story-grid-layer template="fill" class="overlay"></amp-story-grid-layer>

  <amp-story-grid-layer template="vertical" class="pad">
    <div class="brand">${htmlEscape(story.publisherName || "Tio Ben IA")}</div>

    <div class="${pageNumber === 1 ? "h1" : "h2"}">${heading}</div>
    ${subheading ? `<div class="meta">${subheading}</div>` : ""}

    ${reference ? `<div class="ref">${reference}</div>` : ""}

    ${text ? `<div class="text">${text}</div>` : ""}

    ${quote ? `<div class="quote">${quote}</div>` : ""}

    ${refrain ? `<div class="pill">${refrain}</div>` : ""}

    ${bulletsHtml}

    ${prayer ? `<div class="prayer">${prayer}</div>` : ""}

    ${ctaHtml}
  </amp-story-grid-layer>
</amp-story-page>
`.trim();
    })
    .join("\n");
}

function buildJsonLd(story: StoryJsonCommon) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.description,
    mainEntityOfPage: story.storyUrl,
    url: story.storyUrl,
    image: [story.poster?.src],
    publisher: {
      "@type": "Organization",
      name: story.publisherName,
      logo: {
        "@type": "ImageObject",
        url: story.publisherLogoSrc,
      },
    },
    datePublished: story.date,
    dateModified: story.date,
  };
  return JSON.stringify(jsonLd);
}

function renderAmpHtml(story: StoryJsonCommon) {
  const pagesHtml = renderPagesHtml(story);
  const jsonLd = buildJsonLd(story);

  return `<!doctype html>
<html ⚡ lang="${htmlEscape(story.lang || "pt-BR")}">
  <head>
    <meta charset="utf-8" />
    <title>${htmlEscape(story.title)}</title>
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
    <link rel="canonical" href="${htmlEscape(story.canonicalUrl)}" />

    <meta name="description" content="${htmlEscape(story.description)}" />
    <meta property="og:title" content="${htmlEscape(story.title)}" />
    <meta property="og:description" content="${htmlEscape(story.description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${htmlEscape(story.storyUrl)}" />
    <meta property="og:image" content="${htmlEscape(story.poster?.src || "")}" />

    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>

    <style amp-boilerplate>
  body {
    -webkit-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
    -moz-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
    -ms-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
    animation: -amp-start 8s steps(1, end) 0s 1 normal both;
  }
  @-webkit-keyframes -amp-start { from { visibility: hidden; } to { visibility: visible; } }
  @-moz-keyframes -amp-start { from { visibility: hidden; } to { visibility: visible; } }
  @-ms-keyframes -amp-start { from { visibility: hidden; } to { visibility: visible; } }
  @-o-keyframes -amp-start { from { visibility: hidden; } to { visibility: visible; } }
  @keyframes -amp-start { from { visibility: hidden; } to { visibility: visible; } }
</style>
<noscript>
  <style amp-boilerplate>
    body { -webkit-animation: none; -moz-animation: none; -ms-animation: none; animation: none; }
  </style>
</noscript>

    <style amp-custom>
      :root{
        --pad-top: 92px;
        --pad-x: 34px;
        --pad-bottom: 56px;
      }

      body, .pad, .brand, .h1, .h2, .meta, .ref, .text, .quote, .pill, .bullets, .prayer, .btn{
        font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .pad { padding: var(--pad-top) var(--pad-x) var(--pad-bottom); }
      .brand { font-size: 16px; letter-spacing: .3px; opacity: .95; font-weight: 700; }

      .h1 { font-size: 56px; line-height: 1.02; font-weight: 900; letter-spacing: -0.6px; }
      .h2 { font-size: 34px; line-height: 1.08; font-weight: 900; letter-spacing: -0.3px; }

      .meta { font-size: 20px; margin-top: 10px; opacity: .95; font-weight: 700; }
      .ref { font-size: 22px; margin-top: 14px; font-weight: 900; opacity: .98; }

      .text { font-size: 22px; line-height: 1.22; margin-top: 16px; font-weight: 650; }

      .bullets { margin-top: 16px; font-size: 22px; line-height: 1.22; padding-left: 0; }
      .bullets li { margin: 10px 0; list-style: none; }

      .pill {
        display: inline-block;
        padding: 10px 14px;
        border-radius: 999px;
        margin-top: 14px;
        font-size: 18px;
        font-weight: 900;
      }

      .quote {
        margin-top: 16px;
        padding: 14px 16px;
        border-left: 4px solid rgba(255,255,255,.85);
        border-radius: 14px;
        font-size: 22px;
        line-height: 1.22;
        font-weight: 750;
      }

      .prayer {
        margin-top: 14px;
        font-size: 22px;
        line-height: 1.22;
        font-style: italic;
        opacity: .96;
        font-weight: 650;
      }

      .btn {
        display: inline-block;
        margin-top: 22px;
        padding: 14px 18px;
        border-radius: 14px;
        font-weight: 950;
        text-decoration: none;
        font-size: 18px;
        letter-spacing: .2px;
      }

      .theme-dark .overlay {
        background: linear-gradient(180deg, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.30) 45%, rgba(0,0,0,0.40) 100%);
      }
      .theme-light .overlay {
        background: linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0.10) 55%, rgba(0,0,0,0.20) 100%);
      }

      /* DARK */
      .theme-dark .brand,
      .theme-dark .text,
      .theme-dark .meta,
      .theme-dark .ref,
      .theme-dark .prayer { color: #f6f6f6; }
      .theme-dark .h1,
      .theme-dark .h2 { color: #f3d48b; text-shadow: 0 2px 10px rgba(0,0,0,0.75); }
      .theme-dark .quote { background: rgba(0,0,0,.40); color: #f6f6f6; border-left-color: rgba(243,212,139,.9); }
      .theme-dark .pill { background: rgba(243, 212, 139, 0.18); border: 1px solid rgba(243, 212, 139, 0.48); color: #f3d48b; }
      .theme-dark .bullets li { background: rgba(0,0,0,0.38); color: #f6f6f6; padding: 10px 12px; border-radius: 12px; }
      .theme-dark .btn { background: rgba(245,245,245,.94); color: #111; }

      /* LIGHT */
      .theme-light .brand,
      .theme-light .text,
      .theme-light .meta,
      .theme-light .ref,
      .theme-light .prayer { color: #171717; text-shadow: 0 1px 6px rgba(255,255,255,0.35); }
      .theme-light .h1,
      .theme-light .h2 { color: #2b1e0c; text-shadow: 0 2px 12px rgba(255,255,255,0.45); }
      .theme-light .quote { background: rgba(255,255,255,.60); color: #171717; border-left-color: rgba(43,30,12,.55); }
      .theme-light .pill { background: rgba(43,30,12,.12); border: 1px solid rgba(43,30,12,.22); color: #2b1e0c; }
      .theme-light .bullets li { background: rgba(255,255,255,.62); color: #171717; padding: 10px 12px; border-radius: 12px; }
      .theme-light .btn { background: rgba(43,30,12,.94); color: #fff; }
    </style>

    <script type="application/ld+json">${jsonLd}</script>
  </head>

  <body>
    <amp-story
      standalone
      title="${htmlEscape(story.title)}"
      publisher="${htmlEscape(story.publisherName)}"
      publisher-logo-src="${htmlEscape(story.publisherLogoSrc)}"
      poster-portrait-src="${htmlEscape(story.poster?.src || "")}"
    >
      ${pagesHtml}
    </amp-story>
  </body>
</html>`;
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;

  const parsed = parseSlug(slug);
  if (!parsed) return new Response("Not found", { status: 404 });

  const { kind, isoDate } = parsed;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://www.iatioben.com.br";

  const site = siteUrl.replace(/\/$/, "");

  // URL “oficial” do story (esta própria página)
  const storyUrl = `${site}/web-stories/${slug}/`;

  const publisherName = process.env.STORY_PUBLISHER_NAME || "Tio Ben IA";
  const publisherLogoSrc =
    process.env.STORY_PUBLISHER_LOGO || `${site}/images/logo-amp.png`;

  let storyJson: StoryJsonCommon;

  if (kind === "liturgia") {
    const canonicalUrl = `${site}/liturgia/${isoDate}`;

    const liturgia = await fetchLiturgiaByIsoDate(isoDate);

    storyJson = buildLiturgiaStory({
      liturgia,
      isoDate,
      canonicalUrl,
      storyUrl,
      lang: "pt-BR",
    }) as unknown as StoryJsonCommon;
  } else {
    // ✅ TERÇO
    const canonicalUrl = `${site}/terco/${isoDate}`;

    // ✅ capa exclusiva do terço (terco-misterio)
    const posterSrc =
      process.env.STORY_TERCO_POSTER ||
      `${site}/images/stories/terco-default.jpg`;

    // ✅ reaproveitar claros/escuros (pode apontar para os mesmos da Liturgia se quiser)
    const bgDarkSrc =
      process.env.STORY_TERCO_BG_DARK ||
      `${site}/images/stories/liturgia-bg-dark.jpg`;

    const bgLightSrc =
      process.env.STORY_TERCO_BG_LIGHT ||
      `${site}/images/stories/liturgia-bg-light.jpg`;

    storyJson = buildTercoStoryJson({
      isoDate,
      siteUrl: site,
      canonicalUrl,
      storyUrl,
      publisherName,
      publisherLogoSrc,
      posterSrc,
      bgDarkSrc,
      bgLightSrc,
      lang: "pt-BR",
    }) as unknown as StoryJsonCommon;
  }

  const html = renderAmpHtml(storyJson);

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
