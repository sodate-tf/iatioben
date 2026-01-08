// app/api/posts/upload/route.ts

import { put, del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { addPostAction, updatePostAction } from "@/app/adminTioBen/actions/postAction";
import type { Post } from "@/app/adminTioBen/types";
import path from "path";

// ✅ App Router: use runtime export (config/api/bodyParser é do Pages Router e foi depreciado)
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const imageFile = formData.get("coverImage");
    const postJson = formData.get("postJson");

    if (typeof postJson !== "string" || !postJson.trim()) {
      return NextResponse.json({ message: "Dados do post ausentes." }, { status: 400 });
    }

    const rawPostData = JSON.parse(postJson) as Post;
    const postData: Post = { ...rawPostData };

    const isEditing = Boolean(postData.id);
    let coverImageUrl: string | undefined = postData.coverImageUrl;

    // --- Upload para Blob (se veio arquivo) ---
    if (imageFile) {
      if (!(imageFile instanceof File)) {
        return NextResponse.json({ message: "Arquivo de imagem inválido." }, { status: 400 });
      }

      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (!token) {
        return NextResponse.json(
          { message: "BLOB_READ_WRITE_TOKEN não configurado no ambiente." },
          { status: 500 }
        );
      }

      const slug = (postData.slug || "post-sem-slug").trim() || "post-sem-slug";
      const fileExtension = path.extname(imageFile.name) || ".jpg";
      const filename = `${slug}-${Date.now()}${fileExtension}`;

      // 1) Envia para o Vercel Blob
      const blob = await put(filename, imageFile, {
        access: "public",
        token,
      });

      const newImageUrl = blob.url;

      // 2) Tenta apagar imagem antiga (não deve quebrar o fluxo se falhar)
      if (
        isEditing &&
        postData.coverImageUrl &&
        postData.coverImageUrl.includes("blob.vercel-storage.com")
      ) {
        try {
          await del(postData.coverImageUrl, { token });
        } catch (e) {
          console.warn("Aviso: não foi possível apagar a imagem antiga do Blob:", e);
        }
      }

      coverImageUrl = newImageUrl;
    }

    // 3) Garante que o DB recebe a URL correta
    postData.coverImageUrl = coverImageUrl;

    // 4) Salva no DB (via Server Actions)
    let savedPost: Post;

    if (isEditing) {
      const updatedResult = await updatePostAction(postData);
      if (!updatedResult) throw new Error("Falha ao salvar post atualizado no DB.");
      savedPost = updatedResult;
    } else {
      const newResult = await addPostAction(postData);
      if (!newResult) throw new Error("Falha ao salvar novo post no DB.");
      savedPost = newResult;
    }

    return NextResponse.json(savedPost, { status: isEditing ? 200 : 201 });
  } catch (error) {
    console.error("Erro ao salvar post ou fazer upload para Blob:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro interno desconhecido.";
    return NextResponse.json({ message: `Falha interna: ${errorMessage}` }, { status: 500 });
  }
}
