// services/pushService.ts

type PushMessage = {
  to: string;
  title: string;
  body: string;
  data?: Record<string, any>;
};

// ✅ Endpoint oficial da Expo
const EXPO_PUSH_API_URL = "https://exp.host/--/api/v2/push/send";

// ✅ Validação básica de token Expo
function isValidExpoPushToken(token: string) {
  return typeof token === "string" && token.startsWith("ExponentPushToken");
}

// ✅ Envia UMA notificação (uso unitário)
export async function sendPushNotification(message: PushMessage) {
  if (!isValidExpoPushToken(message.to)) {
    console.warn("⛔ Token Expo inválido:", message.to);
    return { error: "Token inválido" };
  }

  const payload = {
    to: message.to,
    sound: "default",
    title: message.title,
    body: message.body,
    data: message.data || {},
  };

  try {
    const response = await fetch(EXPO_PUSH_API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log("✅ Push enviado:", data);

    return data;
  } catch (error) {
    console.error("❌ Erro ao enviar push:", error);
    return { error: "Falha no envio" };
  }
}

// ✅ Envia EM LOTE (recomendado quando há muitos tokens)
export async function sendPushBatch(
  messages: PushMessage[]
) {
  // ✅ Remove tokens inválidos antes de enviar
  const validMessages = messages.filter((msg) =>
    isValidExpoPushToken(msg.to)
  );

  if (validMessages.length === 0) {
    console.warn("⚠️ Nenhuma notificação válida para envio.");
    return { warning: "Nenhum push válido" };
  }

  // ✅ A Expo recomenda no máximo 100 por requisição
  const chunks: PushMessage[][] = [];
  const chunkSize = 100;

  for (let i = 0; i < validMessages.length; i += chunkSize) {
    chunks.push(validMessages.slice(i, i + chunkSize));
  }

  const results: any[] = [];

  for (const chunk of chunks) {
    const payload = chunk.map((msg) => ({
      to: msg.to,
      sound: "default",
      title: msg.title,
      body: msg.body,
      data: msg.data || {},
    }));

    try {
      const response = await fetch(EXPO_PUSH_API_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log("✅ Lote de push enviado:", data);

      results.push(data);
    } catch (error) {
      console.error("❌ Erro ao enviar lote de push:", error);
      results.push({ error: true });
    }
  }

  return results;
}
