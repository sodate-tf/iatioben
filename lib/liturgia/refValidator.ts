// lib/liturgia/refValidation.ts

const BOOK_MAP: Record<string, string> = {
  // Pentateuco
  Gn: "Genesis",
  Ex: "Exodus",
  Lv: "Leviticus",
  Nm: "Numbers",
  Dt: "Deuteronomy",

  // Históricos (adicione quando precisar)
  Js: "Joshua",
  Jz: "Judges",
  Rt: "Ruth",

  // Salmos
  Sl: "Psalm",
  Sal: "Psalm",

  // Profetas / etc.
  Is: "Isaiah",
  Jr: "Jeremiah",
  Ez: "Ezekiel",
  Br: "Baruch",

  // Evangelhos
  Mt: "Matthew",
  Mc: "Mark",
  Lc: "Luke",
  Jo: "John",

  // Atos e Cartas (adicione conforme aparecer)
  At: "Acts",
  Rm: "Romans",
  "1Cor": "1 Corinthians",
  "2Cor": "2 Corinthians",
};

function stripParentheses(s: string) {
  return s.replace(/\(.*?\)/g, "").trim();
}

function normalizeDashes(s: string) {
  return s.replace(/[–—]/g, "-");
}

/**
 * Converte "Gn 22, 1-2. 9a. 10-13. 15-18"
 * => "Genesis 22:1-2; 22:9; 22:10-13; 22:15-18"
 *
 * Observações:
 * - remove sufixos a/b/c (9a, 31a etc.) para facilitar teste.
 * - mantém ranges.
 * - suporta range cruzando capítulo: "14, 15–15, 1" => "14:15-15:1"
 */
export function normalizeRefForGateway(ptRefRaw: string): string {
  let s = (ptRefRaw || "").trim();
  if (!s) return "";

  s = stripParentheses(s);
  s = normalizeDashes(s);
  s = s.replace(/\s+/g, " ");

  // split: book token + rest
  const m = s.match(/^([0-9]?\s?[A-Za-zÀ-ÿ]{1,5})\s+(.+)$/);
  if (!m) return s;

  const bookPT = m[1].replace(/\s+/g, "");
  let rest = m[2].trim();

  const bookEN = BOOK_MAP[bookPT] ?? BOOK_MAP[m[1]] ?? m[1];

  // Caso tipo "Sl 103" (sem vírgula)
  if (!rest.includes(",")) {
    // remove letras (ex.: "18B" -> "18")
    rest = rest.replace(/[A-Za-z]/g, "").trim();
    return `${bookEN} ${rest}`.trim();
  }

  const [chapterStr, versesRaw] = rest.split(",", 2);
  const chapter = chapterStr.trim().replace(/[^\d]/g, "");
  if (!chapter) return `${bookEN} ${rest}`.trim();

  let verses = (versesRaw || "")
    .replace(/\./g, ";")       // "."
    .replace(/[a-zA-Z]/g, "")  // "9a" -> "9"
    .replace(/\s+/g, " ")
    .trim();

  // Converte "15-15, 1" => "15-15:1"
  verses = verses.replace(/(\d+)\s*-\s*(\d+)\s*,\s*(\d+)/g, "$1-$2:$3");

  const parts = verses
    .split(";")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((v) => {
      // Se já tem ":" (ex: "15:1"), significa que cruzou capítulo.
      // A query final deve ficar "14:15-15:1" e não "14:15-14:15:1".
      if (v.includes(":")) return `${chapter}:${v}`;
      return `${chapter}:${v}`;
    });

  return `${bookEN} ${parts.join("; ")}`.trim();
}

export function buildBibleGatewayUrl(ptRefRaw: string, version = "NRSVCE") {
  const query = normalizeRefForGateway(ptRefRaw);
  if (!query) return "";
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(query)}&version=${encodeURIComponent(version)}`;
}
