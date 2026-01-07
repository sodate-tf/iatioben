// app/liturgia-diaria/[data]/page.tsx

import type { Metadata } from "next";
import Script from "next/script";
import { fetchLiturgiaByDate } from "@/lib/liturgia/api";
import { parseSlugDate, slugFromDate, pad2 } from "@/lib/liturgia/date";
import LiturgiaHubPerfect from "@/components/liturgia/LiturgiaHubPerfect";
import LiturgiaAside from "@/components/liturgia/LiturgiaAside";
import { AdsenseSidebarMobile300x250 } from "@/components/ads/AdsenseBlocks";

export const dynamic = "force-static";
export const revalidate = 86400;

const SITE_URL = "https://www.iatioben.com.br";
const ADS_SLOT_SIDEBAR_DESKTOP = "8534838745";
const ADS_SLOT_SIDEBAR_MOBILE = "1573844576";

type PageParams = { data: string };
type PageProps = { params: Promise<PageParams> | PageParams };

function safeSlug(slug: string) {
  return (slug || "").trim();
}

function buildTitle(dd: number, mm: number, yyyy: number) {
  const d = String(dd).padStart(2, "0");
  const m = String(mm).padStart(2, "0");
  return `Liturgia Diária ${d}/${m}/${yyyy} – Evangelho, Leituras e Salmo`;
}

function buildDescription(dd: number, mm: number, yyyy: number) {
  const d = String(dd).padStart(2, "0");
  const m = String(mm).padStart(2, "0");
  return `Liturgia do dia ${d}/${m}/${yyyy} com Evangelho, leituras e salmo. Acompanhe o calendário e navegue por datas, mês e ano.`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await Promise.resolve(params);
  const slug = safeSlug(resolved.data);

  const dt = slug ? parseSlugDate(slug) : null;

  // fallback: rota inválida (não indexar)
  if (!dt) {
    const canonical = `${SITE_URL}/liturgia-diaria`;

    const ogImage = `${SITE_URL}/og?title=${encodeURIComponent(
      "Liturgia Diária"
    )}&description=${encodeURIComponent(
      "Evangelho, leituras e salmo do dia com calendário mensal e anual"
    )}`;

    return {
      title: "Liturgia Diária – IA Tio Ben",
      description: "Acompanhe a liturgia diária com Evangelho, leituras e salmo.",
      robots: { index: false, follow: false },
      alternates: { canonical },

      openGraph: {
        type: "website",
        url: canonical,
        siteName: "IA Tio Ben",
        locale: "pt_BR",
        title: "Liturgia Diária – IA Tio Ben",
        description: "Acompanhe a liturgia diária com Evangelho, leituras e salmo.",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: "Liturgia Diária – IA Tio Ben",
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title: "Liturgia Diária – IA Tio Ben",
        description: "Acompanhe a liturgia diária com Evangelho, leituras e salmo.",
        images: [ogImage],
      },
    };
  }

  const dd = dt.getDate();
  const mm = dt.getMonth() + 1;
  const yyyy = dt.getFullYear();

  const title = buildTitle(dd, mm, yyyy);
  const description = buildDescription(dd, mm, yyyy);
  const canonical = `${SITE_URL}/liturgia-diaria/${slug}`;

  // OG dinâmica via /og (título + description)
  const ogImage = `${SITE_URL}/og?title=${encodeURIComponent(
    title
  )}&description=${encodeURIComponent(description)}`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },

    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "IA Tio Ben",
      type: "article",
      locale: "pt_BR",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}


