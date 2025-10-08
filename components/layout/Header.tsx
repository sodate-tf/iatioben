// Header.tsx
"use client"; // 👈 Adicionado para permitir o uso de hooks do Next.js

import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/app/adminTioBen/contexts/AuthContext';
import { useRouter } from 'next/navigation'; // 👈 Importação CORRETA do Next.js

const Header = () => {
  const { logout } = useAuth();
  const router = useRouter(); // 👈 Inicializa o hook de roteamento do Next.js

  const handleLogout = () => {
    logout();
    // ⚠️ CORREÇÃO: Usando router.push() no lugar de navigate()
    router.push('/adminTioBen/login'); 
  };

  return (
    <header className="bg-surface shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-text-primary">Painel Administrativo</h1>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-200"
      >
        <LogOut size={18} />
        <span>Sair</span>
      </button>
    </header>
  );
};

export default Header;