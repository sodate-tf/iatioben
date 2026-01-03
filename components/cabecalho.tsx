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
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import AdsenseScriptLoader from "./AdsenseLoadScript";
import { motion, AnimatePresence } from "framer-motion";

/* Ícone Share iOS */
const ShareIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
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

const TERCO_HUB = "/santo-terco/como-rezar-o-terco";

const TERCO_ITEMS = [
  { label: "Rezar Mistérios Gozosos", href: "/santo-terco/rezar/misterios-gozosos" },
  { label: "Rezar Mistérios Dolorosos", href: "/santo-terco/rezar/misterios-dolorosos" },
  { label: "Rezar Mistérios Gloriosos", href: "/santo-terco/rezar/misterios-gloriosos" },
  { label: "Rezar Mistérios Luminosos", href: "/santo-terco/rezar/misterios-luminosos" },
];

export default function Cabecalho() {
  const pathname = usePathname();
  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  /* =======================
     PWA INSTALL
  ======================= */
  const [installable, setInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const ios =
      /iPad|iPhone|iPod/.test(ua) || (ua.includes("Mac") && "ontouchend" in document);
    setIsIOS(ios);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setInstallable(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = () => {
    if (isIOS) setShowInstallModal(true);
    else deferredPrompt?.prompt();
  };

  /* =======================
     TERÇO MENU STATE
  ======================= */
  const [openDesktopTerco, setOpenDesktopTerco] = useState(false);
  const [openMobileTerco, setOpenMobileTerco] = useState(false);
  const longPressRef = useRef<NodeJS.Timeout | null>(null);

  const startLongPress = () => {
    longPressRef.current = setTimeout(() => {
      setOpenMobileTerco(true);
    }, 450);
  };

  const endLongPress = () => {
    if (longPressRef.current) clearTimeout(longPressRef.current);
  };

  /* =======================
     DATE (Liturgia)
  ======================= */
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const todayUrl = `/liturgia-diaria/${dd}-${mm}-${yyyy}`;

  return (
    <>
      <AdsenseScriptLoader />

      {/* =======================
         DESKTOP HEADER
      ======================= */}
      <header className="hidden md:flex bg-amber-100 px-6 py-3 items-center justify-between shadow-md sticky top-0 z-20">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/ben-transparente.png"
            alt="Tio Ben"
            width={56}
            height={56}
            priority
          />
          <span className="text-3xl font-extrabold text-amber-900">Tio Ben</span>
        </Link>

        {/* NAV */}
        <nav className="flex items-center gap-8 relative">
          <Link href={todayUrl} className="font-semibold text-amber-900 hover:text-amber-700 flex items-center gap-2">
            <BookOpen /> Liturgia
          </Link>

          {/* SANTO TERÇO DESKTOP */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDesktopTerco(true)}
            onMouseLeave={() => setOpenDesktopTerco(false)}
          >
            <Link
              href={TERCO_HUB}
              className="font-semibold text-amber-900 hover:text-amber-700 flex items-center gap-2"
            >
              <CircleDashed /> Santo Terço
            </Link>

            <AnimatePresence>
              {openDesktopTerco && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full left-0 mt-2 w-72 rounded-2xl bg-white shadow-xl border p-2 z-50"
                >
                  <Link
                    href={TERCO_HUB}
                    className="block rounded-xl px-4 py-3 font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900"
                  >
                    Aprenda a rezar o terço
                  </Link>

                  <div className="mt-2 space-y-1">
                    {TERCO_ITEMS.map((i) => (
                      <Link
                        key={i.href}
                        href={i.href}
                        className="block rounded-xl px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {i.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/blog" className="font-semibold text-amber-900 hover:text-amber-700 flex items-center gap-2">
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

      {/* =======================
         MOBILE BOTTOM BAR
      ======================= */}
      <nav className="fixed md:hidden bottom-0 left-0 right-0 z-30 bg-white border-t grid grid-cols-5 h-20">
        <Link href="/" className="flex flex-col items-center justify-center">
          <Bot />
          <span className="text-xs">IA</span>
        </Link>

        <Link href={todayUrl} className="flex flex-col items-center justify-center">
          <BookOpen />
          <span className="text-xs">Liturgia</span>
        </Link>

        {/* SANTO TERÇO MOBILE */}
        <button
          onClick={() => window.location.href = TERCO_HUB}
          onTouchStart={startLongPress}
          onTouchEnd={endLongPress}
          className="flex flex-col items-center justify-center"
        >
          <CircleDashed />
          <span className="text-xs">Terço</span>
        </button>

        <Link href="/blog" className="flex flex-col items-center justify-center">
          <Newspaper />
          <span className="text-xs">Blog</span>
        </Link>

        <button className="flex flex-col items-center justify-center">
          <Menu />
          <span className="text-xs">Menu</span>
        </button>
      </nav>

      {/* =======================
         MOBILE TERÇO SHEET
      ======================= */}
      <AnimatePresence>
        {openMobileTerco && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end"
            onClick={() => setOpenMobileTerco(false)}
          >
            <motion.div
              className="bg-white w-full rounded-t-3xl p-5 space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <Link
                href={TERCO_HUB}
                className="block rounded-2xl bg-amber-700 text-white px-4 py-3 font-semibold text-center"
              >
                Aprenda a rezar o terço
              </Link>

              {TERCO_ITEMS.map((i) => (
                <Link
                  key={i.href}
                  href={i.href}
                  className="block rounded-xl border px-4 py-3 text-center"
                >
                  {i.label}
                </Link>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =======================
         iOS INSTALL MODAL
      ======================= */}
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
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
