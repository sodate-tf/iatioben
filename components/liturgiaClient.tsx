'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Spinner from './SpinnerLoading';
import Cabecalho from './cabecalho';
import AdSense from './Adsense';
import Link from 'next/link';
import CalendarioLiturgia from './calendarioLiturgia';

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

interface LiturgyData {
  data: string;
  liturgia: string;
  cor: string;
  oracoes: Oracoes;
  leituras: LeiturasObject;
  antifonas: Antifonas;
}

type LiturgyReadingKey = keyof LeiturasObject;

interface FormattedDate {
  day?: string;
  month?: string;
  year?: string;
}

interface LiturgiaContentProps {
  date?: string;
}

export default function LiturgiaContent({ date }: LiturgiaContentProps) {
  const [liturgyData, setLiturgyData] = useState<LiturgyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<LiturgyReadingKey | null>(null);
  const [fontSize, setFontSize] = useState(16);

  let API_URL = 'https://liturgia.up.railway.app/v2/';

  if (date) {
    const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
    const match = date.match(regex);
    if (match) {
      const [, dd, mm, yyyy] = match;
      API_URL = `https://liturgia.up.railway.app/v2/?dia=${dd}&mes=${mm}&ano=${yyyy}`;
    }
  }

  useEffect(() => {
    const fetchLiturgy = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Erro HTTP! status: ${res.status}`);
        const data: LiturgyData = await res.json();
        setLiturgyData(data);

        // Define primeira aba disponível
        if (data.leituras.primeiraLeitura.length) setActiveTab('primeiraLeitura');
        else if (data.leituras.salmo.length) setActiveTab('salmo');
        else if (data.leituras.segundaLeitura.length) setActiveTab('segundaLeitura');
        else if (data.leituras.evangelho.length) setActiveTab('evangelho');
      } catch (err: unknown) {
        console.error('Falha ao buscar dados da liturgia:', err);
        setError(
          err instanceof Error
            ? `Não foi possível carregar a liturgia do dia: ${err.message}.`
            : 'Não foi possível carregar a liturgia do dia: Erro desconhecido.'
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchLiturgy();
  }, [API_URL]);

  const formatDate = (dateString?: string): FormattedDate => {
    if (!dateString) return {};
    const [dayStr, monthStr, yearStr] = dateString.split('/');
    const monthNames = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    const monthNumber = parseInt(monthStr, 10) - 1;
    return { day: dayStr, month: monthNames[monthNumber], year: yearStr };
  };

  const { day, month, year } = formatDate(liturgyData?.data);

  const getReadingContent = () => {
    if (!liturgyData || !activeTab) return null;
    const readingsArray = liturgyData.leituras[activeTab];
    if (!readingsArray || readingsArray.length === 0)
      return <p className="text-gray-600">Conteúdo não disponível para esta seção.</p>;

    const reading = readingsArray[0];
    return (
      <div>
        <h4 className="font-bold text-sm mb-2 text-amber-800">{reading.referencia}</h4>
        {reading.titulo && <h3 className="font-bold text-lg mb-2 text-amber-800">{reading.titulo}</h3>}
        {activeTab === 'salmo' && (reading as SalmoReadingItem).refrao && (
          <p className="font-semibold text-amber-700 mb-2" style={{ fontSize: `${fontSize}px` }}>
            {(reading as SalmoReadingItem).refrao}
          </p>
        )}
        <p className="whitespace-pre-line text-gray-700 leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
          {reading.texto}
        </p>
      </div>
    );
  };

  const getShareableReadingText = (): string => {
    if (!liturgyData) return '';
    let text = '';
    const { primeiraLeitura, salmo, segundaLeitura, evangelho } = liturgyData.leituras;
    if (primeiraLeitura.length) text += `1ª Leitura:\n${primeiraLeitura[0].texto}\n\n`;
    if (salmo.length)
      text += `Salmo:\n${(salmo[0] as SalmoReadingItem).refrao || ''}\n${salmo[0].texto}\n\n`;
    if (segundaLeitura.length) text += `2ª Leitura:\n${segundaLeitura[0].texto}\n\n`;
    if (evangelho.length) text += `Evangelho:\n${evangelho[0].texto}\n\n`;
    return text;
  };

  const handleShare = async () => {
    if (!liturgyData) return;
    const shareText = `Liturgia Diária - ${liturgyData.liturgia}\n\n${liturgyData.data}\n\n${getShareableReadingText()}\n\n${window.location.href}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Liturgia Diária - ${liturgyData.liturgia}`, text: shareText, url: window.location.href });
      } catch (err: unknown) {
        console.error('Erro ao compartilhar:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido ao compartilhar.');
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Texto da liturgia copiado para a área de transferência!');
      } catch (err) {
        console.error('Erro ao copiar:', err);
      }
    }
  };

  // Abas filtradas dinamicamente
  const tabs: { key: LiturgyReadingKey; label: string }[] = [
    { key: 'primeiraLeitura', label: '1ª Leitura' },
    { key: 'salmo', label: 'Salmo' },
    { key: 'segundaLeitura', label: '2ª Leitura' },
    { key: 'evangelho', label: 'Evangelho' },
  ];

  const filteredTabs = liturgyData
    ? tabs.filter((tab) => liturgyData.leituras[tab.key]?.length)
    : [];

  // Data atual
  const hoje = new Date();
  function parseDateString(str: string): Date {
    const [dd, mm, yyyy] = str.split('-').map(Number);
    return new Date(yyyy, mm - 1, dd);
  }
  function formatDateNav(d: Date) {
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  }
  function getDayAbbreviation(d: Date) {
    return d.toLocaleDateString('pt-BR', { weekday: 'short' });
  }
  function formatDateTooltip(d: Date) {
    return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  }

  const offsets = [-2, -1, 1, 2].map((offset) => {
    const dt = new Date(hoje.getTime() + offset * 86400000);
    return { date: formatDateNav(dt), abrev: offset === -1 ? 'Ontem' : offset === 1 ? 'Amanhã' : getDayAbbreviation(dt), tooltip: formatDateTooltip(dt) };
  });

  const [dataAnterior2, dataAnterior1, dataSeguinte1, dataSeguinte2] = offsets;

  return (
    <div className="flex flex-col min-h-screen bg-amber-400 relative">
      <Cabecalho />
      <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-4xl mx-auto w-full">
        <motion.h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          Liturgia Diária
        </motion.h1>

        {isLoading ? (
          <Spinner />
        ) : error ? (
          <p className="text-red-600 text-lg">{error}</p>
        ) : liturgyData ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-lg shadow-lg p-4 md:p-8 w-full">
            <div className="flex flex-col items-center w-full px-4 md:px-0">
              <div className="flex flex-col md:flex-row items-center justify-center w-full mb-4 relative">
                <div className="flex flex-col items-center md:mr-6">
                  <div className="relative">
                    <span className="text-6xl font-bold text-amber-700">{day}</span>
                    <div className="flex flex-col absolute top-7 left-[calc(100%+5px)] -translate-y-1/2">
                      <span className="text-xl font-semibold text-amber-600 leading-none">{month}</span>
                      <span className="text-2xl text-gray-600 leading-none">{year}</span>
                    </div>
                  </div>
                </div>
                <CalendarioLiturgia handleShare={handleShare} onFontSizeChange={setFontSize} />
              </div>

              <nav className="flex flex-wrap justify-center gap-2 mb-4 text-sm md:text-base">
                <Link href={`/liturgia-diaria/${dataAnterior2.date}`} title={`Liturgia de ${dataAnterior2.tooltip}`} className="px-2 py-1 rounded hover:bg-gray-200 transition">&laquo; {dataAnterior2.abrev}</Link>
                <Link href={`/liturgia-diaria/${dataAnterior1.date}`} title={`Liturgia de ${dataAnterior1.tooltip}`} className="px-2 py-1 rounded hover:bg-gray-200 transition">{dataAnterior1.abrev}</Link>
                <Link href="/liturgia-diaria" title="Liturgia de Hoje" className="px-2 py-1 rounded bg-amber-200 font-semibold hover:bg-amber-300 transition">Hoje</Link>
                <Link href={`/liturgia-diaria/${dataSeguinte1.date}`} title={`Liturgia de ${dataSeguinte1.tooltip}`} className="px-2 py-1 rounded hover:bg-gray-200 transition">{dataSeguinte1.abrev}</Link>
                <Link href={`/liturgia-diaria/${dataSeguinte2.date}`} title={`Liturgia de ${dataSeguinte2.tooltip}`} className="px-2 py-1 rounded hover:bg-gray-200 transition">{dataSeguinte2.abrev} &raquo;</Link>
              </nav>

              <p className="text-xl text-gray-700 mb-2 text-center">
                <span className="font-semibold">Cor Litúrgica:</span>{' '}
                <span className={`font-bold ${
                  liturgyData.cor === 'Branco' ? 'text-gray-900' :
                  liturgyData.cor === 'Verde' ? 'text-green-700' :
                  liturgyData.cor === 'Vermelho' ? 'text-red-700' :
                  liturgyData.cor === 'Roxo' ? 'text-purple-700' :
                  liturgyData.cor === 'Rosa' ? 'text-pink-600' :
                  liturgyData.cor === 'Dourado' ? 'text-yellow-600' :
                  'text-gray-800'
                }`}>
                  {liturgyData.cor}
                </span>
              </p>

              <h2 className="text-2xl font-bold text-amber-900 mb-6 border-b-2 border-amber-300 pb-2 text-center">
                {liturgyData.liturgia}
              </h2>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
              {filteredTabs.map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2 rounded-full text-sm md:text-base font-semibold transition-colors duration-200 ${activeTab === tab.key ? 'bg-amber-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              {getReadingContent()}
            </div>
          </motion.div>
        ) : null}
      </div>

      <AdSense adSlot="5858882948" adFormat="autorelaxed" />

      <footer className="bg-amber-100 text-center py-4 mt-auto">
        <div id="ezoic-pub-ad-placeholder-103"></div>
        <Link href="http://www.iatioben.com.br/termo-de-responsabilidade">Termo de responsabilidade</Link>
        <p className="text-gray-600 text-sm">
          Desenvolvido por <Link href="http://4udevelops.com.br">4U Develops</Link> - Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}
