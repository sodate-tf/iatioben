import { BookOpen, Download, Newspaper } from 'lucide-react'; // Ícones lucide-react (Rss removido por não uso)
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import AdsenseScriptLoader from './AdsenseLoadScript';
import Image from 'next/image';

// Ícones SVG customizados (Apenas o necessário para o Modal)

// Icone de Compartilhar (para instrução iOS)
const ShareIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11 6C12.6569 6 14 4.65685 14 3C14 1.34315 12.6569 0 11 0C9.34315 0 8 1.34315 8 3C8 3.22371 8.02449 3.44169 8.07092 3.65143L4.86861 5.65287C4.35599 5.24423 3.70652 5 3 5C1.34315 5 0 6.34315 0 8C0 9.65685 1.34315 11 3 11C3.70652 11 4.35599 10.7558 4.86861 10.3471L8.07092 12.3486C8.02449 12.5583 8 12.7763 8 13C8 14.6569 9.34315 16 11 16C12.6569 16 14 14.6569 14 13C14 11.3431 12.6569 10 11 10C10.2935 10 9.644 10.2442 9.13139 10.6529L5.92908 8.65143C5.97551 8.44169 6 8.22371 6 8C6 7.77629 5.97551 7.55831 5.92908 7.34857L9.13139 5.34713C9.644 5.75577 10.2935 6 11 6Z" fill="#ffffff"></path> </g></svg>
);

// Tipagem para o evento beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
 readonly prompt: () => Promise<void>;
 readonly userChoice: Promise<{
  outcome: "accepted" | "dismissed";
  platform: string;
 }>;
}

export default function Cabecalho() {
 const [installable, setInstallable] = useState(false);
 const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
 const [showInstallModal, setShowInstallModal] = useState(false);
 const [isIOS, setIsIOS] = useState(false);

 // 1. Detecção de iOS para PWA
 useEffect(() => {
  const userAgent = window.navigator.userAgent;
  const isIOSDevice =
   /iPad|iPhone|iPod/.test(userAgent) ||
   (userAgent.includes("Mac") && "ontouchend" in document);
  // Evita detecção incorreta no MS Edge em alguns dispositivos
  const isMSStream = 'MSStream' in window;

  setIsIOS(isIOSDevice && !isMSStream);
 }, []);

 // 2. Gerenciamento do Service Worker e PWA
 useEffect(() => {
  if ("serviceWorker" in navigator) {
   navigator.serviceWorker
    .register("/service-worker.js")  
    .catch((error) =>
     console.error("Falha ao registrar o Service Worker:", error)
    );
  }

  const handleBeforeInstallPrompt = (e: Event) => {
   e.preventDefault();
   setDeferredPrompt(e as BeforeInstallPromptEvent);
   setInstallable(true);
  };
  
  const handleAppInstalled = () => {
   setInstallable(false);
  };

  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.addEventListener("appinstalled", handleAppInstalled);

  return () => {
   window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
   window.removeEventListener("appinstalled", handleAppInstalled);
  };
 }, []);

 // 3. Lógica de Instalação do PWA
 const handleInstallClick = () => {
  if (isIOS) {
   setShowInstallModal(true);
  } else if (deferredPrompt) {
   deferredPrompt.prompt();
   setDeferredPrompt(null);
  }
 };

 // 4. Cálculo da URL da Liturgia Diária
 const today = new Date();
 const dd = String(today.getDate()).padStart(2, "0");
 const mm = String(today.getMonth() + 1).padStart(2, "0");
 const yyyy = today.getFullYear();
 const todayUrl = `/liturgia-diaria/${dd}-${mm}-${yyyy}`;
 
 const shouldShowInstallButton = isIOS || installable;

 return (
  <>
   <AdsenseScriptLoader />
   {/* Header responsivo: Logo à esquerda e Ícones à direita */}
   <header className="bg-amber-100 p-2 flex items-center justify-between shadow-md sticky top-0 z-10 w-full">
    
    {/* Seção do Logo: Otimizada para Mobile */}
    <Link href="/" className="flex items-center space-x-1 sm:space-x-2 cursor-pointer min-w-0">
     <Image
      src="http://www.iatioben.com.br/images/ben-transparente.png"
      alt="Tio Ben Logo"
      width={150}
      // Tamanhos otimizados para mobile e desktop
      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
     />
     {/* Título: Reduzido no Mobile, ampliado no Desktop */}
     <span className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-900 leading-none">
      Tio Ben
     </span>
    </Link>
    
    {/* Seção de Ícones (Ações): Compactada e Alinhada para Mobile */}
    <div className="flex items-center space-x-1 sm:space-x-3">
     
     {/* Link Liturgia Diária (Prioridade Alta) */}
     <Link
      href={todayUrl}
      // Estilo para botão de ícone: flex-col para empilhar ícone e texto
      className="flex flex-col items-center justify-center p-1 sm:p-2 rounded-lg text-amber-900 hover:bg-amber-200 transition-colors duration-200 text-[0.6rem] sm:text-xs md:text-sm whitespace-nowrap"
     >
      {/* Tamanho dos ícones ajustado: menor no mobile, maior no desktop */}
      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
      <span className="hidden sm:inline">Liturgia Diária</span> {/* Oculta o texto no mobile mais estreito */}
            <span className="inline sm:hidden">Liturgia</span> {/* Texto resumido para mobile */}
     </Link>

     {/* Link Blog / Notícias (Prioridade Média) */}
     <Link
      href="/blog"
      className="flex flex-col items-center justify-center p-1 sm:p-2 rounded-lg text-amber-900 hover:bg-amber-200 transition-colors duration-200 text-[0.6rem] sm:text-xs md:text-sm whitespace-nowrap"
     >
      <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
      <span>Blog</span>
     </Link>

     {/* Botão de Instalar (PWA) (Prioridade Média) */}
     {shouldShowInstallButton && (
      <button
       onClick={handleInstallClick}
       className="flex flex-col items-center justify-center p-1 sm:p-2 rounded-lg text-amber-900 hover:bg-amber-200 transition-colors duration-200 text-[0.6rem] sm:text-xs md:text-sm whitespace-nowrap"
      >
       <Download className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
       <span>Instalar</span>
      </button>
     )}
    </div>
   </header>
   
   {/* Modal de Instalação para iOS: Mantido o estilo para consistência, adicionado texto-white para melhor contraste no fundo escuro */}
   {showInstallModal && (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
     <div className="bg-amber-900 text-white rounded-lg shadow-2xl p-6 max-w-sm w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">
       Como Instalar no iPhone
      </h2>
      <p className="text-center mb-4">
       Para adicionar o Tio Ben à sua tela de início, siga as instruções:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-left">
       <li>
        Toque no ícone de Compartilhar
        <span className="ml-2">
         <ShareIcon />
        </span>
        na barra inferior do Safari.
       </li>
       <li>
        Em seguida, toque em &quot;Adicionar à Tela de Início&quot;.
       </li>
      </ol>
      <div className="flex justify-center mt-6">
       <button
        onClick={() => setShowInstallModal(false)}
        className="bg-gray-200 hover:bg-gray-300 text-amber-900 font-bold py-2 px-4 rounded-full transition-colors"
       >
        Entendi
       </button>
      </div>
     </div>
    </div>
   )}
  </>
 );
}