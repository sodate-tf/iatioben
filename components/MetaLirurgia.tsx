import type { Metadata } from 'next';
import LiturgiaDiariaClient from '../app/liturgia-diaria/page';

// Esta página agora é um Server Component e lida apenas com a metadata.
export const metadata: Metadata = {
  title: "Liturgia Diária e Respostas Católicas com IA | Tio Ben",
  description:
    "Acesse a Liturgia Diária de forma simples e rápida. Encontre as leituras do dia, o Evangelho, a reflexão e a oração, tudo em um só lugar. Aprofunde sua fé com a Liturgia Diária Católica.",
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
    "Liturgia",
    "Liturgia Diária",
    "Liturgia diária católica",
    "leitura do dia",
    "liturgia do dia",
  ],
  authors: [{ name: "4U Develops" }],
  alternates: {
    canonical: "https://www.iatioben.com.br/liturgia-diaria",
  },
  openGraph: {
    title: "Liturgia Diária Católica | Tio Ben",
    description:
      "Acesse a Liturgia Diária de forma simples e rápida. Encontre as leituras do dia, o Evangelho, a reflexão e a oração, tudo em um só lugar. Aprofunde sua fé com a Liturgia Diária Católica.",
    type: "website",
    url: "https://www.iatioben.com.br/liturgia-diaria",
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


export default function LiturgiaPage() {
  return <LiturgiaDiariaClient />;
}
