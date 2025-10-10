// app/blog/[slug]/page.tsx

import BlogPostDetail from '../../../components/BlogPostDetail';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostBySlug } from '@/app/adminTioBen/actions/postAction';
import type { Post } from '@/app/adminTioBen/types';
import { generatePostMetadata } from '@/components/blogMetaData';

// -----------------------------------------------------------------------
// Função Auxiliar de Fetch
// -----------------------------------------------------------------------
async function getPostDataBySlug(slug: string): Promise<Post | null> {
  if (!slug) return null;

  try {
    const postData = await getPostBySlug(slug);

    if (postData && postData.slug === slug) {
      return postData;
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar post pelo slug:', (error as Error).message);
    return null;
  }
}

// -----------------------------------------------------------------------
// generateMetadata (params agora é Promise)
// -----------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const postData = await getPostDataBySlug(slug);

  if (!postData) {
    return {
      title: 'Página Não Encontrada - Blog IA Tio Ben',
    };
  }

  return generatePostMetadata(postData);
}

// -----------------------------------------------------------------------
// Componente principal (Server Component) - params como Promise
// -----------------------------------------------------------------------
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const postData = await getPostDataBySlug(slug);

  if (!postData) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <BlogPostDetail post={postData} />
    </div>
  );
}