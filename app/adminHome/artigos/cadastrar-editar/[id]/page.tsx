// app/adminHome/artigos/cadastrar-editar/[id]/page.tsx
import { AuthProvider } from "@/app/adminTioBen/contexts/AuthContext";
import { DataProvider } from "@/app/adminTioBen/contexts/DataContext";
import AdminLayout from "@/components/layout/AdminLayout";
import PostFormPage from "@/components/PostFormPage";
import React from 'react';

// Tipagem robusta e completa para o App Router
interface PostPageProps {
  params: {
    id: string; // O segmento dinâmico [id] é garantido como string
  };
  // Incluir searchParams é crucial para satisfazer o validador interno do Next.js.
  searchParams?: { [key: string]: string | string[] | undefined };
}

// A página Server Component DEVE ser tipada com as props do Next.js
export default function PostsEditarCadastrarRoute({ params }: PostPageProps): React.ReactElement {
  
  // Garantimos que o ID é string, conforme a tipagem da interface.
  const postId: string = params.id;

  return(
    <AuthProvider>
      <DataProvider>
        <AdminLayout>
          {/* O ID é passado como prop. Não precisa mais ser string | undefined aqui */}
          {/* Se o ID puder ser inválido, PostFormPage deve lidar com isso. */}
          <PostFormPage postId={postId} />
        </AdminLayout>
      </DataProvider>
    </AuthProvider>  
  );
}