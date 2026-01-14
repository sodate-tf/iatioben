// app/(pt)/layout.tsx
import type { Metadata } from "next";
import React from "react";
import Script from "next/script";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import PageTransition from "@/components/pageTransiction";
import Cabecalho from "@/components/cabecalho";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "IA Tio Ben | Liturgia Diária",
    template: "%s | IA Tio Ben",
  },
  description:
    "Liturgia diária completa, Evangelho e reflexões para rezar e se preparar para a Santa Missa.",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function PtRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <Cabecalho />

        <main className="pb-20">
          <PageTransition>{children}</PageTransition>
        </main>

        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-17GKJ4F1Q8"
        />
        <Script
          id="gtag-init-pt"
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

        <Script
          async
          src="https://pagead2.googletagmanager.com/pagead/js/adsbygoogle.js?client=ca-pub-8819996017476509"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />

        <SpeedInsights />
        <Analytics />

        <Footer />
      </body>
    </html>
  );
}
