// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import React from "react";
import Script from "next/script";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import AdsenseScriptLoader from "@/components/adsenseScriptLoader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.iatioben.com.br"),
};

export const viewport: Viewport = {
  themeColor: "#fbbf24",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // lang default pt-BR (vamos ajustar /en no client no passo 3)
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen">
        {children}

        {/* GA4 */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-17GKJ4F1Q8"
        />
        <Script
          id="gtag-init"
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

        {/* AdSense (carregar 1x no app inteiro) */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8819996017476509"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        <AdsenseScriptLoader />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
