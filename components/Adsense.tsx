// components/AdsenseBlock.tsx
import { useEffect, useRef, useState } from "react";
import Script from "next/script";

type AdsenseBlockProps = {
  adClient: string; // ex.: "ca-pub-XXXXXXXXXXXXXXX"
  adSlot: string;   // ex.: "1234567890"
  adFormat?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  testMode?: boolean; // define data-adtest="on" (útil em dev)
  style?: React.CSSProperties; // para customizar altura/largura do contêiner
};

export default function AdsenseBlock({
  adClient,
  adSlot,
  adFormat = "auto",
  responsive = true,
  testMode = false,
  style,
}: AdsenseBlockProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Garante execução apenas no cliente
    if (!containerRef.current || loaded) return;

    const el = containerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            try {
              // Fila do AdSense + render do <ins class="adsbygoogle" />
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              setLoaded(true);
            } catch (e) {
              console.error("AdSense push error:", e);
            } finally {
              observer.unobserve(el);
              observer.disconnect();
            }
            break;
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => {
      observer.unobserve(el);
      observer.disconnect();
    };
  }, [loaded]);

  return (
    <>
      {/* Injete o script UMA única vez na aplicação.
          Se você já injeta no _app/layout, remova este Script daqui. */}
      <Script
        id="adsbygoogle-init"
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
        crossOrigin="anonymous"
        onError={(e) => console.error("AdSense script load error:", e)}
      />

      <div ref={containerRef} style={{ minHeight: 90, ...(style || {}) }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={responsive ? "true" : "false"}
          // Em desenvolvimento, ative testMode para evitar violações de política:
          // https://developers.google.com/publisher-tag/guides/adtest
          data-adtest={testMode ? "on" : undefined}
        />
      </div>
    </>
  );
}