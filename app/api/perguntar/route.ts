import { NextRequest, NextResponse } from "next/server";
import { askTioBen } from "@/app/lib/tioBenAgent";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pergunta = body.pergunta;

    if (!pergunta) {
      return NextResponse.json({ error: "Pergunta é obrigatória" }, { status: 400 });
    }

    const resposta = await askTioBen(pergunta);
    return NextResponse.json({ resposta });
  } catch (err: any) {
    console.error("Erro na API:", err);
    return NextResponse.json({ error: "Erro ao gerar resposta" }, { status: 500 });
  }
}
