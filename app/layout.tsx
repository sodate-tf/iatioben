import "./globals.css";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import React from "react";

export const metadata = {
  title: "IA Tio Ben | Inteligência Artificial Católica",
  description: "Liturgia diária, evangelho e reflexões cristãs com o Tio Ben.",
  icons: [
    { rel: "apple-touch-icon", url: "/tio-ben-180x180.png" },
    { rel: "manifest", url: "/manifest.json" },
  ],
  themeColor: "#fbbf24",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tio Ben",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}

        {/* 🔹 Dados estruturados */}
        <Script
          id="jsonld-home"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Tio Ben",
              url: "https://www.iatioben.com.br",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.iatioben.com.br?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
              inLanguage: "pt-BR",
              image: "https://www.iatioben.com.br/images/ben-transparente.png",
              sameAs: ["https://www.instagram.com/ia.tioben"],
            }),
          }}
        />

        {/* 🔹 Google Analytics */}
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
              gtag('config', 'G-17GKJ4F1Q8', { page_path: window.location.pathname });
            `,
          }}
        />

        {/* 🔹 Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8819996017476509"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />

        {/* 🔹 Gatekeeper CMP */}
        <Script
          async
          src="https://cmp.gatekeeperconsent.com/min.js"
          data-cfasync="false"
          strategy="lazyOnload"
        />
        <Script
          async
          src="https://the.gatekeeperconsent.com/cmp.min.js"
          data-cfasync="false"
          strategy="lazyOnload"
        />

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
