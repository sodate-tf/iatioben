// app/api/perguntar/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { pergunta } = await req.json();

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

    console.log("Chave Gemini:", process.env.GEMINI_API_KEY);
    console.log("Pergunta:", pergunta);

    // Chamada REST ao Gemini
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gemini-2.5-flash",
          prompt: `${systemInstruction}\n\nPergunta: ${pergunta}`,
        }),
      }
    );

    const responseText = await response.text();
    console.log("Resposta bruta do Gemini:", responseText);

    let resposta = "Desculpe, não consegui obter resposta do Tio Ben.";

    try {
      const data = JSON.parse(responseText);
      resposta = data?.candidates?.[0]?.content?.[0]?.text || resposta;
    } catch {
      console.warn("Resposta do Gemini não era JSON, retornando mensagem padrão.");
    }

    return NextResponse.json({ resposta });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro na API /perguntar:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
