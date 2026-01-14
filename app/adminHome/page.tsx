import AdminLayout from "@/components/layout/AdminLayout";

import PostsListPage from "@/components/PostsListPage";
import { AuthProvider } from "../adminTioBen/contexts/AuthContext";
import { DataProvider } from "../adminTioBen/contexts/DataContext";

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