// lib/liturgia/api.ts

import { pad2 } from "./date";

export type LiturgiaNormalized = {
  dateSlug: string; // dd-mm-yyyy
  dateISO: string;  // yyyy-mm-dd
  dateLabel: string; // dd/mm/yyyy
  weekday: string;
  season: string;
  celebration: string;
  color: string;

  primeiraRef: string;
  salmoRef: string;
  segundaRef: string;
  evangelhoRef: string;

  primeiraTexto: string;
  salmoTexto: string;
  segundaTexto: string;
  evangelhoTexto: string;

  antEntrada: string;
  antComunhao: string;

  // Texto editorial curto para o hub/preview/snippet
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

export function normalizeLiturgiaApi(raw: any, day: number, month: number, year: number) {
  const dd = pad2(day);
  const mm = pad2(month);

  const dateSlug = `${dd}-${mm}-${year}`;
  const dateISO = `${year}-${mm}-${dd}`;
  const dateLabel = `${dd}/${mm}/${year}`;

  // Seu JSON real:
  // raw.data: "05/01/2026"
  // raw.liturgia: "2ª feira do Tempo do Natal..."
  // raw.cor: "Branco"
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

  const primeiraTexto = safeStr(primeira?.texto);
  const salmoTexto = safeStr(salmo?.texto);
  const segundaTexto = safeStr(segunda?.texto);
  const evangelhoTexto = safeStr(evangelho?.texto);

  const antEntrada = safeStr(raw?.antifonas?.entrada);
  const antComunhao = safeStr(raw?.antifonas?.comunhao);

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
