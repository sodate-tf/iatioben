"use client";
import "./globals.css"; // Mantido devido ao "use client" e efeitos globais
import Script from "next/script";
import React from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        {/*
          Melhoria UX: Mantenha apenas os links e meta tags ESSENCIAIS
          para o head. O Next.js já gerencia o <title>, <meta description>
          e o resto do SEO do `metadata` no app/page.tsx.
        */}
        <link rel="apple-touch-icon" href="/tio-ben-180x180.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Tio Ben" />
        
        {/* Dados estruturados em JSON-LD são mantidos no <head> para SEO instantâneo */}
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
              "sameAs": ["https://www.instagram.com/ia.tioben"],
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

        {/* Google Analytics - Movido para o final do <head> com strategy="afterInteractive" */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-17GKJ4F1Q8`}
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
      </head>
      <body>
        {children}
        
        {/* Otimização Mobile First: Scripts de Ads/Consentimento no final do <body> para não bloquear o FCP (First Contentful Paint) */}
        
        {/* Google AdSense - Usando 'defer' e no <body> para carregamento não bloqueante. */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8819996017476509"
          crossOrigin="anonymous"
          strategy="lazyOnload" // Estratégia de carregamento não-essencial
        />
        
        {/* Scripts de Consentimento (CMP) - Também usando 'lazyOnload' e 'defer' */}
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