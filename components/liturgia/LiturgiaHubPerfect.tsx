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
        active
          ? "bg-amber-500 text-white border-amber-500"
          : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
      ].join(" ")}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function Block({
  title,
  refText,
  body,
}: {
  title: string;
  refText?: string;
  body?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-semibold text-amber-700 uppercase">{title}</p>
      {refText ? <p className="mt-1 text-sm font-bold text-slate-900">{refText}</p> : null}
      <div className="mt-3 whitespace-pre-line text-sm text-slate-800 leading-relaxed">
        {body?.trim() ? body : "—"}
      </div>
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
    return Boolean((data.segundaRef && data.segundaRef.trim()) || (data.segundaTexto && data.segundaTexto.trim()));
  }, [data.segundaRef, data.segundaTexto]);

  const [tab, setTab] = useState<TabKey>("leituras");

  return (
    <article
      className={[
        "mx-auto w-full max-w-5xl px-3 sm:px-4 lg:px-6 py-6 bg-white text-slate-900 leading-relaxed",
        className || "",
      ].join(" ")}
      itemScope
      itemType="https://schema.org/Article"
    >
      <link rel="canonical" href={canonical} />

      <header className="mb-6">
        <p className="text-xs font-semibold tracking-wide text-amber-700 uppercase">IA Tio Ben • Liturgia</p>

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
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Calendário da Liturgia
          </Link>

          <Link
            href={`/liturgia-diaria/${todaySlug}`}
            className="rounded-xl bg-amber-500 text-white px-4 py-2 text-sm font-semibold hover:bg-amber-600"
          >
            Hoje • {todayLabel}
          </Link>

          <Link
            href={`/liturgia-diaria/${prevSlug}`}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Ontem
          </Link>

          <Link
            href={`/liturgia-diaria/${nextSlug}`}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Amanhã
          </Link>
        </div>
      </header>

      {/* Visão rápida (referências) */}
      <section className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight">Referências do dia</h2>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Primeira Leitura</p>
            <p className="mt-1 text-sm font-bold text-slate-900">{data.primeiraRef || "—"}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Salmo</p>
            <p className="mt-1 text-sm font-bold text-slate-900">{data.salmoRef || "—"}</p>
          </div>

          {hasSecond ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Segunda Leitura</p>
              <p className="mt-1 text-sm font-bold text-slate-900">{data.segundaRef || "—"}</p>
            </div>
          ) : null}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Evangelho</p>
            <p className="mt-1 text-sm font-bold text-slate-900">{data.evangelhoRef || "—"}</p>
          </div>
        </div>
      </section>

      {/* Tabs (mais intuitivas) */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">Texto completo</h2>
          <p className="text-xs text-slate-500">
            Selecione a seção abaixo para ler com conforto.
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
              <Block title="Primeira Leitura" refText={data.primeiraRef} body={data.primeiraTexto} />
              {hasSecond ? <Block title="Segunda Leitura" refText={data.segundaRef} body={data.segundaTexto} /> : null}
            </div>
          ) : null}

          {tab === "salmo" ? (
            <Block title="Salmo" refText={data.salmoRef} body={data.salmoTexto} />
          ) : null}

          {tab === "evangelho" ? (
            <Block title="Evangelho" refText={data.evangelhoRef} body={data.evangelhoTexto} />
          ) : null}
        </div>
      </section>

      {(data.antEntrada || data.antComunhao) ? (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">Antífonas</h2>

          <div className="mt-4 space-y-4">
            {data.antEntrada ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Entrada</p>
                <p className="mt-2 text-sm text-slate-800 whitespace-pre-line">{data.antEntrada}</p>
              </div>
            ) : null}

            {data.antComunhao ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Comunhão</p>
                <p className="mt-2 text-sm text-slate-800 whitespace-pre-line">{data.antComunhao}</p>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <footer className="mt-8 border-t border-slate-200 pt-6">
        <p className="text-xs text-slate-500">
          URL desta liturgia: <span className="font-semibold">/liturgia-diaria/{dateSlug}</span>
        </p>
      </footer>

      <meta itemProp="datePublished" content={`${data.dateISO}T06:00:00-03:00`} />
      <meta itemProp="dateModified" content={`${data.dateISO}T06:00:00-03:00`} />
    </article>
  );
}
