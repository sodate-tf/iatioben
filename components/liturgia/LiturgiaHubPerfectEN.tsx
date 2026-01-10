// components/liturgia/LiturgiaHubPerfectEN.tsx
"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import type { LiturgiaNormalized } from "@/lib/liturgia/api";

type Props = {
  siteUrl: string;
  hubCanonicalPath: string; // ex: /en/daily-mass-readings/05-01-2026
  dateSlug: string; // dd-mm-yyyy
  data: LiturgiaNormalized;

  prevSlug: string;
  nextSlug: string;

  todaySlug: string;
  todayLabel: string; // ex: 01/10/2026 (en-US) ou “January 10, 2026” — você decide no page.tsx

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
      className={[
        "rounded-xl px-3 py-2 text-sm font-semibold border transition",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
        active
          ? "bg-amber-600 text-white border-amber-600"
          : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
      ].join(" ")}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function HtmlBody({ html, fallbackText }: { html?: string; fallbackText?: string }) {
  const hasHtml = Boolean(html && html.trim());
  const hasText = Boolean(fallbackText && fallbackText.trim());

  if (hasHtml) {
    const safeHtml: string = html ?? "";
    return (
      <div
        className={[
          "text-[15px] sm:text-[16px] leading-7 text-slate-800",
          "[&>p]:mt-3 [&>p:first-child]:mt-0",
          "break-words",
          "[&_a]:text-amber-700 [&_a]:font-semibold [&_a]:underline [&_a]:decoration-amber-300 hover:[&_a]:decoration-amber-500",
          "[&_sub]:align-baseline",
        ].join(" ")}
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    );
  }

  return (
    <div className="whitespace-pre-line text-[15px] sm:text-[16px] leading-7 text-slate-800 break-words">
      {hasText ? fallbackText : "—"}
    </div>
  );
}

function ReadingBlock({
  title,
  refText,
  html,
  text,
}: {
  title: string;
  refText?: string;
  html?: string;
  text?: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">
          {title}
        </p>
        {refText ? (
          <p className="text-sm sm:text-base font-bold text-slate-900">{refText}</p>
        ) : null}
      </div>

      <div className="mt-3">
        <HtmlBody html={html} fallbackText={text} />
      </div>
    </section>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-semibold text-slate-500 uppercase">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-900 break-words">{value || "—"}</p>
    </div>
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
  const canonical = `${siteUrl}${hubCanonicalPath}`;

  const hasSecond = useMemo(() => {
    return Boolean(
      (data.segundaRef && data.segundaRef.trim()) ||
        (data.segundaTexto && data.segundaTexto.trim()) ||
        ((data as any).segundaHtml && String((data as any).segundaHtml).trim())
    );
  }, [data]);

  const [tab, setTab] = useState<TabKey>("readings");

  // Prefer HTML when present (your normalizer already provides it)
  const firstHtml = (data as any).primeiraHtml as string | undefined;
  const psalmHtml = (data as any).salmoHtml as string | undefined;
  const secondHtml = (data as any).segundaHtml as string | undefined;
  const gospelHtml = (data as any).evangelhoHtml as string | undefined;

  const antEntranceHtml = (data as any).antEntradaHtml as string | undefined;
  const antCommunionHtml = (data as any).antComunhaoHtml as string | undefined;

  const dayHref = (slug: string) => `/en/daily-mass-readings/${slug}`;

  return (
    <article
      className={[
        "mx-auto w-full max-w-5xl px-3 sm:px-4 lg:px-6 py-6 bg-white text-slate-900 leading-relaxed",
        "overflow-x-hidden",
        className || "",
      ].join(" ")}
      itemScope
      itemType="https://schema.org/Article"
    >
      <link rel="canonical" href={canonical} />

      <header className="mb-6">
        <p className="text-xs font-semibold tracking-wide text-amber-700 uppercase">
          IA Tio Ben • Liturgy
        </p>

        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
          Daily Mass Readings for {data.dateLabel}: Gospel & Readings
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          {data.celebration ? data.celebration : ""}
          {data.color ? ` • Liturgical color: ${data.color}` : ""}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/en/daily-mass-readings"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
          >
            Readings calendar
          </Link>

          <Link
            href={dayHref(todaySlug)}
            className="rounded-xl bg-amber-600 text-white px-4 py-2 text-sm font-semibold hover:bg-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
          >
            Today • {todayLabel}
          </Link>

          <Link
            href={dayHref(prevSlug)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
          >
            Yesterday
          </Link>

          <Link
            href={dayHref(nextSlug)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
          >
            Tomorrow
          </Link>
        </div>
      </header>

      {/* Quick view (references) */}
      <section className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">Today’s references</h2>
          <p className="text-xs text-slate-500">Use the tabs below for easier reading.</p>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Chip label="First Reading" value={data.primeiraRef || "—"} />
          <Chip label="Responsorial Psalm" value={data.salmoRef || "—"} />
          {hasSecond ? <Chip label="Second Reading" value={data.segundaRef || "—"} /> : null}
          <Chip label="Gospel" value={data.evangelhoRef || "—"} />
        </div>
      </section>

      {/* Tabs */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">Full text</h2>
          <p className="text-xs text-slate-500">Switch sections to reduce scrolling.</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
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

        <div className="mt-4">
          {tab === "readings" ? (
            <div className="space-y-4">
              <ReadingBlock
                title="First Reading"
                refText={data.primeiraRef}
                html={firstHtml}
                text={data.primeiraTexto}
              />

              {hasSecond ? (
                <ReadingBlock
                  title="Second Reading"
                  refText={data.segundaRef}
                  html={secondHtml}
                  text={data.segundaTexto}
                />
              ) : null}
            </div>
          ) : null}

          {tab === "psalm" ? (
            <ReadingBlock
              title="Responsorial Psalm"
              refText={data.salmoRef}
              html={psalmHtml}
              text={data.salmoTexto}
            />
          ) : null}

          {tab === "gospel" ? (
            <ReadingBlock
              title="Gospel"
              refText={data.evangelhoRef}
              html={gospelHtml}
              text={data.evangelhoTexto}
            />
          ) : null}
        </div>
      </section>

      {(data.antEntrada || data.antComunhao) ? (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">Antiphons</h2>

          <div className="mt-4 space-y-4">
            {data.antEntrada ? (
              <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Entrance
                </p>
                <div className="mt-3">
                  <HtmlBody html={antEntranceHtml} fallbackText={data.antEntrada} />
                </div>
              </section>
            ) : null}

            {data.antComunhao ? (
              <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Communion
                </p>
                <div className="mt-3">
                  <HtmlBody html={antCommunionHtml} fallbackText={data.antComunhao} />
                </div>
              </section>
            ) : null}
          </div>
        </section>
      ) : null}

      <footer className="mt-8 border-t border-slate-200 pt-6">
        <p className="text-xs text-slate-500 break-words">
          This page: <span className="font-semibold">{dayHref(dateSlug)}</span>
        </p>
      </footer>

      <meta itemProp="datePublished" content={`${data.dateISO}T06:00:00-03:00`} />
      <meta itemProp="dateModified" content={`${data.dateISO}T06:00:00-03:00`} />
    </article>
  );
}
