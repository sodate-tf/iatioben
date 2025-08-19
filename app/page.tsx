"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "@/components/SpinnerLoading";
import TestBanner from "@/components/testBanner";
import VideoAdModal from "@/components/testVideoAd";
import Link from "next/link";

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

      const res = await fetch("https://www.iatioben.com.br/api/perguntar", {
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
      // 
      fetch("https://www.iatioben.com.br/api/sheets", {
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
      <div className="flex flex-col min-h-screen bg-amber-400 relative" >
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
                      width={250}
                      height={250}
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

                <motion.div
                  className="flex w-full  bg-white rounded-lg shadow-lg p-4 m-20 items-center justify-center text-justify"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <span>
                    <p className="mb-3"> Bem-vindo(a) ao <b>Tio Ben!</b> Este é o seu espaço para explorar e aprofundar a sua fé de uma maneira única e acessível.<br />
                        Nosso aplicativo foi criado com o propósito de conectar a sabedoria milenar da <b>fé Católica</b> com a tecnologia moderna,<br/>transformando um vasto conhecimento em respostas simples, claras e objetivas para suas perguntas do dia a dia.
                    </p>
                    <p className="mb-3"> O <b>Tio Ben</b> é um agente de inteligência artificial treinado para responder com base em fontes confiáveis e fundamentais da Igreja:<br />
                        a Bíblia Sagrada, o Catecismo e a Tradição Católica.
                    </p>
                    <p className="mb-3"> Ele age como um catequista digital, sempre pronto para guiar e esclarecer suas dúvidas com <b>carinho, respeito e simplicidade.</b><br />
                        Nosso objetivo é que você se sinta à vontade para perguntar sobre qualquer tema relacionado à fé.<br/>
                    </p>
                    <p className="mb-3">
                      Seja para entender um ensinamento complexo, buscar uma inspiração, ou apenas ter uma conversa sobre a vida cristã, o <b>Tio Ben</b> está aqui para você.<br />
                      É a sua fé, traduzida em uma conversa amigável e direta, feita para auxiliar na sua jornada espiritual.
                    </p>
                  </span>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Modal de resposta */}
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
        <footer className="bg-amber-100 text-center py-4 -mt-8">
          <p className="text-gray-600 text-sm">
            Desenvolvido por <Link href="http://4udevelops.com.br" target="_blank" about="Desenvolvido por 4u Develops">4U Develops</Link> - Todos os direitos reservados
          </p>
        </footer>
      </div>
    </>
  );
}
