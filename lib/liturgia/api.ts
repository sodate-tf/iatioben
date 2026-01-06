// lib/liturgia/api.ts
//
// Ajustes feitos para melhorar experiência de leitura:
// 1) Mantém os campos *Texto* originais (plain text) para compatibilidade.
// 2) Adiciona campos *Html* (primeiraHtml, salmoHtml, etc.) já com:
//    - quebras de linha normalizadas (parágrafos e <br/> quando necessário)
//    - números de versículos destacados como <sub class="...">n</sub>
// 3) Funções utilitárias para você aplicar em outros pontos do site.
//
// Importante: para renderizar os campos *Html* no React/Next, use
// dangerouslySetInnerHTML, ou um renderer seguro de HTML.

import { pad2 } from "./date";

export type LiturgiaNormalized = {
  dateSlug: string; // dd-mm-yyyy
  dateISO: string; // yyyy-mm-dd
  dateLabel: string; // dd/mm/yyyy
  weekday: string;
  season: string;
  celebration: string;
  color: string;

  primeiraRef: string;
  salmoRef: string;
  segundaRef: string;
  evangelhoRef: string;

  // Plain text (compatibilidade)
  primeiraTexto: string;
  salmoTexto: string;
  segundaTexto: string;
  evangelhoTexto: string;

  antEntrada: string;
  antComunhao: string;

  // HTML (melhor leitura)
  primeiraHtml: string;
  salmoHtml: string;
  segundaHtml: string;
  evangelhoHtml: string;

  antEntradaHtml: string;
  antComunhaoHtml: string;

  // Texto editorial curto para o hub/preview/snippet (plain)
  evangelhoPreview: string;
};

function safeStr(v: any) {
  if (typeof v === "string") return v.trim();
  if (v == null) return "";
  return String(v).trim();
}

function firstSentences(text: string, maxChars = 260) {
  const t = text.replace(/\s+/g, " ").trim();
  if (!t) return "";
  if (t.length <= maxChars) return t;
  return t.slice(0, maxChars).replace(/[.,;:\s]+$/g, "") + "…";
}

function pick0<T>(arr: any): T | null {
  return Array.isArray(arr) && arr.length ? (arr[0] as T) : null;
}

function weekdayPT(dd: number, mm: number, yyyy: number) {
  const dt = new Date(yyyy, mm - 1, dd, 12, 0, 0);
  try {
    return new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(dt);
  } catch {
    return "";
  }
}

/* =========================
   Leitura agradável (HTML)
   ========================= */

/**
 * Escapa HTML básico para você poder montar HTML seguro por composição.
 * (A API geralmente traz texto “limpo”, mas isto evita que qualquer tag apareça.)
 */
