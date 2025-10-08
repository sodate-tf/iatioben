// app/adminTioBen/layout.tsx (CORRETO)
"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { AuthProvider } from "../adminTioBen/contexts/AuthContext";
import { DataProvider } from "../adminTioBen/contexts/DataContext";
import React from 'react'; // Importar React é boa prática, mas ReactNode já está importado se estiver no arquivo

// 1. O layout DEVE receber a prop children (o conteúdo aninhado)
export default function AdminTioBenLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <DataProvider>
                {/* 2. O AdminLayout DEVE ENVOLVER o children */}
                <AdminLayout> 
                    {children} 
                </AdminLayout> 
            </DataProvider>
        </AuthProvider>
    );
}