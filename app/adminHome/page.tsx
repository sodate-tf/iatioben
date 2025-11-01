import AdminLayout from "@/components/layout/AdminLayout";
import { AuthProvider } from "../adminTioBen/contexts/AuthContext";
import { DataProvider } from "../adminTioBen/contexts/DataContext";
import PostsListPage from "@/components/PostsListPage";

export default function AdminHomePage() {
  return (
    <AuthProvider>
              <DataProvider>
                 <AdminLayout>
                    <h1>Página ADM TIO BEN</h1>
                </AdminLayout>
            </DataProvider>
          </AuthProvider>   
  );
}