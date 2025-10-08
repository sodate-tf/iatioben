'use client';
import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "@/components/SpinnerLoading";
import VideoAdModal from "@/components/testVideoAd";
import Link from "next/link";
import FaqTioBen from "@/components/faqTioBen";
import Cabecalho from "@/components/cabecalho";
import Head from "next/head";


export default function Home() {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const questionCount = useRef(0);

  const [lastQuestion, setLastQuestion] = useState("");
  const [lastAnswer, setLastAnswer] = useState("");

  const [showInterstitial, setShowInterstitial] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  
 

  const navigateToAnswer = () => {
    setShowInterstitial(false);
    setShowAnswerModal(true);
  };
  
  const askQuestion = async (userQuestion: string) => {
    setErrorMessage("");
    try {
      const res = await fetch("/api/perguntar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta: userQuestion }),
      });

      if (!res.ok) {
        throw new Error("Falha na resposta da API.");
      }

      const data = await res.json();
      return data.resposta;
    } catch (err) {
      console.error(err);
      setErrorMessage("Desculpe, não consegui obter resposta do Tio Ben. Tente novamente mais tarde.");
      return null;
    }
  };

  const logToSheets = async (pergunta : string, resposta: string) => {
    try {
      await fetch("/api/sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta, resposta }),
      });
    } catch (err) {
      console.error("Falha ao salvar no Google Sheets:", err);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      setErrorMessage("Por favor, digite sua pergunta.");
      return;
    }

    setIsLoading(true);
    setLastQuestion(question);
    const answer = await askQuestion(question);
    setLastAnswer(answer);
    
    // Incrementa a contagem apenas se a pergunta for bem-sucedida
    if (answer) {
      questionCount.current += 1;
      logToSheets(question, answer);
    }

    setIsLoading(false);
    setQuestion("");

    if (answer) {
      if (questionCount.current === 2 || (questionCount.current > 2 && (questionCount.current - 2) % 3 === 0)) {
        setShowInterstitial(true);
      } else {
        navigateToAnswer();
      }
    }
  };
  

  return (
    <>
    <Head>
        {/* --- SEO BÁSICO --- */}
        <title>IA Tio Ben | Inteligência Artificial para Liturgia, Oração e Reflexões</title>
        <meta
          name="description"
          content="IA Tio Ben - Sua inteligência artificial para liturgia diária, liturgia católica, leituras do dia e reflexões cristãs. Simples, acessível e direto para sua vida espiritual."
        />
        <meta
          name="keywords"
          content="IA Tio Ben, inteligência artificial católica, liturgia, liturgia católica, liturgia diária, leitura do dia, leituras liturgia do dia, oração diária, reflexões bíblicas"
        />

        {/* --- SEO AVANÇADO --- */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="4U Develops" />
        <meta name="language" content="pt-BR" />

        {/* --- OPEN GRAPH (para Facebook/WhatsApp) --- */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="IA Tio Ben" />
        <meta
          property="og:title"
          content="IA Tio Ben | Liturgia Diária e Inteligência Artificial Cristã"
        />
        <meta
          property="og:description"
          content="Receba a liturgia do dia, leituras, salmos e reflexões com ajuda da IA Tio Ben."
        />
        <meta property="og:url" content="https://www.iatioben.com.br/" />
        <meta property="og:image" content="https://www.iatioben.com.br/images/og_image.png" />

        {/* --- TWITTER CARD --- */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@iatioben" />
        <meta
          name="twitter:title"
          content="IA Tio Ben | Inteligência Artificial para Liturgia e Reflexões"
        />
        <meta
          name="twitter:description"
          content="Liturgia diária, leituras católicas e reflexões na palma da sua mão com a IA Tio Ben."
        />
        <meta name="twitter:image" content="https://www.iatioben.com.br/images/og_image.png" />

        {/* --- FAVICON --- */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="flex flex-col min-h-screen bg-amber-400 relative">
        <Cabecalho />
        <div className="flex-1 flex flex-col items-center px-4 py-8">
          <motion.h1
            className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Pergunte para o Tio Ben
          </motion.h1>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                className="flex items-center justify-center min-h-screen bg-amber-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Spinner />
              </motion.div>
            ) : (
              <>
                <div className="relative flex flex-col items-center">
                  <motion.div
                    className="bg-amber-100 max-w-[80%] p-4 rounded-xl shadow-md relative z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <p className="text-amber-950 text-lg">
                      👋 Oi! Eu sou o Tio Ben. Pode mandar sua pergunta que eu respondo com alegria!
                    </p>
                    <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[15px] border-transparent border-t-amber-100"></div>
                  </motion.div>

                  <motion.div
                    className="mt-4 relative z-20"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <Image
                      src="/images/ben-transparente.png"
                      alt="Tio Ben"
                      width={250}
                      height={250}
                      priority
                    />
                  </motion.div>
                </div>

                <motion.div
                  className="flex flex-col w-full max-w-2xl bg-white rounded-lg shadow-lg p-4"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <textarea
                    className="flex-1 p-2 border border-gray-300 rounded-lg text-lg text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
                    rows={4}
                    placeholder="Digite sua pergunta aqui..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={isLoading}
                  />
                  {errorMessage && (
                    <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleAskQuestion}
                    disabled={isLoading || question.trim() === ""}
                    className="mt-4 bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold hover:cursor-pointer hover:bg-amber-800 disabled:opacity-50"
                  >
                    {isLoading ? "Carregando..." : "Perguntar"}
                  </motion.button>
                </motion.div>

                <FaqTioBen />
              </>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showAnswerModal && (
              <motion.div
                className="fixed inset-0 flex items-start overflow-auto justify-center bg-black/50 z-51 pt-16 pb-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl flex flex-col items-center relative z-51"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-bold text-amber-900 mb-4 text-center">
                    {lastQuestion}
                  </h2>
                  <div className="text-gray-700 text-base mb-6 whitespace-pre-line max-h-[60vh] overflow-auto">
                    {lastAnswer}
                  </div>
                  <button
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
                    onClick={() => setShowAnswerModal(false)}
                  >
                    Fechar
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {showInterstitial && (
            <VideoAdModal
              onComplete={() => {
                setShowInterstitial(false);
                setShowAnswerModal(true);
              }}
              skipAfter={7}
            />
          )}

          
        </div>

        <footer className="bg-amber-100 text-center py-4 -mt-8">
          <div id="ezoic-pub-ad-placeholder-103"></div>
          <Link href="http://www.iatioben.com.br/termo-de-responsabilidade" target="_blank" about="Termo de responsabilidade do site iaTioBen.com.br">Termo de responsabilidade</Link>
          <p className="text-gray-600 text-sm">
            Desenvolvido por <Link href="http://4udevelops.com.br" target="_blank" about="Desenvolvido por 4u Develops">4U Develops</Link> - Todos os direitos reservados
          </p>
        </footer>
      </div>
    </>
  );
}
