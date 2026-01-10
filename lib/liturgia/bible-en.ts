// lib/liturgia/bible-en.ts
// Busca texto bíblico em inglês a partir de uma referência PT (ex: "Lc 24, 1-12")
// usando NET Bible (labs.bible.org).
// Docs do formato do "passage=": John 3:16-17 etc. (aceita ranges) :contentReference[oaicite:1]{index=1}

import "server-only";

const NET_BIBLE_ENDPOINT = "https://labs.bible.org/api/";

const BOOK_MAP: Record<string, string> = {
  // Pentateuco / Históricos
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

  // Sabedoria / Profetas (alguns podem não existir na NET Bible, depende do corpus)
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

  // NT
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

/**
 * Converte referência PT para um "passage" compatível com labs.bible.org
 * Exemplos:
 * - "Lc 24, 1-12" -> "Luke 24:1-12"
 * - "Sl 103" -> "Psalm 103"
 * - "Ex 15, 1-6. 17-18" -> "Exodus 15:1-6,17-18" (heurística)
 */
export function ptRefToNetPassage(ptRef: string): string | null {
  const raw = stripParenSuffix(normalizeDashes(String(ptRef || "").trim()));
  if (!raw) return null;

  // separa "Livro" do resto: "Lc 24, 1-12"
  const m = raw.match(/^([1-3]?\s?[A-Za-zÀ-ÿ]+)\s+(.+)$/);
  if (!m) {
    // pode ser só "Sl 103"
    const m2 = raw.match(/^([1-3]?\s?[A-Za-zÀ-ÿ]+)\s+(\d+)\s*$/);
    if (!m2) return null;
    const book = BOOK_MAP[m2[1].replace(/\s+/g, "")] || BOOK_MAP[m2[1].trim()];
    if (!book) return null;
    return `${book} ${m2[2]}`;
  }

  const bookKey = m[1].replace(/\s+/g, "");
  const book = BOOK_MAP[bookKey] || BOOK_MAP[m[1].trim()];
  if (!book) return null;

  let rest = m[2].trim();

  // Formato comum: "24, 1-12"
  // troca "," (separador capítulo/verso) por ":" e limpa espaços
  // mantém "." como separador de segmentos (ex: "1-6. 17-18")
  rest = rest
    .replace(/\s*,\s*/g, ":")
    .replace(/\s*\.\s*/g, ",") // trata "1-6. 17-18" como lista
    .replace(/\s+/g, "");

  // Se rest ficou só capítulo: "103"
  // Se ficou "24:1-12" ok
  return `${book} ${rest}`;
}

export async function fetchNetBibleText(ptRef: string) {
  const passage = ptRefToNetPassage(ptRef);
  if (!passage) return null;

  // labs.bible.org usa querystring "passage=" e "type=json"
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

  if (!Array.isArray(json) || !json.length) return null;

  // junta em texto contínuo
  const text = json
    .map((v) => (v?.text || "").trim())
    .filter(Boolean)
    .join(" ");

  return text || null;
}
