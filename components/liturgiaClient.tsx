"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
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

/* ================= PROPS ================= */

interface LiturgiaClientProps {
  data: LiturgyData;
}

/* ================= HELPERS (DATE) ================= */

function parseApiDateBR(dateString?: string) {
  // "dd/mm/yyyy"
  if (!dateString) return null;
  const parts = dateString.split("/");
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts;
  const d = Number(dd);
  const m = Number(mm);
  const y = Number(yyyy);
  if (!d || !m || !y) return null;
  // meio-dia para evitar problemas de offset/virada
  return new Date(y, m - 1, d, 12, 0, 0);
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatSlugDate(d: Date) {
  return `${pad2(d.getDate())}-${pad2(d.getMonth() + 1)}-${d.getFullYear()}`;
}

function getWeekdayShort(d: Date) {
  return d.toLocaleDateString("pt-BR", { weekday: "short" });
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
  const monthNames = [
    "JAN",
    "FEV",
    "MAR",
    "ABR",
    "MAI",
    "JUN",
    "JUL",
    "AGO",
    "SET",
    "OUT",
    "NOV",
    "DEZ",
  ];
  const monthNumber = Number(monthStr) - 1;
  const month = monthNumber >= 0 && monthNumber <= 11 ? monthNames[monthNumber] : "---";
  return { day: dayStr || "--", month, year: yearStr || "----" };
}

/* ================= HELPERS (LITURGIA) ================= */

function ensureLiturgicalEnding(text: string, kind: "reading" | "gospel") {
  const t = (text || "").trim();
  if (!t) return "";

  const ending = kind === "gospel" ? "Palavra da Salvação." : "Palavra do Senhor.";

  // evita duplicar
  const hasEnding = new RegExp(`${ending.replace(/\./g, "\\.")}\\s*$`, "i").test(t);
  if (hasEnding) return t;

  const withPunct = /[.!?…]$/.test(t) ? t : `${t}.`;
  return `${withPunct}\n\n${ending}`;
}

/**
 * Converte números de versículos colados no início de palavra:
 * "24Ana" => "<sup>24</sup>Ana"
 *
 * Regra: captura 1-3 dígitos seguidos imediatamente por letra (inclui acentos),
 * e garante que antes não é dígito.
 */
function renderVersesWithSup(text: string): React.ReactNode {
  const s = text ?? "";
  if (!s) return s;

  // (início OU não-dígito) + (1-3 dígitos) + (próximo é letra)
  const re = /(^|[^0-9])(\d{1,3})(?=[A-Za-zÀ-ÿ])/g;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of s.matchAll(re)) {
    const idx = match.index ?? 0;
    const prefix = match[1]; // "" ou um caractere
    const num = match[2];

    const numStart = idx + prefix.length;
    const numEnd = numStart + num.length;

    // texto antes do match (até o prefixo)
    const before = s.slice(lastIndex, idx);
    if (before) nodes.push(before);

    // prefixo (se existir)
    if (prefix) nodes.push(prefix);

    nodes.push(
      <sup key={`v-${numStart}`} className="text-[0.7em] align-super">
        {num}
      </sup>
    );

    lastIndex = numEnd;
  }

  const tail = s.slice(lastIndex);
  if (tail) nodes.push(tail);

  return nodes.length ? nodes : s;
}

/* ================= COMPONENTE ================= */

