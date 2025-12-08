"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import React from "react";

const ADSENSE_CLIENT_ID = "ca-pub-8819996017476509";

interface AdSenseProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  skeletonHeight?: number;
}

export default function AdSense({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  style = { display: "block", minHeight: 100 },
  skeletonHeight = 100,
}: AdSenseProps) {

  // ✅ CORREÇÃO AQUI (HTMLDivElement em vez de HTMLModElement)
  const adRef = useRef<HTMLModElement | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  /* ✅ LAZY LOAD COM INTERSECTION OBSERVER */
  useEffect(() => {
    if (!adRef.current || !scriptLoaded || loaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && adRef.current) {
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              setLoaded(true);
            } catch (e) {
              console.error("AdSense error on push:", e);
            }
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(adRef.current);

    return () => observer.disconnect();
  }, [adSlot, scriptLoaded, loaded]);

  return (
    <div style={{ position: "relative", width: "100%", ...style }}>

      {/* ✅ SKELETON DE CARREGAMENTO */}
      {!loaded && (
        <div
          aria-hidden="true"
          className="adsense-skeleton"
          style={{
            ...style,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 1,
            height: skeletonHeight,
            background: "linear-gradient(90deg, #eee, #ddd, #eee)",
            backgroundSize: "200% 100%",
            animation: "skeleton-loading 1.5s infinite",
            borderRadius: 8,
          }}
        />
      )}

      {/* ✅ BLOCO DO ANÚNCIO */}
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          ...style,
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
          minHeight: style.minHeight || skeletonHeight,
        }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />

      {/* ✅ SCRIPT ADSENSE CARREGADO APENAS NO CLIENT */}
      <Script
        id="adsbygoogle-script"
        async
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
        onLoad={() => setScriptLoaded(true)}
      />

      {/* ✅ ANIMAÇÃO DO SKELETON */}
      <style global jsx>{`
        @keyframes skeleton-loading {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
