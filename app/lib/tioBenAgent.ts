// app/lib/tioBenAgent.ts
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// Obter a chave de API do ambiente Vercel
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY não está configurada nas variáveis de ambiente.");
}

// Inicializar o cliente da API do Gemini
const genAI = new GoogleGenerativeAI(apiKey);

// Obter a instância do modelo
const model: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function askTioBen(pergunta: string): Promise<string> {
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

  const fullPrompt = `${systemInstruction}\n\nPergunta: ${pergunta}`;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error);
    return "Desculpe, não consegui obter resposta do Tio Ben. Houve um erro na comunicação.";
  }
}
