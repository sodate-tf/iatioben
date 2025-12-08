'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Spinner from './SpinnerLoading';
import Cabecalho from './cabecalho';
import CalendarioLiturgia from './calendarioLiturgia';
import Footer from './Footer';

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
}

export interface LiturgyData {
  data: string;
  liturgia: string;
  cor: string;
  oracoes: Oracoes;
  leituras: LeiturasObject;
  antifonas: Antifonas;
}

type LiturgyReadingKey = keyof LeiturasObject;

/* ================= PROPS ================= */

interface LiturgiaClientProps {
  data: LiturgyData;
}

/* ================= COMPONENTE ================= */

export default function LiturgiaClient({ data }: LiturgiaClientProps) {
  const [activeTab, setActiveTab] = useState<LiturgyReadingKey>(() => {
    if (data.leituras.primeiraLeitura.length) return 'primeiraLeitura';
    if (data.leituras.salmo.length) return 'salmo';
    if (data.leituras.segundaLeitura.length) return 'segundaLeitura';
    return 'evangelho';
  });

  const [fontSize, setFontSize] = useState(16);

  /* ================= DATA FORMATADA ================= */

  function formatDate(dateString?: string) {
    if (!dateString) return {};
    const [dayStr, monthStr, yearStr] = dateString.split('/');
    const monthNames = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    const monthNumber = parseInt(monthStr, 10) - 1;
    return { day: dayStr, month: monthNames[monthNumber], year: yearStr };
  }

  const { day, month, year } = formatDate(data?.data);

  /* ================= TEXTO DAS LEITURAS ================= */

  const getReadingContent = () => {
    const readingsArray = data.leituras[activeTab];
    if (!readingsArray || readingsArray.length === 0) {
      return <p className="text-gray-600">Conteúdo não disponível.</p>;
    }

    const reading = readingsArray[0];

    return (
      <div>
        <h4 className="font-bold text-sm mb-2 text-amber-800">{reading.referencia}</h4>

        {reading.titulo && (
          <h3 className="font-bold text-lg mb-2 text-amber-800">{reading.titulo}</h3>
        )}

        {activeTab === 'salmo' && (reading as SalmoReadingItem).refrao && (
          <p className="font-semibold text-amber-700 mb-2" style={{ fontSize }}>
            {(reading as SalmoReadingItem).refrao}
          </p>
        )}

        <p className="whitespace-pre-line text-gray-700 leading-relaxed" style={{ fontSize }}>
          {reading.texto}
        </p>
      </div>
    );
  };

  /* ================= TEXTO PARA COMPARTILHAR ================= */

  const getShareableReadingText = () => {
    let text = '';
    const { primeiraLeitura, salmo, segundaLeitura, evangelho } = data.leituras;

    if (primeiraLeitura.length) text += `1ª Leitura:\n${primeiraLeitura[0].texto}\n\n`;
    if (salmo.length)
      text += `Salmo:\n${(salmo[0] as SalmoReadingItem).refrao || ''}\n${salmo[0].texto}\n\n`;
    if (segundaLeitura.length) text += `2ª Leitura:\n${segundaLeitura[0].texto}\n\n`;
    if (evangelho.length) text += `Evangelho:\n${evangelho[0].texto}\n\n`;

    return text;
  };

  const handleShare = async () => {
    const shareText = `Liturgia Diária - ${data.liturgia}\n\n${data.data}\n\n${getShareableReadingText()}\n\n${window.location.href}`;

    if (navigator.share) {
      await navigator.share({
        title: `Liturgia Diária - ${data.liturgia}`,
        text: shareText,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('Texto da liturgia copiado!');
    }
  };

  /* ================= ABAS ================= */

  const tabs: { key: LiturgyReadingKey; label: string }[] = [
    { key: 'primeiraLeitura', label: '1ª Leitura' },
    { key: 'salmo', label: 'Salmo' },
    { key: 'segundaLeitura', label: '2ª Leitura' },
    { key: 'evangelho', label: 'Evangelho' },
  ];

  const filteredTabs = tabs.filter(tab => data.leituras[tab.key]?.length);

  /* ================= NAVEGAÇÃO DE DATAS ================= */

  const hoje = new Date();

  function formatDateNav(d: Date) {
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  }

  function getDayAbbreviation(d: Date) {
    return d.toLocaleDateString('pt-BR', { weekday: 'short' });
  }

  function formatDateTooltip(d: Date) {
    return d.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  const offsets = [-2, -1, 1, 2].map(offset => {
    const dt = new Date(hoje.getTime() + offset * 86400000);
    return {
      date: formatDateNav(dt),
      abrev: offset === -1 ? 'Ontem' : offset === 1 ? 'Amanhã' : getDayAbbreviation(dt),
      tooltip: formatDateTooltip(dt),
    };
  });

  const [dataAnterior2, dataAnterior1, dataSeguinte1, dataSeguinte2] = offsets;

  /* ================= RENDER ================= */

  return (
    <div className="flex flex-col min-h-screen bg-amber-400 relative">
      <Cabecalho />

      <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-4xl mx-auto w-full">
        <motion.h1
          className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Liturgia Diária Católica – Evangelho do Dia com o Tio Ben
        </motion.h1>

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

            {/* Navegação */}
            <nav className="flex flex-nowrap overflow-x-auto gap-2 mb-4 text-sm px-2 py-1 bg-white shadow-md rounded-lg">
              <Link href={`/liturgia-diaria/${dataAnterior2.date}`} title={dataAnterior2.tooltip} className="px-3 py-2 bg-gray-200 rounded-md">
                « {dataAnterior2.abrev}
              </Link>
              <Link href={`/liturgia-diaria/${dataAnterior1.date}`} title={dataAnterior1.tooltip} className="px-3 py-2 bg-gray-200 rounded-md">
                {dataAnterior1.abrev}
              </Link>
              <Link href="/liturgia-diaria" className="px-3 py-2 bg-amber-400 font-semibold rounded-md">
                Hoje
              </Link>
              <Link href={`/liturgia-diaria/${dataSeguinte1.date}`} title={dataSeguinte1.tooltip} className="px-3 py-2 bg-gray-200 rounded-md">
                {dataSeguinte1.abrev}
              </Link>
              <Link href={`/liturgia-diaria/${dataSeguinte2.date}`} title={dataSeguinte2.tooltip} className="px-3 py-2 bg-gray-200 rounded-md">
                {dataSeguinte2.abrev} »
              </Link>
            </nav>

            <p className="text-xl text-gray-700 mb-2">
              <span className="font-semibold">Cor Litúrgica:</span>{' '}
              <span className="font-bold">{data.cor}</span>
            </p>

            <h2 className="text-2xl font-bold mb-6 text-center">{data.liturgia}</h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {filteredTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-full ${
                  activeTab === tab.key ? 'bg-amber-600 text-white' : 'bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            {getReadingContent()}
          </div>

          {/* BLOCO EDITORIAL SEO */}
          <div className="mt-8 p-5 bg-amber-100 rounded border border-amber-300 text-sm leading-relaxed">
            A Liturgia Diária nos conduz ao encontro vivo com a Palavra de Deus. Ao meditar o Evangelho de hoje,
            somos convidados à conversão, à prática do amor e ao fortalecimento da fé.
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
