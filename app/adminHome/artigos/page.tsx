import { AuthProvider } from "@/app/adminTioBen/contexts/AuthContext";
import { DataProvider } from "@/app/adminTioBen/contexts/DataContext";
import AdminLayout from "@/components/layout/AdminLayout";
import PostsListPage from "@/components/PostsListPage";

export default function PostsRoute() {
  return(
         <AuthProvider>
          <DataProvider>
             <AdminLayout>
               <PostsListPage />
            </AdminLayout>
        </DataProvider>
      </AuthProvider>   
  )
}
