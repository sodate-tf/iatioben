// app/blog/[slug]/page.tsx (DEVE SER UM SERVER COMPONENT)

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostDetail from '../../../components/BlogPostDetail';
import { DataProvider } from '@/app/adminTioBen/contexts/DataContext';
import { generateBlogMetadata } from '@/app/blog/utils/metadata'; // Importe a função
import { getPostBySlug } from '@/app/adminTioBen/utils/dataFetcher'; // SIMULADO: Funcao Server-side

// 1. FUNÇÃO DE GERAÇÃO DE METADADOS (Executada no Servidor/Build Time)
export async function generateMetadata({ 
  params,
}: { 
  params: { slug: string } 
}) {
  
  // AQUI é onde a busca REAL deve acontecer no servidor
  const post = await getPostBySlug(params.slug); 
  
  if (!post) {
    // Retorna um objeto Metadata vazio ou notFound() para 404
    return {}; 
  }

  // Usa a função utilitária para gerar o objeto de Metadados
  return generateBlogMetadata({ post, slug: params.slug });
}


// 2. COMPONENTE PRINCIPAL DA PÁGINA (Server Component)
// Passa o slug, e o Client Component BlogPostDetail fará o restante da busca e renderização
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  
  // IMPORTANTE: Seu componente BlogPostDetail depende do DataProvider
  return (
    <DataProvider>
      {/* O BlogPostDetail ainda contém a lógica de busca usando o useData() */}
      <BlogPostDetail slug={params.slug} />
    </DataProvider>
  );
}