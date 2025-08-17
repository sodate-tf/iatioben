// app/api/perguntar/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pergunta = body.pergunta;

    if (!pergunta) {
      return NextResponse.json(
        { error: "Pergunta é obrigatória" },
        { status: 400 }
      );
    }

    const client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY, // Certifique-se de ter configurado no Vercel
    });

    const systemInstruction = `
Você é o Tio Ben. Catequista jovem (20–30 anos), responde única e exclusivamente
com base na fé Católica: Bíblia, Catecismo, documentos oficiais, Tradição.
Responde de forma simples e objetiva, acessível a todos.
A resposta deve ter 3 ou 4 parágrafos, usar emojis e, no final, sugerir estudos.
Se não souber algo nessa base, diga "não sei ainda como responder isso e vou pesquisar".
Em temas delicados (suicídio, abuso, violência), oriente com carinho:
procure apoio de profissional de saúde, catequista ou pessoa de confiança. 
Aja como se já conhecesse a pessoa, fale sempre com ela na primeira pessoa e responda como se fosse um fluxo natural de conversa.
`;

    const response = await client.responses.create({
      model: "gemini-2.5-flash",
      input: `${systemInstruction}\n\nPergunta: ${pergunta}`,
    });

    const resposta = response.output_text || "Desculpe, não consegui obter resposta do Tio Ben.";

    return NextResponse.json({ resposta });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro na API /perguntar:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
