// app/blog/[slug]/page.tsx

import BlogPostDetail from '../../../components/BlogPostDetail';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// ⚠️ Importação da função de Server Action (que retorna UM Post ou null)
import { getPostBySlug } from '@/app/adminTioBen/actions/postAction';

import { Post } from '@/app/adminTioBen/types';
import { generatePostMetadata } from '@/components/blogMetaData';


// -----------------------------------------------------------------------
// 1. Tipagem CORRETA para o App Router
// -----------------------------------------------------------------------
interface PostPageProps {
  params: {
    slug: string;
  };
}

// -----------------------------------------------------------------------
// 2. Função Auxiliar de Fetch (Simplificada e Corrigida)
// -----------------------------------------------------------------------
async function getPostDataBySlug(slug: string): Promise<Post | null> {
  if (!slug) {
    return null;
  }
  
  try {
    // 🚀 CHAVE DE CORREÇÃO: Chamamos getPostBySlug e esperamos UM Post ou null.
    // Isso remove a lógica errada de 'Array.isArray' e 'activePosts.find'.
    const postData = await getPostBySlug(slug);

    // Validação de retorno: O tipo 'postData' é estritamente 'Post | null'
    // Se o post for null, é porque não foi encontrado (ou não está ativo/publicado,
    // se a Action postAction.ts estiver correta).
    if (!postData) {
      return null;
    }
    
    return postData;
  } catch (error) {
    // Validação de erro: Usamos 'unknown' e garantimos que é um erro ao logar.
    console.error("Erro ao buscar post pelo slug:", (error as Error).message);
    return null; 
  }
}

// -----------------------------------------------------------------------
// 3. generateMetadata (Server Component)
// -----------------------------------------------------------------------
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const postData = await getPostDataBySlug(params.slug);
  
  if (!postData) {
    return {
      title: 'Página Não Encontrada - Blog IA Tio Ben',
    };
  }

  // Usa o utilitário de metadados
  return generatePostMetadata(postData);
}

// -----------------------------------------------------------------------
// 4. Componente principal (Server Component)
// -----------------------------------------------------------------------
export default async function BlogPostPage({ params }: PostPageProps) {
  // A chamada aqui será dedupulicada (cacheada) pelo Next.js.
  const postData = await getPostDataBySlug(params.slug);

  if (!postData) {
    // Se não encontrar, exibe a tela 404
    notFound(); 
  }

  return (
    // Aplicação de classes mobile-first
    <div className="container mx-auto px-4 py-8 md:px-8">
      {/* O Client Component (BlogPostDetail) recebe os dados completos. */}
      <BlogPostDetail post={postData} />
    </div>
  );
}