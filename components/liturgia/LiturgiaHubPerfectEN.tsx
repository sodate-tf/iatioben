// components/liturgia/LiturgiaHubPerfectEN.tsx
"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import type { LiturgiaNormalized } from "@/lib/liturgia/api";

type Props = {
  siteUrl: string;
  hubCanonicalPath: string; // ex: /en/daily-mass-readings
  dateSlug: string; // MM-DD-YYYY (ex: 01-13-2026)
  data: LiturgiaNormalized;

  prevSlug: string; // MM-DD-YYYY
  nextSlug: string; // MM-DD-YYYY

  todaySlug: string; // MM-DD-YYYY
  todayLabel: string; // ex: 01/13/2026 ou “January 13, 2026”

  className?: string;
};

type TabKey = "readings" | "psalm" | "gospel";

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

/** Heurística simples para identificar texto PT (evita renderizar antífonas PT na página EN). */
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
  const hasMarker = ptMarkers.some((m) =>
    t.toLowerCase().includes(m.toLowerCase())
  );
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
    "domingo": "Sunday",
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
 * Tentativa pragmática de traduzir o padrão mais frequente:
 * "3ª feira da 1ª Semana do Tempo Comum" -> "Tuesday of the 1st Week in Ordinary Time"
 * Se não casar, retorna vazio (e a UI não imprime o texto PT).
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
    const suffix =
      week === 1 ? "st" : week === 2 ? "nd" : week === 3 ? "rd" : "th";
    return `${weekday} of the ${week}${suffix} Week in Ordinary Time`;
  }

  return "";
}

function safeHtml(html?: string) {
  if (!html) return "";
  return html;
}

