// app/blog/[slug]/page.tsx

import BlogPostDetail from '../../../components/BlogPostDetail';
import { notFound } from 'next/navigation';

import { Post } from '@/app/adminTioBen/types';

// Tipagem correta para Pages do App Router
interface PostPageProps {
  params: {
    slug: string;
  };
}

// Função auxiliar para buscar o post no servidor (Otimizada pelo Next.js)
async function getPostDataBySlug(slug: string): Promise<Post | null> {
  if (!slug) {
    return null;
  }
  try {
    const activePosts = await getPostBySlug(slug);
    // Validação de tipo: a busca deve retornar um array de 'Post'
    if (!Array.isArray(activePosts)) {
        throw new Error("Dados de posts inválidos do servidor.");
    }
    const postData = activePosts.find((p: Post) => p.slug === slug);
    return postData || null;
  } catch (error) {
    console.error("Erro ao buscar post no servidor:", error);
    // Em caso de erro de API/DB, trata como não encontrado para evitar vazamento de erro.
    return null; 
  }
}

// -----------------------------------------------------------------------
// generateMetadata: Usado pelo Next.js para SEO no Servidor
// -----------------------------------------------------------------------
// A função generatePostMetadata deve ser importada de '@/components/blogMetaData' ou utils
import { generatePostMetadata } from '@/components/blogMetaData';
import { Metadata } from 'next';
import { getPostBySlug } from '@/app/adminTioBen/actions/postAction';

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const postData = await getPostDataBySlug(params.slug);
  
  if (!postData) {
    return {
      title: 'Página Não Encontrada - Blog IA Tio Ben',
    };
  }

  return generatePostMetadata(postData);
}

// -----------------------------------------------------------------------
// Componente principal (Server Component)
// -----------------------------------------------------------------------
export default async function BlogPostPage({ params }: PostPageProps) {
  const postData = await getPostDataBySlug(params.slug);

  if (!postData) {
    // Se não encontrar, exibe a tela 404
    notFound(); 
  }

  // O DataProvider e Context foram eliminados da página.
  // O componente de Cliente (BlogPostDetail) recebe os dados completos.
  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <BlogPostDetail post={postData} />
    </div>
  );
}