import "./globals.css";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import PageTransition from "@/components/pageTransiction";
import Cabecalho from "@/components/cabecalho";
import Footer from "@/components/Footer";

export const viewport  = {
  title: {
    default: "IA Tio Ben | Inteligência Artificial Católica",
    template: "%s | IA Tio Ben",
  },
  description: "Liturgia diária, evangelho e reflexões cristãs com o Tio Ben.",
  metadataBase: new URL("https://www.iatioben.com.br"),
  icons: {
    icon: "/favicon.ico",
    apple: "/tio-ben-180x180.png",
  },
  themeColor: "#fbbf24",
  openGraph: {
    type: "website",
    siteName: "IA Tio Ben",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
  },
};

import { Lora } from "next/font/google";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-lora",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={lora.variable}>
  {/* ✅ HEADER FIXO GLOBAL (FORA DA ANIMAÇÃO) */}
  <Cabecalho />

  {/* ✅ CONTEÚDO COM ANIMAÇÃO */}
  <main className="pb-20">
    <PageTransition>{children}</PageTransition>
  </main>

  {/* ✅ WebSite Schema GLOBAL */}
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

  {/* ✅ GA */}
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

  {/* ✅ AdSense */}
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
