import fs from "node:fs/promises";

export async function readText(filePath) {
  return fs.readFile(filePath, "utf8");
}

export async function writeText(filePath, content) {
  await fs.writeFile(filePath, content, "utf8");
}

export async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

export function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function compactSpaces(s = "") {
  return String(s).replace(/\s+/g, " ").trim();
}

export function limitChars(s = "", max = 280) {
  const t = compactSpaces(s);
  if (t.length <= max) return t;
  return t.slice(0, Math.max(0, max - 1)).trimEnd() + "…";
}

export function applyTemplate(tpl, vars) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, key) => (key in vars ? String(vars[key]) : ""));
}
