'use client';
import BlogPostDetail from '../../../components/BlogPostDetail';
import { DataProvider, useData } from '@/app/adminTioBen/contexts/DataContext';
import { useParams } from 'next/navigation';

export default function BlogPostContent() {
    const params = useParams();
    const slug = params?.slug as string;

  if (!slug) {
     // SE NÃO TIVER O SLUG, COLOCAR UM REDIRECT PARA /BLOG 
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

