'use client';
import React, { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Menu } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* 🔹 HEADER SUPERIOR */}
      <header className="sticky top-0 z-30 bg-background border-b border-border flex items-center justify-between px-4 py-3 sm:px-6 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Botão de menu para mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="sm:hidden p-2 rounded-md hover:bg-muted transition"
            aria-label="Abrir menu"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>

          <h1 className="text-lg font-semibold tracking-tight">
            Painel Administrativo
          </h1>
        </div>

        {/* Exibe Header completo apenas no desktop */}
        <div className="hidden sm:block">
          <Header />
        </div>
      </header>

      {/* 🔹 CONTEÚDO PRINCIPAL */}
      <div className="flex flex-1">
        {/* Sidebar deslizante (mobile) + fixa (desktop) */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-card shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          sm:relative sm:translate-x-0 sm:shadow-none`}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </aside>

        {/* Fundo escuro ao abrir menu no mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 sm:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Conteúdo */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
