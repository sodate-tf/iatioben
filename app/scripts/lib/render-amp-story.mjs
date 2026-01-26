// scripts/lib/render-amp-story.mjs
import { escapeHtml, limitChars } from "./utils.mjs";

export function renderPagesHtml(story) {
  return (story.pages || []).map((p, idx) => renderPage(p, idx + 1, story)).join("\n");
}

function renderPage(p, pageNumber, story) {
  const id = escapeHtml(p.id || `p${pageNumber}`);
  const theme = p.theme === "light" ? "theme-light" : "theme-dark";

  const heading = escapeHtml(limitChars(p.heading || "", 60));
  const subheading = p.subheading ? escapeHtml(limitChars(p.subheading, 80)) : "";
  const text = p.text ? escapeHtml(limitChars(p.text, 280)) : "";
  const reference = p.reference ? escapeHtml(limitChars(p.reference, 80)) : "";
  const refrain = p.refrain ? escapeHtml(limitChars(p.refrain, 140)) : "";
  const quote = p.quote ? escapeHtml(limitChars(p.quote, 140)) : "";
  const prayer = p.prayer ? escapeHtml(limitChars(p.prayer, 180)) : "";

  const bullets = Array.isArray(p.bullets) ? p.bullets.slice(0, 3) : [];
  const cta = p.cta?.url ? { label: p.cta.label || "Abrir", url: p.cta.url } : null;

  const bgSrc = escapeHtml(p.background?.src || story.poster?.src || "");
  const bgAlt = escapeHtml(p.background?.alt || story.poster?.alt || story.title || "Background");

  return `
<amp-story-page id="${id}" class="${theme}">
  <amp-story-grid-layer template="fill">
    <amp-img src="${bgSrc}" width="1080" height="1920" layout="responsive" alt="${bgAlt}"></amp-img>
  </amp-story-grid-layer>

  <amp-story-grid-layer template="fill" class="overlay"></amp-story-grid-layer>

  <amp-story-grid-layer template="vertical" class="pad">
    <div class="brand">${escapeHtml(story.publisherName || "Tio Ben IA")}</div>

    <div class="${pageNumber === 1 ? "h1" : "h2"}">${heading}</div>
    ${subheading ? `<div class="meta">${subheading}</div>` : ""}

    ${reference ? `<div class="ref">${reference}</div>` : ""}

    ${text ? `<div class="text">${text}</div>` : ""}

    ${quote ? `<div class="quote">${quote}</div>` : ""}

    ${refrain ? `<div class="pill">${refrain}</div>` : ""}

    ${
      bullets.length
        ? `<ul class="bullets">${bullets
            .map((b) => `<li>${escapeHtml(limitChars(String(b), 120))}</li>`)
            .join("")}</ul>`
        : ""
    }

    ${prayer ? `<div class="prayer">${prayer}</div>` : ""}

    ${cta ? `<a class="btn" href="${escapeHtml(cta.url)}">${escapeHtml(cta.label)}</a>` : ""}
  </amp-story-grid-layer>
</amp-story-page>
`.trim();
}
