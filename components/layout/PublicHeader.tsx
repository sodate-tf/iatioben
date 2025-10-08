// PublicHeader.tsx
"use client"; // 👈 O usePathname requer um Client Component

import React from 'react';
import Link from 'next/link'; // 👈 Importação CORRETA para links no Next.js
import { usePathname } from 'next/navigation'; // 👈 Hook para obter a rota atual

const PublicHeader: React.FC = () => {
    
    const pathname = usePathname(); // Obtém o caminho da URL atual

    // ⚠️ Lógica ajustada para receber o 'href' e comparar com o 'pathname'
    const navLinkClasses = (href: string): string => { 
        const isActive = pathname === href;
        return `text-text-secondary hover:text-primary px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive ? 'text-primary font-bold' : ''}`;
    };

    return (
        <header className="bg-surface shadow-md sticky top-0 z-10">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        {/* 1. CORREÇÃO: <Link to="/"> substituído por <Link href="/"> */}
                        <Link href="/" className="text-2xl font-bold text-primary">
                            IA Tio Ben
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {/* 2. CORREÇÃO: <NavLink to="/blog"> substituído por <Link href="/blog"> */}
                            <Link 
                                href="/blog" 
                                className={navLinkClasses("/blog")} // Passa o href para a função de classe
                            >
                                Blog
                            </Link>
                            {/* Adicionar outros links públicos aqui, se necessário */}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default PublicHeader;