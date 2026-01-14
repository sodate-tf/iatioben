"use client"
import { AuthProvider } from "@/app/adminTioBen/contexts/AuthContext";
import { DataProvider } from "@/app/adminTioBen/contexts/DataContext";
import AdminLayout from "@/components/layout/AdminLayout";
import PostFormPage from "@/components/PostFormPage";
import { useParams } from "next/navigation";


export default function Page() {
  const params = useParams();
  const id = params?.id as string; // dd-mm-yyyy
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
