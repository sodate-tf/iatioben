// lib/liturgia/api.ts
//
// Ajustes feitos para melhorar experiência de leitura:
// 1) Mantém os campos *Texto* originais (plain text) para compatibilidade.
// 2) Adiciona campos *Html* (primeiraHtml, salmoHtml, etc.) já com:
//    - quebras de linha normalizadas (parágrafos e <br/> quando necessário)
//    - números de versículos destacados como <sup class="...">n</sup>
// 3) Mantém um payload completo (leiturasFull/oracoesFull/antifonasFull) para datas
//    com múltiplas leituras/salmos (ex.: Vigília Pascal), sem “perder” dados.
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

  // Antífonas (plain)
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

  /**
   * ✅ Payload completo (sem perder leituras extras, múltiplos salmos e variantes).
   * Cada item já inclui `textoHtml` pronto.
   */
  leiturasFull?: {
    primeiraLeitura?: Array<{ referencia?: string; texto?: string; textoHtml?: string }>;
    segundaLeitura?: Array<{ referencia?: string; texto?: string; textoHtml?: string }>;
    salmo?: Array<{ referencia?: string; refrao?: string; texto?: string; textoHtml?: string }>;
    evangelho?: Array<{ referencia?: string; texto?: string; textoHtml?: string }>;
    extras?: Array<{
      tipo?: string;
      titulo?: string;
      referencia?: string;
      texto?: string;
      textoHtml?: string;
    }>;
  };

  /**
   * ✅ Orações completas (API raw costuma vir como string).
   */
  oracoesFull?: {
    coleta?: string;
    coletaHtml?: string;
    oferendas?: string;
    oferendasHtml?: string;
    comunhao?: string;
    comunhaoHtml?: string;
    extras?: any[];
  };

  /**
   * ✅ Antífonas completas (API raw costuma vir como string).
   */
  antifonasFull?: {
    entrada?: string;
    entradaHtml?: string;
    comunhao?: string;
    comunhaoHtml?: string;
  };

  /**
   * Opcional: raw original para debug
   */
  raw?: any;
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
 * Observação: são classes Tailwind.
 */
const VERSE_SUP_CLASS =
  "mx-0.5 align-baseline rounded bg-amber-50 px-1 text-[0.75em] font-semibold text-amber-900/90 border border-amber-100";

/**
 * Converte prováveis números de versículos (1–3 dígitos) para <sup>.
 * Heurísticas (conservadoras) para não quebrar números comuns:
 * - início de linha: "1 " / "12 " etc.
 * - após pontuação + espaço: ". 2 " / ": 15 " etc.
 * - não mexe se já existir <sup> no texto
 *
 * Mantive o nome da função para compatibilidade com imports existentes.
 */
export function formatVersesToSub(text: string): string {
  const raw = safeStr(text);
  if (!raw) return "";

  // evita duplicar
  if (raw.includes("<sup")) return raw;

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
    (_m, before, num) => `${before}<sup class="${VERSE_SUP_CLASS}">${num}</sup>`
  );

  return s;
}

/**
 * Converte texto em HTML agradável:
 * - escapa HTML
 * - aplica <sup> nos versículos
 * - cria parágrafos por blocos (linhas vazias)
 * - preserva quebras simples como <br/>
 */
export function toReadableHtml(text: string): string {
  const raw = safeStr(text);
  if (!raw) return "";

  // Aplica sup de versículos e já escapa HTML dentro
  let s = formatVersesToSub(raw);

  // Normaliza blocos
  s = s.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();

  // Divide em blocos por linha vazia (parágrafos)
  const blocks = s
    .split(/\n{2,}/g)
    .map((b) => b.trim())
    .filter(Boolean);

  // Dentro de um bloco, linha simples vira <br/>
  const html = blocks.map((b) => `<p>${b.replace(/\n/g, "<br/>")}</p>`).join("");

  return html;
}

/**
 * Antífonas costumam ser curtas; ainda assim, aplicamos o mesmo pipeline.
 */
export function toAntiphonHtml(text: string): string {
  return toReadableHtml(text);
}

/* =========================
   Normalizer (completo)
   ========================= */

function mapTextoHtml(arr: any) {
  if (!Array.isArray(arr)) return [];
  return arr.map((it: any) => {
    const texto = safeStr(it?.texto);
    return {
      ...it,
      texto,
      textoHtml: texto ? toReadableHtml(texto) : "",
    };
  });
}

