'use client';
// pages/liturgia-diaria.tsx

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Spinner from '@/components/SpinnerLoading'; // Assegure-se de que o caminho está correto
import Cabecalho from '@/components/cabecalho'; // Certifique-se de que este componente existe e está no caminho correto
import AdSense from '@/components/Adsense';
import LiturgiaMeta from '@/components/MetaLirurgia';

// --- Definições de Tipos (Interfaces) ---

// Interface base para uma leitura
interface LiturgyReadingItem {
  referencia: string;
  titulo: string;
  texto: string;
}

// Interface para o Salmo, que tem uma propriedade extra 'refrao'
interface SalmoReadingItem extends LiturgyReadingItem {
  refrao: string;
}

// Interface para o objeto 'oracoes'
interface Oracoes {
  coleta: string;
  oferendas: string;
  comunhao: string;
  extras: string[]; // Supondo que 'extras' é um array de strings
}

// Interface para o objeto 'antifonas'
interface Antifonas {
  entrada: string;
  comunhao: string;
}

// Interface para o objeto 'leituras' aninhado
interface LeiturasObject {
  primeiraLeitura: LiturgyReadingItem[];
  salmo: SalmoReadingItem[];
  segundaLeitura: LiturgyReadingItem[]; // Pode ser array vazio se não houver 2ª leitura
  evangelho: LiturgyReadingItem[];
  //extras: any[]; // Se 'extras' tiver um tipo definido, use-o
}

// Interface principal para os dados da liturgia retornados pela API
interface LiturgyData {
  data: string; // Ex: "28/08/2025" (formato DD/MM/AAAA)
  liturgia: string; // "Santo Agostinho, bispo e doutor da Igreja, Memória"
  cor: string;  // Ex: "Branco", "Verde", "Roxo"
  oracoes: Oracoes;
  leituras: LeiturasObject; // Objeto contendo todas as leituras
  antifonas: Antifonas;
}

// Tipo que define as chaves de 'leituras' que contêm os conteúdos das leituras
type LiturgyReadingKey = keyof LeiturasObject;

// Interface para o objeto retornado por formatDate
interface FormattedDate {
  day?: string;
  month?: string;
  year?: string;
}

// --- Componente Principal ---

