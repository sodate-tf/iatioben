'use client'; 

// Importa apenas o necessário para a lógica e renderização

import Spinner from '@/components/SpinnerLoading';
import { useData } from '@/app/adminTioBen/contexts/DataContext';

// SEO Components (Client Side)
import MetaDataBlog from '@/components/blogMetaData';
import BlogJsonLd from '@/components/blogJasonLd';
import BlogPostDetail from '@/components/BlogPostDetail';


interface BlogDetailLogicProps {
  slug: string;
}

/**
 * Componente de Lógica: Busca o post no Contexto, trata o loading e renderiza o conteúdo.
 * Requer estar envolto pelo DataProvider.
 */
export default function BlogDetailLogic({ slug }: BlogDetailLogicProps) {
  // 1. Consome o Contexto
  const { activePosts } = useData();
  
  // 2. Busca do Post: Garantimos que 'activePosts' é um array para evitar erros.
  const post = Array.isArray(activePosts) 
    ? activePosts.find((p) => p.slug === slug) 
    : null;

  // 3. Lógica de Loading/Não Encontrado
  if (!post) {
    // Feedback rápido para o usuário mobile/desktop
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <Spinner />
      </div>
    );
  }

  // 4. Renderização do Post
  return (
    <>
      {/* Componentes de SEO (Se eles dependem de dados do post, devem estar aqui) */}
      <MetaDataBlog postData={post} key="meta-blog" /> 
      {/* Note: Ajustei o BlogJsonLd para usar 'post' se ele precisar de dados, ou mantive o 'slug' se a lógica for interna. */}
      <BlogJsonLd slug={slug} key="json-ld-blog" /> 

      {/* Estrutura Responsiva (Mobile First): Container centralizado e com padding */}
      <div className="flex flex-col w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <BlogPostDetail slug={slug} /> 
      </div>
    </>
  );
}