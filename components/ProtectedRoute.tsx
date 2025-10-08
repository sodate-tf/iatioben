// components/ProtectedRoute.tsx
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/adminTioBen/contexts/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated === false) {
            // ⚠️ Redireciona para a página de login usando a navegação Next.js
            router.replace('/adminTioBen'); 
        }
    }, [isAuthenticated, router]);

    // Exibe um carregamento ou um conteúdo vazio se a autenticação não estiver confirmada
    if (isAuthenticated === false) {
        return <div className="p-8 text-center">Acesso negado. Redirecionando...</div>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;