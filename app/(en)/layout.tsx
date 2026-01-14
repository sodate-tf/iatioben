// app/(en)/en/layout.tsx
import type { Metadata } from "next";
import React from "react";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import PageTransition from "@/components/pageTransiction";
import Cabecalho from "@/components/cabecalho";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "IA Tio Ben | Daily Mass Readings",
    template: "%s | IA Tio Ben",
  },
  description:
    "Daily Mass Readings, Gospel and reflections to pray and prepare for Mass.",
};

export default function EnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>

      <main className="pb-20">
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-17GKJ4F1Q8"
      />
      <Script
        id="gtag-init-en"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-17GKJ4F1Q8');
          `,
        }}
      />

      {/* Google AdSense */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8819996017476509"
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />

      <SpeedInsights />
      <Analytics />

    </>
  );
}
