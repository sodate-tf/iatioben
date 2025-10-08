// app/adminHome/artigos/cadastrar-editar/[id]/page.tsx
import { AuthProvider } from "@/app/adminTioBen/contexts/AuthContext";
import { DataProvider } from "@/app/adminTioBen/contexts/DataContext";
import AdminLayout from "@/components/layout/AdminLayout";
import PostFormPage from "@/components/PostFormPage";


export default async function Page({ params }: any) {
  const { id } = await Promise.resolve(params);
  return (
    <AuthProvider>
      <DataProvider>
        <AdminLayout>
          <PostFormPage postId={id} />
        </AdminLayout>
      </DataProvider>
    </AuthProvider>
  );
}
