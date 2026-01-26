// app/web-stories/[slug]/route.ts
import { NextRequest } from "next/server";
import { fetchLiturgiaByIsoDate } from "@/lib/liturgia/api";
import { LiturgyStoryJson } from "@/app/lib/web-stories/story-types";
import { buildLiturgiaStoryJson } from "@/app/lib/web-stories/liturgia-story-builder";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function htmlEscape(s: string) {
  return (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseSlugToIsoDate(slug: string) {
  // esperado: liturgia-26-01-2026
  const m = slug.match(/^liturgia-(\d{2})-(\d{2})-(\d{4})$/);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  return `${yyyy}-${mm}-${dd}`;
}

function renderPagesHtml(story: LiturgyStoryJson) {
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

      const bullets = Array.isArray(p.bullets) ? p.bullets.slice(0, 3) : [];
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

function buildJsonLd(story: LiturgyStoryJson) {
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

function renderAmpHtml(story: LiturgyStoryJson) {
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
      body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}
      @keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}
    </style>
    <noscript><style amp-boilerplate>body{-webkit-animation:none;animation:none}</style></noscript>

    <style amp-custom>
      .pad { padding: 72px 30px 44px; }
      .brand { font-size: 14px; letter-spacing: .2px; opacity: .95; }

      .h1 { font-size: 40px; line-height: 1.05; font-weight: 800; }
      .h2 { font-size: 26px; line-height: 1.15; font-weight: 800; }

      .meta { font-size: 16px; margin-top: 8px; opacity: .92; }
      .ref { font-size: 16px; margin-top: 10px; font-weight: 800; opacity: .96; }

      .text { font-size: 18px; line-height: 1.25; margin-top: 14px; }

      .bullets { margin-top: 14px; font-size: 18px; line-height: 1.25; padding-left: 0; }
      .bullets li { margin: 8px 0; list-style: none; }

      .pill {
        display: inline-block;
        padding: 8px 12px;
        border-radius: 999px;
        margin-top: 12px;
        font-size: 14px;
        font-weight: 800;
      }

      .quote {
        margin-top: 14px;
        padding: 12px 14px;
        border-left: 4px solid rgba(255,255,255,.85);
        border-radius: 10px;
        font-size: 18px;
        line-height: 1.25;
        font-weight: 650;
      }

      .prayer {
        margin-top: 12px;
        font-size: 18px;
        line-height: 1.25;
        font-style: italic;
        opacity: .95;
      }

      .btn {
        display: inline-block;
        margin-top: 18px;
        padding: 12px 16px;
        border-radius: 12px;
        font-weight: 900;
        text-decoration: none;
        font-size: 16px;
      }

      /* DARK */
      .theme-dark .overlay {
        background: linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.30) 100%);
      }
      .theme-dark .brand,
      .theme-dark .text,
      .theme-dark .meta,
      .theme-dark .ref,
      .theme-dark .prayer { color: #f5f5f5; }
      .theme-dark .h1,
      .theme-dark .h2 { color: #f3d48b; text-shadow: 0 2px 8px rgba(0,0,0,0.7); }
      .theme-dark .quote { background: rgba(0,0,0,.35); color: #f5f5f5; border-left-color: rgba(243,212,139,.9); }
      .theme-dark .pill { background: rgba(243, 212, 139, 0.18); border: 1px solid rgba(243, 212, 139, 0.45); color: #f3d48b; }
      .theme-dark .bullets li { background: rgba(0,0,0,0.35); color: #f5f5f5; padding: 6px 10px; border-radius: 10px; }
      .theme-dark .btn { background: rgba(245,245,245,.92); color: #111; }

      /* LIGHT */
      .theme-light .overlay {
        background: linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(0,0,0,0.12) 55%, rgba(0,0,0,0.22) 100%);
      }
      .theme-light .brand,
      .theme-light .text,
      .theme-light .meta,
      .theme-light .ref,
      .theme-light .prayer { color: #1a1a1a; text-shadow: 0 1px 6px rgba(255,255,255,0.35); }
      .theme-light .h1,
      .theme-light .h2 { color: #3a2a10; text-shadow: 0 2px 10px rgba(255,255,255,0.45); }
      .theme-light .quote { background: rgba(255,255,255,.55); color: #1a1a1a; border-left-color: rgba(58,42,16,.55); }
      .theme-light .pill { background: rgba(58,42,16,.12); border: 1px solid rgba(58,42,16,.22); color: #3a2a10; }
      .theme-light .bullets li { background: rgba(255,255,255,.55); color: #1a1a1a; padding: 6px 10px; border-radius: 10px; }
      .theme-light .btn { background: rgba(58,42,16,.92); color: #fff; }
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

  const isoDate = parseSlugToIsoDate(slug);
  if (!isoDate) {
    return new Response("Not found", { status: 404 });
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://www.iatioben.com.br";

  const canonicalUrl = `${siteUrl.replace(/\/$/, "")}/liturgia/${isoDate}/`;

  const publisherName = process.env.STORY_PUBLISHER_NAME || "Tio Ben IA";
  const publisherLogoSrc =
    process.env.STORY_PUBLISHER_LOGO ||
    `${siteUrl.replace(/\/$/, "")}/images/logo-amp.png`;

  const posterSrc =
    process.env.STORY_LITURGIA_POSTER_DEFAULT ||
    `${siteUrl.replace(/\/$/, "")}/images/stories/liturgia-default.jpg`;

  const bgDarkSrc =
    process.env.STORY_LITURGIA_BG_DARK ||
    `${siteUrl.replace(/\/$/, "")}/images/stories/liturgia-bg-dark.jpg`;

  const bgLightSrc =
    process.env.STORY_LITURGIA_BG_LIGHT ||
    `${siteUrl.replace(/\/$/, "")}/images/stories/liturgia-bg-light.jpg`;

  const liturgia = await fetchLiturgiaByIsoDate(isoDate);

  const storyJson = buildLiturgiaStoryJson({
    isoDate,
    siteUrl,
    canonicalUrl,
    posterSrc,
    bgDarkSrc,
    bgLightSrc,
    publisherName,
    publisherLogoSrc,
    liturgia,
  });

  const html = renderAmpHtml(storyJson);

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
