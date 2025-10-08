'use client';

import { useParams } from 'next/navigation';
import BlogPostDetail from '../../../components/BlogPostDetail';
import Spinner from '@/components/SpinnerLoading';
import { DataProvider, useData } from '@/app/adminTioBen/contexts/DataContext';
import MetaDataBlog from '@/components/blogMetaData';
import BlogJsonLd from '@/components/blogJasonLd';

function BlogPostContent({ slug }: { slug: string }) {
  const { activePosts } = useData();
  const post = activePosts.find((p) => p.slug === slug);

  if (!post) {
    return <Spinner />; // ou uma mensagem "Post não encontrado"
  }

  return (
    <>
 

      <BlogPostDetail slug={slug} />
      
    </>
  );
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  return (
    <DataProvider>
         <head>            
        <MetaDataBlog slug={slug} />
        <BlogJsonLd slug={slug} />
    </head>
      <BlogPostContent slug={slug} />
    </DataProvider>
  );
}
