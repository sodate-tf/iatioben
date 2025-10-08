// app/api/posts/upload/route.ts

import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';
// Importe suas Server Actions aqui
import { addPostAction, updatePostAction } from '@/app/adminTioBen/actions/postAction'; 
import { Post } from '@/app/adminTioBen/types';
import path from 'path';

// Força o runtime Node.js para manipulação de arquivos
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    const formData: FormData = await request.formData();
    
    const imageFile = formData.get('coverImage') as File | null;
    const postJson = formData.get('postJson') as string | null;

    if (!postJson) {
      return NextResponse.json({ message: 'Dados do post ausentes.' }, { status: 400 });
    }

    // Usamos 'any' temporariamente para a conversão de JSON, mas reatribuímos a Post para segurança
    const rawPostData: Post = JSON.parse(postJson);
    const postData: Post = { ...rawPostData };
    
    const isEditing: boolean = !!postData.id;
    let coverImageUrl: string | undefined = postData.coverImageUrl;

    // --- CORREÇÃO DE UPLOAD E URL ---
    if (imageFile) {
      if (!(imageFile instanceof File)) {
        return NextResponse.json({ message: 'Arquivo de imagem inválido.' }, { status: 400 });
      }
      
      const slug: string = postData.slug || 'post-sem-slug';
      const fileExtension: string = path.extname(imageFile.name) || '.jpg';
      const filename: string = `${slug}-${Date.now()}${fileExtension}`;

      // 1. Envio para o Vercel Blob
      const blob = await put(filename, imageFile, {
        access: 'public', 
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      
      // 2. OBTENÇÃO E ATRIBUIÇÃO DA URL
      const newImageUrl: string = blob.url;
      
      // Boa prática: Apagar a imagem antiga do Blob, se existir, na edição
      if (isEditing && postData.coverImageUrl && postData.coverImageUrl.includes('blob.vercel-storage.com')) {
          await del(postData.coverImageUrl);
      }
      
      // Atualiza o objeto que será salvo no DB
      coverImageUrl = newImageUrl;
    }
    
    // 3. Integração com o Banco de Dados (Chama sua Server Action)
    
    // Garante que o objeto final de dados do post contém a URL correta (nova, antiga, ou null)
    postData.coverImageUrl = coverImageUrl; 
    
    let savedPost: Post;
    
    if (isEditing) {
        // Atualiza o post no DB (agora com a coverImageUrl correta)
        const updatedResult = await updatePostAction(postData);
        if (!updatedResult) throw new Error("Falha ao salvar post atualizado no DB.");
        savedPost = updatedResult;
    } else {
        // Adiciona o post no DB (agora com a coverImageUrl correta)
        const newResult = await addPostAction(postData);
        if (!newResult) throw new Error("Falha ao salvar novo post no DB.");
        savedPost = newResult;
    }

    // 4. Retorna o resultado final (com a URL)
    return NextResponse.json(savedPost, { status: isEditing ? 200 : 201 });
    
  } catch (error) {
    console.error('Erro ao salvar post ou fazer upload para Blob:', error);
    const errorMessage: string = error instanceof Error ? error.message : 'Erro interno desconhecido.';
    return NextResponse.json({ 
      message: `Falha interna: ${errorMessage}`
    }, { status: 500 });
  }
}