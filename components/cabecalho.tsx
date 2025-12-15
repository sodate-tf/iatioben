"use client";

import {
  BookOpen,
  Download,
  Newspaper,
  Menu,
  Bot,
  CircleDashed,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import AdsenseScriptLoader from "./AdsenseLoadScript";
import { motion } from "framer-motion";

/* Ícone Share iOS */
const ShareIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="#ffffff"
  >
    <path
      d="M11 6C12.6569 6 14 4.65685 14 3C14 1.34315 12.6569 0 11 0C9.34315 0 8 1.34315 8 3C8 3.22371 8.02449 3.44169 8.07092 3.65143L4.86861 5.65287C4.35599 5.24423 3.70652 5 3 5C1.34315 5 0 6.34315 0 8C0 9.65685 1.34315 11 3 11C3.70652 11 4.35599 10.7558 4.86861 10.3471L8.07092 12.3486C8.02449 12.5583 8 12.7763 8 13C8 14.6569 9.34315 16 11 16C12.6569 16 14 14.6569 14 13C14 11.3431 12.6569 10 11 10C10.2935 10 9.644 10.2442 9.13139 10.6529L5.92908 8.65143C5.97551 8.44169 6 8.22371 6 8C6 7.77629 5.97551 7.55831 5.92908 7.34857L9.13139 5.34713C9.644 5.75577 10.2935 6 11 6Z"
      fill="#ffffff"
    />
  </svg>
);

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function Cabecalho() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  /* PWA Install Logic */
  const [installable, setInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    const isiOS =
      /iPad|iPhone|iPod/.test(ua) || (ua.includes("Mac") && "ontouchend" in document);
    const isMS = "MSStream" in window;
    setIsIOS(isiOS && !isMS);
  }, []);

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
    if (isIOS) setShowInstallModal(true);
    else if (deferredPrompt) {
      deferredPrompt.prompt();
      setDeferredPrompt(null);
    }
  };

  /* Liturgia Diária Link */
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const todayUrl = `/liturgia-diaria/${dd}-${mm}-${yyyy}`;

  const baseBtn =
    "relative flex flex-col items-center justify-center gap-1 w-full h-full transition active:scale-95";

  const activeBtn = "text-amber-700 font-semibold";
  const normalBtn = "text-gray-900 hover:bg-amber-100";

  return (
    <>
      <AdsenseScriptLoader />

      {/* DESKTOP HEADER */}
      <header className="hidden md:flex bg-amber-100 px-6 py-3 items-center justify-between shadow-md sticky top-0 z-20">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/ben-transparente.png"
            alt="Tio Ben"
            width={64}
            height={64}
            priority
            fetchPriority="high"
          />
          <span className="text-3xl font-extrabold text-amber-900">Tio Ben</span>
        </Link>

        {/* NAV WITH ANIMATED INDICATOR */}
        <nav className="flex items-center gap-6 relative">
          {/* Liturgia */}
          <Link href={todayUrl} className="relative px-1">
            {isActive("/liturgia") && (
              <motion.span
                layoutId="desktop-active"
                className="absolute -bottom-1 left-0 right-0 h-[3px] bg-amber-700 rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
            <span
              className={`flex items-center gap-2 font-semibold ${
                isActive("/liturgia") ? "text-amber-700" : "text-amber-900"
              }`}
            >
              <BookOpen /> Liturgia
            </span>
          </Link>

          {/* Santo Terço */}
          <Link href="/santo-terco" className="relative px-1">
            {isActive("/santo-terco") && (
              <motion.span
                layoutId="desktop-active"
                className="absolute -bottom-1 left-0 right-0 h-[3px] bg-amber-700 rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
            <span
              className={`flex items-center gap-2 font-semibold ${
                isActive("/santo-terco") ? "text-amber-700" : "text-amber-900"
              }`}
            >
              <CircleDashed /> Santo Terço
            </span>
          </Link>

          {/* Blog */}
          <Link href="/blog" className="relative px-1">
            {isActive("/blog") && (
              <motion.span
                layoutId="desktop-active"
                className="absolute -bottom-1 left-0 right-0 h-[3px] bg-amber-700 rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
            <span
              className={`flex items-center gap-2 font-semibold ${
                isActive("/blog") ? "text-amber-700" : "text-amber-900"
              }`}
            >
              <Newspaper /> Blog
            </span>
          </Link>

          {(installable || isIOS) && (
            <button
              onClick={handleInstallClick}
              className="bg-amber-700 text-white px-4 py-2 rounded-xl font-semibold hover:bg-amber-800"
              type="button"
            >
              <Download className="inline mr-1" /> Instalar
            </button>
          )}
        </nav>
      </header>

      {/* MOBILE BOTTOM BAR */}
      <nav className="fixed md:hidden bottom-0 left-0 right-0 z-30 bg-white border-t shadow-2xl grid grid-cols-5 h-20 px-1">
        {/* IA */}
        <Link href="/" className={`${baseBtn} ${isActive("/") ? activeBtn : normalBtn}`}>
          {isActive("/") && (
            <motion.span
              layoutId="mobile-active"
              className="absolute top-0 left-3 right-3 h-[3px] bg-amber-700 rounded-full"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
          <Bot size={24} />
          <span className="text-[11px] font-medium">IA</span>
        </Link>

        {/* Liturgia */}
        <Link
          href={todayUrl}
          className={`${baseBtn} ${isActive("/liturgia") ? activeBtn : normalBtn}`}
        >
          {isActive("/liturgia") && (
            <motion.span
              layoutId="mobile-active"
              className="absolute top-0 left-3 right-3 h-[3px] bg-amber-700 rounded-full"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
          <BookOpen size={24} />
          <span className="text-[11px] font-medium">Liturgia</span>
        </Link>

        {/* Santo Terço */}
        <Link
          href="/santo-terco"
          className={`${baseBtn} ${isActive("/santo-terco") ? activeBtn : normalBtn}`}
        >
          {isActive("/santo-terco") && (
            <motion.span
              layoutId="mobile-active"
              className="absolute top-0 left-3 right-3 h-[3px] bg-amber-700 rounded-full"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
          <CircleDashed size={24} />
          <span className="text-[11px] font-medium">Terço</span>
        </Link>

        {/* Blog */}
        <Link href="/blog" className={`${baseBtn} ${isActive("/blog") ? activeBtn : normalBtn}`}>
          {isActive("/blog") && (
            <motion.span
              layoutId="mobile-active"
              className="absolute top-0 left-3 right-3 h-[3px] bg-amber-700 rounded-full"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
          <Newspaper size={24} />
          <span className="text-[11px] font-medium">Blog</span>
        </Link>

        {/* Instalar */}
        {(installable || isIOS) ? (
          <button onClick={handleInstallClick} className={`${baseBtn} ${normalBtn}`} type="button">
            <Download size={24} />
            <span className="text-[11px] font-medium">Instalar</span>
          </button>
        ) : (
          <button className={`${baseBtn} opacity-40`} type="button">
            <Menu size={24} />
            <span className="text-[11px] font-medium">Menu</span>
          </button>
        )}
      </nav>

      {/* iOS Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-amber-900 text-white rounded-xl p-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4">Instalar no iPhone</h2>
            <p className="mb-4">
              Toque em compartilhar e depois em &quot;Adicionar à Tela de Início&quot;.
            </p>
            <div className="flex justify-center mb-4 w-10 h-10 mx-auto">
              <ShareIcon />
            </div>
            <button
              onClick={() => setShowInstallModal(false)}
              className="bg-white text-amber-900 px-4 py-2 rounded-full font-bold"
              type="button"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
