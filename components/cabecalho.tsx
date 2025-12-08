"use client";

import { BookOpen, Download, Newspaper, Home, Menu, Bot } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdsenseScriptLoader from "./AdsenseLoadScript";

/* ✅ ÍCONE SHARE iOS */
const ShareIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
    <path d="M11 6C12.6569 6 14 4.65685 14 3C14 1.34315 12.6569 0 11 0C9.34315 0 8 1.34315 8 3C8 3.22371 8.02449 3.44169 8.07092 3.65143L4.86861 5.65287C4.35599 5.24423 3.70652 5 3 5C1.34315 5 0 6.34315 0 8C0 9.65685 1.34315 11 3 11C3.70652 11 4.35599 10.7558 4.86861 10.3471L8.07092 12.3486C8.02449 12.5583 8 12.7763 8 13C8 14.6569 9.34315 16 11 16C12.6569 16 14 14.6569 14 13C14 11.3431 12.6569 10 11 10C10.2935 10 9.644 10.2442 9.13139 10.6529L5.92908 8.65143C5.97551 8.44169 6 8.22371 6 8C6 7.77629 5.97551 7.55831 5.92908 7.34857L9.13139 5.34713C9.644 5.75577 10.2935 6 11 6Z" fill="#ffffff"/>
  </svg>
);

interface BeforeInstallPromptEvent extends Event {
  readonly prompt: () => Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function Cabecalho() {
  const [installable, setInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  /* ✅ DETECTA iOS */
  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(userAgent) ||
      (userAgent.includes("Mac") && "ontouchend" in document);

    const isMSStream = "MSStream" in window;
    setIsIOS(isIOSDevice && !isMSStream);
  }, []);

  /* ✅ CONTROLE PWA */
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setInstallable(true);
    };

    const installed = () => setInstallable(false);

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installed);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  const handleInstallClick = () => {
    if (isIOS) {
      setShowInstallModal(true);
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      setDeferredPrompt(null);
    }
  };

  /* ✅ DATA DA LITURGIA */
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const todayUrl = `/liturgia-diaria/${dd}-${mm}-${yyyy}`;

  return (
    <>
      <AdsenseScriptLoader />

      {/* ✅ HEADER DESKTOP */}
      <header className="hidden md:flex bg-amber-100 px-6 py-3 items-center justify-between shadow-md sticky top-0 z-20">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/ben-transparente.png"
            alt="Tio Ben"
            width={48}
            height={48}
            priority
          />
          <span className="text-3xl font-extrabold text-amber-900">Tio Ben</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href={todayUrl} className="flex items-center gap-2 font-semibold text-amber-900 hover:text-amber-700">
            <BookOpen /> Liturgia
          </Link>

          <Link href="/blog" className="flex items-center gap-2 font-semibold text-amber-900 hover:text-amber-700">
            <Newspaper /> Blog
          </Link>

          {(installable || isIOS) && (
            <button
              onClick={handleInstallClick}
              className="bg-amber-700 text-white px-4 py-2 rounded-xl font-semibold hover:bg-amber-800"
            >
              <Download className="inline mr-1" /> Instalar
            </button>
          )}
        </nav>
      </header>

      {/* ✅ BOTTOM BAR MOBILE (UX DE APP) */}
      <nav className="fixed md:hidden bottom-0 left-0 right-0 z-30 bg-white border-t shadow-xl grid grid-cols-4">
        <Link href="/" className="flex flex-col items-center justify-center py-2 text-xs hover:bg-amber-100 active:scale-95 transition">
          <Bot size={20} />
          IA Tio Ben
        </Link>

        <Link href={todayUrl} className="flex flex-col items-center justify-center py-2 text-xs hover:bg-amber-100 active:scale-95 transition">
          <BookOpen size={20} />
          Liturgia
        </Link>

        <Link href="/blog" className="flex flex-col items-center justify-center py-2 text-xs hover:bg-amber-100 active:scale-95 transition">
          <Newspaper size={20} />
          Blog
        </Link>

        {(installable || isIOS) ? (
          <button
            onClick={handleInstallClick}
            className="flex flex-col items-center justify-center py-2 text-xs hover:bg-amber-100 active:scale-95 transition"
          >
            <Download size={20} />
            Instalar
          </button>
        ) : (
          <button className="flex flex-col items-center justify-center py-2 text-xs opacity-40 cursor-default">
            <Menu size={20} />
            Menu
          </button>
        )}
      </nav>

      {/* ✅ MODAL iOS INSTALL */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-amber-900 text-white rounded-xl p-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4">Instalar no iPhone</h2>
            <p className="mb-4">Toque em compartilhar e depois em “Adicionar à Tela de Início”.</p>
            <div className="flex justify-center mb-4 w-10 h-10 mx-auto">
              <ShareIcon />
            </div>
            <button
              onClick={() => setShowInstallModal(false)}
              className="bg-white text-amber-900 px-4 py-2 rounded-full font-bold"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
