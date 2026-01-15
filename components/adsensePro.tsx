"use client";

import { useEffect, useRef, useState } from "react";

interface AdSenseProProps {
  slot: string;
  height?: number;
  className?: string;
}

/**
 * AdSensePro (Client)
 * - NÃO carrega script aqui (script deve ser global no layout)
 * - Só dá push quando:
 *   (1) o elemento entra em viewport
 *   (2) o script já está disponível (window.adsbygoogle existe)
 * - Evita double-push
 */
export default function AdSensePro({ slot, height = 120, className }: AdSenseProProps) {
  // Não use HTMLInsElement: em alguns tsconfigs ele não existe
  const insRef = useRef<HTMLElement | null>(null);
  const [pushed, setPushed] = useState(false);

  useEffect(() => {
    const el = insRef.current;
    if (!el || pushed) return;

    let cancelled = false;

    const tryPush = () => {
      if (cancelled || pushed) return;

      // respeita o tipo já existente no seu global.d.ts (unknown[] | undefined)
      if (!("adsbygoogle" in window) || !window.adsbygoogle) return;

      try {
        // cast local (sem redeclarar global) para permitir push
        (window.adsbygoogle as unknown[]).push({});
        setPushed(true);
      } catch {
        // se falhar por timing, as tentativas abaixo podem resolver
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || pushed) return;

        tryPush();

        let tries = 0;
        const maxTries = 12; // ~3s (12 * 250ms)
        const timer = window.setInterval(() => {
          tries += 1;
          tryPush();
          if (pushed || tries >= maxTries) window.clearInterval(timer);
        }, 250);

        observer.disconnect();
      },
      { threshold: 0.25 }
    );

    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [pushed]);

  return (
    <div
      className={className}
      style={{ minHeight: height, width: "100%", marginTop: 15, marginBottom: 15 }}
    >
      {!pushed && (
        <div
          style={{
            height,
            width: "100%",
            borderRadius: 8,
            background: "linear-gradient(90deg, #f5f5f5, #e2e2e2, #f5f5f5)",
            backgroundSize: "200% 100%",
            animation: "ads-skeleton 1.6s infinite",
          }}
          aria-hidden="true"
        />
      )}

      <ins
        // React aceita ref em intrinsic element; o tipo do ref pode ser HTMLElement
        ref={insRef as any}
        className="adsbygoogle"
        style={{
          display: "block",
          minHeight: height,
          opacity: pushed ? 1 : 0,
          transition: "opacity .35s ease",
        }}
        data-ad-client="ca-pub-8819996017476509"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />

      <style>{`
        @keyframes ads-skeleton {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
