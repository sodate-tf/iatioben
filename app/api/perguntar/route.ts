// app/api/perguntar/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { GoogleAuth } from "google-auth-library";

let client: GoogleGenAI | null = null;

async function getClient() {
  if (!client) {
    if (!process.env.GEMINI_SERVICE_ACCOUNT_JSON) {
      throw new Error(
        "Service Account JSON não encontrado em GEMINI_SERVICE_ACCOUNT_JSON"
      );
    }

    const credentials = JSON.parse(process.env.GEMINI_SERVICE_ACCOUNT_JSON);

    const auth = new GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    const accessToken = await auth.getAccessToken(); // retorna string
    if (!accessToken) throw new Error("Não foi possível obter access token");
    
    client = new GoogleGenAI({ apiKey: accessToken });
  }
  return client;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pergunta = body.pergunta?.trim();

    if (!pergunta) {
      return NextResponse.json(
        { error: "Pergunta é obrigatória" },
        { status: 400 }
      );
    }

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

    const client = await getClient();

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${systemInstruction}\n\nPergunta: ${pergunta}`,
    });

    const resposta = response.text || "Desculpe, não consegui obter resposta do Tio Ben.";

    return NextResponse.json({ resposta });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro na API /perguntar:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