function escapeHtml(s: string) {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Estilização do número do versículo.
 * - Fonte menor
 * - Pequeno destaque em “pill”
 *
 * Observação: são classes Tailwind. Se você não usa Tailwind na renderização do HTML,
 * troque por uma classe estática (ex.: "verse-num") e estilize no CSS.
 */
const VERSE_SUB_CLASS =
  "mx-0.5 align-baseline rounded bg-amber-50 px-1 text-[0.75em] font-semibold text-amber-900/90 border border-amber-100";

/**
 * Converte prováveis números de versículos (1–3 dígitos) para <sub>.
 * Heurísticas (conservadoras) para não quebrar números comuns:
 * - início de linha: "1 " / "12 " etc.
 * - após pontuação + espaço: ". 2 " / ": 15 " etc.
 * - não mexe se já existir <sub> no texto
 */
export function formatVersesToSub(text: string): string {
  const raw = safeStr(text);
  if (!raw) return "";

  // evita duplicar
  if (raw.includes("<sub")) return raw;

  let s = escapeHtml(raw);

  s = s.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  /**
   * Regra:
   * - número de 1 a 3 dígitos
   * - imediatamente antes de letra maiúscula
   * - ou após pontuação
   */
  s = s.replace(
    /(^|[\s.;:!?—–-])(\d{1,3})(?=[A-ZÁÉÍÓÚÂÊÔÃÕÀÇ])/g,
    (_m, before, num) =>
      `${before}<sup class="${VERSE_SUB_CLASS}">${num}</sup>`
  );

  return s;
}


/**
 * Converte texto em HTML agradável:
 * - escapa HTML
 * - aplica <sub> nos versículos
 * - cria parágrafos por blocos (linhas vazias)
 * - preserva quebras simples como <br/>
 */
export function toReadableHtml(text: string): string {
  const raw = safeStr(text);
  if (!raw) return "";

  // Aplica sub de versículos e já escapa HTML dentro
  let s = formatVersesToSub(raw);

  // Se formatVersesToSub retornou texto já escapado, seguimos
  // Agora normalizamos blocos
  s = s.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();

  // Divide em blocos por linha vazia (parágrafos)
  const blocks = s
    .split(/\n{2,}/g)
    .map((b) => b.trim())
    .filter(Boolean);

  // Dentro de um bloco, linha simples vira <br/>
  const html = blocks
    .map((b) => `<p>${b.replace(/\n/g, "<br/>")}</p>`)
    .join("");

  return html;
}

/**
 * Antífonas costumam ser curtas; ainda assim, aplicamos o mesmo pipeline.
 */
export function toAntiphonHtml(text: string): string {
  return toReadableHtml(text);
}

/* =========================
   Normalizer
   ========================= */

export function normalizeLiturgiaApi(raw: any, day: number, month: number, year: number): LiturgiaNormalized {
  const dd = pad2(day);
  const mm = pad2(month);

  const dateSlug = `${dd}-${mm}-${year}`;
  const dateISO = `${year}-${mm}-${dd}`;
  const dateLabel = `${dd}/${mm}/${year}`;

  const weekday = weekdayPT(day, month, year);
  const season = ""; // opcional: se quiser inferir depois
  const celebration = safeStr(raw?.liturgia) || "";
  const color = safeStr(raw?.cor) || "";

  const primeira = pick0<{ referencia?: string; texto?: string }>(raw?.leituras?.primeiraLeitura);
  const salmo = pick0<{ referencia?: string; texto?: string }>(raw?.leituras?.salmo);
  const segunda = pick0<{ referencia?: string; texto?: string }>(raw?.leituras?.segundaLeitura);
  const evangelho = pick0<{ referencia?: string; texto?: string }>(raw?.leituras?.evangelho);

  const primeiraRef = safeStr(primeira?.referencia);
  const salmoRef = safeStr(salmo?.referencia);
  const segundaRef = safeStr(segunda?.referencia);
  const evangelhoRef = safeStr(evangelho?.referencia);

  // Plain text (mantém compatibilidade)
  const primeiraTexto = safeStr(primeira?.texto);
  const salmoTexto = safeStr(salmo?.texto);
  const segundaTexto = safeStr(segunda?.texto);
  const evangelhoTexto = safeStr(evangelho?.texto);

  const antEntrada = safeStr(raw?.antifonas?.entrada);
  const antComunhao = safeStr(raw?.antifonas?.comunhao);

  // HTML (melhor leitura)
  const primeiraHtml = toReadableHtml(primeiraTexto);
  const salmoHtml = toReadableHtml(salmoTexto);
  const segundaHtml = toReadableHtml(segundaTexto);
  const evangelhoHtml = toReadableHtml(evangelhoTexto);

  const antEntradaHtml = toAntiphonHtml(antEntrada);
  const antComunhaoHtml = toAntiphonHtml(antComunhao);

  const evangelhoPreview = firstSentences(evangelhoTexto || "", 280);

  return {
    dateSlug,
    dateISO,
    dateLabel,
    weekday,
    season,
    celebration,
    color,

    primeiraRef,
    salmoRef,
    segundaRef,
    evangelhoRef,

    primeiraTexto,
    salmoTexto,
    segundaTexto,
    evangelhoTexto,

    antEntrada,
    antComunhao,

    primeiraHtml,
    salmoHtml,
    segundaHtml,
    evangelhoHtml,

    antEntradaHtml,
    antComunhaoHtml,

    evangelhoPreview,
  };
}

export async function fetchLiturgiaByDate(day: number, month: number, year: number) {
  const url = `https://liturgia.up.railway.app/v2/?dia=${day}&mes=${month}&ano=${year}`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`Liturgia API error: ${res.status}`);
  const raw = await res.json();
  return normalizeLiturgiaApi(raw, day, month, year);
}