const LiturgiaDiaria: React.FC = () => {
  // Estados tipados
  const [liturgyData, setLiturgyData] = useState<LiturgyData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<LiturgyReadingKey | null>(null);
  const [fontSize, setFontSize] = useState<number>(16);

  const API_URL = "https://liturgia.up.railway.app/v2/"; // URL da API

  useEffect(() => {
    const fetchLiturgy = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error(`Erro HTTP! status: ${res.status}`);
        }
        const data: LiturgyData = await res.json(); // Tipando a resposta da API
        setLiturgyData(data);

        // Define a primeira leitura disponível como a aba ativa por padrão
        // Acessa via `data.leituras.<nomeDaLeitura>` e verifica se o array não está vazio
        if (data.leituras.primeiraLeitura.length > 0) {
          setActiveTab('primeiraLeitura');
        } else if (data.leituras.salmo.length > 0) {
          setActiveTab('salmo');
        } else if (data.leituras.segundaLeitura.length > 0) {
          setActiveTab('segundaLeitura');
        } else if (data.leituras.evangelho.length > 0) {
          setActiveTab('evangelho');
        }
      } catch (err: unknown) {
  console.error("Falha ao buscar dados da liturgia:", err);
  
  if (err instanceof Error) {
    setError(`Não foi possível carregar a liturgia do dia: ${err.message}.`);
  } else {
    setError('Não foi possível carregar a liturgia do dia: Erro desconhecido.');
  }} finally {
        setIsLoading(false);
      }
    };

    fetchLiturgy();
  }, []);

  const formatDate = (dateString: string | undefined): FormattedDate => {
    if (!dateString) {
      return {};
    }

    const [dayStr, monthStr, yearStr] = dateString.split('/');
    const monthNames = [
      'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
      'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'
    ];

    const monthNumber = parseInt(monthStr, 10) - 1;
    const monthAbbreviation = monthNames[monthNumber];

    return {
      day: dayStr,
      month: monthAbbreviation,
      year: yearStr,
    };
  };

  const { day, month, year } = formatDate(liturgyData?.data);

  const getReadingContent = () => {
    if (!liturgyData || !activeTab) return null;

    const readingsArray = liturgyData.leituras[activeTab];

    if (readingsArray && readingsArray.length > 0) {
      const reading = readingsArray[0]; // Pega o primeiro item do array

      return (
        <div>
          <h4 className="font-bold text-sm mb-2 text-amber-800">{reading.referencia}</h4>  
          {/* Título da leitura (pode não existir em salmos diretamente) */}
          {reading.titulo && <h3 className="font-bold text-lg mb-2 text-amber-800">{reading.titulo}</h3>}
          {/* Refrao, se for um salmo */}
          {activeTab === 'salmo' && (reading as SalmoReadingItem).refrao && (
            <p className="font-semibold text-amber-700 mb-2" style={{ fontSize: `${fontSize}px` }}>
              {(reading as SalmoReadingItem).refrao}
            </p>
          )}
          {/* Texto da leitura */}
          <p className="whitespace-pre-line text-gray-700 leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
            {reading.texto}
          </p>
        </div>
      );
    }
    return <p className="text-gray-600">Conteúdo não disponível para esta seção.</p>;
  };

  // Função para concatenar todos os textos das leituras para compartilhamento
  const getShareableReadingText = (): string => {
    let text = '';
    // Adiciona uma verificação explícita para liturgyData e leituras
    if (!liturgyData || !liturgyData.leituras) {
      return ''; // Retorna string vazia se os dados não estiverem disponíveis
    }

    if (liturgyData.leituras.primeiraLeitura.length) {
      text += `1ª Leitura:\n${liturgyData.leituras.primeiraLeitura[0].texto}\n\n`;
    }
    if (liturgyData.leituras.salmo.length) {
      text += `Salmo:\n${(liturgyData.leituras.salmo[0] as SalmoReadingItem).refrao || ''}\n${liturgyData.leituras.salmo[0].texto}\n\n`;
    }
    if (liturgyData.leituras.segundaLeitura.length) {
      text += `2ª Leitura:\n${liturgyData.leituras.segundaLeitura[0].texto}\n\n`;
    }
    if (liturgyData.leituras.evangelho.length) {
      text += `Evangelho:\n${liturgyData.leituras.evangelho[0].texto}\n\n`;
    }
    return text;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Liturgia Diária - ${liturgyData?.liturgia || 'Dia'}`, // Usar liturgyData.liturgia
          text: `Confira a liturgia do dia: ${liturgyData?.data || ''}\n\n${liturgyData?.liturgia || ''}`,
          url: "https://www.iatioben.com.br/liturgia-diaria",
        });
      } catch (err: unknown) {
  console.error("Falha ao buscar dados da liturgia:", err);
  
  if (err instanceof Error) {
    setError(`Não foi possível carregar a liturgia do dia: ${err.message}.`);
  } else {
    setError('Não foi possível carregar a liturgia do dia: Erro desconhecido.');
  }}
    } else {
      alert('Seu navegador não suporta a função de compartilhamento. Por favor, copie o link e o texto.');
      const shareText = `Liturgia Diária - ${liturgyData?.liturgia || 'Dia'}\n\n${liturgyData?.data || ''}\n\n${getShareableReadingText()}\n\n${window.location.href}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Texto da liturgia copiado para a área de transferência!');
      }).catch(err => {
        console.error('Erro ao copiar:', err);
      });
    }
  };

  // Interface para as informações de cada aba
  interface TabInfo {
    key: LiturgyReadingKey;
    label: string;
  }

  // Abas disponíveis, filtradas dinamicamente
  const tabs: TabInfo[] = [
    { key: 'primeiraLeitura', label: '1ª Leitura' },
    { key: 'salmo', label: 'Salmo' },
    { key: 'segundaLeitura', label: '2ª Leitura' },
    { key: 'evangelho', label: 'Evangelho' },
  ] as const
  tabs.filter(tab => liturgyData && liturgyData.leituras && liturgyData.leituras[tab.key] && liturgyData.leituras[tab.key].length > 0); // <-- CORREÇÃO AQUI

  return (
    <div className="flex flex-col min-h-screen bg-amber-400 relative">
      {/* Cabeçalho consistente */}
      <Cabecalho />
      <LiturgiaMeta />

      {/* Área de conteúdo principal da página da Liturgia Diária */}
      <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-4xl mx-auto w-full">
        <motion.h1
          className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Liturgia Diária
        </motion.h1>

        {/* Renderização condicional: spinner, mensagem de erro ou conteúdo da liturgia */}
        {isLoading ? (
          <Spinner />
        ) : error ? (
          <p className="text-red-600 text-lg">{error}</p>
        ) : liturgyData ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-4 md:p-8 w-full"
          >
            {/* Seção de exibição da data */}
            <div className="flex justify-center items-end mb-4 relative w-full"> {/* Centralizado */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <span className="text-6xl font-bold text-amber-700">{day}</span> {/* Número grande do dia */}
                  {/* Mês e ano ajustados para centralizar melhor com o dia grande */}
                  <div className="flex flex-col absolute top-7 left-[calc(100%+5px)] -translate-y-1/2">
                    <span className="text-xl font-semibold text-amber-600 leading-none">{month}</span>
                    <span className="text-2xl text-gray-600 leading-none">{year}</span>
                  </div>
                </div>
              </div>

              {/* Botão de Compartilhamento e Controles de Tamanho de Fonte (à direita) */}
              <div className="absolute right-0 top-0 flex flex-col items-end space-y-2">
                <button
                  onClick={handleShare}
                  className="bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
                  title="Compartilhar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.632l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
                    className="bg-gray-200 text-gray-700 p-1 rounded-full text-lg font-bold hover:bg-gray-300"
                    title="Diminuir fonte"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSize(prev => Math.min(24, prev + 2))}
                    className="bg-gray-200 text-gray-700 p-1 rounded-full text-lg font-bold hover:bg-gray-300"
                    title="A+"
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>


            {/* Exibição da Cor Litúrgica */}
            <p className="text-xl text-gray-700 mb-2 text-center"> {/* Centralizado */}
              <span className="font-semibold">Cor Litúrgica:</span>{" "}
              <span className={`font-bold ${
                liturgyData.cor === 'Branco' ? 'text-gray-900' :
                liturgyData.cor === 'Verde' ? 'text-green-700' :
                liturgyData.cor === 'Vermelho' ? 'text-red-700' :
                liturgyData.cor === 'Roxo' ? 'text-purple-700' :
                liturgyData.cor === 'Rosa' ? 'text-pink-600' : // Ajustado para tom mais escuro
                liturgyData.cor === 'Dourado' ? 'text-yellow-600' : // Ajustado para tom mais escuro
                'text-gray-800'
              }`}>
                {liturgyData.cor}
              </span>
            </p>

            {/* Subtítulo / Nome da Liturgia */}
            <h2 className="text-2xl font-bold text-amber-900 mb-6 border-b-2 border-amber-300 pb-2 text-center"> {/* Centralizado */}
              {liturgyData.liturgia}
            </h2>

            {/* Abas para as Leituras */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-full text-sm md:text-base font-semibold transition-colors duration-200 ${
                    activeTab === tab.key
                      ? "bg-amber-600 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Área de conteúdo da leitura */}
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              {getReadingContent()}
            </div>
          </motion.div>
        ) : null /* Se não houver dados e não estiver carregando/erro, não renderiza nada */}
      </div>
 
      <AdSense adSlot='5858882948' adFormat='autorelaxed'  />

      {/* Rodapé consistente */}
      <footer className="bg-amber-100 text-center py-4 mt-auto">
        <div id="ezoic-pub-ad-placeholder-103"></div>
        <Link href="http://www.iatioben.com.br/termo-de-responsabilidade"  about="Termo de responsabilidade do site iaTioBen.com.br">Termo de responsabilidade</Link>
        <p className="text-gray-600 text-sm">
          Desenvolvido por <Link href="http://4udevelops.com.br"  about="Desenvolvido por 4u Develops">4U Develops</Link> - Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
};

export default LiturgiaDiaria;