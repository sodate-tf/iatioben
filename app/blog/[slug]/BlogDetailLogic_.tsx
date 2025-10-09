import Spinner from '@/components/SpinnerLoading';
import { useData } from '@/app/adminTioBen/contexts/DataContext';
import MetaDataBlog from '@/components/blogMetaData';
import BlogJsonLd from '@/components/blogJasonLd';
import BlogPostDetail from '@/components/BlogPostDetail';
interface BlogDetailLogicProps {
  slug: string;
}
export default function BlogDetailLogic({ slug }: BlogDetailLogicProps) {
   const { activePosts } = useData();
    const post = Array.isArray(activePosts) 
    ? activePosts.find((p) => p.slug === slug) 
    : null;
  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <Spinner />
      </div>
    );
  }
  return (
    <>
      <MetaDataBlog postData={post} key="meta-blog" /> 
      <BlogJsonLd slug={slug} key="json-ld-blog" /> 
      <div className="flex flex-col w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <BlogPostDetail slug={slug} /> 
      </div>
    </>
  );
}