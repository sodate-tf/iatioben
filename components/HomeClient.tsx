'use client';
import React, { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "@/components/SpinnerLoading";
import VideoAdModal from "@/components/testVideoAd";
import FaqTioBen from "@/components/faqTioBen";
import Cabecalho from "@/components/cabecalho";
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

  return (
    <div className="flex flex-col min-h-screen bg-amber-400 relative">
      <Cabecalho />

      <main className="flex-1 flex flex-col items-center px-4 py-8">

        {/* BLOCO SEO VISÍVEL (IMPORTANTE) */}
        <section className="text-center mb-8 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold text-amber-900 mb-3">
            IA Tio Ben – Liturgia Diária e Evangelho do Dia
          </h1>
          <p className="text-gray-700 text-lg">
            Descubra a liturgia diária, o evangelho do dia, salmos e reflexões católicas com a ajuda da inteligência artificial.
          </p>
        </section>

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
              {/* BALÃO DE FALA */}
              <section className="relative flex flex-col items-center">
                <motion.div
                  className="bg-amber-100 max-w-[80%] p-4 rounded-xl shadow-md relative z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <p className="text-amber-950 text-lg">
                    👋 Oi! Eu sou o Tio Ben. Pode mandar sua pergunta — quero te ajudar a entender melhor a fé e a liturgia!
                  </p>
                </motion.div>

                <motion.div className="mt-4 relative z-20">
                  <Image
                    src="/images/ben-transparente.png"
                    alt="IA Tio Ben — Catequista Virtual"
                    width={250}
                    height={250}
                    priority
                  />
                </motion.div>
              </section>

              {/* FORMULÁRIO */}
              <motion.section className="flex flex-col w-full max-w-2xl bg-white rounded-lg shadow-lg p-4 mt-6">
                <h2 className="text-xl font-semibold text-amber-900 mb-3 text-center">
                  Faça sua pergunta ao Tio Ben 🙋‍♂️
                </h2>

                <textarea
                  className="flex-1 p-2 border border-gray-300 rounded-lg text-lg text-gray-700 resize-none"
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

        {/* MODAL */}
        <AnimatePresence>
          {showAnswerModal && (
            <motion.div className="fixed inset-0 flex items-start justify-center bg-black/50 z-50 pt-16 pb-16">
              <motion.div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl flex flex-col items-center">
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
  );
}

export default function HomeClient() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-gray-700">Carregando...</div>}>
      <HomeContent />
    </Suspense>
  );
}