export default async function LiturgiaDayPage({ params }: PageProps) {
  const resolved = await Promise.resolve(params);
  const slug = safeSlug(resolved.data);

  const dt = slug ? parseSlugDate(slug) : null;
  if (!dt) {
    return (
      <article className="mx-auto max-w-3xl px-4 py-10 bg-white text-slate-900 min-h-screen">
        <h1 className="text-2xl font-bold">Data inválida</h1>
        <p className="mt-2 text-sm text-slate-600">
          Use o formato <span className="font-semibold">dd-mm-aaaa</span>. Exemplo:{" "}
          <span className="font-semibold">/liturgia-diaria/05-01-2026</span>
        </p>
        <div className="mt-4">
          <a
            href="/liturgia-diaria"
            className="inline-flex rounded-xl bg-amber-500 text-white px-4 py-2 text-sm font-semibold hover:bg-amber-600"
          >
            Voltar para Liturgia Diária
          </a>
        </div>
      </article>
    );
  }

  const day = dt.getDate();
  const month = dt.getMonth() + 1;
  const year = dt.getFullYear();

  const data = await fetchLiturgiaByDate(day, month, year);

  const prev = new Date(year, month - 1, day - 1);
  const next = new Date(year, month - 1, day + 1);

  const prevSlug = slugFromDate(prev);
  const nextSlug = slugFromDate(next);

  const canonical = `${SITE_URL}/liturgia-diaria/${slug}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "IA Tio Ben", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Liturgia Diária", item: `${SITE_URL}/liturgia-diaria` },
      { "@type": "ListItem", position: 3, name: data.dateLabel, item: canonical },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: buildTitle(day, month, year),
    description: buildDescription(day, month, year),
    mainEntityOfPage: canonical,
    datePublished: `${data.dateISO}T06:00:00-03:00`,
    dateModified: `${data.dateISO}T06:00:00-03:00`,
    author: { "@type": "Organization", name: "IA Tio Ben" },
    publisher: { "@type": "Organization", name: "IA Tio Ben" },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Onde encontrar a liturgia diária completa de ${data.dateLabel}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Nesta página você encontra a liturgia diária de ${data.dateLabel} com Primeira Leitura, Salmo, Evangelho e, quando houver, Segunda Leitura.`,
        },
      },
      {
        "@type": "Question",
        name: "Quais partes normalmente aparecem na liturgia diária?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Em geral: Primeira Leitura, Salmo Responsorial, Evangelho e, quando houver, Segunda Leitura e antífonas.",
        },
      },
      {
        "@type": "Question",
        name: "Como acessar a liturgia de outra data?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use a página /liturgia-diaria e o calendário por mês/ano para abrir qualquer data em /liturgia-diaria/dd-mm-aaaa.",
        },
      },
    ],
  };

  // Mantém como está (server time)
  const today = new Date();
  const todaySlug = `${pad2(today.getDate())}-${pad2(today.getMonth() + 1)}-${today.getFullYear()}`;
  const todayLabel = `${pad2(today.getDate())}/${pad2(today.getMonth() + 1)}/${today.getFullYear()}`;

  return (
    <>
      <Script
        id="jsonld-breadcrumb-liturgia-dia"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="jsonld-article-liturgia-dia"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Script
        id="jsonld-faq-liturgia-dia"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <article className="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6 py-6 bg-white text-slate-900 leading-relaxed min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6">
          <main className="min-w-0">
            <LiturgiaHubPerfect
              siteUrl={SITE_URL}
              hubCanonicalPath={`/liturgia-diaria/${slug}`}
              dateSlug={slug}
              data={data}
              prevSlug={prevSlug}
              nextSlug={nextSlug}
              todaySlug={todaySlug}
              todayLabel={todayLabel}
              className="max-w-none px-0 py-0"
            />

            {/* Anúncio mobile (somente aqui, para não duplicar com o aside) */}
            <div className="mt-6 lg:hidden">
              <AdsenseSidebarMobile300x250 slot={ADS_SLOT_SIDEBAR_MOBILE} />
            </div>

            {/* Removido: bloco “Acesso rápido” mobile duplicado (o aside já cobre isso) */}
          </main>

          {/* ASIDE: só no desktop para evitar duplicar anúncio e blocos no mobile */}
          <div className="hidden lg:block">
            <LiturgiaAside
              year={year}
              month={month}
              todaySlug={todaySlug}
              todayLabel={todayLabel}
              prevSlug={prevSlug}
              nextSlug={nextSlug}
              adsSlotDesktop300x250={ADS_SLOT_SIDEBAR_DESKTOP}
              blogLinks={[
                {
                  href: "/liturgia/ano-liturgico",
                  title: "Ano litúrgico: tempos, cores e calendário",
                  desc: "Entenda o que muda ao longo do ano e como acompanhar.",
                },
                {
                  href: "/liturgia/leituras-da-missa",
                  title: "Guia das leituras da Missa",
                  desc: "Primeira leitura, salmo, evangelho e como acompanhar.",
                },
                {
                  href: "/liturgia/como-usar-a-liturgia",
                  title: "Como usar a liturgia no dia a dia",
                  desc: "Um método simples para rezar e se preparar para a Missa.",
                },
              ]}
            />
          </div>

          {/* ASIDE (mobile): sem anúncio (você já tem o bloco Adsense mobile acima) */}
          <div className="mt-6 lg:hidden">
            <LiturgiaAside
              year={year}
              month={month}
              todaySlug={todaySlug}
              todayLabel={todayLabel}
              prevSlug={prevSlug}
              nextSlug={nextSlug}
              blogLinks={[
                {
                  href: "/liturgia/ano-liturgico",
                  title: "Ano litúrgico: tempos, cores e calendário",
                  desc: "Entenda o que muda ao longo do ano e como acompanhar.",
                },
                {
                  href: "/liturgia/leituras-da-missa",
                  title: "Guia das leituras da Missa",
                  desc: "Primeira leitura, salmo, evangelho e como acompanhar.",
                },
                {
                  href: "/liturgia/como-usar-a-liturgia",
                  title: "Como usar a liturgia no dia a dia",
                  desc: "Um método simples para rezar e se preparar para a Missa.",
                },
              ]}
            />
          </div>
        </div>

        <link rel="canonical" href={canonical} />
      </article>
    </>
  );
}
