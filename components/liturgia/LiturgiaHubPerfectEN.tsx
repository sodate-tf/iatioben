// components/liturgia/LiturgiaHubPerfectEN.tsx
"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { LiturgiaNormalized } from "@/lib/liturgia/api";

type Props = {
  siteUrl: string;
  hubCanonicalPath: string; // e.g.: /en/daily-mass-readings
  dateSlug: string; // MM-DD-YYYY (e.g.: 01-13-2026)
  data: LiturgiaNormalized;

  prevSlug: string; // MM-DD-YYYY
  nextSlug: string; // MM-DD-YYYY

  todaySlug: string; // MM-DD-YYYY
  todayLabel: string; // e.g.: 01/13/2026 or “January 13, 2026”

  className?: string;
};

type DynTab =
  | {
      id: string;
      kind: "reading";
      label: string;
      item: { referencia?: string; texto?: string; textoHtml?: string };
    }
  | {
      id: string;
      kind: "psalm";
      label: string;
      item: { referencia?: string; refrao?: string; texto?: string; textoHtml?: string };
    }
  | {
      id: string;
      kind: "gospel";
      label: string;
      item: { referencia?: string; texto?: string; textoHtml?: string };
    }
  | {
      id: string;
      kind: "extras";
      label: string;
      items: Array<{ tipo?: string; titulo?: string; referencia?: string; texto?: string; textoHtml?: string }>;
    };

function ordinal(n: number) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  const d = n % 10;
  if (d === 1) return `${n}st`;
  if (d === 2) return `${n}nd`;
  if (d === 3) return `${n}rd`;
  return `${n}th`;
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "rounded-xl px-3 py-2 text-sm font-semibold border transition",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
        active
          ? "bg-amber-600 text-white border-amber-600"
          : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/** Simple heuristic to identify PT content (avoids rendering PT antiphons on EN page). */
function looksPortuguese(text?: string) {
  if (!text) return false;
  const t = text.trim();
  if (!t) return false;

  const ptMarkers = [
    "Senhor",
    "vós",
    "vosso",
    "vossa",
    "misericórdia",
    "coração",
    "anjos",
    "trono",
    "alegr",
    "salvação",
    "ó",
    "à",
    "é",
    "ç",
  ];
  const hasDiacritics = /[áàâãéêíóôõúç]/i.test(t);
  const hasMarker = ptMarkers.some((m) => t.toLowerCase().includes(m.toLowerCase()));
  return hasDiacritics || hasMarker;
}

function ptWeekdayToEn(pt?: string) {
  if (!pt) return "";
  const s = pt.toLowerCase().trim();
  const map: Record<string, string> = {
    "segunda-feira": "Monday",
    "terça-feira": "Tuesday",
    "terca-feira": "Tuesday",
    "quarta-feira": "Wednesday",
    "quinta-feira": "Thursday",
    "sexta-feira": "Friday",
    "sábado": "Saturday",
    "sabado": "Saturday",
    domingo: "Sunday",
  };
  return map[s] ?? "";
}

function ptColorToEn(pt?: string) {
  if (!pt) return "";
  const s = pt.toLowerCase().trim();
  const map: Record<string, string> = {
    verde: "Green",
    roxo: "Violet",
    violeta: "Violet",
    branco: "White",
    vermelho: "Red",
    rosa: "Rose",
    preto: "Black",
    dourado: "Gold",
  };
  return map[s] ?? "";
}

/**
 * Pragmatic translation attempt for the most common pattern:
 * "3ª feira da 1ª Semana do Tempo Comum" -> "Tuesday of the 1st Week in Ordinary Time"
 * If it doesn't match, returns empty string (UI will skip printing PT text).
 */
