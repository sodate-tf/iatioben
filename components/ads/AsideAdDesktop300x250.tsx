// components/ads/AsideAdDesktop300x250.tsx
"use client";

import Script from "next/script";

const ADS_CLIENT = "ca-pub-8819996017476509";
const ADS_SLOT_SIDEBAR_DESKTOP = "8534838745"; // use o slot correto do aside

export default function AsideAdDesktop300x250() {
  return (
    <div className="hidden lg:block rounded-2xl border border-border bg-card p-3 shadow-sm">
      <p className="px-1 pb-2 text-[11px] font-semibold text-muted-foreground">
        Publicidade
      </p>

      <div className="flex justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: "inline-block", width: 300, height: 250 }}
          data-ad-client={ADS_CLIENT}
          data-ad-slot={ADS_SLOT_SIDEBAR_DESKTOP}
        />
      </div>

      <Script
        id="adsbygoogle-aside-desktop"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(adsbygoogle = window.adsbygoogle || []).push({});`,
        }}
      />
    </div>
  );
}
