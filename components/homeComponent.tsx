'use client';
import React, { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "@/components/SpinnerLoading";
import VideoAdModal from "@/components/testVideoAd";
import FaqTioBen from "@/components/faqTioBen";
import Cabecalho from "@/components/cabecalho";
import Head from "next/head";
import Footer from "./Footer";

function HomeContent() {
  const searchParams = useSearchParams();

  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const questionCount = useRef(0);

  const [lastQuestion, setLastQuestion] = useState("");
  const [lastAnswer, setLastAnswer] = useState("");
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);

  // 🚀 Nova função — detecta ?texto= na URL e faz a pergunta automática
  useEffect(() => {
    const perguntaViaUrl = searchParams.get("texto");
    if (perguntaViaUrl) {
      setQuestion(perguntaViaUrl);
      handleAskQuestion(perguntaViaUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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

      if (!res.ok) throw new Error("Falha na resposta da API.");
      const data = await res.json();
      return data.resposta;
    } catch (err) {
      console.error(err);
      setErrorMessage("Desculpe, não consegui obter resposta do Tio Ben. Tente novamente mais tarde.");
      return null;
    }
  };

  const logToSheets = async (pergunta: string, resposta: string) => {
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

  const handleAskQuestion = async (perguntaOpcional?: string) => {
    const perguntaFinal = perguntaOpcional || question;
    if (!perguntaFinal.trim()) {
      setErrorMessage("Por favor, digite sua pergunta.");
      return;
    }

    setIsLoading(true);
    setLastQuestion(perguntaFinal);
    const answer = await askQuestion(perguntaFinal);
    setLastAnswer(answer);

    if (answer) {
      questionCount.current += 1;
      logToSheets(perguntaFinal, answer);
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

  const jsonLdHome = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "IA Tio Ben",
    url: "https://www.iatioben.com.br",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.iatioben.com.br/busca?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <Head>
        <title>IA Tio Ben | Liturgia Diária, Evangelho do Dia e Reflexões Católicas</title>
        <meta
          name="description"
          content="Converse com o Tio Ben, seu catequista virtual. Descubra a liturgia diária, o evangelho do dia, salmos e reflexões católicas. Explore o Blog IA Tio Ben e cresça na fé!"
        />
        <meta
          name="keywords"
          content="IA Tio Ben, liturgia diária, evangelho do dia, leituras católicas, reflexões bíblicas, blog católico, inteligência artificial católica, orações, homilia, catequese"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="4U Develops" />
        <meta name="language" content="pt-BR" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="IA Tio Ben" />
        <meta property="og:title" content="IA Tio Ben | Evangelho e Liturgia Diária com Inteligência Artificial" />
        <meta property="og:description" content="Receba o Evangelho do dia e reflexões católicas com o Tio Ben — sua inteligência artificial para a fé." />
        <meta property="og:url" content="https://www.iatioben.com.br/" />
        <meta property="og:image" content="https://www.iatioben.com.br/images/og_image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="IA Tio Ben | Liturgia Diária e Reflexões Cristãs" />
        <meta name="twitter:description" content="Descubra a liturgia católica do dia, salmos e evangelho com o Tio Ben. Uma forma leve e acessível de fortalecer a fé." />
        <meta name="twitter:image" content="https://www.iatioben.com.br/images/og_image.png" />
        <link rel="icon" href="/favicon.ico" />
        <script type="application/ld+json">{JSON.stringify(jsonLdHome)}</script>
      </Head>

      <div className="flex flex-col min-h-screen bg-amber-400 relative">
        <Cabecalho />

        <main className="flex-1 flex flex-col items-center px-4 py-8">
          {/* Introdução */}
          <motion.section
            className="text-center mb-10 max-w-2xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
              IA Tio Ben — Catequista Virtual para a Liturgia Diária e Reflexões Católicas
            </h1>
            <p className="text-lg text-gray-800 leading-relaxed">
              Bem-vindo ao <strong>Tio Ben</strong>! 🙌  
              Aqui você pode tirar dúvidas sobre fé, Bíblia, liturgia diária e a vida cristã.  
              Nossa inteligência artificial foi criada para te acompanhar espiritualmente e te ajudar a compreender o <strong>Evangelho do Dia</strong> e as <strong>leituras litúrgicas</strong>.
            </p>
          </motion.section>

          {/* Personagem e perguntas */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                className="flex items-center justify-center min-h-screen bg-amber-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Spinner />
              </motion.div>
            ) : (
              <>
                <section className="relative flex flex-col items-center">
                  <motion.div
                    className="bg-amber-100 max-w-[80%] p-4 rounded-xl shadow-md relative z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <p className="text-amber-950 text-lg">
                      👋 Oi! Eu sou o Tio Ben. Pode mandar sua pergunta — quero te ajudar a entender melhor a fé e a liturgia!
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
                      alt="IA Tio Ben — Catequista Virtual"
                      width={250}
                      height={250}
                      priority
                    />
                  </motion.div>
                </section>

                <motion.section
                  className="flex flex-col w-full max-w-2xl bg-white rounded-lg shadow-lg p-4 mt-6"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <h2 className="text-xl font-semibold text-amber-900 mb-3 text-center">
                    Faça sua pergunta ao Tio Ben 🙋‍♂️
                  </h2>
                  <textarea
                    className="flex-1 p-2 border border-gray-300 rounded-lg text-lg text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
                    rows={4}
                    placeholder="Digite sua pergunta sobre liturgia, fé, oração ou o evangelho..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={isLoading}
                  />
                  {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAskQuestion()}
                    disabled={isLoading || question.trim() === ""}
                    className="mt-4 bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-800 disabled:opacity-50"
                  >
                    {isLoading ? "Carregando..." : "Perguntar"}
                  </motion.button>
                </motion.section>

                <FaqTioBen />
              </>
            )}
          </AnimatePresence>

          {/* Modal de resposta */}
          <AnimatePresence>
            {showAnswerModal && (
              <motion.div
                className="fixed inset-0 flex items-start overflow-auto justify-center bg-black/50 z-50 pt-16 pb-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl flex flex-col items-center relative"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <h2 className="text-xl font-bold text-amber-900 mb-4 text-center">{lastQuestion}</h2>
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
        </main>

        <Footer />
      </div>
    </>
  );
}

// 🧱 Wrapping HomeContent with Suspense boundary
export default function Home() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-gray-700">Carregando...</div>}>
      <HomeContent />
    </Suspense>
  );
}
