"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

export default function AdSensePro({
  slot,
  height = 120,
}: {
  slot: string;
  height?: number;
}) {
  const adRef = useRef<HTMLModElement>(null); 
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!adRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loaded) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch {}

        setLoaded(true);
        observer.disconnect();
      }
    });

    observer.observe(adRef.current);

    return () => observer.disconnect();
  }, [loaded]);

  return (
    <div style={{ minHeight: height, width: "100%" }}>
      {!loaded && (
        <div
          style={{
            height,
            width: "100%",
            borderRadius: 8,
            background:
              "linear-gradient(90deg, #f5f5f5, #e2e2e2, #f5f5f5)",
            backgroundSize: "200% 100%",
            animation: "skeleton 1.6s infinite",
          }}
        />
      )}

      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
          height,
          opacity: loaded ? 1 : 0,
          transition: "opacity .5s ease",
        }}
        data-ad-client="ca-pub-8819996017476509"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />

      <Script
        strategy="lazyOnload"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8819996017476509`}
        crossOrigin="anonymous"
      />

      <style>{`
        @keyframes skeleton {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
