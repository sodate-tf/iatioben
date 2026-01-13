// components/liturgia/LiturgiaHubPerfectEN.tsx
"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import type { LiturgiaNormalized } from "@/lib/liturgia/api";
import DailyParagraph from "./DailyParagraph";

type Props = {
  siteUrl: string;

  /**
   * Canonical base path for the English hub (no trailing date).
   * Example: /en/daily-mass-readings
   */
  hubCanonicalPath: string;

  /**
   * Current page slug for EN routes.
   * IMPORTANT: EN uses MM-DD-YYYY (e.g., 01-13-2026)
   */
  dateSlug: string; // mm-dd-yyyy

  data: LiturgiaNormalized;

  /** Adjacent day slugs for EN routes (MM-DD-YYYY) */
  prevSlug: string;
  nextSlug: string;

  /** Today slug/label (EN) */
  todaySlug: string; // mm-dd-yyyy
  todayLabel: string; // e.g., 01/13/2026 or “January 13, 2026”

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

function HtmlBody({
  html,
  fallbackText,
}: {
  html?: string;
  fallbackText?: string;
}) {
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
        // NOTE: ensure upstream sanitizer/normalizer produces safe HTML
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
          <p className="text-sm sm:text-base font-bold text-slate-900">
            {refText}
          </p>
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
      <p className="text-[11px] font-semibold text-slate-500 uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-slate-900 break-words">
        {value || "—"}
      </p>
    </div>
  );
}

function isValidEnSlugMMDDYYYY(slug: string): boolean {
  // MM-DD-YYYY (with leading zeros)
  if (!slug) return false;
  if (!/^\d{2}-\d{2}-\d{4}$/.test(slug)) return false;

  const [mmS, ddS, yyyyS] = slug.split("-");
  const mm = Number(mmS);
  const dd = Number(ddS);
  const yyyy = Number(yyyyS);
  if (!mm || !dd || !yyyy) return false;
  if (mm < 1 || mm > 12) return false;
  if (dd < 1 || dd > 31) return false;

  // Validate real date
  const dt = new Date(Date.UTC(yyyy, mm - 1, dd, 12, 0, 0));
  return (
    dt.getUTCFullYear() === yyyy &&
    dt.getUTCMonth() === mm - 1 &&
    dt.getUTCDate() === dd
  );
}

function enUSLabelFromISO(dateISO?: string): string {
  // dateISO: YYYY-MM-DD
  if (!dateISO) return "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateISO)) return "";

  // Use midday UTC to avoid timezone edge cases
  const dt = new Date(`${dateISO}T12:00:00Z`);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

export default function LiturgiaHubPerfectEN({
  // siteUrl and hubCanonicalPath are intentionally not used inside the client component:
  // canonical/metadata must be handled in generateMetadata (server side).
  siteUrl: _siteUrl,
  hubCanonicalPath: _hubCanonicalPath,
  dateSlug,
  data,
  prevSlug,
  nextSlug,
  todaySlug,
  todayLabel,
  className,
}: Props) {
  const [tab, setTab] = useState<TabKey>("readings");

  // Prefer normalized HTML when present
  const firstHtml = (data as any).primeiraHtml as string | undefined;
  const psalmHtml = (data as any).salmoHtml as string | undefined;
  const secondHtml = (data as any).segundaHtml as string | undefined;
  const gospelHtml = (data as any).evangelhoHtml as string | undefined;

  const antEntranceHtml = (data as any).antEntradaHtml as string | undefined;
  const antCommunionHtml = (data as any).antComunhaoHtml as string | undefined;

  const hasSecond = useMemo(() => {
    return Boolean(
      (data.segundaRef && data.segundaRef.trim()) ||
        (data.segundaTexto && data.segundaTexto.trim()) ||
        (secondHtml && secondHtml.trim())
    );
  }, [data.segundaRef, data.segundaTexto, secondHtml]);

  const dayHref = (slug: string) => `/en/daily-mass-readings/${slug}`;

  // Robust title label derived from ISO (not from PT dateLabel)
  const dateLabelUS = useMemo(() => enUSLabelFromISO(data?.dateISO), [data?.dateISO]);

  // Defensive: if caller passes an invalid slug, still render but avoid generating broken self-link
  const safeDateSlug = useMemo(() => {
    return isValidEnSlugMMDDYYYY(dateSlug) ? dateSlug : todaySlug;
  }, [dateSlug, todaySlug]);

  const safePrevSlug = useMemo(() => {
    return isValidEnSlugMMDDYYYY(prevSlug) ? prevSlug : todaySlug;
  }, [prevSlug, todaySlug]);

  const safeNextSlug = useMemo(() => {
    return isValidEnSlugMMDDYYYY(nextSlug) ? nextSlug : todaySlug;
  }, [nextSlug, todaySlug]);

  const safeTodaySlug = useMemo(() => {
    return isValidEnSlugMMDDYYYY(todaySlug) ? todaySlug : safeDateSlug;
  }, [todaySlug, safeDateSlug]);

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
      <header className="mb-6">
        <p className="text-xs font-semibold tracking-wide text-amber-700 uppercase">
          IA Tio Ben • Liturgy
        </p>

        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
          Daily Mass Readings for {dateLabelUS || todayLabel}: Gospel &amp; Readings
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          {data.celebration ? data.celebration : ""}
          {data.color ? ` • Liturgical color: ${data.color}` : ""}
        </p>

        {/* Editorial paragraph of the day (Liturgical season / special dates) */}
        <div className="mt-3">
          <DailyParagraph date={safeDateSlug} locale="en" />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/en/daily-mass-readings"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
          >
            Readings calendar
          </Link>

          <Link
            href={dayHref(safeTodaySlug)}
            className="rounded-xl bg-amber-600 text-white px-4 py-2 text-sm font-semibold hover:bg-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
          >
            Today • {todayLabel}
          </Link>

          <Link
            href={dayHref(safePrevSlug)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
          >
            Yesterday
          </Link>

          <Link
            href={dayHref(safeNextSlug)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
          >
            Tomorrow
          </Link>
        </div>
      </header>

      {/* Quick view (references) */}
      <section className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Chip label="First Reading" value={data.primeiraRef || "—"} />
          <Chip label="Responsorial Psalm" value={data.salmoRef || "—"} />
          {hasSecond ? (
            <Chip label="Second Reading" value={data.segundaRef || "—"} />
          ) : null}
          <Chip label="Gospel" value={data.evangelhoRef || "—"} />
        </div>
      </section>

      {/* Tabs */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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

      {data.antEntrada || data.antComunhao ? (
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
          This page:{" "}
          <span className="font-semibold">{dayHref(safeDateSlug)}</span>
        </p>
      </footer>

      {/* Use ISO (stable) for structured data timestamps */}
      <meta itemProp="datePublished" content={`${data.dateISO}T06:00:00-03:00`} />
      <meta itemProp="dateModified" content={`${data.dateISO}T06:00:00-03:00`} />
    </article>
  );
}
