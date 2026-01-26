import fs from "node:fs";
import path from "node:path";

function isLightBg(bgSrc){
  const s = String(bgSrc||"").toLowerCase();
  return s.includes("amarelo e preto") && !s.includes("(1)");
}

const TEMPLATE_PATH = path.join(process.cwd(), "amp-story.template.html");

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderCover(p, story) {
  const bgSrcRaw = p.background?.src || story.poster?.src || "";
  const theme = isLightBg(bgSrcRaw) ? "light" : "dark";
  const bgSrc = escapeHtml(bgSrcRaw);

  return `
<amp-story-page id="${escapeHtml(p.id || "cover")}" auto-advance-after="7s">
  <amp-story-grid-layer template="fill">
    <amp-img src="${bgSrc}" width="720" height="1280" layout="responsive" alt=""></amp-img>
  </amp-story-grid-layer>

  <amp-story-grid-layer template="vertical" class="pad theme-${theme}">
    <div class="brand">${escapeHtml(story.publisherName || "Tio Ben IA")}</div>
    <h1 class="h1">${escapeHtml(p.heading || story.title || "Liturgia de Hoje")}</h1>
    ${p.subheading ? `<div class="subheading">${escapeHtml(p.subheading)}</div>` : ""}
    ${p.date ? `<div class="meta">${escapeHtml(p.date)}</div>` : ""}
    ${p.text ? `<div class="text">${escapeHtml(p.text)}</div>` : ""}

    ${
      p.cta?.url
        ? `<a class="btn" href="${escapeHtml(p.cta.url)}">${escapeHtml(p.cta.label || "Abrir no site")}</a>`
        : ""
    }
  </amp-story-grid-layer>
</amp-story-page>
  `.trim();
}

function renderPage(pageNumber, p, story) {
  if ((p.id || "") === "cover") return renderCover(p, story);

  const bgSrcRaw = p.background?.src || story.poster?.src || "";
  const theme = isLightBg(bgSrcRaw) ? "light" : "dark";
  const bgSrc = escapeHtml(bgSrcRaw);

  const heading = escapeHtml(p.heading || "");
  const subheading = escapeHtml(p.subheading || "");
  const meta = escapeHtml(p.meta || "");
  const ref = escapeHtml(p.reference || "");
  const refrain = escapeHtml(p.refrain || "");
  const text = escapeHtml(p.text || "");
  const quote = escapeHtml(p.quote || "");
  const prayer = escapeHtml(p.prayer || "");

  const cta = p.cta?.url ? { label: p.cta.label || "Abrir no site", url: p.cta.url } : null;

  const bullets = Array.isArray(p.bullets) ? p.bullets.filter(Boolean).slice(0, 4) : [];

  return `
<amp-story-page id="${escapeHtml(p.id || `p${pageNumber}`)}">
  <amp-story-grid-layer template="fill">
    <amp-img src="${bgSrc}" width="720" height="1280" layout="responsive" alt=""></amp-img>
  </amp-story-grid-layer>

  <amp-story-grid-layer template="vertical" class="pad theme-${theme}">
    <div class="brand">${escapeHtml(story.publisherName || "Tio Ben IA")}</div>

    <div class="panel">
      ${heading ? `<h2 class="h2">${heading}</h2>` : ""}
      ${subheading ? `<div class="subheading">${subheading}</div>` : ""}
      ${meta ? `<div class="meta">${meta}</div>` : ""}
      ${ref ? `<div class="ref">${ref}</div>` : ""}
      ${refrain ? `<div class="pill">${refrain}</div>` : ""}
      ${text ? `<div class="text">${text}</div>` : ""}
      ${quote ? `<div class="quote">${quote}</div>` : ""}

      ${
        bullets.length
          ? `<ul class="bullets">${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
          : ""
      }

      ${prayer ? `<div class="prayer">${prayer}</div>` : ""}

      ${cta ? `<a class="btn" href="${escapeHtml(cta.url)}">${escapeHtml(cta.label)}</a>` : ""}
    </div>
  </amp-story-grid-layer>
</amp-story-page>
  `.trim();
}

export function renderAmpStory(story) {
  const template = fs.readFileSync(TEMPLATE_PATH, "utf-8");

  const pagesHtml = (story.pages || [])
    .map((p, idx) => renderPage(idx + 1, p, story))
    .join("\n\n");

  const out = template
    .replaceAll("{{STORY_TITLE}}", escapeHtml(story.title || "Liturgia de Hoje"))
    .replaceAll("{{PUBLISHER_NAME}}", escapeHtml(story.publisherName || "Tio Ben IA"))
    .replaceAll("{{PUBLISHER_LOGO}}", escapeHtml(story.publisherLogo || "/images/logo.png"))
    .replaceAll("{{POSTER_IMAGE}}", escapeHtml(story.poster?.src || story.posterImage || "/images/liturgia-default.jpg"))
    .replaceAll("{{CANONICAL_URL}}", escapeHtml(story.canonicalUrl || "https://www.iatioben.com.br"))
    .replaceAll("{{PAGES_HTML}}", pagesHtml);

  return out;
}
