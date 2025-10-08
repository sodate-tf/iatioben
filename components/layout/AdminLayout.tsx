import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

// O componente DEVE aceitar children
const AdminLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="container mx-auto px-6 py-8">
            {children} {/* 👈 CORREÇÃO: Renderiza o conteúdo da rota filha aqui */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;