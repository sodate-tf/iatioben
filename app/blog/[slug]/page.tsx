'use client';
import { useParams } from 'next/navigation';
import BlogPostDetail from '../../../components/BlogPostDetail';
import Spinner from '@/components/SpinnerLoading';
import { DataProvider, useData } from '@/app/adminTioBen/contexts/DataContext';
import MetaDataBlog from '@/components/blogMetaData';
import BlogJsonLd from '@/components/blogJasonLd';


function BlogDetailLogic({ slug }: { slug: string }) {
  const { activePosts } = useData();
  const post = activePosts.find((p) => p.slug === slug);
  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <MetaDataBlog postData={post} /> 
      <BlogJsonLd slug={slug} /> 
      <div className="flex flex-col w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <BlogPostDetail slug={slug}  /> 
      </div>
    </>
  );
}


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