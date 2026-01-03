// app/layout.tsx
import "./globals.css";
import Script from "next/script";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import PageTransition from "@/components/pageTransiction";
import Cabecalho from "@/components/cabecalho";
import Footer from "@/components/Footer";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.iatioben.com.br"),
  title: {
    default: "IA Tio Ben | Inteligência Artificial Católica",
    template: "%s | IA Tio Ben",
  },
  description: "Liturgia diária, evangelho e reflexões cristãs com o Tio Ben.",
  icons: {
    icon: "/favicon.ico",
    apple: "/tio-ben-180x180.png",
  },
  openGraph: {
    type: "website",
    siteName: "IA Tio Ben",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbbf24",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <Cabecalho />

        <main className="pb-20">
          <PageTransition>{children}</PageTransition>
        </main>

        <Script
          id="jsonld-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "IA Tio Ben",
              url: "https://www.iatioben.com.br",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.iatioben.com.br/?texto={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

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

        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8819996017476509"
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