function mapSalmoHtml(arr: any) {
  if (!Array.isArray(arr)) return [];
  return arr.map((it: any) => {
    const texto = safeStr(it?.texto);
    return {
      ...it,
      texto,
      textoHtml: texto ? toReadableHtml(texto) : "",
    };
  });
}

function mapExtrasHtml(arr: any) {
  if (!Array.isArray(arr)) return [];
  return arr.map((it: any) => {
    const texto = safeStr(it?.texto);
    return {
      ...it,
      texto,
      textoHtml: texto ? toReadableHtml(texto) : "",
    };
  });
}

export function normalizeLiturgiaApi(
  raw: any,
  day: number,
  month: number,
  year: number
): LiturgiaNormalized {
  const dd = pad2(day);
  const mm = pad2(month);

  const dateSlug = `${dd}-${mm}-${year}`;
  const dateISO = `${year}-${mm}-${dd}`;
  const dateLabel = `${dd}/${mm}/${year}`;

  const weekday = weekdayPT(day, month, year);
  const season = ""; // opcional: se quiser inferir depois
  const celebration = safeStr(raw?.liturgia) || "";
  const color = safeStr(raw?.cor) || "";

  // ✅ LISTAS COMPLETAS (não perde dados)
  const primeiraArr = mapTextoHtml(raw?.leituras?.primeiraLeitura);
  const segundaArr = mapTextoHtml(raw?.leituras?.segundaLeitura);
  const salmoArr = mapSalmoHtml(raw?.leituras?.salmo);
  const evangelhoArr = mapTextoHtml(raw?.leituras?.evangelho);
  const extrasArr = mapExtrasHtml(raw?.leituras?.extras);

  // ✅ “Primários” para compatibilidade (mantém seu comportamento atual)
  const primeira0 = primeiraArr[0] || null;
  const salmo0 = salmoArr[0] || null;
  const segunda0 = segundaArr[0] || null;
  const evangelho0 = evangelhoArr[0] || null;

  const primeiraRef = safeStr(primeira0?.referencia);
  const salmoRef = safeStr(salmo0?.referencia);
  const segundaRef = safeStr(segunda0?.referencia);
  const evangelhoRef = safeStr(evangelho0?.referencia);

  // Plain text (compatibilidade)
  const primeiraTexto = safeStr(primeira0?.texto);
  const salmoTexto = safeStr(salmo0?.texto);
  const segundaTexto = safeStr(segunda0?.texto);
  const evangelhoTexto = safeStr(evangelho0?.texto);

  // Antífonas (API raw vem como string)
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

  // Orações (API raw vem como string)
  const coleta = safeStr(raw?.oracoes?.coleta);
  const oferendas = safeStr(raw?.oracoes?.oferendas);
  const comunhao = safeStr(raw?.oracoes?.comunhao);

  const oracoesFull = {
    coleta: coleta || "",
    coletaHtml: coleta ? toReadableHtml(coleta) : "",
    oferendas: oferendas || "",
    oferendasHtml: oferendas ? toReadableHtml(oferendas) : "",
    comunhao: comunhao || "",
    comunhaoHtml: comunhao ? toReadableHtml(comunhao) : "",
    extras: Array.isArray(raw?.oracoes?.extras) ? raw.oracoes.extras : [],
  };

  const antifonasFull = {
    entrada: antEntrada || "",
    entradaHtml: antEntrada ? toAntiphonHtml(antEntrada) : "",
    comunhao: antComunhao || "",
    comunhaoHtml: antComunhao ? toAntiphonHtml(antComunhao) : "",
  };

  const leiturasFull = {
    primeiraLeitura: primeiraArr,
    segundaLeitura: segundaArr,
    salmo: salmoArr,
    evangelho: evangelhoArr,
    extras: extrasArr,
  };

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

    // ✅ novos campos completos
    leiturasFull,
    oracoesFull,
    antifonasFull,

    // opcional (debug)
    raw,
  };
}

export async function fetchLiturgiaByDate(day: number, month: number, year: number) {
  const url = `https://liturgia.up.railway.app/v2/?dia=${day}&mes=${month}&ano=${year}`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`Liturgia API error: ${res.status}`);
  const raw = await res.json();
  return normalizeLiturgiaApi(raw, day, month, year);
}

export async function fetchLiturgiaByIsoDate(isoDate: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    throw new Error("isoDate inválido. Use YYYY-MM-DD.");
  }

  const [yearStr, monthStr, dayStr] = isoDate.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  return fetchLiturgiaByDate(day, month, year);
}
