import { useEffect, useRef, useState } from "react";

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
  const adRef = useRef<HTMLModElement>(null); // <-- corrigido
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!adRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && adRef.current) {
            try {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              setLoaded(true);
            } catch (e) {
              console.error("AdSense error:", e);
            }
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(adRef.current);

    return () => observer.disconnect();
  }, [adSlot]);

  return (
    <div style={{ position: "relative" }}>
      {!loaded && (
        <div
          style={{
            height: skeletonHeight,
            background: "linear-gradient(90deg, #eee, #ddd, #eee)",
            backgroundSize: "200% 100%",
            animation: "skeleton-loading 1.5s infinite",
            borderRadius: 8,
          }}
        />
      )}

      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ ...style, display: loaded ? "block" : "none" }}
        data-ad-client="ca-pub-8819996017476509"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />

      <style>
        {`
          @keyframes skeleton-loading {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
    </div>
  );
}
