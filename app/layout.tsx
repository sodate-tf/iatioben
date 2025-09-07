import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import React, { useState, useEffect } from "react";

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
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detecta se o dispositivo é iOS
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent as any) && !(window as any).MSStream;
    setIsIOS(isIOS);
  }, []);

  return (
    <html lang="pt-BR">
      <head>
        {/* Meta tags para iOS/Apple */}
        <link rel="apple-touch-icon" href="/tio-ben-180x180.png" />
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
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-17GKJ4F1Q8');
          `}
        </Script>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8819996017476509"
          crossOrigin="anonymous"
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

        {/* Botão de instalar para iOS e Modal de Instruções */}
        {isIOS && (
          <div className="flex justify-center p-4 bg-gray-100 dark:bg-gray-800">
            <button
              onClick={() => setShowInstallModal(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Adicionar à Tela de Início
            </button>
          </div>
        )}

        {showInstallModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4 text-center">
                Como Instalar no iPhone
              </h2>
              <p className="text-center mb-4">
                Para adicionar o Tio Ben à sua tela de início, siga as
                instruções:
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  Toque no ícone de Compartilhar
                  <span className="ml-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 inline-block"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.217 10.385a2.25 2.25 0 0 1-2.246 2.246H3.375a2.25 2.25 0 0 1-2.246-2.246v-1.125a2.25 2.25 0 0 1 2.246-2.246h1.596a2.25 2.25 0 0 1 2.246 2.246zm1.125-3.375a2.25 2.25 0 0 1 2.246-2.246h1.125a2.25 2.25 0 0 1 2.246 2.246zm1.125-1.125a2.25 2.25 0 0 1 2.246 2.246v1.125a2.25 2.25 0 0 1-2.246 2.246h-1.125a2.25 2.25 0 0 1-2.246-2.246v-1.125a2.25 2.25 0 0 1 2.246-2.246zm1.125-1.125a2.25 2.25 0 0 1 2.246 2.246v1.125a2.25 2.25 0 0 1-2.246 2.246h-1.125a2.25 2.25 0 0 1-2.246-2.246v-1.125a2.25 2.25 0 0 1 2.246-2.246z"
                      />
                    </svg>
                  </span>
                  na barra inferior.
                </li>
                <li>
                  Em seguida, toque em "Adicionar à Tela de Início".
                </li>
              </ol>
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowInstallModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {children}
      </body>
    </html>
  );
}
