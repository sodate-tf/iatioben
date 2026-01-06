// components/liturgia/LiturgiaHubPerfect.tsx

"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import type { LiturgiaNormalized } from "@/lib/liturgia/api";

type Props = {
  siteUrl: string;
  hubCanonicalPath: string; // ex: /liturgia-diaria/05-01-2026
  dateSlug: string; // dd-mm-aaaa
  data: LiturgiaNormalized;
  prevSlug: string;
  nextSlug: string;

  // para o botão “Hoje” (sem depender de Date.now() no client)
  todaySlug: string;
  todayLabel: string;

  className?: string;
};

type TabKey = "leituras" | "salmo" | "evangelho";

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

function Chip({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-semibold text-slate-500 uppercase">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-900 break-words">{value || "—"}</p>
    </div>
  );
}

export default function LiturgiaHubPerfect({
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
        // quando existir:
        ((data as any).segundaHtml && String((data as any).segundaHtml).trim())
    );
  }, [data]);

  const [tab, setTab] = useState<TabKey>("leituras");

  // Preferir HTML (novo), cair para Texto (antigo)
  const primeiraHtml = (data as any).primeiraHtml as string | undefined;
  const salmoHtml = (data as any).salmoHtml as string | undefined;
  const segundaHtml = (data as any).segundaHtml as string | undefined;
  const evangelhoHtml = (data as any).evangelhoHtml as string | undefined;

  const antEntradaHtml = (data as any).antEntradaHtml as string | undefined;
  const antComunhaoHtml = (data as any).antComunhaoHtml as string | undefined;

  return (
    <article
      className={[
        "mx-auto w-full max-w-5xl px-3 sm:px-4 lg:px-6 py-6 bg-white text-slate-900 leading-relaxed",
        // melhora de leitura: limita linhas e dá “respiro”
        "overflow-x-hidden",
        className || "",
      ].join(" ")}
      itemScope
      itemType="https://schema.org/Article"
    >
      <link rel="canonical" href={canonical} />

      <header className="mb-6">
        <p className="text-xs font-semibold tracking-wide text-amber-700 uppercase">
          IA Tio Ben • Liturgia
        </p>

        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
          Liturgia diária de {data.dateLabel}: Evangelho e leituras da Missa
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          {data.celebration || ""}
          {data.color ? ` • Cor litúrgica: ${data.color}` : ""}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/liturgia-diaria"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
          >
            Calendário da Liturgia
          </Link>

          <Link
            href={`/liturgia-diaria/${todaySlug}`}
            className="rounded-xl bg-amber-600 text-white px-4 py-2 text-sm font-semibold hover:bg-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
          >
            Hoje • {todayLabel}
          </Link>

          <Link
            href={`/liturgia-diaria/${prevSlug}`}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
          >
            Ontem
          </Link>

          <Link
            href={`/liturgia-diaria/${nextSlug}`}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
          >
            Amanhã
          </Link>
        </div>
      </header>

      {/* Visão rápida (referências) */}
      <section className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">Referências do dia</h2>
          <p className="text-xs text-slate-500">
            Use as abas abaixo para ler com conforto.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Chip label="Primeira Leitura" value={data.primeiraRef || "—"} />
          <Chip label="Salmo" value={data.salmoRef || "—"} />
          {hasSecond ? <Chip label="Segunda Leitura" value={data.segundaRef || "—"} /> : null}
          <Chip label="Evangelho" value={data.evangelhoRef || "—"} />
        </div>
      </section>

      {/* Tabs */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">Texto completo</h2>
          <p className="text-xs text-slate-500">
            Alternar seções reduz “rolagem” e melhora a leitura.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <TabButton active={tab === "leituras"} onClick={() => setTab("leituras")}>
            Leituras
          </TabButton>
          <TabButton active={tab === "salmo"} onClick={() => setTab("salmo")}>
            Salmo
          </TabButton>
          <TabButton active={tab === "evangelho"} onClick={() => setTab("evangelho")}>
            Evangelho
          </TabButton>
        </div>

        <div className="mt-4">
          {tab === "leituras" ? (
            <div className="space-y-4">
              <ReadingBlock
                title="Primeira Leitura"
                refText={data.primeiraRef}
                html={primeiraHtml}
                text={data.primeiraTexto}
              />
              {hasSecond ? (
                <ReadingBlock
                  title="Segunda Leitura"
                  refText={data.segundaRef}
                  html={segundaHtml}
                  text={data.segundaTexto}
                />
              ) : null}
            </div>
          ) : null}

          {tab === "salmo" ? (
            <ReadingBlock
              title="Salmo"
              refText={data.salmoRef}
              html={salmoHtml}
              text={data.salmoTexto}
            />
          ) : null}

          {tab === "evangelho" ? (
            <ReadingBlock
              title="Evangelho"
              refText={data.evangelhoRef}
              html={evangelhoHtml}
              text={data.evangelhoTexto}
            />
          ) : null}
        </div>
      </section>

      {(data.antEntrada || data.antComunhao) ? (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">Antífonas</h2>

          <div className="mt-4 space-y-4">
            {data.antEntrada ? (
              <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Entrada</p>
                <div className="mt-3">
                  <HtmlBody html={antEntradaHtml} fallbackText={data.antEntrada} />
                </div>
              </section>
            ) : null}

            {data.antComunhao ? (
              <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Comunhão</p>
                <div className="mt-3">
                  <HtmlBody html={antComunhaoHtml} fallbackText={data.antComunhao} />
                </div>
              </section>
            ) : null}
          </div>
        </section>
      ) : null}

      <footer className="mt-8 border-t border-slate-200 pt-6">
        <p className="text-xs text-slate-500 break-words">
          URL desta liturgia:{" "}
          <span className="font-semibold">/liturgia-diaria/{dateSlug}</span>
        </p>
      </footer>

      <meta itemProp="datePublished" content={`${data.dateISO}T06:00:00-03:00`} />
      <meta itemProp="dateModified" content={`${data.dateISO}T06:00:00-03:00`} />
    </article>
  );
}
