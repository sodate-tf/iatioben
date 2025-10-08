import { AuthProvider } from "@/app/adminTioBen/contexts/AuthContext";
import { DataProvider } from "@/app/adminTioBen/contexts/DataContext";
import AdminLayout from "@/components/layout/AdminLayout";
import PostFormPage from "@/components/PostFormPage";
import React from 'react';

// Tipagem completa para o App Router
interface PostPageProps {
  // A tipagem do params está correta para esta rota:
  params: {
    id: string; 
  };
  // Incluir searchParams é ESSENCIAL para satisfazer o validador interno do Next.js:
  searchParams?: { [key: string]: string | string[] | undefined };
}

// A função da página é um Server Component
export default function PostsEditarCadastrarRoute({ params }: PostPageProps): React.ReactElement {
  
  // O ID é tipado como string
  const postId: string = params.id;

  return(
    <AuthProvider>
      <DataProvider>
        <AdminLayout>
          {/* Passa o ID como prop. */}
          <PostFormPage postId={postId} />
        </AdminLayout>
      </DataProvider>
    </AuthProvider>  
  );
}