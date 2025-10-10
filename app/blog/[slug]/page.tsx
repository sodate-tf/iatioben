'use client';
import BlogPostDetail from '../../../components/BlogPostDetail';
import Spinner from '@/components/SpinnerLoading';
import { DataProvider, useData } from '@/app/adminTioBen/contexts/DataContext';

export default function BlogPostContent({ slug }: { slug: string }) {
  const { activePosts } = useData();
  const post = activePosts.find((p) => p.slug === slug);

  if (!post) {
    return <Spinner />; // ou uma mensagem "Post não encontrado"
  }

  return (
    <>
      <div>
        <DataProvider>
           <BlogPostDetail slug={slug} />
         </DataProvider>
      </div>
    </>
  );
}

