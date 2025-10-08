// app/adminHome/layout.tsx

import AdminLayout from '@/components/layout/AdminLayout'; 
import { AuthProvider } from '../adminTioBen/contexts/AuthContext'; // Ajuste o caminho se necessário
import { DataProvider } from '../adminTioBen/contexts/DataContext'; // Ajuste o caminho se necessário
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminHomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DataProvider>
        <ProtectedRoute>
          <AdminLayout> 
            {children} 
          </AdminLayout> 
        </ProtectedRoute>
      </DataProvider>
    </AuthProvider>
  );
}