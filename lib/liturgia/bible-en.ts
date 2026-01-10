// lib/liturgia/bible-en.ts
import "server-only";

const NET_BIBLE_ENDPOINT = "https://labs.bible.org/api/";

const BOOK_MAP: Record<string, string> = {
  Gn: "Genesis",
  Ex: "Exodus",
  Lv: "Leviticus",
  Nm: "Numbers",
  Dt: "Deuteronomy",
  Js: "Joshua",
  Jz: "Judges",
  Rt: "Ruth",
  "1Sm": "1 Samuel",
  "2Sm": "2 Samuel",
  "1Rs": "1 Kings",
  "2Rs": "2 Kings",
  "1Cr": "1 Chronicles",
  "2Cr": "2 Chronicles",
  Esd: "Ezra",
  Ne: "Nehemiah",
  Tb: "Tobit",
  Jt: "Judith",
  Est: "Esther",

  Jó: "Job",
  Sl: "Psalm",
  Pr: "Proverbs",
  Ecl: "Ecclesiastes",
  Ct: "Song of Solomon",
  Is: "Isaiah",
  Jr: "Jeremiah",
  Lm: "Lamentations",
  Ez: "Ezekiel",
  Dn: "Daniel",
  Os: "Hosea",
  Jl: "Joel",
  Am: "Amos",
  Abd: "Obadiah",
  Jn: "Jonah",
  Mq: "Micah",
  Na: "Nahum",
  Hc: "Habakkuk",
  Sf: "Zephaniah",
  Ag: "Haggai",
  Zc: "Zechariah",
  Ml: "Malachi",

  Mt: "Matthew",
  Mc: "Mark",
  Lc: "Luke",
  Jo: "John",
  At: "Acts",
  Rm: "Romans",
  "1Cor": "1 Corinthians",
  "2Cor": "2 Corinthians",
  Gl: "Galatians",
  Ef: "Ephesians",
  Fl: "Philippians",
  Cl: "Colossians",
  "1Ts": "1 Thessalonians",
  "2Ts": "2 Thessalonians",
  "1Tm": "1 Timothy",
  "2Tm": "2 Timothy",
  Tt: "Titus",
  Fm: "Philemon",
  Hb: "Hebrews",
  Tg: "James",
  "1Pd": "1 Peter",
  "2Pd": "2 Peter",
  "1Jo": "1 John",
  "2Jo": "2 John",
  "3Jo": "3 John",
  Jd: "Jude",
  Ap: "Revelation",
};

function normalizeDashes(s: string) {
  return s.replace(/[–—]/g, "-");
}

function stripParenSuffix(s: string) {
  // remove "(Forma Longa)" etc
  return s.replace(/\s*\([^)]*\)\s*/g, " ").trim();
}

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

/**
 * Converte referência PT para "passage" compatível com labs.bible.org
 * Exemplos:
 * - "Lc 24, 1-12" -> "Luke 24:1-12"
 * - "Sl 103" -> "Psalm 103"
 * - "Ex 15, 1-6. 17-18" -> "Exodus 15:1-6,17-18"
 */
export function ptRefToNetPassage(ptRef: string): string | null {
  const raw = stripParenSuffix(normalizeDashes(safeStr(ptRef)));
  if (!raw) return null;

  // "Lc 24, 1-12"
  const m = raw.match(/^([1-3]?\s?[A-Za-zÀ-ÿ]+)\s+(.+)$/);
  if (!m) {
    // "Sl 103"
    const m2 = raw.match(/^([1-3]?\s?[A-Za-zÀ-ÿ]+)\s+(\d+)\s*$/);
    if (!m2) return null;

    const k1 = m2[1].replace(/\s+/g, "");
    const book = BOOK_MAP[k1] || BOOK_MAP[m2[1].trim()];
    if (!book) return null;

    return `${book} ${m2[2]}`;
  }

  const bookKey = m[1].replace(/\s+/g, "");
  const book = BOOK_MAP[bookKey] || BOOK_MAP[m[1].trim()];
  if (!book) return null;

  let rest = m[2].trim();
  rest = rest
    .replace(/\s*,\s*/g, ":") // cap, verso -> cap:verso
    .replace(/\s*\.\s*/g, ",") // "1-6. 17-18" -> "1-6,17-18"
    .replace(/\s+/g, "");

  return `${book} ${rest}`;
}

