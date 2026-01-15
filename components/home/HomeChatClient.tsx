"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clipboard } from "lucide-react";
import Spinner from "@/components/SpinnerLoading";
import FaqTioBen from "@/components/faqTioBen";
import AdSensePro from "@/components/adsensePro";

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

function HomeChatContent() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const isFirstMessage = messages.length === 0;

  const askQuestion = async (userQuestion: string, history: Message[]) => {
    try {
      const res = await fetch("/api/perguntar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pergunta: userQuestion,
          history,
        }),
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

    const historyWithNewQuestion: Message[] = [
      ...messages,
      { role: "user", content: pergunta },
    ];

    setMessages(historyWithNewQuestion);
    setIsTyping(true);

    const answer = await askQuestion(pergunta, historyWithNewQuestion);

    setIsTyping(false);
    setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // feedback discreto (evita alert que atrapalha UX/metrics)
      // você pode trocar por toast depois
    } catch {
      // ignore
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setIsTyping(false);
    setQuestion("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-200 to-amber-400">
      {/* Agora o HERO é SSR (no HomeHero). Aqui fica só o chat/FAQ/ads. */}

      {!isFirstMessage ? (
        <>
          {/* CHAT */}
          <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 pt-6 pb-[180px]">
            <div className="flex justify-end mb-3">
              <button
                onClick={handleClearChat}
                className="text-xs px-3 py-1 rounded-full border
                           text-amber-700 border-amber-700
                           hover:bg-amber-700 hover:text-white
                           transition-colors"
              >
                Limpar conversa
              </button>
            </div>

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
                      alt="IA Tio Ben"
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  )}

                  <div
                    className={`relative max-w-[75%] p-5 rounded-2xl text-sm md:text-base shadow
                    ${
                      msg.role === "user"
                        ? "bg-amber-700 text-white rounded-br-none"
                        : "bg-[#fffaf1] text-gray-900 rounded-bl-none border border-amber-100"
                    }`}
                    style={{ lineHeight: "1.9" }}
                  >
                    <div
                      className="space-y-3"
                      dangerouslySetInnerHTML={{
                        __html:
                          msg.role === "assistant"
                            ? formatMessageText(msg.content).replace(/\n/g, "<br/>")
                            : msg.content,
                      }}
                    />

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

              {isTyping && (
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/ben-transparente.png"
                    alt="IA Tio Ben"
                    width={32}
                    height={32}
                  />
                  <div className="px-4 py-3 rounded-xl bg-white shadow">
                    <Spinner />
                  </div>
                </div>
              )}
            </div>
          </main>
        </>
      ) : (
        // Estado inicial (antes da primeira pergunta): mantenha conteúdo leve
        <main className="flex-1 flex flex-col items-center justify-start px-5 text-center gap-6 pt-6 pb-[220px]">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-3">
            <p className="text-gray-800 font-semibold">
              Faça sua primeira pergunta ao Tio Ben
            </p>

            <textarea
              className="resize-none p-4 border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
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

          {/* FAQ + Ads somente no estado inicial */}
          <div className="relative z-[1] w-full max-w-4xl mx-auto px-4">
            <AdSensePro slot="4577789231" height={140} />
            <FaqTioBen />
          </div>
        </main>
      )}

      {/* INPUT FIXO */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[9999]
                   bg-white border-t shadow-xl
                   pb-[env(safe-area-inset-bottom)]"
      >
        <div className="max-w-4xl mx-auto flex items-center gap-3 px-4 py-3">
          <Image
            src="/images/ben-transparente.png"
            alt="IA Tio Ben"
            width={40}
            height={40}
            className="hidden sm:block"
          />

          <textarea
            className="flex-1 resize-none p-3 border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
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
    </div>
  );
}

export default function HomeChatClient() {
  return (
    <Suspense fallback={<div className="text-center py-10">Carregando...</div>}>
      <HomeChatContent />
    </Suspense>
  );
}
