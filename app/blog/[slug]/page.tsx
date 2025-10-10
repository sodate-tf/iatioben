import { useParams } from 'next/navigation';
import BlogPostDetail from '../../../components/BlogPostDetail';
import Spinner from '@/components/SpinnerLoading';
import { DataProvider, useData } from '@/app/adminTioBen/contexts/DataContext';

function BlogPostContent({ slug }: { slug: string }) {
  const { activePosts } = useData();
  const post = activePosts.find((p) => p.slug === slug);

  if (!post) {
    return <Spinner />; // ou uma mensagem "Post não encontrado"
  }

  return (
    <>
    <div>
      <BlogPostDetail slug={slug} />
      </div>
    </>
  );
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  return (
    <DataProvider>    
      <BlogPostContent slug={slug} />
    </DataProvider>
  );
}