/**
 * Classe Tailwind para "pill" do versículo (padrão Tio Ben).
 */
const VERSE_PILL_CLASS =
  "mx-0.5 align-baseline rounded bg-amber-50 px-1 text-[0.75em] font-semibold text-amber-900/90 border border-amber-100";

/**
 * Junta o retorno do labs.bible.org preservando versículos
 * - normal: "1 In the beginning..."
 * - se mudar capítulo dentro do range: "3:16 For this is..."
 */
function joinNetVerses(
  rows: Array<{ chapter?: string; verse?: string; text?: string }>,
  opts?: { showChapterWhenChanges?: boolean }
) {
  const showChapterWhenChanges = opts?.showChapterWhenChanges ?? true;

  let lastChapter: string | null = null;
  const parts: string[] = [];

  for (const r of rows) {
    const chapter = safeStr(r.chapter);
    const verse = safeStr(r.verse);
    const txt = safeStr(r.text);
    if (!txt) continue;

    let label = "";
    if (chapter && verse) {
      if (showChapterWhenChanges && lastChapter && chapter !== lastChapter) {
        label = `${chapter}:${verse} `;
      } else {
        label = `${verse} `;
      }
      lastChapter = chapter;
    }

    parts.push(label + txt);
  }

  return parts.join(" ");
}

/**
 * Garante que "3:16For" vire "3:16 For" (defensivo)
 */
function normalizeVerseSpacing(s: string) {
  return s
    .replace(/(\d{1,3}:\d{1,3})(?=\S)/g, "$1 ")
    .replace(/(^|\s)(\d{1,3})(?=\S)/g, "$1$2 ");
}

/**
 * Converte números de versículo para <sup class="...">...</sup>
 * - escapa HTML antes (seguro)
 * - suporta aspas/parênteses logo após o número (EN comum)
 * - suporta "3:16" e "16"
 */
function formatVersesToSupHtmlEN(plain: string) {
  const raw = safeStr(plain);
  if (!raw) return "";
  if (raw.includes("<sup")) return raw; // evita duplicar (defensivo)

  let s = escapeHtml(normalizeVerseSpacing(raw));

  // após o número pode vir espaço + aspas/parênteses + letra
  const NEXT_IS_TEXT = String.raw`(?=\s*["“”'‘(\[]?[A-Za-zÀ-ÿ])`;

  // capítulo:verso
  s = s.replace(
    new RegExp(String.raw`(^|[\s.;:!?—–-])(\d{1,3}:\d{1,3})${NEXT_IS_TEXT}`, "g"),
    (_m, before, num) => `${before}<sup class="${VERSE_PILL_CLASS}">${num}</sup>`
  );

  // só verso
  s = s.replace(
    new RegExp(String.raw`(^|[\s.;:!?—–-])(\d{1,3})${NEXT_IS_TEXT}`, "g"),
    (_m, before, num) => `${before}<sup class="${VERSE_PILL_CLASS}">${num}</sup>`
  );

  return s;
}

/**
 * Retorna texto EN com numeração consistente.
 * Útil para metadados/descrição e fallback.
 */
export async function fetchNetBibleText(ptRef: string) {
  const passage = ptRefToNetPassage(ptRef);
  if (!passage) return null;

  const url = new URL(NET_BIBLE_ENDPOINT);
  url.searchParams.set("passage", passage);
  url.searchParams.set("type", "json");
  url.searchParams.set("formatting", "plain");

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
  if (!res.ok) return null;

  const json = (await res.json()) as Array<{
    bookname?: string;
    chapter?: string;
    verse?: string;
    text?: string;
  }>;

  if (!Array.isArray(json) || json.length === 0) return null;

  const joined = joinNetVerses(json, { showChapterWhenChanges: true });
  return joined ? normalizeVerseSpacing(joined).trim() : null;
}

/**
 * Retorna HTML (EN-only) já com <sup> e pronto para render.
 * Observação: este HTML deve ser renderizado diretamente (dangerouslySetInnerHTML)
 * e NÃO passar por toReadableHtml (senão vai escapar).
 */
export async function fetchNetBibleHtml(ptRef: string) {
  const text = await fetchNetBibleText(ptRef);
  if (!text) return null;
  return formatVersesToSupHtmlEN(text);
}
