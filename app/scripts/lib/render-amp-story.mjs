// app/lib/web-stories/render-amp-story.mjs
import fs from "node:fs/promises";
import path from "node:path";

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderBullets(bullets = []) {
  if (!bullets?.length) return "";
  return `<ul class="bullets">${bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`;
}

function renderPage(p) {
  const themeClass = p.theme === "light" ? "theme-light" : "theme-dark";
  const overlayClass = p.theme === "light" ? "overlay-light" : "overlay-dark";

  const id = esc(p.id);
  const bgSrc = esc(p.background?.src);
  const bgAlt = esc(p.background?.alt || "Fundo");

  const heading = esc(p.heading);
  const subheading = p.subheading ? `<div class="sub">${esc(p.subheading)}</div>` : "";
  const text = p.text ? `<div class="text">${esc(p.text)}</div>` : "";
  const quote = p.quote ? `<div class="quote">${esc(p.quote)}</div>` : "";

  const reference = p.reference ? `<div class="ref">${esc(p.reference)}</div>` : "";
  const refrain = p.refrain ? `<div class="pill">${esc(p.refrain)}</div>` : "";

  const bullets = renderBullets(p.bullets);

  const prayer = p.prayer ? `<div class="prayer">${esc(p.prayer)}</div>` : "";

  const cta =
    p.cta?.url && p.cta?.label
      ? `<a class="btn" href="${esc(p.cta.url)}">${esc(p.cta.label)}</a>`
      : "";

  return `
<amp-story-page id="${id}" class="${themeClass}">
  <amp-story-grid-layer template="fill" class="bg">
    <amp-img src="${bgSrc}" width="1080" height="1920" layout="responsive" alt="${bgAlt}"></amp-img>
  </amp-story-grid-layer>

  <amp-story-grid-layer template="fill" class="${overlayClass}"></amp-story-grid-layer>

  <amp-story-grid-layer template="vertical" class="wrap">
    <div class="brand">Tio Ben IA</div>

    <div class="card">
      <div class="heading">${heading}</div>
      ${subheading}
      ${reference}
      ${refrain}
      ${text}
      ${quote}
      ${bullets}
      ${prayer}
      ${cta}
    </div>
  </amp-story-grid-layer>
</amp-story-page>
`.trim();
}

export async function renderAmpStoryHtml(storyJson, templatePath) {
  const tpl = await fs.readFile(templatePath, "utf-8");

  const pagesHtml = (storyJson.pages || []).map(renderPage).join("\n\n");

  return tpl
    .replaceAll("{{title}}", esc(storyJson.title))
    .replaceAll("{{canonicalUrl}}", esc(storyJson.canonicalUrl))
    .replaceAll("{{publisherName}}", esc(storyJson.publisherName))
    .replaceAll("{{publisherLogoSrc}}", esc(storyJson.publisherLogoSrc))
    .replaceAll("{{posterSrc}}", esc(storyJson.poster?.src))
    .replaceAll("{{pagesHtml}}", pagesHtml);
}

export function resolveTemplate(defaultDir) {
  return path.join(defaultDir, "amp-story.template.html");
}
