// Este é o código do seu arquivo de layout principal, app/layout.tsx.
// Ele inclui as tags para o PWA e para as metatags de SEO.

import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pergunte ao Tio Ben - Respostas Católicas com IA",
  description: "Faça perguntas ao Tio Ben, nosso catequista virtual, e receba respostas baseadas na Bíblia, Catecismo e tradição da Igreja Católica. Aprenda e aprofunde sua fé com simplicidade e clareza.",
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
    "IA católica"
  ],
  authors: [{ name: "4U Develops" }],
  viewport: "width=device-width, initial-scale=1.0",
  alternates: {
    canonical: "https://www.iatioben.com.br",
  },
  openGraph: {
    title: "Pergunte ao Tio Ben - Catequista Virtual Católico",
    description: "Faça suas perguntas ao Tio Ben e receba respostas católicas confiáveis e claras. Baseadas na Bíblia, Catecismo e tradição da Igreja.",
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
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/tio-ben-192x192.png",
    apple: "/tio-ben-180x180.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <Script
          id="structured-data"
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
                  "url": "https://www.iatioben.com.br/",
                  "name": "Instale o Tio Ben"
                },
                {
                  "@type": "URL",
                  "url": "https://www.iatioben.com.br",
                  "name": "Tio Ben Catequista Virtual"
                }
              ]
            }`
          }}
        />
      </head>
      <body className={inter.className}>
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-17GKJ4F1Q8"
        />
        <Script
          id="google-analytics-config"
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
          id="google-ads"
          strategy="lazyOnload"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8819996017476509"
          crossOrigin="anonymous"
        />
        <Script
          id="gatekeeper-cmp"
          strategy="lazyOnload"
          src="https://cmp.gatekeeperconsent.com/min.js"
        />
        <Script
          id="gatekeeper-cmp-the"
          strategy="lazyOnload"
          src="https://the.gatekeeperconsent.com/cmp.min.js"
        />
        <Script
          id="service-worker-registration"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ("serviceWorker" in navigator) {
                window.addEventListener("load", function () {
                  navigator.serviceWorker.register("/service-worker.js").then(
                    function (registration) {
                      console.log("Service Worker registration successful with scope: ", registration.scope);
                    },
                    function (err) {
                      console.log("Service Worker registration failed: ", err);
                    }
                  );
                });
              }
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
