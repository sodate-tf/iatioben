function safeStr(v: unknown) {
  return String(v ?? "").trim();
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const VERSE_SUB_CLASS =
  "mx-0.5 align-baseline rounded bg-amber-50 px-1 text-[0.75em] font-semibold text-amber-900/90 border border-amber-100";

/**
 * Converte números de versículo para <sup> (padrão Tio Ben).
 * Suporta:
 * - "1 In the beginning..."
 * - "3:16 For this is the way..."
 */
export function formatVersesToSub(text: string): string {
  const raw = safeStr(text);
  if (!raw) return "";
  if (raw.includes("<sup")) return raw; // evita duplicar

  let s = escapeHtml(raw).replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // 1) capítulo:verso
  s = s.replace(
    /(^|[\s.;:!?—–-])(\d{1,3}:\d{1,3})(?=\s+[^<\s])/g,
    (_m, before, num) => `${before}<sup class="${VERSE_SUB_CLASS}">${num}</sup>`
  );

  // 2) só verso
  s = s.replace(
    /(^|[\s.;:!?—–-])(\d{1,3})(?=\s+[^<\s])/g,
    (_m, before, num) => `${before}<sup class="${VERSE_SUB_CLASS}">${num}</sup>`
  );

  return s;
}
