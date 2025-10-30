import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { addPostAction } from "@/app/adminTioBen/actions/postAction";

/**
 * ✅ API de publicação remota protegida com chave
 * Recebe dados JSON com um post e os salva diretamente no banco do site de destino.
 * Inclui autenticação via cabeçalho HTTP: "x-api-key"
 * 
 * Envio esperado no gerador:
 *  headers: { "Content-Type": "application/json", "x-api-key": "SUA_CHAVE_SECRETA_AQUI" }
 */

export async function POST(req: NextRequest) {
  console.log("🌐 [remote-post] Requisição recebida para salvar post remoto.");

  // 1️⃣ Validação da API Key
  const clientKey = req.headers.get("x-api-key");
  const serverKey = process.env.REMOTE_POST_API_KEY;

  if (!serverKey) {
    console.error("❌ [remote-post] Variável REMOTE_POST_API_KEY não configurada no ambiente!");
    return NextResponse.json(
      { success: false, message: "Servidor mal configurado. Falta REMOTE_POST_API_KEY." },
      { status: 500 }
    );
  }

  if (!clientKey || clientKey !== serverKey) {
    console.warn("🚫 [remote-post] Chave de API inválida ou ausente!");
    return NextResponse.json(
      { success: false, message: "Acesso não autorizado. Chave de API inválida." },
      { status: 401 }
    );
  }

  try {
    // 2️⃣ Leitura dos dados do post
    const data = await req.json();
    console.log("📦 [remote-post] Dados recebidos:", data);

    const {
      title,
      slug,
      content, // HTML gerado pelo gerador
      categoryId,
      categoryName,
      keywords,
      metaDescription,
      coverImageUrl,
      publishDate,
      expiryDate,
      isActive = true,
    } = data;

    // 3️⃣ Validação básica
    if (!title || !slug || !content || !categoryId) {
      console.warn("⚠️ [remote-post] Campos obrigatórios ausentes:", data);
      return NextResponse.json(
        { success: false, message: "Campos obrigatórios ausentes (title, slug, content, categoryId)." },
        { status: 400 }
      );
    }

    // 4️⃣ Montagem do objeto Post
    const postData = {
      id: uuidv4(),
      title,
      slug,
      content,
      categoryId,
      categoryName: categoryName || "Notícias",
      keywords: keywords || "",
      metaDescription: metaDescription || "",
      coverImageUrl: coverImageUrl || null,
      publishDate: new Date(publishDate || new Date()).toISOString(),
      expiryDate: expiryDate ? new Date(expiryDate).toISOString() : undefined,
      isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("🧠 [remote-post] Dados formatados para criação:", postData);

    // 5️⃣ Chamada da Action do backend local
    const savedPost = await addPostAction(postData);

    console.log("✅ [remote-post] Post salvo com sucesso:", savedPost?.id || "(sem ID)");

    return NextResponse.json(
      { success: true, message: "Post salvo com sucesso!", post: savedPost },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ [remote-post] Erro ao salvar post remoto:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao salvar post remoto.",
        details: error.message || error.toString(),
      },
      { status: 500 }
    );
  }
}
