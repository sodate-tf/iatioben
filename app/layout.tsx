import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import React from "react";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "Pergunte ao Tio Ben - Respostas Católicas com IA",
  description:
    "Faça perguntas ao Tio Ben, nosso catequista virtual, e receba respostas baseadas na Bíblia, Catecismo e tradição da Igreja Católica. Aprenda e aprofunde sua fé com simplicidade e clareza.",
  keywords: [
    "Tio Ben",
    "perguntas católicas",
    "catequista virtual",
    "respostas católicas",
    "fé",
    "Bíblia Católica",
    "Catecismo",
    "Igreja Católica",
    "estudo da fé",
    "aprendizado religioso",
    "app de perguntas",
    "IA católica",
  ],
  authors: [{ name: "4U Develops" }],
  viewport: "width=device-width, initial-scale=1.0",
  alternates: {
    canonical: "https://www.iatioben.com.br",
  },
  openGraph: {
    title: "Pergunte ao Tio Ben - Catequista Virtual Católico",
    description:
      "Faça suas perguntas ao Tio Ben e receba respostas católicas confiáveis e claras. Baseadas na Bíblia, Catecismo e tradição da Igreja.",
    type: "website",
    url: "https://www.iatioben.com.br",
    images: [
      {
        url: "https://www.iatioben.com.br/images/og-image.png",
      },
    ],
    locale: "pt_BR",
    siteName: "Pergunte ao Tio Ben",
  },
  other: {
    "google-adsense-account": "ca-pub-8819996017476509",
    "google-site-verification": "G-17GKJ4F1Q8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    
    <html lang="pt-BR">
      
      <head>
        {/* Meta tags para iOS/Apple */}
        <link rel="apple-touch-icon" href="/tio-ben-180x180.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Tio Ben" />

        {/* Script de dados estruturados para SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Tio Ben",
              "url": "https://www.iatioben.com.br",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.iatioben.com.br?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "inLanguage": "pt-BR",
              "image": "https://www.iatioben.com.br/images/ben-transparente.png",
              "sameAs": [
                "https://www.instagram.com/ia.tioben"
              ],
              "mainEntity": {
                "@type": "Organization",
                "name": "Tio Ben",
                "url": "https://www.iatioben.com.br"
              },
              "additionalLinks": [
                {
                  "@type": "URL",
                  "url": "https://www.iatioben.com.br/liturgia-diaria",
                  "name": "Liturgia Diária"
                },
                {
                  "@type": "URL",
                  "url": "https://www.iatioben.com.br",
                  "name": "Tio Ben Catequista Virtual"
                }
              ]
            }`,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        
      </head>
      <body>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-17GKJ4F1Q8"
        />
       
        <Script
            id="adsbygoogle-init"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8819996017476509"
          />
        <Script
          async
          src="https://cmp.gatekeeperconsent.com/min.js"
          data-cfasync="false"
        />
        <Script
          async
          src="https://the.gatekeeperconsent.com/cmp.min.js"
          data-cfasync="false"
        />

        

        {children}
        <SpeedInsights/>
        <Analytics/>
      </body>
    </html>
  );
}
