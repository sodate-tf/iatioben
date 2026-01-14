// app/liturgia-diaria/page.tsx

import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";
import { fetchLiturgiaByDate, LiturgiaNormalized } from "@/lib/liturgia/api";
import { monthLabelPT, pad2 } from "@/lib/liturgia/date";
import AutoScrollTo from "@/components/liturgia/AutoScrollTo";
import LiturgiaAside from "@/components/liturgia/LiturgiaAside";
import { AdsenseInArticle, AdsenseSidebarMobile300x250 } from "@/components/ads/AdsenseBlocks";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";

const SITE_URL = "https://www.iatioben.com.br";
const HUB_PATH = "/liturgia-diaria";
const CANONICAL_URL = `${SITE_URL}${HUB_PATH}`;

const ADS_SLOT_BODY_TOP = "7474884427";
const ADS_SLOT_SIDEBAR_DESKTOP = "8534838745";
const ADS_SLOT_SIDEBAR_MOBILE = "1573844576";

export const dynamic = "force-static";
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Liturgia Diária – Evangelho, Leituras e Salmo do dia",
  description:
    "Acompanhe a Liturgia Diária com Evangelho, leituras e salmo. Reze, medite e consulte qualquer data pelo calendário mensal e anual.",

  alternates: { canonical: CANONICAL_URL },

  openGraph: {
    type: "website",
    url: CANONICAL_URL,
    siteName: "IA Tio Ben",
    locale: "pt_BR",

    // 🔹 Título focado em valor + ação
    title: "Liturgia Diária – Reze com a Palavra todos os dias",

    // 🔹 Mensagem clara + CTA (isso aparece no preview do WhatsApp/Facebook)
    description:
      "Evangelho, leituras e salmo do dia organizados para a sua oração. Acesse agora a Liturgia Diária e acompanhe o calendário completo.",

    images: [
      {
        // ✅ mockup padrão (public/og/base.png embutido na rota)
        url: `${SITE_URL}/og/liturgia.png`,
        width: 1200,
        height: 630,
        alt: "Liturgia Diária – IA Tio Ben",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Liturgia Diária – Reze com a Palavra todos os dias",

    description:
      "Evangelho, leituras e salmo do dia para rezar e meditar. Acesse a Liturgia Diária completa no IA Tio Ben.",

    images: [`${SITE_URL}/og/liturgia.png`],
  },
};


/* =========================
   HELPERS
   ========================= */

function buildSlug(dd: number, mm: number, yyyy: number) {
  const d = String(dd).padStart(2, "0");
  const m = String(mm).padStart(2, "0");
  return `${d}-${m}-${yyyy}`;
}

function getTodayInSaoPauloParts() {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  }

  return { year, month, day };
}

/* =========================
   PAGE
   ========================= */
export default async function LiturgiaHubPage() {
  const { year, month, day } = getTodayInSaoPauloParts();

  const today: LiturgiaNormalized = await fetchLiturgiaByDate(day, month, year);

  const base = new Date(year, month - 1, day);
  const prev = new Date(base);
  prev.setDate(base.getDate() - 1);
  const next = new Date(base);
  next.setDate(base.getDate() + 1);

  const prevSlug = buildSlug(prev.getDate(), prev.getMonth() + 1, prev.getFullYear());
  const nextSlug = buildSlug(next.getDate(), next.getMonth() + 1, next.getFullYear());

  const months = Array.from({ length: 12 }, (_, i) => i + 1).map((m) => ({
    label: monthLabelPT(year, m),
    href: `/liturgia-diaria/ano/${year}/${pad2(m)}`,
  }));

  /* =========================
     JSON-LD (SEO)
     ========================= */

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Onde posso ler a Liturgia Diária de hoje?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Na seção “Hoje” você encontra as referências do dia e pode abrir a página completa com as leituras, o salmo e o evangelho.",
        },
      },
      {
        "@type": "Question",
        name: "O que inclui a Liturgia Diária?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Normalmente inclui Primeira Leitura, Salmo Responsorial, Evangelho do dia e, quando houver, Segunda Leitura, além de elementos próprios da celebração.",
        },
      },
      {
        "@type": "Question",
        name: "Como acessar a liturgia de outra data?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Use o calendário do ano e do mês. Cada dia possui uma URL no formato /liturgia-diaria/dd-mm-aaaa.",
        },
      },
    ],
  };

  const hubJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Liturgia Diária",
    description: "Evangelho, leituras e salmo do dia, com calendário mensal e anual.",
    url: CANONICAL_URL,
    isPartOf: { "@type": "WebSite", name: "IA Tio Ben", url: SITE_URL },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "IA Tio Ben", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Liturgia Diária", item: CANONICAL_URL },
    ],
  };

  return (
    <>
      <Script
        id="jsonld-liturgia-hub"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hubJsonLd) }}
      />
      <Script
        id="jsonld-liturgia-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="jsonld-liturgia-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <AutoScrollTo targetId="hoje" desktopHeaderPx={80} extraOffsetPx={12} behavior="smooth" />

      <main className="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6 py-6 bg-white text-slate-900 leading-relaxed min-h-screen">
        <article className="min-w-0">
          <header className="mb-6">
  <div className="flex items-start justify-between gap-4">
    <div className="min-w-0">
      <p className="text-xs font-semibold tracking-wide text-amber-700 uppercase">
        IA Tio Ben • Liturgia
      </p>

      <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
        Liturgia Diária – Evangelho, Leituras e Salmo do dia
      </h1>
    </div>

    {/* Seletor de idioma (PT/EN) */}
    <div className="shrink-0">
      <LanguageSwitcher />
    </div>
  </div>

  <p className="mt-3 text-base text-slate-600 max-w-3xl">
    Aqui você encontra a <strong>Liturgia Diária</strong> do Brasil para cada dia do ano, com{" "}
    <strong>leituras da Missa</strong>, <strong>salmo responsorial</strong> e{" "}
    <strong>evangelho do dia</strong>. Use o calendário anual e mensal para consultar qualquer data
    e preparar sua oração e participação na Missa.
  </p>

  <div className="mt-4 flex flex-wrap gap-2">
    <Link
      href={`/liturgia-diaria/${today.dateSlug}`}
      className="rounded-xl bg-amber-500 text-white px-4 py-2 text-sm font-semibold hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
    >
      Liturgia de hoje • {today.dateLabel}
    </Link>

    <Link
      href={`/liturgia-diaria/${prevSlug}`}
      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
    >
      Ontem
    </Link>

    <Link
      href={`/liturgia-diaria/${nextSlug}`}
      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
    >
      Amanhã
    </Link>

    <Link
      href={`/liturgia-diaria/ano/${year}`}
      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
    >
      Calendário do ano
    </Link>
  </div>
