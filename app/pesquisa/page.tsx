// app/page.tsx ou app/home/page.tsx
import Home from "@/components/HomeClientNew";
import React from "react";


export const metadata = {
  title: "IA Tio Ben | Inteligência Artificial Católica para Liturgia e Estudos",
  description: "IA Tio Ben é uma inteligência artificial católica para liturgia diária, leituras do dia e reflexões cristãs. Uma ferramenta prática de estudos e espiritualidade.",
  keywords: "IA Tio Ben, inteligência artificial católica, liturgia, liturgia diária, leituras, oração, estudos bíblicos, reflexão cristã",
  authors: [{ name: "4U Develops" }],
  openGraph: {
    title: "IA Tio Ben | Liturgia, Leituras e Inteligência Artificial Cristã",
    description: "Receba a liturgia do dia, leituras, salmos e reflexões com a IA Tio Ben.",
    url: "https://www.iatioben.com.br/",
    siteName: "IA Tio Ben",
    images: [
      {
        url: "https://www.iatioben.com.br/images/og_image.png",
        width: 1200,
        height: 630,
        alt: "IA Tio Ben - Inteligência Artificial Católica",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@iatioben",
    title: "IA Tio Ben | Inteligência Artificial Católica",
    description: "Liturgia diária, leituras católicas e reflexões na palma da sua mão com a IA Tio Ben.",
    images: ["https://www.iatioben.com.br/images/og_image.png"],
  },
};

export default function HomePage() {
  return <Home />;
}
