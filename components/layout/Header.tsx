'use client';

import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/adminTioBen/contexts/AuthContext';

const Header = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/adminTioBen/login');
  };

  return (
    <div className="flex items-center gap-4">
      {/* Perfil / nome do usuário (exemplo) */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
        <User className="w-4 h-4" />
        <span>Administrador</span>
      </div>

      {/* Botão de sair */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted hover:bg-destructive hover:text-destructive-foreground transition-colors text-sm"
      >
        <LogOut size={16} />
        <span>Sair</span>
      </button>
    </div>
  );
};

export default Header;