function ptCelebrationToEn(pt?: string) {
  if (!pt) return "";

  const raw = pt.trim();

  const norm = raw
    .replace(/\s+/g, " ")
    .replace(/3ª\s*feira/i, "terça-feira")
    .replace(/3a\s*feira/i, "terça-feira")
    .replace(/2ª\s*feira/i, "segunda-feira")
    .replace(/2a\s*feira/i, "segunda-feira")
    .replace(/4ª\s*feira/i, "quarta-feira")
    .replace(/4a\s*feira/i, "quarta-feira")
    .replace(/5ª\s*feira/i, "quinta-feira")
    .replace(/5a\s*feira/i, "quinta-feira")
    .replace(/6ª\s*feira/i, "sexta-feira")
    .replace(/6a\s*feira/i, "sexta-feira");

  const m = norm.match(
    /^(segunda-feira|terça-feira|terca-feira|quarta-feira|quinta-feira|sexta-feira|sábado|sabado|domingo)\s+da\s+(\d+)ª?\s+Semana\s+do\s+Tempo\s+Comum/i
  );
  if (m) {
    const weekday = ptWeekdayToEn(m[1]);
    const week = Number(m[2]);
    const suffix = week === 1 ? "st" : week === 2 ? "nd" : week === 3 ? "rd" : "th";
    return `${weekday} of the ${week}${suffix} Week in Ordinary Time`;
  }

  return "";
}

function safeHtml(html?: string) {
  return html || "";
}

// Date helpers (EN) — slug MM-DD-YYYY
function parseEnSlugDate_MMDDYYYY(slug?: string) {
  if (!slug) return null;
  const m = slug.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!m) return null;

  const mm = Number(m[1]);
  const dd = Number(m[2]);
  const yyyy = Number(m[3]);

  if (!mm || !dd || !yyyy) return null;

  // Use UTC to avoid timezone shifting the day
  const dt = new Date(Date.UTC(yyyy, mm - 1, dd));
  if (Number.isNaN(dt.getTime())) return null;

  // Basic validation (month/day)
  if (dt.getUTCFullYear() !== yyyy || dt.getUTCMonth() !== mm - 1 || dt.getUTCDate() !== dd) {
    return null;
  }

  return dt;
}

function formatEnLongDate(dt: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(dt);
}

function formatEnShortDate(dt: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(dt);
}

