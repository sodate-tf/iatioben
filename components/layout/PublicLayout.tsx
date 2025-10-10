// PublicLayout.tsx (Deve estar localizado em app/alguma-pasta/layout.tsx ou components/layout/PublicLayout.tsx)
import React from 'react';
// Não precisamos mais do 'Outlet' ou de qualquer importação do 'react-router-dom'
import PublicHeader from './PublicHeader';
import Footer from '../Footer';

// O componente agora recebe 'children' (o conteúdo da rota filha) como propriedade
interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <PublicHeader />
      {/* O conteúdo da rota filha é renderizado através da prop 'children' */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children} {/* 👈 SUBSTITUIÇÃO do <Outlet /> */}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;