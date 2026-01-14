import { AuthProvider } from "@/app/adminTioBen/contexts/AuthContext";
import { DataProvider } from "@/app/adminTioBen/contexts/DataContext";
import CategoriesPage from "@/components/CategoriesPage";
import AdminLayout from "@/components/layout/AdminLayout";
export default function CategoriesRoute() {
    return (
        <AuthProvider>
          <DataProvider>
             <AdminLayout>
                 <CategoriesPage />
            </AdminLayout>
        </DataProvider>
      </AuthProvider>     
    );
}