function toISODateInputValueFromUTC(dt: Date) {
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const d = String(dt.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`; // yyyy-mm-dd
}

function toEnSlugFromISODateInput(iso: string) {
  // iso: yyyy-mm-dd
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const yyyy = m[1];
  const mm = m[2];
  const dd = m[3];
  return `${mm}-${dd}-${yyyy}`; // MM-DD-YYYY
}

/** Font-size control used inside the content card (no sticky/floating). */
function FontSizeMenu({
  fontStep,
  setFontStep,
}: {
  fontStep: number;
  setFontStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm",
          "text-sm font-semibold text-slate-800 hover:bg-slate-50",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
        ].join(" ")}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Text size"
      >
        <span className="text-base leading-none">Aa</span>
        <span className="hidden sm:inline text-xs font-semibold text-slate-600">Text</span>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute left-0 z-20 mt-2 w-44 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setFontStep((s) => Math.max(-2, s - 1));
              setOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
          >
            Smaller
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setFontStep(0);
              setOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
          >
            Default
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setFontStep((s) => Math.min(4, s + 1));
              setOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
          >
            Larger
          </button>
        </div>
      ) : null}
    </div>
  );
}

/** Language control (EN/PT) kept local to avoid project-path import ambiguity. */
function LanguageControl({
  enUrl,
  ptUrl,
}: {
  enUrl: string;
  ptUrl: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm",
          "text-sm font-semibold text-slate-800 hover:bg-slate-50",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
        ].join(" ")}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Language"
      >
        <span className="text-xs font-semibold text-slate-600">Lang</span>
        <span>EN</span>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute left-0 z-20 mt-2 w-44 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden"
        >
          <Link
            role="menuitem"
            href={enUrl}
            className="block px-3 py-2 text-sm hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            English (EN)
          </Link>
          <Link
            role="menuitem"
            href={ptUrl}
            className="block px-3 py-2 text-sm hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            Portuguese (PT-BR)
          </Link>
        </div>
      ) : null}
    </div>
  );
}

// EN — “Share” button: shares meaningful text + CTA; fallback copies full message + link
function ShareButton({
  url,
  title,
  text,
}: {
  url: string;
  title: string;
  text: string;
}) {
  const [copied, setCopied] = React.useState(false);

  async function onShare() {
    const fullMessage = `${text}\n\n${url}`;

    try {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share({ title, text, url });
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullMessage);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
        return;
      }

      window.prompt("Copy and send this message:", fullMessage);
    } catch {
      // user canceled / blocked
    }
  }

  return (
    <button
      type="button"
      onClick={onShare}
      className={[
        "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold",
        "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2",
        "active:translate-y-[1px] transition",
      ].join(" ")}
      aria-label="Share this page"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
        <path d="M12 16V4" />
        <path d="M7 9l5-5 5 5" />
      </svg>

      <span>{copied ? "Copied" : "Share"}</span>
    </button>
  );
}

function HtmlBlock({ html, fontPx }: { html: string; fontPx: number }) {
  return (
    <div
      className="leading-7 text-slate-800 [&>p]:mt-3 [&>p:first-child]:mt-0 [&_em]:text-slate-700 [&_strong]:text-slate-900 [&_a]:text-amber-700 [&_a]:font-semibold [&_a]:underline [&_a]:decoration-amber-300 hover:[&_a]:decoration-amber-500 [&_sub]:align-baseline [&_sup]:align-baseline"
      style={{ fontSize: `${fontPx}px` }}
      dangerouslySetInnerHTML={{ __html: html || "<p>—</p>" }}
    />
  );
}

export default function LiturgiaHubPerfectEN({
  siteUrl,
  hubCanonicalPath,
  dateSlug,
  data,
  prevSlug,
  nextSlug,
  todaySlug,
  todayLabel,
  className,
}: Props) {
  const router = useRouter();

  const [activeTabId, setActiveTabId] = useState<string>("r-0");
  const [fontStep, setFontStep] = useState(0);

  const canonical = `${siteUrl}${hubCanonicalPath}/${dateSlug}`;

  const pageDate = useMemo(() => parseEnSlugDate_MMDDYYYY(dateSlug), [dateSlug]);

  const pageLabel = useMemo(() => (pageDate ? formatEnLongDate(pageDate) : dateSlug), [pageDate, dateSlug]);
  const pageLabelShort = useMemo(() => (pageDate ? formatEnShortDate(pageDate) : dateSlug), [pageDate, dateSlug]);

  const pickerISO = useMemo(() => (pageDate ? toISODateInputValueFromUTC(pageDate) : ""), [pageDate]);

  function onPickDate(iso: string) {
    const slug = toEnSlugFromISODateInput(iso);
    if (!slug) return;
    router.push(`${hubCanonicalPath}/${slug}`);
  }

  const fontPx = useMemo(() => {
    const base = 16;
    return Math.max(13, Math.min(22, base + fontStep));
  }, [fontStep]);

  const shareTitle = `Daily Mass Readings for ${pageLabelShort}: ${
    data.evangelhoRef ? `Gospel — ${data.evangelhoRef}` : "Gospel & Readings"
  }`;

  const shareText = [
    `Daily Mass Readings for ${pageLabelShort}.`,
    data.evangelhoRef ? `Gospel: ${data.evangelhoRef}.` : null,
    "Open the link to read the full readings and share it with someone.",
  ]
    .filter(Boolean)
    .join(" ");

  const weekdayEN = useMemo(() => ptWeekdayToEn(data.weekday) || "", [data.weekday]);
  const colorEN = useMemo(() => ptColorToEn(data.color) || "", [data.color]);
  const celebrationEN = useMemo(() => ptCelebrationToEn(data.celebration) || "", [data.celebration]);

  const ptDayPath = useMemo(() => {
    const ddmmyyyy = data.dateSlug || "";
    return ddmmyyyy ? `/liturgia-diaria/${ddmmyyyy}` : "/liturgia-diaria";
  }, [data.dateSlug]);

  const enDayPath = useMemo(() => `${hubCanonicalPath}/${dateSlug}`, [hubCanonicalPath, dateSlug]);

  const hasAntiphonsEN = useMemo(() => {
    const a1 = data.antEntradaHtml || data.antEntrada;
    const a2 = data.antComunhaoHtml || data.antComunhao;
    if (!a1 && !a2) return false;
    return !(looksPortuguese(a1) || looksPortuguese(a2));
  }, [data.antEntradaHtml, data.antEntrada, data.antComunhaoHtml, data.antComunhao]);

  const content = useMemo(() => {
    const full = (data as any)?.leiturasFull;

    const first: any[] = Array.isArray(full?.primeiraLeitura) ? full.primeiraLeitura : [];
    const second: any[] = Array.isArray(full?.segundaLeitura) ? full.segundaLeitura : [];
    const psalms: any[] = Array.isArray(full?.salmo) ? full.salmo : [];
    const gospels: any[] = Array.isArray(full?.evangelho) ? full.evangelho : [];
    const extras: any[] = Array.isArray(full?.extras) ? full.extras : [];

    const hasAny = (it: any) =>
      Boolean(
        (it?.referencia && String(it.referencia).trim()) ||
          (it?.textoHtml && String(it.textoHtml).trim()) ||
          (it?.texto && String(it.texto).trim())
      );

    let readings = [...first, ...second].filter(hasAny);

    if (!readings.length && (data.primeiraRef || data.primeiraHtml || data.primeiraTexto)) {
      readings = [
        { referencia: data.primeiraRef, texto: data.primeiraTexto, textoHtml: data.primeiraHtml },
      ];
      if (data.segundaRef || data.segundaHtml || data.segundaTexto) {
        readings.push({ referencia: data.segundaRef, texto: data.segundaTexto, textoHtml: data.segundaHtml });
      }
    }

    let ps = psalms.filter(hasAny);
    if (!ps.length && (data.salmoRef || data.salmoHtml || data.salmoTexto)) {
      ps = [{ referencia: data.salmoRef, refrao: "", texto: data.salmoTexto, textoHtml: data.salmoHtml }];
    }

    let gos = gospels.filter(hasAny);
    if (!gos.length && (data.evangelhoRef || data.evangelhoHtml || data.evangelhoTexto)) {
      gos = [{ referencia: data.evangelhoRef, texto: data.evangelhoTexto, textoHtml: data.evangelhoHtml }];
    }

    return { readings, psalms: ps, gospels: gos, extras: extras.filter(hasAny) };
  }, [data]);

  const refFirstReading = content.readings[0]?.referencia || data.primeiraRef || "—";
  const refSecondReading = content.readings[1]?.referencia || data.segundaRef || "";
  const showSecondReading = Boolean(refSecondReading && String(refSecondReading).trim());
  const refPsalm = content.psalms[0]?.referencia || data.salmoRef || "—";
  const refGospel = content.gospels[0]?.referencia || data.evangelhoRef || "—";
  const extraReadingsCount = Math.max(0, content.readings.length - 2);

  const tabs = useMemo<DynTab[]>(() => {
    const out: DynTab[] = [];

    for (let i = 0; i < content.readings.length; i++) {
      out.push({ id: `r-${i}`, kind: "reading", label: `${ordinal(i + 1)} Reading`, item: content.readings[i] });

      if (content.psalms[i]) {
        out.push({
          id: `p-${i}`,
          kind: "psalm",
          label: i === 0 ? "Psalm" : `Psalm ${i + 1}`,
          item: content.psalms[i],
        });
      }
    }

    if (content.gospels[0]) {
      out.push({ id: "g-0", kind: "gospel", label: "Gospel", item: content.gospels[0] });
    }

    if (content.extras.length) {
      out.push({ id: "x", kind: "extras", label: "More", items: content.extras });
    }

    if (!out.length) {
      out.push({
        id: "g-0",
        kind: "gospel",
        label: "Gospel",
        item: { referencia: data.evangelhoRef, textoHtml: safeHtml(data.evangelhoHtml) },
      });
    }

    return out;
  }, [content, data.evangelhoRef, data.evangelhoHtml]);

  useEffect(() => {
    if (!tabs.length) return;
    if (!tabs.some((t) => t.id === activeTabId)) setActiveTabId(tabs[0].id);
  }, [tabs, activeTabId]);

  const activeTab = useMemo(() => tabs.find((t) => t.id === activeTabId) ?? tabs[0], [tabs, activeTabId]);

  return (
    <article
      className={[
        "mx-auto w-full max-w-5xl px-3 sm:px-4 lg:px-6 py-6",
        "bg-white text-slate-900 leading-relaxed overflow-x-hidden",
        className ?? "",
      ].join(" ")}
      itemScope
      itemType="https://schema.org/Article"
    >
      <header className="mb-6">
        <p className="text-xs font-semibold tracking-wide text-amber-700 uppercase">IA Tio Ben • Liturgy</p>

        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
          Daily Mass Readings for {pageLabel}: {data.evangelhoRef ? `Gospel — ${data.evangelhoRef}` : "Gospel & Readings"}
        </h1>

        {(celebrationEN || colorEN || weekdayEN) && (
          <p className="mt-2 text-sm text-slate-600">
            {celebrationEN ? celebrationEN : null}
            {celebrationEN && (colorEN || weekdayEN) ? " • " : null}
            {colorEN ? `Liturgical color: ${colorEN}` : null}
            {colorEN && weekdayEN ? " • " : null}
            {weekdayEN ? weekdayEN : null}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            className="rounded-xl bg-amber-600 text-white px-4 py-2 text-sm font-semibold hover:bg-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
            href={`${hubCanonicalPath}/${todaySlug}`}
          >
            Today • {todayLabel}
          </Link>

          <Link
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
            href={`${hubCanonicalPath}/${prevSlug}`}
          >
            Yesterday
          </Link>

          <Link
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
            href={`${hubCanonicalPath}/${nextSlug}`}
          >
            Tomorrow
          </Link>
        </div>
      </header>

      {/* Reference cards */}
      <section className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
        <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">First Reading</p>
            <p className="mt-1 text-sm font-bold text-slate-900 break-words">{refFirstReading}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Responsorial Psalm</p>
            <p className="mt-1 text-sm font-bold text-slate-900 break-words">{refPsalm}</p>
          </div>

          {showSecondReading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Second Reading</p>
              <p className="mt-1 text-sm font-bold text-slate-900 break-words">{refSecondReading}</p>
              {extraReadingsCount > 0 ? (
                <p className="mt-2 text-xs text-slate-500">
                  +{extraReadingsCount} more reading{extraReadingsCount > 1 ? "s" : ""}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Gospel</p>
            <p className="mt-1 text-sm font-bold text-slate-900 break-words">{refGospel}</p>
          </div>
        </div>
      </section>

      {/* Tabs + controls inside the block (calendar, font, share, language) */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <span className="hidden sm:inline text-xs font-semibold text-slate-600">Date</span>
            <input
              type="date"
              value={pickerISO}
              onChange={(e) => onPickDate(e.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
              aria-label="Pick a date"
            />
          </div>

          <FontSizeMenu fontStep={fontStep} setFontStep={setFontStep} />

          <ShareButton url={canonical} title={shareTitle} text={shareText} />

          <div className="ml-0 sm:ml-1">
            <LanguageControl enUrl={enDayPath} ptUrl={ptDayPath} />
          </div>
        </div>

        <p className="mt-4 text-sm font-semibold text-slate-700">Readings, Psalms & Gospel</p>

        <div className="mt-3 -mx-1 px-1 overflow-x-auto">
          <div className="flex gap-2 pb-1">
            {tabs.map((t) => (
              <TabButton key={t.id} active={activeTabId === t.id} onClick={() => setActiveTabId(t.id)}>
                {t.label}
              </TabButton>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {activeTab?.kind === "reading" ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="flex flex-col gap-1">
                <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">{activeTab.label}</p>
                <p className="text-sm sm:text-base font-bold text-slate-900">{activeTab.item?.referencia || "—"}</p>
              </div>

              <div className="mt-3">
                <HtmlBlock html={safeHtml(activeTab.item?.textoHtml) || "<p>—</p>"} fontPx={fontPx} />
              </div>
            </section>
          ) : null}

          {activeTab?.kind === "psalm" ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="flex flex-col gap-1">
                <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">{activeTab.label}</p>
                <p className="text-sm sm:text-base font-bold text-slate-900">{activeTab.item?.referencia || "—"}</p>
                {activeTab.item?.refrao ? <p className="mt-1 text-sm text-slate-700 italic">{activeTab.item.refrao}</p> : null}
              </div>

              <div className="mt-3">
                <HtmlBlock html={safeHtml(activeTab.item?.textoHtml) || "<p>—</p>"} fontPx={fontPx} />
              </div>
            </section>
          ) : null}

          {activeTab?.kind === "gospel" ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="flex flex-col gap-1">
                <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">Gospel</p>
                <p className="text-sm sm:text-base font-bold text-slate-900">{activeTab.item?.referencia || data.evangelhoRef || "—"}</p>
              </div>

              <div className="mt-3">
                <HtmlBlock html={safeHtml(activeTab.item?.textoHtml) || "<p>—</p>"} fontPx={fontPx} />
              </div>
            </section>
          ) : null}

          {activeTab?.kind === "extras" ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="flex flex-col gap-1">
                <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">More Readings & Prayers</p>
                <p className="text-sm text-slate-600">Additional blocks from the official liturgy feed.</p>
              </div>

              <div className="mt-4 space-y-4">
                {activeTab.items.map((it, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{it?.tipo || "Extra"}</p>
                      <p className="text-sm font-bold text-slate-900">{it?.titulo || it?.referencia || "—"}</p>
                    </div>

                    <div className="mt-3">
                      <HtmlBlock html={safeHtml(it?.textoHtml) || "<p>—</p>"} fontPx={fontPx} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>

      {/* Antiphons */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight">Antiphons</h2>

        {hasAntiphonsEN ? (
          <div className="mt-4 space-y-4">
            {!!(data.antEntradaHtml || data.antEntrada) && (
              <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Entrance</p>
                <div className="mt-3">
                  <HtmlBlock
                    html={data.antEntradaHtml || (data.antEntrada ? `<p>${data.antEntrada}</p>` : "<p>—</p>")}
                    fontPx={fontPx}
                  />
                </div>
              </section>
            )}

            {!!(data.antComunhaoHtml || data.antComunhao) && (
              <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Communion</p>
                <div className="mt-3">
                  <HtmlBlock
                    html={data.antComunhaoHtml || (data.antComunhao ? `<p>${data.antComunhao}</p>` : "<p>—</p>")}
                    fontPx={fontPx}
                  />
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-sm text-slate-800">
            Antiphons are not available in English for this date.
          </div>
        )}
      </section>

      <footer className="mt-8 border-t border-slate-200 pt-6">
        <p className="text-xs text-slate-500 break-words">
          This page: <span className="font-semibold">{hubCanonicalPath}/{dateSlug}</span>
        </p>
      </footer>
    </article>
  );
}
