"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CalendarioLiturgia from "./calendarioLiturgia";
import AdSensePro from "./adsensePro";

/* ================= TIPAGENS ================= */

interface LiturgyReadingItem {
  referencia: string;
  titulo?: string;
  texto: string;
}

interface SalmoReadingItem extends LiturgyReadingItem {
  refrao?: string;
}

interface Oracoes {
  coleta: string;
  oferendas: string;
  comunhao: string;
  extras: string[];
}

interface Antifonas {
  entrada: string;
  comunhao: string;
}

interface LeiturasObject {
  primeiraLeitura: LiturgyReadingItem[];
  salmo: SalmoReadingItem[];
  segundaLeitura: LiturgyReadingItem[];
  evangelho: LiturgyReadingItem[];
  extras: any[];
}

export interface LiturgyData {
  data: string; // "dd/mm/yyyy"
  liturgia: string;
  cor: string;
  oracoes: Oracoes;
  leituras: LeiturasObject;
  antifonas: Antifonas;
}

type LiturgyReadingKey = Exclude<keyof LeiturasObject, "extras">;

interface LiturgiaClientProps {
  data: LiturgyData;
}

/* ================= HELPERS (DATE) ================= */

function parseApiDateBR(dateString?: string) {
  if (!dateString) return null;
  const parts = dateString.split("/");
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts;
  const d = Number(dd);
  const m = Number(mm);
  const y = Number(yyyy);
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d, 12, 0, 0);
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatSlugDate(d: Date) {
  return `${pad2(d.getDate())}-${pad2(d.getMonth() + 1)}-${d.getFullYear()}`;
}

