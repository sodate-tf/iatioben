'use client'; 

import { useParams } from 'next/navigation';

// Componentes da Página
import Spinner from '@/components/SpinnerLoading';
import { DataProvider } from '@/app/adminTioBen/contexts/DataContext';
import BlogDetailLogic from './BlogDetailLogic_';


// Componente Filho (refatorado)



/**
 * Componente principal da Página do Blog Post.
 * Responsável por obter o slug e fornecer o contexto de dados.
 */
export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // 1. Tratamento Mobile First: Feedback imediato se o slug não estiver disponível
  if (!slug) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <Spinner />
      </div>
    ); 
  }

  // 2. Renderiza a estrutura com o Provider
  // O DataProvider envolve a lógica, garantindo que useData funcione.
  return (
    <DataProvider>
      <BlogDetailLogic slug={slug} />
    </DataProvider>
  );
}