"use client";

import { useState } from "react";
import { sendPushManual } from "./action";

export default function NotificationForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState<"post" | "ai_chat" | "external" | "liturgy" | "campaign">("post");
  const [payload, setPayload] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      setLoading(true);
      setStatus("Enviando notificação...");

      const res = await sendPushManual({
        title,
        body,
        type,
        payload: payload ? JSON.parse(payload) : {},
      });

      if (res?.success) {
        setStatus("✅ Notificação enviada com sucesso!");
        setTitle("");
        setBody("");
        setPayload("");
      } else {
        setStatus("❌ Falha ao enviar notificação.");
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Erro no envio. Verifique o payload.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow border space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold">
        Enviar Notificação Imediata
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* TÍTULO */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Título da Notificação</label>
          <input
            className="w-full rounded-md border px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ex: Novo conteúdo no Tio Ben IA"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* MENSAGEM */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Mensagem</label>
          <textarea
            className="w-full rounded-md border px-3 py-3 text-base min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Escreva a mensagem que aparecerá na notificação..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>

        {/* TIPO */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Tipo de Notificação</label>
          <select
            className="w-full rounded-md border px-3 py-3 text-base bg-white"
            value={type}
            onChange={(e) => {
              setType(e.target.value as any);
              setPayload("");
            }}
          >
            <option value="post">📄 Post</option>
            <option value="ai_chat">🤖 Chat IA</option>
            <option value="external">🌐 Link Externo</option>
            <option value="liturgy">🙏 Liturgia</option>
            <option value="campaign">📢 Campanha</option>
          </select>
        </div>

        {/* PAYLOAD DINÂMICO */}
        {type !== "liturgy" && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              {type === "post" && "Slug do Post"}
              {type === "ai_chat" && "Pergunta para a IA"}
              {type === "external" && "URL externa"}
              {type === "campaign" && "Identificador da campanha"}
            </label>

            <textarea
              className="w-full rounded-md border px-3 py-3 text-base min-h-[90px] focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={
                type === "post"
                  ? `{ "slug": "sagrado-coracao-jesus" }`
                  : type === "ai_chat"
                  ? `{ "question": "Explique o Sagrado Coração de Jesus" }`
                  : type === "external"
                  ? `{ "url": "https://instagram.com/iatioben" }`
                  : `{ "campaign": "rifa-acampabento-2025" }`
              }
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
            />
          </div>
        )}

        {/* BOTÃO */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl text-base font-semibold text-white bg-primary hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading ? "Enviando..." : "🚀 Enviar Notificação Agora"}
        </button>

        {/* STATUS */}
        {status && (
          <div className="text-center text-sm font-medium mt-2">
            {status}
          </div>
        )}
      </form>
    </div>
  );
}