</header>


          <section className="mb-6">
            <AdsenseInArticle slot={ADS_SLOT_BODY_TOP} />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6">
            <section className="min-w-0">
              {/* HOJE */}
              <section
                id="hoje"
                className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm scroll-mt-24"
              >
                <h2 className="text-xl font-bold">Hoje • {today.dateLabel}</h2>

                <p className="mt-1 text-sm text-slate-600">
                  {today.celebration || ""}
                  {today.color ? ` • Cor litúrgica: ${today.color}` : ""}
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">
                      Primeira leitura
                    </p>
                    <p className="mt-1 text-sm font-bold">{today.primeiraRef || "—"}</p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">Salmo</p>
                    <p className="mt-1 text-sm font-bold">{today.salmoRef || "—"}</p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">
                      Segunda leitura
                    </p>
                    <p className="mt-1 text-sm font-bold">{today.segundaRef || "—"}</p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">
                      Evangelho
                    </p>
                    <p className="mt-1 text-sm font-bold">{today.evangelhoRef || "—"}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/liturgia-diaria/${today.dateSlug}`}
                    className="inline-flex rounded-xl bg-amber-500 text-white px-4 py-2 text-sm font-semibold hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  >
                    Abrir liturgia completa
                  </Link>

                  <Link
                    href="#faq"
                    className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                  >
                    Perguntas frequentes
                  </Link>
                </div>
              </section>

              <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-bold">O que é a Liturgia Diária?</h2>
                <p className="mt-2 text-sm text-slate-600">
                  A Liturgia Diária reúne as leituras bíblicas e os elementos próprios propostos pela Igreja
                  para cada dia do ano. Ela ajuda a acompanhar o caminho da Palavra ao longo do tempo litúrgico,
                  em sintonia com a Missa e a espiritualidade de cada celebração.
                </p>
              </section>

              <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-bold">Calendário por mês</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Selecione um mês para abrir o calendário completo e acessar qualquer dia.
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {months.map((x) => (
                    <Link
                      key={x.href}
                      href={x.href}
                      className="rounded-xl border border-slate-200 p-4 hover:bg-slate-50"
                    >
                      <p className="text-sm font-bold">{x.label}</p>
                      <p className="mt-1 text-xs text-slate-600">Abrir calendário do mês</p>
                    </Link>
                  ))}
                </div>

                <div className="mt-4">
                  <Link
                    href={`/liturgia-diaria/ano/${year}`}
                    className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                  >
                    Ver calendário do ano {year}
                  </Link>
                </div>
              </section>

              <section
                className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                id="faq"
              >
                <h2 className="text-xl font-bold">Perguntas frequentes</h2>

                <div className="mt-4 space-y-4">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <h3 className="font-bold">A Liturgia Diária é oficial?</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Ela segue o calendário litúrgico e o lecionário de cada dia. Aqui apresentamos as referências
                      e a organização do conteúdo para facilitar o acompanhamento e a preparação para a Missa.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <h3 className="font-bold">Como acessar a liturgia de outra data?</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Use o calendário do ano e do mês. Cada dia abre em <strong>/liturgia-diaria/dd-mm-aaaa</strong>.
                    </p>
                  </div>
                </div>
              </section>

              {/* Ads mobile: fica aqui, e o aside NÃO renderiza anúncio no mobile */}
              <div className="mt-6 lg:hidden">
                <AdsenseSidebarMobile300x250 slot={ADS_SLOT_SIDEBAR_MOBILE} />
              </div>
            </section>

            {/* ASIDE: renderiza no desktop com ad 300x250; no mobile sem ad para não duplicar */}
            <aside className="min-w-0">
              {/* Desktop */}
              <div className="hidden lg:block">
                <LiturgiaAside
                  year={year}
                  month={month}
                  todaySlug={today.dateSlug}
                  todayLabel={today.dateLabel}
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

              {/* Mobile */}
              <div className="mt-6 lg:hidden">
                <LiturgiaAside
                  year={year}
                  month={month}
                  todaySlug={today.dateSlug}
                  todayLabel={today.dateLabel}
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
            </aside>
          </div>
        </article>
      </main>
    </>
  );
}
