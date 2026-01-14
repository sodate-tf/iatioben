import { AuthProvider } from "@/app/adminTioBen/contexts/AuthContext";
import { DataProvider } from "@/app/adminTioBen/contexts/DataContext";
import AdminLayout from "@/components/layout/AdminLayout";
import PostFormPage from "@/components/PostFormPage";

export default function pageCadastarEditar(){
    return(
    <AuthProvider>
          <DataProvider>
             <AdminLayout>
               <PostFormPage  />
            </AdminLayout>
        </DataProvider>
      </AuthProvider>   
    )
}