export default function LiturgiaClient({ data }: LiturgiaClientProps) {
  const readingOrder: LiturgyReadingKey[] = useMemo(
    () => ["primeiraLeitura", "salmo", "segundaLeitura", "evangelho"],
    []
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

  /* ================= DATA BASE PARA NAVEGAÇÃO ================= */

  const baseDate = useMemo(() => parseApiDateBR(data?.data) ?? new Date(), [data?.data]);

  const navOffsets = useMemo(() => {
    const arr = [-2, -1, 0, 1, 2].map((offset) => {
      const dt = new Date(baseDate.getTime() + offset * 86400000);
      return {
        offset,
        date: formatSlugDate(dt),
        abrev:
          offset === 0
            ? "Hoje"
            : offset === -1
            ? "Ontem"
            : offset === 1
            ? "Amanhã"
            : getWeekdayShort(dt),
        tooltip: formatTooltip(dt),
      };
    });

    const [m2, m1, today, p1, p2] = arr;
    return { m2, m1, today, p1, p2 };
  }, [baseDate]);

  const { day, month, year } = useMemo(() => formatHeaderDate(data?.data), [data?.data]);

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
    const textoFinal = isSalmo
      ? currentReading.texto
      : ensureLiturgicalEnding(currentReading.texto, kind);

    return (
      <div>
        <h4 className="font-bold text-sm mb-2 text-amber-800">{currentReading.referencia}</h4>

        {currentReading.titulo && (
          <h3 className="font-bold text-lg mb-2 text-amber-800">{currentReading.titulo}</h3>
        )}

        {isSalmo && salmoRefrao && (
          <p
            className="font-semibold text-amber-800 mt-3 whitespace-pre-line"
            style={{ fontSize, lineHeight: "1.9" }}
          >
            {salmoRefrao}
          </p>
        )}

        <p className="whitespace-pre-line text-gray-900 mt-4" style={{ fontSize, lineHeight: "1.9" }}>
          {renderVersesWithSup(textoFinal)}
        </p>
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

  /* ================= ABAS ================= */

  const tabs: { key: LiturgyReadingKey; label: string }[] = [
    { key: "primeiraLeitura", label: "1ª Leitura" },
    { key: "salmo", label: "Salmo" },
    { key: "segundaLeitura", label: "2ª Leitura" },
    { key: "evangelho", label: "Evangelho" },
  ];

  const filteredTabs = tabs.filter((tab) => data?.leituras?.[tab.key]?.length);

  /* ================= RENDER ================= */

  return (
    <div className="flex flex-col min-h-screen bg-amber-400 relative">
      <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-4xl mx-auto w-full">
        <motion.h1
          className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Liturgia Diária – Evangelho do Dia
        </motion.h1>

        <p className="text-center text-gray-800/80 mb-6">
          {data?.liturgia ? `${data.liturgia} • ${data.data}` : data?.data}
        </p>

        <AdSensePro slot="2156366376" height={140} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-4 md:p-8 w-full"
        >
          <div className="flex flex-col items-center w-full px-4 md:px-0">
            <CalendarioLiturgia handleShare={handleShare} onFontSizeChange={setFontSize} />

            <div className="relative mb-4">
              <span className="text-6xl font-bold text-amber-700">{day}</span>
              <div className="flex flex-col absolute top-7 left-[calc(100%+5px)] -translate-y-1/2">
                <span className="text-xl font-semibold text-amber-600">{month}</span>
                <span className="text-2xl text-gray-600">{year}</span>
              </div>
            </div>

            {/* Navegação baseada na data exibida */}
            <nav className="flex flex-nowrap overflow-x-auto gap-2 mb-4 text-sm px-2 py-1 bg-white shadow-md rounded-lg">
              <Link
                href={`/liturgia-diaria/${navOffsets.m2.date}`}
                title={navOffsets.m2.tooltip}
                className="px-3 py-2 bg-gray-200 text-gray-900 rounded-md whitespace-nowrap"
              >
                « {navOffsets.m2.abrev}
              </Link>

              <Link
                href={`/liturgia-diaria/${navOffsets.m1.date}`}
                title={navOffsets.m1.tooltip}
                className="px-3 py-2 bg-gray-200 text-gray-900 rounded-md whitespace-nowrap"
              >
                {navOffsets.m1.abrev}
              </Link>

              <Link
                href="/liturgia-diaria"
                className="px-3 py-2 bg-amber-400 font-semibold rounded-md text-gray-900 whitespace-nowrap"
                title="Ir para a liturgia de hoje"
              >
                Hoje
              </Link>

              <Link
                href={`/liturgia-diaria/${navOffsets.p1.date}`}
                title={navOffsets.p1.tooltip}
                className="px-3 py-2 bg-gray-200 text-gray-900 rounded-md whitespace-nowrap"
              >
                {navOffsets.p1.abrev}
              </Link>

              <Link
                href={`/liturgia-diaria/${navOffsets.p2.date}`}
                title={navOffsets.p2.tooltip}
                className="px-3 py-2 bg-gray-200 text-gray-900 rounded-md whitespace-nowrap"
              >
                {navOffsets.p2.abrev} »
              </Link>
            </nav>

            <p className="text-xl text-gray-700 mb-2">
              <span className="font-semibold">Cor Litúrgica:</span>{" "}
              <span className="font-bold">{data.cor}</span>
            </p>

            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">{data.liturgia}</h2>

            {/* Antífonas */}
            {(data?.antifonas?.entrada || data?.antifonas?.comunhao) && (
              <div className="w-full max-w-3xl mx-auto mb-6 p-4 bg-[#fffaf1] rounded-xl border border-amber-200">
                {data.antifonas.entrada && (
                  <div className="mb-4">
                    <p className="font-semibold text-amber-800">Antífona de Entrada</p>
                    <p className="text-gray-900 whitespace-pre-line" style={{ lineHeight: "1.8" }}>
                      {data.antifonas.entrada}
                    </p>
                  </div>
                )}

                {data.antifonas.comunhao && (
                  <div>
                    <p className="font-semibold text-amber-800">Antífona de Comunhão</p>
                    <p className="text-gray-900 whitespace-pre-line" style={{ lineHeight: "1.8" }}>
                      {data.antifonas.comunhao}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {filteredTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                aria-pressed={activeTab === tab.key}
                className={`px-4 py-2 rounded-full transition ${
                  activeTab === tab.key ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Leitura */}
          <div
            className="p-6 bg-[#fffaf1] rounded-xl border border-amber-200 shadow-sm max-w-3xl mx-auto font-reading"
            style={{ lineHeight: "1.9" }}
          >
            {getReadingContent()}
          </div>

          {/* Orações */}
          {(data?.oracoes?.coleta || data?.oracoes?.oferendas || data?.oracoes?.comunhao) && (
            <div
              className="mt-8 p-6 bg-[#fffaf1] rounded-xl border border-amber-200 shadow-sm max-w-3xl mx-auto font-reading"
              style={{ lineHeight: "1.9" }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Orações da Missa</h3>

              {data.oracoes.coleta && (
                <div className="mb-6">
                  <p className="font-semibold text-amber-800">Oração do Dia (Coleta)</p>
                  <p className="whitespace-pre-line text-gray-900 mt-2" style={{ fontSize }}>
                    {data.oracoes.coleta}
                  </p>
                </div>
              )}

              {data.oracoes.oferendas && (
                <div className="mb-6">
                  <p className="font-semibold text-amber-800">Oração sobre as Oferendas</p>
                  <p className="whitespace-pre-line text-gray-900 mt-2" style={{ fontSize }}>
                    {data.oracoes.oferendas}
                  </p>
                </div>
              )}

              {data.oracoes.comunhao && (
                <div>
                  <p className="font-semibold text-amber-800">Oração depois da Comunhão</p>
                  <p className="whitespace-pre-line text-gray-900 mt-2" style={{ fontSize }}>
                    {data.oracoes.comunhao}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* BLOCO EDITORIAL SEO */}
          <div
            className="mt-10 p-6 bg-[#fffaf1] rounded-xl border border-amber-300 text-sm text-gray-900 font-reading max-w-3xl mx-auto"
            style={{ lineHeight: "1.9" }}
          >
            A Liturgia Diária nos conduz ao encontro vivo com a Palavra de Deus. Ao meditar o Evangelho de hoje,
            somos convidados à conversão, à prática do amor e ao fortalecimento da fé.
          </div>
        </motion.div>
      </div>

      <AdSensePro slot="2672028232" height={140} />
    </div>
  );
}