// EN — “Share” button with accent color + share icon
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
    try {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share({ title, text, url });
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
        return;
      }

      window.prompt("Copy this link:", url);
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
      {/* share icon */}
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

      <span>{copied ? "Link copied" : "Share"}</span>
    </button>
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
  const [tab, setTab] = useState<TabKey>("readings");

  const canonical = `${siteUrl}${hubCanonicalPath}/${dateSlug}`;

  const shareTitle = `Daily Mass Readings for ${todayLabel}: ${
    data.evangelhoRef || "Gospel & Readings"
  }`;

  const shareText = [
    // celebrationEN preferível, mas como é memo abaixo, fazemos aqui de forma robusta:
    data.celebration ? ptCelebrationToEn(data.celebration) || null : null,
    data.primeiraRef ? `First Reading: ${data.primeiraRef}` : null,
    data.salmoRef ? `Psalm: ${data.salmoRef}` : null,
    data.evangelhoRef ? `Gospel: ${data.evangelhoRef}` : null,
    "Pray and prepare for Mass with IA Tio Ben.",
  ]
    .filter(Boolean)
    .join(" • ");

  const weekdayEN = useMemo(() => {
    const byPt = ptWeekdayToEn(data.weekday);
    return byPt || "";
  }, [data.weekday]);

  const colorEN = useMemo(() => {
    const byPt = ptColorToEn(data.color);
    return byPt || "";
  }, [data.color]);

  const celebrationEN = useMemo(() => {
    const byPt = ptCelebrationToEn(data.celebration);
    return byPt || "";
  }, [data.celebration]);

  const ptDayPath = useMemo(() => {
    const ddmmyyyy = data.dateSlug || "";
    return ddmmyyyy ? `/liturgia-diaria/${ddmmyyyy}` : "/liturgia-diaria";
  }, [data.dateSlug]);

  const hasAntiphonsEN = useMemo(() => {
    const a1 = data.antEntradaHtml || data.antEntrada;
    const a2 = data.antComunhaoHtml || data.antComunhao;
    if (!a1 && !a2) return false;

    const ptLike = looksPortuguese(a1) || looksPortuguese(a2);
    return !ptLike;
  }, [data.antEntradaHtml, data.antEntrada, data.antComunhaoHtml, data.antComunhao]);

  const readingsHtml = useMemo(() => safeHtml(data.primeiraHtml), [data.primeiraHtml]);
  const psalmHtml = useMemo(() => safeHtml(data.salmoHtml), [data.salmoHtml]);
  const gospelHtml = useMemo(() => safeHtml(data.evangelhoHtml), [data.evangelhoHtml]);

  const showSecondReading = Boolean(data.segundaRef?.trim());

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
        <p className="text-xs font-semibold tracking-wide text-amber-700 uppercase">
          IA Tio Ben • Liturgy
        </p>

        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
          Daily Mass Readings for {todayLabel}: Gospel &amp; Readings
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
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
            href={hubCanonicalPath}
          >
            Readings calendar
          </Link>

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

          <ShareButton url={canonical} title={shareTitle} text={shareText} />
        </div>
      </header>

      {/* Reference cards */}
      <section className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
        <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">
              First Reading
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900 break-words">
              {data.primeiraRef || "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">
              Responsorial Psalm
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900 break-words">
              {data.salmoRef || "—"}
            </p>
          </div>

          {showSecondReading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">
                Second Reading
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900 break-words">
                {data.segundaRef}
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">
              Gospel
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900 break-words">
              {data.evangelhoRef || "—"}
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mt-1 flex flex-wrap gap-2">
          <TabButton active={tab === "readings"} onClick={() => setTab("readings")}>
            Readings
          </TabButton>
          <TabButton active={tab === "psalm"} onClick={() => setTab("psalm")}>
            Psalm
          </TabButton>
          <TabButton active={tab === "gospel"} onClick={() => setTab("gospel")}>
            Gospel
          </TabButton>
        </div>

        <div className="mt-4 space-y-4">
          {tab === "readings" && (
            <>
              <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                <div className="flex flex-col gap-1">
                  <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">
                    First Reading
                  </p>
                  <p className="text-sm sm:text-base font-bold text-slate-900">
                    {data.primeiraRef || "—"}
                  </p>
                </div>

                <div className="mt-3">
                  <div
                    className="text-[15px] sm:text-[16px] leading-7 text-slate-800 [&>p]:mt-3 [&>p:first-child]:mt-0 break-words [&_a]:text-amber-700 [&_a]:font-semibold [&_a]:underline [&_a]:decoration-amber-300 hover:[&_a]:decoration-amber-500 [&_sub]:align-baseline"
                    dangerouslySetInnerHTML={{ __html: readingsHtml || "<p>—</p>" }}
                  />
                </div>
              </section>

              {showSecondReading && (
                <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                  <div className="flex flex-col gap-1">
                    <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">
                      Second Reading
                    </p>
                    <p className="text-sm sm:text-base font-bold text-slate-900">
                      {data.segundaRef}
                    </p>
                  </div>

                  <div className="mt-3">
                    <div
                      className="text-[15px] sm:text-[16px] leading-7 text-slate-800 [&>p]:mt-3 [&>p:first-child]:mt-0 break-words [&_a]:text-amber-700 [&_a]:font-semibold [&_a]:underline [&_a]:decoration-amber-300 hover:[&_a]:decoration-amber-500 [&_sub]:align-baseline"
                      dangerouslySetInnerHTML={{
                        __html: safeHtml(data.segundaHtml) || "<p>—</p>",
                      }}
                    />
                  </div>
                </section>
              )}
            </>
          )}

          {tab === "psalm" && (
            <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="flex flex-col gap-1">
                <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">
                  Responsorial Psalm
                </p>
                <p className="text-sm sm:text-base font-bold text-slate-900">
                  {data.salmoRef || "—"}
                </p>
              </div>

              <div className="mt-3">
                <div
                  className="text-[15px] sm:text-[16px] leading-7 text-slate-800 [&>p]:mt-3 [&>p:first-child]:mt-0 break-words [&_a]:text-amber-700 [&_a]:font-semibold [&_a]:underline [&_a]:decoration-amber-300 hover:[&_a]:decoration-amber-500 [&_sub]:align-baseline"
                  dangerouslySetInnerHTML={{ __html: psalmHtml || "<p>—</p>" }}
                />
              </div>
            </section>
          )}

          {tab === "gospel" && (
            <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="flex flex-col gap-1">
                <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">
                  Gospel
                </p>
                <p className="text-sm sm:text-base font-bold text-slate-900">
                  {data.evangelhoRef || "—"}
                </p>
              </div>

              <div className="mt-3">
                <div
                  className="text-[15px] sm:text-[16px] leading-7 text-slate-800 [&>p]:mt-3 [&>p:first-child]:mt-0 break-words [&_a]:text-amber-700 [&_a]:font-semibold [&_a]:underline [&_a]:decoration-amber-300 hover:[&_a]:decoration-amber-500 [&_sub]:align-baseline"
                  dangerouslySetInnerHTML={{ __html: gospelHtml || "<p>—</p>" }}
                />
              </div>
            </section>
          )}
        </div>
      </section>

      {/* Antiphons */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight">Antiphons</h2>

        {hasAntiphonsEN ? (
          <div className="mt-4 space-y-4">
            {!!(data.antEntradaHtml || data.antEntrada) && (
              <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Entrance
                </p>
                <div className="mt-3">
                  <div
                    className="text-[15px] sm:text-[16px] leading-7 text-slate-800 [&>p]:mt-3 [&>p:first-child]:mt-0 break-words"
                    dangerouslySetInnerHTML={{
                      __html:
                        data.antEntradaHtml ||
                        (data.antEntrada ? `<p>${data.antEntrada}</p>` : "<p>—</p>"),
                    }}
                  />
                </div>
              </section>
            )}

            {!!(data.antComunhaoHtml || data.antComunhao) && (
              <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Communion
                </p>
                <div className="mt-3">
                  <div
                    className="text-[15px] sm:text-[16px] leading-7 text-slate-800 [&>p]:mt-3 [&>p:first-child]:mt-0 break-words"
                    dangerouslySetInnerHTML={{
                      __html:
                        data.antComunhaoHtml ||
                        (data.antComunhao ? `<p>${data.antComunhao}</p>` : "<p>—</p>"),
                    }}
                  />
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-sm text-slate-800">
            <p className="font-semibold">Antiphons are not available in English yet.</p>
            <p className="mt-1">
              You can view the antiphons on the Portuguese page for this day:
              <Link className="ml-1 font-semibold text-amber-800 underline" href={ptDayPath}>
                open PT liturgy
              </Link>
              .
            </p>
          </div>
        )}
      </section>

      <footer className="mt-8 border-t border-slate-200 pt-6">
        <p className="text-xs text-slate-500 break-words">
          This page:{" "}
          <span className="font-semibold">
            {hubCanonicalPath}/{dateSlug}
          </span>
        </p>
      </footer>
    </article>
  );
}
