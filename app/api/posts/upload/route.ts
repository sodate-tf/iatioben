// app/api/posts/upload/route.ts

import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { Post } from '@/app/adminTioBen/types'; // Certifique-se que o caminho está correto
import path from 'path';

// Força o Next.js a usar o runtime Node.js (necessário para manipulação de arquivos)
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
    const isEditing = formData.get('isEditing') === 'true';

    if (!postJson) {
      return NextResponse.json({ message: 'Dados do post ausentes.' }, { status: 400 });
    }

    const postData: Post = JSON.parse(postJson);
    let coverImageUrl: string | undefined = postData.coverImageUrl;

    // 1. Processamento do Upload para Vercel Blob
    if (imageFile) {
      if (!(imageFile instanceof File)) {
        return NextResponse.json({ message: 'Arquivo de imagem inválido.' }, { status: 400 });
      }

      // Garante um nome de arquivo único e limpo
      const slug = postData.slug || 'post-sem-titulo';
      const fileExtension = path.extname(imageFile.name) || '.jpg';
      const filename = `${slug}-${Date.now()}${fileExtension}`;

      // Envia o arquivo para o Vercel Blob
      const blob = await put(filename, imageFile, {
        access: 'public', // Torna a imagem acessível publicamente
      });
      
      // Salva a URL pública
      coverImageUrl = blob.url;
    } 
    
    // Se o post estava em edição e o usuário removeu a imagem, o coverImageUrl será null/undefined, 
    // e o backend deve refletir isso no DB. Se o coverImageUrl existe e não há novo arquivo, ele é mantido.

    // 2. Integração com o Banco de Dados
    // Nesta etapa, você deve:
    // 2.1. Validar e sanitizar os dados de 'postData'.
    // 2.2. Atualizar 'postData.coverImageUrl' com a nova URL (coverImageUrl).
    // 2.3. Chamar a função do seu serviço de DB (ex: Prisma, Mongoose) para salvar ou atualizar o post.
    
    // *** SIMULAÇÃO DE SALVAMENTO NO DB ***
    const savedPost: Post = {
        ...postData,
        coverImageUrl: coverImageUrl, // URL do Blob ou URL anterior
        // Adicionar o ID gerado pelo DB se for um novo post
        id: postData.id || 'new-uuid-from-db' 
    };
    // *** FIM DA SIMULAÇÃO ***

    // 3. Retorna o post atualizado
    return NextResponse.json(savedPost, { status: isEditing ? 200 : 201 });
    
  } catch (error) {
    console.error('Erro ao salvar post ou fazer upload para Blob:', error);
    return NextResponse.json({ 
      message: 'Falha interna ao processar o post e o upload.', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}