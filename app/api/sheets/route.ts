// app/api/sheets/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { pergunta, resposta } = await req.json();

    // aqui você chama seu endpoint do Google Apps Script
    const scriptUrl = "https://script.google.com/macros/s/AKfycbyZIzzyYm65sRliEdZ2K8aZ84sJ_AjUJPKPDFHu1BravX3W1QUt1bPaLR3Xh324QUY9/exec";

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pergunta,
        resposta,
        date: new Date().toISOString(),
      }),
    });

    const data = await response.json();

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Erro na API /sheets:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// bloqueia GET
export async function GET() {
  return NextResponse.json({ error: "Método não permitido" }, { status: 405 });
}
