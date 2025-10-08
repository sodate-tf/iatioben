// Sidebar.tsx
"use client"; // Necessário para usar o hook useRouter e usePathname

import React from 'react';
import Link from 'next/link'; // 👈 Importação CORRETA do Next.js
import { usePathname } from 'next/navigation'; // 👈 Hook para obter a rota atual
import { FileText, Tag } from 'lucide-react';

const Sidebar = () => {
    // Obtém o caminho da URL atual (ex: /admin/posts)
    const pathname = usePathname();

    // ⚠️ Lógica ajustada para receber o 'href' e comparar com o 'pathname'
    const navLinkClasses = (href: string): string => {
        // Verifica se a rota atual corresponde ao link.
        // Usamos 'includes' para que /admin/posts/new ainda ative /admin/posts
        const isActive = pathname.includes(href) && href !== '/adminHome'; 
        
        // Ajuste fino para a rota base /adminHome
        if (href === '/adminHome' && pathname !== '/adminHome') {
            return navLinkClasses('/adminHome/artigos'); // Redireciona visualmente para o primeiro item
        }

        return `flex items-center px-4 py-2.5 mt-2 text-gray-100 transition-colors duration-300 transform rounded-lg hover:bg-blue-700 ${
            isActive ? 'bg-blue-700 shadow-lg' : ''
        }`;
    };

    return (
        <div className="flex flex-col w-64 bg-primary text-white">
            <div className="flex items-center justify-center h-20 border-b border-blue-800">
                <h1 className="text-2xl font-bold">IA Tio Ben</h1>
            </div>
            <nav className="flex-1 px-4 py-4">
                
                {/* CORREÇÃO 1: Substituído NavLink por Link e 'to' por 'href' */}
                <Link 
                    href="/adminHome/artigos" 
                    className={navLinkClasses("/adminHome/artigos")} // Passa o caminho para a função de classe
                >
                    <FileText size={20} />
                    <span className="mx-4 font-medium">Posts</span>
                </Link>
                
                {/* CORREÇÃO 2: Substituído NavLink por Link e 'to' por 'href' */}
                <Link 
                    href="/adminHome/categories" 
                    className={navLinkClasses("/adminHome/categories")}
                >
                    <Tag size={20} />
                    <span className="mx-4 font-medium">Categorias</span>
                </Link>
                
            </nav>
        </div>
    );
};

export default Sidebar