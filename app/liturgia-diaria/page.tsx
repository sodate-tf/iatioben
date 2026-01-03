// app/liturgia/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import LiturgiaHubClient from "@/components/LiturgiaHubClient";

export const dynamic = "force-static";

const SITE_URL = "https://www.iatioben.com.br";
const PAGE_PATH = "/liturgia";
const CANONICAL_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE = `${SITE_URL}/og_image_liturgia.png`;

export const metadata: Metadata = {
  title: "Liturgia Católica: Leituras Diárias, Calendário e Como Funciona",
  description:
    "Entenda a Liturgia Católica: o que é, como funcionam as leituras da Missa, ciclos A/B/C, tempos litúrgicos, calendário e acesso rápido à Liturgia Diária (Evangelho do dia).",
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: "Liturgia Católica: Leituras Diárias, Calendário e Como Funciona",
    description:
      "Guia completo da Liturgia Católica: estrutura da Missa, leituras, ciclos e tempos litúrgicos, com acesso à Liturgia Diária e conteúdos para aprofundar.",
    url: CANONICAL_URL,
    siteName: "IA Tio Ben",
    locale: "pt_BR",
    type: "article",
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Liturgia Católica: Leituras Diárias, Calendário e Como Funciona",
    description:
      "Guia completo da Liturgia Católica: estrutura da Missa, leituras, ciclos e tempos litúrgicos, com acesso à Liturgia Diária e conteúdos para aprofundar.",
    images: [OG_IMAGE],
  },
};

function isoNowBR() {
  // Para schema (não crítico, mas consistente)
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}-03:00`;
}

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": CANONICAL_URL },
    headline: "Liturgia Católica: Leituras Diárias, Calendário e Como Funciona",
    description:
      "Guia completo da Liturgia Católica: o que é, como funcionam as leituras, ciclos e tempos litúrgicos, com acesso rápido à Liturgia Diária.",
    image: OG_IMAGE,
    url: CANONICAL_URL,
    inLanguage: "pt-BR",
    datePublished: isoNowBR(),
    dateModified: isoNowBR(),
    author: { "@type": "Person", name: "Tio Ben", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "IA Tio Ben",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
  };

  // FAQ Schema (hub pilar costuma se beneficiar bastante)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "O que é a Liturgia da Missa?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "A Liturgia é a oração pública da Igreja e, na Missa, é o modo como celebramos o Mistério de Cristo. Ela inclui Liturgia da Palavra (leituras e Evangelho) e Liturgia Eucarística.",
        },
      },
      {
        "@type": "Question",
        name: "Por que as leituras mudam todos os dias?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "As leituras seguem um lecionário organizado pela Igreja, distribuído ao longo do ano litúrgico, para que a comunidade seja alimentada pela Palavra de Deus em ciclos e tempos litúrgicos.",
        },
      },
      {
        "@type": "Question",
        name: "O que são os ciclos A, B e C?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "São ciclos dominicais do lecionário: A (Mateus), B (Marcos) e C (Lucas). Eles se alternam a cada ano, garantindo variedade e profundidade na proclamação do Evangelho.",
        },
      },
      {
        "@type": "Question",
        name: "Qual a diferença entre solenidade, festa e memória?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "São graus de celebração no calendário litúrgico. Solenidades são as mais importantes, festas vêm em seguida e memórias destacam santos e acontecimentos, podendo ser obrigatórias ou facultativas.",
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="jsonld-liturgia-hub-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="jsonld-liturgia-hub-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <LiturgiaHubClient />
    </>
  );
}