function formatBRShort(date: Date) {
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function getWeekdayShort(d: Date) {
  return d.toLocaleDateString("pt-BR", { weekday: "short" });
}

function getWeekdayLongFromBR(dateString?: string) {
  const d = parseApiDateBR(dateString);
  if (!d) return "";
  return d.toLocaleDateString("pt-BR", { weekday: "long" });
}

function getLongDateFromBR(dateString?: string) {
  const d = parseApiDateBR(dateString);
  if (!d) return "";
  const day = pad2(d.getDate());
  const month = d.toLocaleDateString("pt-BR", { month: "long" });
  const year = d.getFullYear();
  return `${day} de ${month} de ${year}`;
}

function formatTooltip(d: Date) {
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatHeaderDate(dateString?: string) {
  if (!dateString) return { day: "--", month: "---", year: "----" };
  const [dayStr, monthStr, yearStr] = dateString.split("/");
  const monthNames = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
  const monthNumber = Number(monthStr) - 1;
  const month = monthNumber >= 0 && monthNumber <= 11 ? monthNames[monthNumber] : "---";
  return { day: dayStr || "--", month, year: yearStr || "----" };
}

/* ================= HELPERS (LITURGIA) ================= */

function ensureLiturgicalEnding(text: string, kind: "reading" | "gospel") {
  const t = (text || "").trim();
  if (!t) return "";

  const ending = kind === "gospel" ? "Palavra da Salvação." : "Palavra do Senhor.";
  const hasEnding = new RegExp(`${ending.replace(/\./g, "\\.")}\\s*$`, "i").test(t);
  if (hasEnding) return t;

  const withPunct = /[.!?…]$/.test(t) ? t : `${t}.`;
  return `${withPunct}\n\n${ending}`;
}

/** "24Ana" => <sup>24</sup>Ana */
function renderVersesWithSup(text: string): React.ReactNode {
  const s = text ?? "";
  if (!s) return s;

  const re = /(^|[^0-9])(\d{1,3})(?=[A-Za-zÀ-ÿ])/g;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of s.matchAll(re)) {
    const idx = match.index ?? 0;
    const prefix = match[1];
    const num = match[2];

    const numStart = idx + prefix.length;
    const numEnd = numStart + num.length;

    const before = s.slice(lastIndex, idx);
    if (before) nodes.push(before);
    if (prefix) nodes.push(prefix);

    nodes.push(
      <sup key={`v-${numStart}`} className="text-[0.7em] align-super text-gray-900">
        {num}
      </sup>
    );

    lastIndex = numEnd;
  }

  const tail = s.slice(lastIndex);
  if (tail) nodes.push(tail);

  return nodes.length ? nodes : s;
}

/* ================= UI HELPERS ================= */

function SectionCard({
  id,
  title,
  subtitle,
  children,
  className = "",
  subtle = false,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  subtle?: boolean;
}) {
  return (
    <section
      id={id}
      className={[
        "scroll-mt-24 rounded-2xl border shadow-sm",
        subtle ? "bg-white/70 border-amber-100" : "bg-white border-amber-200",
        "backdrop-blur-sm",
        className,
      ].join(" ")}
    >
      <header className="px-5 pt-5 pb-3">
        <h3 className="text-base sm:text-lg font-bold text-gray-900">{title}</h3>
        {subtitle ? <p className="mt-1 text-sm text-gray-700">{subtitle}</p> : null}
      </header>
      <div className="px-5 pb-5">{children}</div>
    </section>
  );
}

function Collapsible({
  id,
  title,
  defaultOpen = false,
  children,
}: {
  id: string;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      id={id}
      className="scroll-mt-24 rounded-2xl border border-amber-200 bg-white shadow-sm"
      open={defaultOpen}
    >
      <summary className="cursor-pointer select-none px-5 py-4 flex items-center justify-between gap-3">
        <span className="font-bold text-gray-900">{title}</span>
        <span className="text-xs font-semibold text-gray-600">Toque para {defaultOpen ? "recolher" : "expandir"}</span>
      </summary>
      <div className="px-5 pb-5">{children}</div>
    </details>
  );
}

/* ================= COMPONENTE ================= */

export default function LiturgiaClient({ data }: LiturgiaClientProps) {
  const pathname = usePathname();

  const readingOrder: LiturgyReadingKey[] = useMemo(
    () => ["primeiraLeitura", "salmo", "segundaLeitura", "evangelho"],
    []
  );

  const tabs = useMemo(
    () =>
      [
        { key: "primeiraLeitura", label: "1ª Leitura" },
        { key: "salmo", label: "Salmo" },
        { key: "segundaLeitura", label: "2ª Leitura" },
        { key: "evangelho", label: "Evangelho" },
      ] as const,
    []
  );

  const filteredTabs = useMemo(
    () => tabs.filter((tab) => data?.leituras?.[tab.key]?.length),
    [tabs, data]
  );

  const firstAvailableTab = useMemo<LiturgyReadingKey>(() => {
    for (const k of readingOrder) {
      if (data?.leituras?.[k]?.length) return k;
    }
    return "evangelho";
  }, [data, readingOrder]);

  const [activeTab, setActiveTab] = useState<LiturgyReadingKey>(firstAvailableTab);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    setActiveTab(firstAvailableTab);
  }, [firstAvailableTab]);

  /* ================= TODAY SLUG / LABEL (PARA CALENDÁRIO) ================= */

  const todayDate = useMemo(() => new Date(), []);
  const todaySlug = useMemo(() => formatSlugDate(todayDate), [todayDate]);
  const todayLabel = useMemo(() => formatBRShort(todayDate), [todayDate]);

  /* ================= DATA BASE PARA NAVEGAÇÃO (pela data exibida) ================= */

  const baseDate = useMemo(() => parseApiDateBR(data?.data) ?? new Date(), [data?.data]);

  const navOffsets = useMemo(() => {
    const arr = [-2, -1, 0, 1, 2].map((offset) => {
      const dt = new Date(baseDate.getTime() + offset * 86400000);
      return {
        offset,
        date: formatSlugDate(dt),
        abrev: getWeekdayShort(dt),
        tooltip: formatTooltip(dt),
      };
    });
    const [m2, m1, today, p1, p2] = arr;
    return { m2, m1, today, p1, p2 };
  }, [baseDate]);

  const { day, month, year } = useMemo(() => formatHeaderDate(data?.data), [data?.data]);

  const isTodayRoute = useMemo(
    () => pathname === "/liturgia-diaria" || pathname === "/liturgia-diaria/",
    [pathname]
  );

  /* ================= HEADER TEXT (MENOS REPETIÇÃO) ================= */

  const weekdayLong = useMemo(() => getWeekdayLongFromBR(data?.data), [data?.data]);
  const dateLong = useMemo(() => getLongDateFromBR(data?.data), [data?.data]);

  const h1Text = useMemo(() => {
    const dateShort = data?.data || "";
    return dateShort ? `Liturgia Diária — ${dateShort} (Evangelho do Dia)` : "Liturgia Diária (Evangelho do Dia)";
  }, [data?.data]);

  const leadText = useMemo(() => {
    const when = weekdayLong && dateLong ? `${weekdayLong}, ${dateLong}` : data?.data || "";
    const lit = data?.liturgia ? data.liturgia : "Liturgia do Dia";
    return when
      ? `Medite a Palavra de Deus em ${when}. Veja a celebração do dia (${lit}) e aprofunde sua oração com serenidade.`
      : `Medite a Palavra de Deus com a Liturgia do Dia e aprofunde sua oração com serenidade.`;
  }, [weekdayLong, dateLong, data?.data, data?.liturgia]);

  const microInfo = useMemo(() => {
    const cor = data?.cor ? `Cor litúrgica: ${data.cor}` : "";
    const lit = data?.liturgia ? data.liturgia : "";
    return [cor, lit].filter(Boolean).join(" • ");
  }, [data?.cor, data?.liturgia]);

  /* ================= LEITURA ATUAL ================= */

  const currentReading = useMemo(() => {
    const arr = data?.leituras?.[activeTab];
    return arr && arr.length ? arr[0] : null;
  }, [data, activeTab]);

  const getReadingContent = () => {
    if (!currentReading) {
      return <p className="text-gray-600">Conteúdo não disponível.</p>;
    }

    const isSalmo = activeTab === "salmo";
    const salmoRefrao = isSalmo ? (currentReading as SalmoReadingItem).refrao : undefined;

    const kind = activeTab === "evangelho" ? "gospel" : "reading";
    const textoFinal = isSalmo ? currentReading.texto : ensureLiturgicalEnding(currentReading.texto, kind);

    return (
      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h4 className="font-bold text-sm text-amber-800">{currentReading.referencia}</h4>
        </div>

        {currentReading.titulo ? (
          <h3 className="font-bold text-lg mt-2 text-gray-900">{currentReading.titulo}</h3>
        ) : null}

        {isSalmo && salmoRefrao ? (
          <p className="font-semibold text-amber-800 mt-3 whitespace-pre-line" style={{ fontSize, lineHeight: "1.9" }}>
            {salmoRefrao}
          </p>
        ) : null}

        <div className="mt-4 text-gray-900 whitespace-pre-line" style={{ fontSize, lineHeight: "1.95" }}>
          {renderVersesWithSup(textoFinal)}
        </div>
      </div>
    );
  };

  /* ================= TEXTO PARA COMPARTILHAR ================= */

  const getShareableReadingText = () => {
    const { primeiraLeitura, salmo, segundaLeitura, evangelho } = data.leituras;

    let text = "";

    if (primeiraLeitura?.length) {
      text += `1ª Leitura:\n${ensureLiturgicalEnding(primeiraLeitura[0].texto, "reading")}\n\n`;
    }
    if (salmo?.length) {
      const s = salmo[0] as SalmoReadingItem;
      const refrao = s.refrao ? `${s.refrao}\n` : "";
      text += `Salmo:\n${refrao}${s.texto}\n\n`;
    }
    if (segundaLeitura?.length) {
      text += `2ª Leitura:\n${ensureLiturgicalEnding(segundaLeitura[0].texto, "reading")}\n\n`;
    }
    if (evangelho?.length) {
      text += `Evangelho:\n${ensureLiturgicalEnding(evangelho[0].texto, "gospel")}\n\n`;
    }

    return text.trim();
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const shareText = `Liturgia Diária - ${data.liturgia}\n${data.data}\n\n${getShareableReadingText()}\n\n${url}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Liturgia Diária - ${data.liturgia}`,
          text: shareText,
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(shareText);
      alert("Texto da liturgia copiado!");
    } catch {
      try {
        await navigator.clipboard.writeText(shareText);
        alert("Texto da liturgia copiado!");
      } catch {
        alert("Não foi possível compartilhar/copiar automaticamente.");
      }
    }
  };

  /* ================= CTA / LINKS INTERNOS ================= */

  const ROUTE_TERCO = "/santo-terco"; // ajuste se necessário

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 via-amber-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center"
        >
          {/* Breadcrumb sutil */}
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-gray-700">
              <li>
                <Link href="/" className="hover:underline">
                  Início
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-400">
                /
              </li>
              <li>
                <Link href="/liturgia-diaria" className="hover:underline">
                  Liturgia Diária
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-400">
                /
              </li>
              {/* SEO: preferir data explícita ao invés de “Hoje” */}
              <li className="text-gray-900 font-semibold">
                {data?.data ? data.data : isTodayRoute ? todayLabel : "—"}
              </li>
            </ol>
          </nav>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            {h1Text}
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-700 max-w-3xl mx-auto">{leadText}</p>

          {microInfo ? <p className="mt-2 text-xs sm:text-sm text-gray-600">{microInfo}</p> : null}
        </motion.header>

        <div className="mt-6">
          <AdSensePro slot="2156366376" height={140} />
        </div>

        {/* SUMÁRIO RÁPIDO (âncoras) */}
        <nav aria-label="Sumário rápido" className="mt-5">
          <div className="rounded-2xl border border-amber-200 bg-white/80 backdrop-blur-sm shadow-sm px-3 py-2">
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <a
                href="#leituras"
                className="px-3 py-2 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 transition font-semibold text-gray-900"
              >
                Leituras
              </a>
              <a
                href="#antifonas"
                className="px-3 py-2 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 transition font-semibold text-gray-900"
              >
                Antífonas
              </a>
              <a
                href="#oracoes"
                className="px-3 py-2 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 transition font-semibold text-gray-900"
              >
                Orações
              </a>
              <a
                href="#aprofundar"
                className="px-3 py-2 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 transition font-semibold text-gray-900"
              >
                Aprofundar
              </a>
            </div>
          </div>
        </nav>

        <motion.main
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mt-4 space-y-4"
        >
          {/* Navegação: calendário + BLOCO DA DATA ABAIXO (corrige quebra) */}
          <SectionCard title="Navegação" subtitle="Escolha a data, ajuste a fonte e compartilhe." subtle>
            <div className="space-y-3">
              <div className="rounded-2xl border border-amber-100 bg-white/70 p-3 sm:p-4">
                <CalendarioLiturgia
                  handleShare={handleShare}
                  onFontSizeChange={setFontSize}
                  todaySlug={todaySlug}
                  todayLabel={todayLabel}
                />
              </div>

              {/* BLOCO DA DATA (abaixo do calendário) */}
              <div className="rounded-2xl border border-amber-300 bg-gradient-to-b from-amber-100 to-white shadow-sm px-4 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="leading-none">
                    <div className="text-6xl font-extrabold text-amber-700">{day}</div>
                    <div className="mt-2 text-sm font-bold tracking-wider text-gray-900">{month}</div>
                    <div className="mt-1 text-base font-semibold text-gray-700">{year}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-semibold text-gray-700">Cor litúrgica</div>
                    <div className="mt-1 inline-flex items-center gap-2 justify-end">
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-600" aria-hidden="true" />
                      <span className="text-sm font-extrabold text-gray-900">{data?.cor || "—"}</span>
                    </div>

                    <div className="mt-2 text-[11px] leading-snug text-gray-700">
                      {data?.liturgia ? data.liturgia : "Liturgia do dia"}
                    </div>
                  </div>
                </div>

                {/* Navegação de datas (compacta) */}
                <div className="mt-4 flex flex-nowrap overflow-x-auto gap-2 pb-1">
                  <Link
                    href={`/liturgia-diaria/${navOffsets.m2.date}`}
                    title={navOffsets.m2.tooltip}
                    className="px-3 py-2 text-sm bg-white border border-amber-200 text-gray-900 rounded-xl whitespace-nowrap hover:bg-amber-50 transition"
                  >
                    « {navOffsets.m2.abrev}
                  </Link>

                  <Link
                    href={`/liturgia-diaria/${navOffsets.m1.date}`}
                    title={navOffsets.m1.tooltip}
                    className="px-3 py-2 text-sm bg-white border border-amber-200 text-gray-900 rounded-xl whitespace-nowrap hover:bg-amber-50 transition"
                  >
                    {navOffsets.m1.abrev}
                  </Link>

                  <Link
                    href="/liturgia-diaria"
                    className="px-3 py-2 text-sm bg-amber-200 font-semibold rounded-xl text-gray-900 whitespace-nowrap border border-amber-300 hover:bg-amber-300 transition"
                    title="Ir para a liturgia de hoje"
                  >
                    {todayLabel}
                  </Link>

                  <Link
                    href={`/liturgia-diaria/${navOffsets.p1.date}`}
                    title={navOffsets.p1.tooltip}
                    className="px-3 py-2 text-sm bg-white border border-amber-200 text-gray-900 rounded-xl whitespace-nowrap hover:bg-amber-50 transition"
                  >
                    {navOffsets.p1.abrev}
                  </Link>

                  <Link
                    href={`/liturgia-diaria/${navOffsets.p2.date}`}
                    title={navOffsets.p2.tooltip}
                    className="px-3 py-2 text-sm bg-white border border-amber-200 text-gray-900 rounded-xl whitespace-nowrap hover:bg-amber-50 transition"
                  >
                    {navOffsets.p2.abrev} »
                  </Link>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* FOCO: Leituras */}
          <section id="leituras" className="scroll-mt-24 rounded-2xl border border-amber-200 bg-white shadow-sm">
            <header className="px-5 pt-5 pb-3">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">Leituras</h2>
                  <p className="text-sm text-gray-700">Alterne entre as leituras e mantenha o foco na Palavra.</p>
                </div>

                <div className="text-sm text-gray-700">
                  <span className="font-semibold">Celebração:</span> {data.liturgia}
                </div>
              </div>
            </header>

            <div className="px-5 pb-4">
              <div className="flex flex-wrap gap-2">
                {filteredTabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    aria-pressed={activeTab === tab.key}
                    className={[
                      "px-4 py-2 rounded-full text-sm font-semibold transition border",
                      activeTab === tab.key
                        ? "bg-amber-200 border-amber-300 text-gray-900"
                        : "bg-white border-amber-200 text-gray-900 hover:bg-amber-50",
                    ].join(" ")}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-5 pb-5">
              <div className="rounded-xl border border-amber-200 bg-[#fffaf1] p-5 sm:p-6 text-gray-900">
                {getReadingContent()}
              </div>
            </div>

            {/* Antífonas: colapsáveis */}
            {(data?.antifonas?.entrada || data?.antifonas?.comunhao) && (
              <div className="px-5 pb-5">
                <Collapsible id="antifonas" title="Antífonas (Entrada e Comunhão)" defaultOpen={false}>
                  {data.antifonas.entrada ? (
                    <div className="mb-4">
                      <p className="font-semibold text-amber-800">Antífona de Entrada</p>
                      <p className="text-gray-900 whitespace-pre-line mt-2" style={{ lineHeight: "1.85" }}>
                        {data.antifonas.entrada}
                      </p>
                    </div>
                  ) : null}

                  {data.antifonas.comunhao ? (
                    <div>
                      <p className="font-semibold text-amber-800">Antífona de Comunhão</p>
                      <p className="text-gray-900 whitespace-pre-line mt-2" style={{ lineHeight: "1.85" }}>
                        {data.antifonas.comunhao}
                      </p>
                    </div>
                  ) : null}
                </Collapsible>
              </div>
            )}
          </section>

          {/* CTA: Terço */}
          <SectionCard
            id="aprofundar"
            title="Aprofunde sua espiritualidade"
            subtitle="Depois da Liturgia, reze o Santo Terço e mantenha uma rotina de oração."
            subtle
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-700 leading-relaxed">
                Um próximo passo simples é rezar o Terço. Você encontra um guia completo e prático para acompanhar em qualquer momento do dia.
              </div>
              <div className="flex gap-3">
                <Link
                  href={ROUTE_TERCO}
                  className="px-4 py-2 rounded-xl bg-amber-200 border border-amber-300 text-gray-900 font-semibold hover:bg-amber-300 transition whitespace-nowrap"
                  aria-label="Ir para o Santo Terço"
                >
                  Ir para o Santo Terço
                </Link>
                <Link
                  href="/blog"
                  className="px-4 py-2 rounded-xl bg-white border border-amber-200 text-gray-900 font-semibold hover:bg-amber-50 transition whitespace-nowrap"
                  aria-label="Ver artigos do blog"
                >
                  Ver Blog
                </Link>
              </div>
            </div>
          </SectionCard>

          {/* Orações: colapsável */}
          {(data?.oracoes?.coleta || data?.oracoes?.oferendas || data?.oracoes?.comunhao) && (
            <Collapsible id="oracoes" title="Orações da Missa" defaultOpen={false}>
              {data.oracoes.coleta ? (
                <div className="mb-6">
                  <p className="font-semibold text-amber-800">Oração do Dia (Coleta)</p>
                  <p className="whitespace-pre-line text-gray-900 mt-2" style={{ fontSize, lineHeight: "1.9" }}>
                    {data.oracoes.coleta}
                  </p>
                </div>
              ) : null}

              {data.oracoes.oferendas ? (
                <div className="mb-6">
                  <p className="font-semibold text-amber-800">Oração sobre as Oferendas</p>
                  <p className="whitespace-pre-line text-gray-900 mt-2" style={{ fontSize, lineHeight: "1.9" }}>
                    {data.oracoes.oferendas}
                  </p>
                </div>
              ) : null}

              {data.oracoes.comunhao ? (
                <div>
                  <p className="font-semibold text-amber-800">Oração depois da Comunhão</p>
                  <p className="whitespace-pre-line text-gray-900 mt-2" style={{ fontSize, lineHeight: "1.9" }}>
                    {data.oracoes.comunhao}
                  </p>
                </div>
              ) : null}
            </Collapsible>
          )}

          <div className="pt-2">
            <AdSensePro slot="2672028232" height={140} />
          </div>
        </motion.main>
      </div>
    </div>
  );
}
