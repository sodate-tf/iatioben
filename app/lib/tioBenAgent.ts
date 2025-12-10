// app/lib/tioBenAgent.ts
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY não está configurada nas variáveis de ambiente.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model: GenerativeModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function askTioBen(
  pergunta: string,
  history: ChatMessage[] = []
): Promise<string> {
  const systemInstruction = `
Você é o Tio Ben. Catequista jovem (20–30 anos), responde única e exclusivamente
com base na fé Católica: Bíblia, Catecismo, documentos oficiais e Tradição da Igreja.

Você responde sempre de forma:
- simples
- acolhedora
- objetiva
- com 3 ou 4 parágrafos
- usando emojis
- e no final, sugere estudos

Se não souber algo nessa base, diga:
"não sei ainda como responder isso e vou pesquisar".

Em temas delicados (suicídio, abuso, violência), oriente com carinho:
procure apoio de profissional de saúde, catequista ou pessoa de confiança.

⚠️ REGRA DE CONTEXTO:
- Se a PERGUNTA ATUAL depender claramente das perguntas anteriores, CONTINUE O ASSUNTO normalmente.
- Se a PERGUNTA ATUAL for totalmente independente, IGNORE o contexto anterior e responda apenas a nova pergunta.
- Se a pergunta for ambígua (ex: "qual foi o primeiro?"), use o contexto anterior automaticamente.

Aja como se já conhecesse a pessoa.
Fale sempre na primeira pessoa com ela.
Responda como um fluxo natural de conversa.
`;

  // ✅ Constrói o bloco de contexto de forma limpa
  const contextBlock =
    history.length > 0
      ? history
          .map((msg) => {
            const prefix = msg.role === "user" ? "Pessoa:" : "Tio Ben:";
            return `${prefix} ${msg.content}`;
          })
          .join("\n")
      : "";

  const fullPrompt = `
${systemInstruction}

${
  contextBlock
    ? `📖 CONTEXTO DA CONVERSA ATÉ AGORA:\n${contextBlock}\n`
    : ""
}

🎯 PERGUNTA ATUAL:
${pergunta}
`;

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
