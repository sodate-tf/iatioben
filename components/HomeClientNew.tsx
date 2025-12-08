'use client';

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clipboard } from "lucide-react";
import Spinner from "@/components/SpinnerLoading";
import FaqTioBen from "@/components/faqTioBen";
import Cabecalho from "@/components/cabecalho";
import Footer from "./Footer";

/* ================= FORMATADOR ================= */
function formatMessageText(text: string) {
  if (!text) return text;
  return text
    .replace(
      /\b(Deus|Jesus|Cristo|fé|oração|Evangelho|Maria|Igreja|Espírito Santo|Eucaristia|Santo|Salvação|Graça)\b/gi,
      "<strong>$1</strong>"
    )
    .replace(/"([^"]+)"/g, "<strong>“$1”</strong>");
}

type Message = {
  role: "user" | "assistant";
  content: string;
};

function HomeContent() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const isFirstMessage = messages.length === 0;

  const askQuestion = async (userQuestion: string) => {
    try {
      const res = await fetch("/api/perguntar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta: userQuestion }),
      });

      const data = await res.json();
      return data.resposta;
    } catch {
      return "⚠️ Houve um problema. Tente novamente.";
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    const pergunta = question;
    setQuestion("");

    setMessages((prev) => [...prev, { role: "user", content: pergunta }]);
    setIsTyping(true);

    const answer = await askQuestion(pergunta);

    setIsTyping(false);
    setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert("Resposta copiada!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-200 to-amber-400">
      <Cabecalho />

      {/* ✅ TELA INICIAL MELHORADA */}
      {isFirstMessage ? (
        <main className="flex-1 flex flex-col items-center justify-center px-5 text-center gap-6">
          <Image
            src="/images/ben-transparente.png"
            alt="Tio Ben"
            width={200}
            height={200}
            priority
          />

          <div className="max-w-xl">
            <h1 className="text-2xl md:text-3xl font-bold text-amber-900 mb-2">
              Olá! Eu sou o Tio Ben 👋
            </h1>
            <p className="text-gray-700 text-base md:text-lg">
              Faça uma pergunta sobre a fé, a liturgia, o Evangelho ou sua vida espiritual.
              A resposta aparecerá logo acima assim que eu terminar de responder.
            </p>
          </div>

          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-3">
            <textarea
              className="resize-none p-4 border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows={2}
              placeholder="Digite sua primeira pergunta..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

            <button
              onClick={handleAskQuestion}
              className="bg-amber-700 text-white py-3 rounded-xl font-semibold text-base hover:bg-amber-800 transition"
            >
              Perguntar ao Tio Ben
            </button>
          </div>
        </main>
      ) : (
        <>
          {/* ✅ CHAT NORMAL */}
          <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 pt-6 pb-32">
            <div className="flex flex-col gap-4">

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-end gap-2 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <Image
                      src="/images/ben-transparente.png"
                      alt="Tio Ben"
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  )}

                  <div
                    className={`relative max-w-[85%] p-4 rounded-2xl text-sm md:text-base leading-relaxed shadow ${
                      msg.role === "user"
                        ? "bg-amber-700 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none"
                    }`}
                    style={{ lineHeight: "1.7" }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          msg.role === "assistant"
                            ? formatMessageText(msg.content)
                            : msg.content,
                      }}
                    />

                    {/* ✅ BOTÃO COPIAR SÓ NA RESPOSTA */}
                    {msg.role === "assistant" && (
                      <button
  onClick={() => handleCopy(msg.content)}
  className="absolute bottom-1 right-2 flex items-center gap-1 
             text-xs text-gray-400 hover:text-amber-700 
             transition-colors cursor-pointer select-none"
  aria-label="Copiar resposta"
>
  <Clipboard size={14} className="opacity-80" />
  <span className="hidden sm:inline">Copiar</span>
</button>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <Image
                      src="/images/avatar-user.png"
                      alt="Usuário"
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  )}
                </motion.div>
              ))}

              {/* ✅ SPINNER NATURAL */}
              {isTyping && (
                <div className="flex items-center gap-2">
                  <Image src="/images/ben-transparente.png" alt="Tio Ben" width={32} height={32} />
                  <div className="px-4 py-3 rounded-xl bg-white shadow">
                    <Spinner />
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* ✅ INPUT FIXO */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-xl">
            <div className="max-w-4xl mx-auto flex items-center gap-3 px-4 py-3">
              <Image src="/images/ben-transparente.png" alt="Tio Ben" width={40} height={40} className="hidden sm:block" />

              <textarea
                className="flex-1 resize-none p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows={1}
                placeholder="Digite sua pergunta ao Tio Ben..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAskQuestion();
                  }
                }}
              />

              <button
                onClick={handleAskQuestion}
                disabled={!question.trim()}
                className="bg-amber-700 text-white px-5 py-2 rounded-xl font-semibold disabled:opacity-40"
              >
                Enviar
              </button>
            </div>
          </div>
        </>
      )}

      <FaqTioBen />
      <Footer />
    </div>
  );
}

export default function HomeClient() {
  return (
    <Suspense fallback={<div className="text-center py-10">Carregando...</div>}>
      <HomeContent />
    </Suspense>
  );
}
