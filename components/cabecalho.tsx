import Link from 'next/link';
import React, { useState, useEffect } from 'react';

// Define SVG icons as components for reusability.
const CloudArrowDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path
      fillRule="evenodd"
      d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-2.25a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3v-2.25a.75.75 0 0 1 .75-.75Z"
      clipRule="evenodd"
    />
  </svg>
);

const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 inline-block"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.217 10.385a2.25 2.25 0 0 1-2.246 2.246H3.375a2.25 2.25 0 0 1-2.246-2.246v-1.125a2.25 2.25 0 0 1 2.246-2.246h1.596a2.25 2.25 0 0 1 2.246 2.246zm1.125-3.375a2.25 2.25 0 0 1 2.246-2.246h1.125a2.25 2.25 0 0 1 2.246 2.246zm1.125-1.125a2.25 2.25 0 0 1 2.246 2.246v1.125a2.25 2.25 0 0 1-2.246 2.246h-1.125a2.25 2.25 0 0 1-2.246-2.246v-1.125a2.25 2.25 0 0 1 2.246-2.246zm1.125-1.125a2.25 2.25 0 0 1 2.246 2.246v1.125a2.25 2.25 0 0 1-2.246 2.246h-1.125a2.25 2.25 0 0 1-2.246-2.246v-1.125a2.25 2.25 0 0 1 2.246-2.246z"
    />
  </svg>
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

  // useEffect para detectar se o dispositivo é iOS.
  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(userAgent) ||
      (userAgent.includes("Mac") && "ontouchend" in document);
    const isMSStream = 'MSStream' in window;

    setIsIOS(isIOSDevice && !isMSStream);
  }, []);

  // useEffect para registrar o Service Worker e ouvir o evento de instalação.
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) =>
          console.log("Service Worker registrado com sucesso:", registration.scope)
        )
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

  const handleInstallClick = () => {
    if (isIOS) {
      // Abre o modal de instruções para iOS
      setShowInstallModal(true);
    } else if (deferredPrompt) {
      // Dispara o prompt de instalação para outras plataformas
      deferredPrompt.prompt();
      setDeferredPrompt(null);
    }
  };

  // Condição para renderizar o botão de instalação
  const shouldShowInstallButton = isIOS || installable;

  return (
    <>
      <header className="bg-amber-100 p-4 flex items-center justify-between shadow-md">
        <Link href="/" className="flex items-center space-x-2 cursor-pointer">
          <img
            src="https://placehold.co/50x50/F59E0B/FFFFFF?text=Logo"
            alt="Tio Ben Logo"
            width={50}
            height={50}
          />
          <span className="text-2xl font-bold text-amber-900">Tio Ben</span>
        </Link>
        <div className="flex items-center space-x-2">
          {shouldShowInstallButton && (
            <button
              onClick={handleInstallClick}
              className="flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200 text-lg"
            >
              <CloudArrowDownIcon />
              <span>Instalar App</span>
            </button>
          )}
          <a
            href="/liturgia-diaria"
            className="flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200 text-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span>Liturgia Diária</span>
          </a>
        </div>
      </header>
      {showInstallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              Como Instalar no iPhone
            </h2>
            <p className="text-center mb-4">
              Para adicionar o Tio Ben à sua tela de início, siga as instruções:
            </p>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Toque no ícone de Compartilhar
                <span className="ml-2">
                  <ShareIcon />
                </span>
                na barra inferior.
              </li>
              <li>
                Em seguida, toque em &quot;Adicionar à Tela de Início&quot;.
              </li>
            </ol>
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowInstallModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
