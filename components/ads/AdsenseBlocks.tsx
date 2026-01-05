// components/ads/AdsenseBlocks.tsx
"use client";

import React, { useEffect, useRef } from "react";

const ADS_CLIENT = "ca-pub-8819996017476509";

function useAdsenseOnce() {
  const pushedRef = useRef(false);

  function pushIfNeeded(insEl: HTMLElement | null) {
    if (!insEl) return;

    // Comentário: em dev/fast refresh pode re-renderizar; não repush no mesmo componente
    if (pushedRef.current) return;

    // Comentário: se o AdSense já preencheu este ins, ele define data-adsbygoogle-status
    const alreadyFilled = insEl.getAttribute("data-adsbygoogle-status");
    if (alreadyFilled) {
      pushedRef.current = true;
      return;
    }

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {
      // Comentário: evita crash em dev; em produção tende a estabilizar
    }
  }

  return { pushIfNeeded };
}

export function AdsenseInArticle({ slot }: { slot: string }) {
  const insRef = useRef<HTMLModElement | null>(null);
  const { pushIfNeeded } = useAdsenseOnce();

  useEffect(() => {
    pushIfNeeded(insRef.current);
  }, [pushIfNeeded]);

  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
      <p className="px-1 pb-2 text-[11px] font-semibold text-muted-foreground">Publicidade</p>

      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADS_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

export function AdsenseSidebarDesktop300x250({ slot }: { slot: string }) {
  const insRef = useRef<HTMLModElement | null>(null);
  const { pushIfNeeded } = useAdsenseOnce();

  useEffect(() => {
    pushIfNeeded(insRef.current);
  }, [pushIfNeeded]);

  return (
    <div className="hidden lg:block rounded-2xl border border-border bg-card p-3 shadow-sm">
      <p className="px-1 pb-2 text-[11px] font-semibold text-muted-foreground">Publicidade</p>

      <div className="flex justify-center">
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "inline-block", width: 300, height: 250 }}
          data-ad-client={ADS_CLIENT}
          data-ad-slot={slot}
        />
      </div>
    </div>
  );
}

export function AdsenseSidebarMobile300x250({ slot }: { slot: string }) {
  const insRef = useRef<HTMLModElement | null>(null);
  const { pushIfNeeded } = useAdsenseOnce();

  useEffect(() => {
    pushIfNeeded(insRef.current);
  }, [pushIfNeeded]);

  return (
    <div className="lg:hidden rounded-2xl border border-border bg-card p-3 shadow-sm">
      <p className="px-1 pb-2 text-[11px] font-semibold text-muted-foreground">Publicidade</p>

      <div className="flex justify-center">
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "inline-block", width: 300, height: 250 }}
          data-ad-client={ADS_CLIENT}
          data-ad-slot={slot}
        />
      </div>
    </div>
  );
}
