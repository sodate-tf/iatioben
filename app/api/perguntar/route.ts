// app/api/perguntar/route.ts
import { NextRequest, NextResponse } from "next/server";
import { askTioBen } from "@/app/lib/tioBenAgent";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const pergunta = body.pergunta?.trim();
    const history: ChatMessage[] = Array.isArray(body.history)
      ? body.history.slice(-5) // ✅ apenas as últimas 5 mensagens
      : [];

    if (!pergunta) {
      return NextResponse.json(
        { error: "Pergunta é obrigatória" },
        { status: 400 }
      );
    }

    const resposta = await askTioBen(pergunta, history);

    return NextResponse.json({ resposta });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro na API /perguntar:", message);

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
