import { AuthProvider } from "@/app/adminTioBen/contexts/AuthContext";
import { DataProvider } from "@/app/adminTioBen/contexts/DataContext";
import AdminLayout from "@/components/layout/AdminLayout";
import PostFormPage from "@/components/PostFormPage";
import { useRouter } from "next/router";

export default function PostsEditarCadastrarRoute() {
   const router = useRouter();
   const { id } = router.query;
   const postId = typeof id === 'string' ? id : undefined;
  return(
         <AuthProvider>
          <DataProvider>
             <AdminLayout>
               <PostFormPage postId={postId} />
            </AdminLayout>
        </DataProvider>
      </AuthProvider>   
  )
}
