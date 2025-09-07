import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";





   export const metadata: Metadata = {
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
      };



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">    
      
        <head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/tio-ben-180x180.png" />
          <title>Pergunte ao Tio Ben - Respostas Católicas com IA</title>
          <meta name="description" content="Faça perguntas ao Tio Ben, nosso catequista virtual, e receba respostas baseadas na Bíblia, Catecismo e tradição da Igreja Católica. Aprenda e aprofunde sua fé com simplicidade e clareza." />
          <meta name="keywords" content="Tio Ben, perguntas católicas, catequista virtual, respostas católicas, fé, Bíblia Católica, Catecismo, Igreja Católica, estudo da fé, aprendizado religioso, app de perguntas, IA católica" />
          <meta name="author" content="4U Develops" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="canonical" href="https://www.iatioben.com.br" />

          <meta property="og:title" content="Pergunte ao Tio Ben - Catequista Virtual Católico" />
          <meta property="og:description" content="Faça suas perguntas ao Tio Ben e receba respostas católicas confiáveis e claras. Baseadas na Bíblia, Catecismo e tradição da Igreja." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.iatioben.com.br" />
          <meta property="og:image" content="https://www.iatioben.com.br/images/og-image.png" />
          <meta property="og:locale" content="pt_BR" />
          <meta property="og:site_name" content="Pergunte ao Tio Ben" />

          <meta name="google-adsense-account" content="ca-pub-8819996017476509"></meta>
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
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8819996017476509"  crossOrigin="anonymous"></script>
        <script async src="https://cmp.gatekeeperconsent.com/min.js" data-cfasync="false"></script>
        <script async src="https://the.gatekeeperconsent.com/cmp.min.js" data-cfasync="false"></script>        

      

<script 
  type="application/ld+json" 
  dangerouslySetInnerHTML={{
    __html: `{
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Tio Ben",
      "url": "https://iatiioben.com.br",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://iatiioben.com.br?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "inLanguage": "pt-BR",
      "image": "https://iatiioben.com.br/images/ben-transparente.png",
      "sameAs": [
        "https://www.instagram.com/ia.tioben"
      ],
      "mainEntity": {
        "@type": "Organization",
        "name": "Tio Ben",
        "url": "https://iatiioben.com.br"
      },
      "additionalLinks": [
        {
          "@type": "URL",
          "url": "https://iatiioben.com.br/liturgia-diaria",
          "name": "Liturgia Diária"
        },
        {
          "@type": "URL",
          "url": "https://iatiioben.com.br/instalacao-pwa",
          "name": "Instale o Tio Ben"
        },
        {
          "@type": "URL",
          "url": "https://iatiioben.com.br",
          "name": "Tio Ben Catequista Virtual"
        }
      ]
    }`
  }}
/>


      </head>
      
      <body
       
      >
        {children}
      </body>
    </html>
  );
}
