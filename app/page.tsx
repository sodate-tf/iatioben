"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "@/components/SpinnerLoading";
import TestBanner from "@/components/testBanner";
import VideoAdModal from "@/components/testVideoAd";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const questionCount = useRef(0);

  const [lastAskedQuestion, setLastAskedQuestion] = useState("");
  const [lastQuestionResult, setLastQuestionResult] = useState("");

  const [showInterstitial, setShowInterstitial] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [modalQuestion, setModalQuestion] = useState("");
  const [modalAnswer, setModalAnswer] = useState("");

  const navigateToAnswer = () => {
    setShowInterstitial(false);
    setShowAnswerModal(true);
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setLastAskedQuestion(question);
    let tempResultado = "Desculpe, não consegui obter resposta do Tio Ben.";

    try {
      questionCount.current += 1;

      const res = await fetch("/api/perguntar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta: question }),
      });

      const data = await res.json();
      tempResultado = data.resposta || tempResultado;
      setLastQuestionResult(tempResultado);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);

      // Salva no Google Sheets
      fetch("/api/sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta: question, resposta: tempResultado }),
      }).then(r => r.text()).then(console.log);

      // Define modal
      setModalQuestion(question);
      setModalAnswer(tempResultado);

      // Lógica de vídeo interstitial
      if (questionCount.current === 2 || (questionCount.current - 2) % 3 === 0) {
        setShowInterstitial(true); // Mostra o vídeo
      } else {
        navigateToAnswer(); // Exibe a resposta diretamente
      }

      // Limpa a pergunta do textarea
      setQuestion("");
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-amber-400">
        <div className="flex-1 flex flex-col items-center px-4 py-8">
          {/* Título */}
          <motion.h1
            className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Pergunte para o Tio Ben
          </motion.h1>

          {/* Loading / Conteúdo */}
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
                {/* Balão do Tio Ben */}
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

                  {/* Imagem do Tio Ben */}
                  <motion.div
                    className="mt-4 relative z-20"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <Image
                      src="/images/ben-transparente.png"
                      alt="Tio Ben"
                      width={350}
                      height={350}
                      priority
                    />
                  </motion.div>
                </div>

                {/* Input e botão */}
                <motion.div
                  className="flex w-full max-w-2xl bg-white rounded-lg shadow-lg p-4"
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
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleAskQuestion}
                    disabled={isLoading}
                    className="ml-2 bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold hover:cursor-pointer hover:bg-amber-800 disabled:opacity-50"
                  >
                    {isLoading ? "Carregando..." : "Perguntar"}
                  </motion.button>
                </motion.div>
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
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl flex flex-col items-center relative z-50"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Pergunta */}
                  <h2 className="text-xl font-bold text-amber-900 mb-4 text-center">
                    {modalQuestion}
                  </h2>

                  {/* Resposta */}
                  <div className="text-gray-700 text-base mb-6 whitespace-pre-line max-h-[60vh] overflow-auto">
                    {modalAnswer}
                  </div>

                  {/* Botão fechar */}
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

          {/* Modal de vídeo */}
          {showInterstitial && (
            <VideoAdModal
              onComplete={() => {
                setShowInterstitial(false);
                setShowAnswerModal(true);
              }}
              skipAfter={7} // botao "pular" após 7 segundos
            />
          )}

          {/* Banner de rodapé */}
          <TestBanner />
        </div>

        {/* Footer */}
        <footer className="bg-amber-100 text-center py-4 mt-6">
          <p className="text-gray-600 text-sm">
            Desenvolvido por 4U Develops - Todos os direitos reservados
          </p>
        </footer>
      </div>
    </>
  );
}
