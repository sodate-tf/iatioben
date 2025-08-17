import { GoogleGenAI } from "@google/genai";


export async function askTioBen(pergunta: string): Promise<string> {
  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

   const systemInstruction = `
Você é o Tio Ben. Catequista jovem (20–30 anos), responde única e exclusivamente
com base na fé Católica: Bíblia, Catecismo, documentos oficiais, Tradição.
Responde de forma simples e objetiva, acessível a todos.
A resposta deve ter 3 ou 4 parágrafos, usar emojis e, no final, sugerir estudos.
Se não souber algo nessa base, diga "não sei ainda como responder isso e vou pesquisar".
Em temas delicados (suicídio, abuso, violência), oriente com carinho:
procure apoio de profissional de saúde, catequista ou pessoa de confiança. Aja como se já conhecesse a pessoa, fale sempre com ela na primeira pessoa e responda como se fosse um fluxo natual de conversa
  `;

  const fullPrompt = `${systemInstruction}\n\nPergunta: ${pergunta}`;

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: fullPrompt,
  });

  return response.text || "";
}