'use client'; 

import { useParams } from 'next/navigation';
import Spinner from '@/components/SpinnerLoading';
import { DataProvider } from '@/app/adminTioBen/contexts/DataContext';
import BlogDetailLogic from './BlogDetailLogic_';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  if (!slug) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <Spinner />
      </div>
    ); 
  }
  return (
    <DataProvider>
      <BlogDetailLogic slug={slug} />
    </DataProvider>
  );
}