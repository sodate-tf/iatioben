// app/en/daily-mass-readings/[data]/page.tsx
//
// English day page (parallel to PT) with culturally natural Catholic English terms.
// - Keeps the slug format dd-mm-yyyy (so your current data fetching works unchanged).
// - Uses “Daily Mass Readings” / “Mass Readings for <date>” for SEO and expectations.
// - Translates all visible UI strings, JSON-LD FAQ, and meta descriptions contextually.
// - Keeps PT URLs intact because this file lives under /en/* only.

import type { Metadata } from "next";
import Script from "next/script";
import { fetchLiturgiaByDate } from "@/lib/liturgia/api";
import { parseSlugDate, slugFromDate, pad2 } from "@/lib/liturgia/date";
import LiturgiaHubPerfect from "@/components/liturgia/LiturgiaHubPerfect";
import LiturgiaAside from "@/components/liturgia/LiturgiaAside";
import { AdsenseSidebarMobile300x250 } from "@/components/ads/AdsenseBlocks";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { fetchNetBibleText } from "@/lib/liturgia/bible-en";
import { toReadableHtml } from "@/lib/liturgia/api"; // você já tem esse helper
import LiturgiaHubPerfectEN from "@/components/liturgia/LiturgiaHubPerfectEN";
import LiturgiaAsideEN from "@/components/liturgia/LiturgiaAsideEN";

export const dynamic = "force-static";
export const revalidate = 86400;

const SITE_URL = "https://www.iatioben.com.br";
const HUB_CANONICAL_PATH = "/en/daily-mass-readings";
const ADS_SLOT_SIDEBAR_DESKTOP = "8534838745";
const ADS_SLOT_SIDEBAR_MOBILE = "1573844576";

type PageParams = { data: string };
type PageProps = { params: Promise<PageParams> | PageParams };

function safeSlug(slug: string) {
  return (slug || "").trim();
}

function formatUSDate(dt: Date) {
  // Human-friendly English label
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(dt);
}

function formatSlashDateUS(dt: Date) {
  // For compact references in titles/descriptions: MM/DD/YYYY
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  const yyyy = dt.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

/**
 * SEO title for the specific day.
 * We avoid literal “Daily Liturgy” and use the term people actually search: “Daily Mass Readings”.
 */
function buildTitle(dt: Date) {
  const pretty = formatUSDate(dt);
  return `Daily Mass Readings — ${pretty}`;
}

/**
 * Short SEO description for the specific day.
 */
function buildDescription(dt: Date) {
  const compact = formatSlashDateUS(dt);
  return `Mass readings for ${compact}: Gospel, readings and responsorial psalm. Browse the calendar and navigate by date, month and year.`;
}

/**
 * Builds meta description including reading references (as requested), plus CTA.
 * Defensive: supports different field names.
 */
function buildRefsDescriptionFromData(data: any) {
  const first =
    data?.primeiraRef || data?.primeiraLeituraRef || data?.primeiraLeitura || null;

  const psalm =
    data?.salmoRef || data?.salmoResponsorialRef || data?.salmo || null;

  const second =
    data?.segundaRef || data?.segundaLeituraRef || data?.segundaLeitura || null;

  const gospel = data?.evangelhoRef || data?.evangelho || null;

  const parts: string[] = [];
  if (first) parts.push(`First Reading: ${first}`);
  if (psalm) parts.push(`Responsorial Psalm: ${psalm}`);
  if (second) parts.push(`Second Reading: ${second}`);
  if (gospel) parts.push(`Gospel: ${gospel}`);

  // CTA at the end (matches your original intent)
  parts.push("Open and pray with the Daily Mass Readings on IA Tio Ben.");

  return parts.join(" • ");
}

async function buildDataEN(data: any) {
  const [firstEn, psalmEn, secondEn, gospelEn] = await Promise.all([
    data?.primeiraRef ? fetchNetBibleText(data.primeiraRef) : Promise.resolve(null),
    data?.salmoRef ? fetchNetBibleText(data.salmoRef) : Promise.resolve(null),
    data?.segundaRef ? fetchNetBibleText(data.segundaRef) : Promise.resolve(null),
    data?.evangelhoRef ? fetchNetBibleText(data.evangelhoRef) : Promise.resolve(null),
  ]);

  const primeiraTexto = firstEn ?? data.primeiraTexto;
  const salmoTexto = psalmEn ?? data.salmoTexto;
  const segundaTexto = secondEn ?? data.segundaTexto;
  const evangelhoTexto = gospelEn ?? data.evangelhoTexto;

  return {
    ...data,
    // sobrescreve os textos que o Hub lê
    primeiraTexto,
    salmoTexto,
    segundaTexto,
    evangelhoTexto,

    // gera html para o mesmo renderer
    primeiraHtml: toReadableHtml(primeiraTexto),
    salmoHtml: toReadableHtml(salmoTexto),
    segundaHtml: toReadableHtml(segundaTexto),
    evangelhoHtml: toReadableHtml(evangelhoTexto),
  };
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await Promise.resolve(params);
  const slug = safeSlug(resolved.data);

  const dt = slug ? parseSlugDate(slug) : null;

  // Fallback: invalid route (do not index)
  if (!dt) {
    const canonical = `${SITE_URL}${HUB_CANONICAL_PATH}`;

    const title = "Daily Mass Readings — IA Tio Ben";
    const description =
      "Gospel, readings and responsorial psalm of the day. Open and pray with the Daily Mass Readings on IA Tio Ben.";

    const ogImage = `${SITE_URL}/og/liturgia.png`;

    return {
      title,
      description,
      robots: { index: false, follow: false },
      alternates: { canonical },

      openGraph: {
        type: "website",
        url: canonical,
        siteName: "IA Tio Ben",
        locale: "en_US",
        title,
        description,
        images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
    };
  }

  const day = dt.getDate();
  const month = dt.getMonth() + 1;
  const year = dt.getFullYear();

  const title = buildTitle(dt);

  let description =
    "Gospel, readings and responsorial psalm of the day. Open and pray with the Daily Mass Readings on IA Tio Ben.";

  try {
    const data = await fetchLiturgiaByDate(day, month, year);
    const dataEN = await buildDataEN(data);
     description = buildRefsDescriptionFromData(dataEN);
  } catch {
    // keep fallback
  }

  const canonical = `${SITE_URL}${HUB_CANONICAL_PATH}/${slug}`;

  // Your current OG route uses the same image path pattern; keep it consistent.
  const ogImage = `${SITE_URL}/og/liturgia/${slug}.png`;

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
      locale: "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function DailyMassReadingsDayPage({ params }: PageProps) {
  const resolved = await Promise.resolve(params);
  const slug = safeSlug(resolved.data);

  const dt = slug ? parseSlugDate(slug) : null;
  if (!dt) {
    return (
      <article className="mx-auto max-w-3xl px-4 py-10 bg-white text-slate-900 min-h-screen">
        <h1 className="text-2xl font-bold">Invalid date</h1>
        <p className="mt-2 text-sm text-slate-600">
          Please use the format <span className="font-semibold">dd-mm-yyyy</span>. Example:{" "}
          <span className="font-semibold">/en/daily-mass-readings/05-01-2026</span>
        </p>
        <div className="mt-4">
          <a
            href="/en/daily-mass-readings"
            className="inline-flex rounded-xl bg-amber-500 text-white px-4 py-2 text-sm font-semibold hover:bg-amber-600"
          >
            Back to Daily Mass Readings
          </a>
        </div>
      </article>
    );
  }

  const day = dt.getDate();
  const month = dt.getMonth() + 1;
  const year = dt.getFullYear();

  const dataPT = await fetchLiturgiaByDate(day, month, year);
  const dataEN = await buildDataEN(dataPT);

  const prev = new Date(year, month - 1, day - 1);
  const next = new Date(year, month - 1, day + 1);

  const prevSlug = slugFromDate(prev);
  const nextSlug = slugFromDate(next);

  const canonical = `${SITE_URL}${HUB_CANONICAL_PATH}/${slug}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "IA Tio Ben", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Daily Mass Readings",
        item: `${SITE_URL}${HUB_CANONICAL_PATH}`,
      },
      { "@type": "ListItem", position: 3, name: dataEN.dateLabel, item: canonical },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: buildTitle(dt),
    description: buildDescription(dt),
    mainEntityOfPage: canonical,
    datePublished: `${dataEN.dateISO}T06:00:00-03:00`,
    dateModified: `${dataEN.dateISO}T06:00:00-03:00`,
    author: { "@type": "Organization", name: "IA Tio Ben" },
    publisher: { "@type": "Organization", name: "IA Tio Ben" },
  };

  const prettyDateEN = formatUSDate(dt);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Where can I find the full Mass readings for ${prettyDateEN}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `On this page you’ll find the Mass readings for ${prettyDateEN}, including the First Reading, Responsorial Psalm, Gospel and, when applicable, the Second Reading.`,
        },
      },
      {
        "@type": "Question",
        name: "What usually appears in the Daily Mass Readings?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Typically: First Reading, Responsorial Psalm, Gospel—and when applicable, the Second Reading and antiphons.",
        },
      },
      {
        "@type": "Question",
        name: "How do I access the readings for another date?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use the /en/daily-mass-readings page and the month/year calendar to open any date at /en/daily-mass-readings/dd-mm-yyyy.",
        },
      },
    ],
  };

  // Keep as-is (server time) to match your current behavior
  const today = new Date();
  const todaySlug = `${pad2(today.getDate())}-${pad2(today.getMonth() + 1)}-${today.getFullYear()}`;
  const todayLabelEN = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(today);

  return (
    <>
      <Script
        id="jsonld-breadcrumb-dmr-day"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="jsonld-article-dmr-day"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Script
        id="jsonld-faq-dmr-day"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <article className="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6 py-6 bg-white text-slate-900 leading-relaxed min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6">
          <main className="min-w-0">
  <div className="mb-4 flex items-start justify-end">
    <LanguageSwitcher />
  </div>

<LiturgiaHubPerfectEN
  siteUrl={SITE_URL}
  hubCanonicalPath={`${HUB_CANONICAL_PATH}/${slug}`}
  dateSlug={slug}
  data={dataEN}
  prevSlug={prevSlug}
  nextSlug={nextSlug}
  todaySlug={todaySlug}
  todayLabel={todayLabelEN}
  className="max-w-none px-0 py-0"
/>

  {/* Mobile ad (only here, to avoid duplication with the aside) */}
  <div className="mt-6 lg:hidden">
    <AdsenseSidebarMobile300x250 slot={ADS_SLOT_SIDEBAR_MOBILE} />
  </div>
</main>


          {/* ASIDE: desktop only */}
          <div className="hidden lg:block">
            <LiturgiaAsideEN
              year={year}
              month={month}
              todaySlug={todaySlug}
              todayLabel={todayLabelEN}
              prevSlug={prevSlug}
              nextSlug={nextSlug}
              adsSlotDesktop300x250={ADS_SLOT_SIDEBAR_DESKTOP}
              blogLinks={[
                {
                  href: "/liturgia/ano-liturgico",
                  title: "Liturgical Year: seasons, colors and calendar",
                  desc: "Understand what changes throughout the year and how to follow it.",
                },
                {
                  href: "/liturgia/leituras-da-missa",
                  title: "A guide to the Mass readings",
                  desc: "First Reading, Psalm, Gospel—and how to follow them.",
                },
                {
                  href: "/liturgia/como-usar-a-liturgia",
                  title: "How to use the liturgy day by day",
                  desc: "A simple method to pray and prepare for Mass.",
                },
              ]}
            />
          </div>

          {/* ASIDE (mobile): no ad */}
          <div className="mt-6 lg:hidden">
            <LiturgiaAsideEN
              year={year}
              month={month}
              todaySlug={todaySlug}
              todayLabel={todayLabelEN}
              prevSlug={prevSlug}
              nextSlug={nextSlug}
              blogLinks={[
                {
                  href: "/liturgia/ano-liturgico",
                  title: "Liturgical Year: seasons, colors and calendar",
                  desc: "Understand what changes throughout the year and how to follow it.",
                },
                {
                  href: "/liturgia/leituras-da-missa",
                  title: "A guide to the Mass readings",
                  desc: "First Reading, Psalm, Gospel—and how to follow them.",
                },
                {
                  href: "/liturgia/como-usar-a-liturgia",
                  title: "How to use the liturgy day by day",
                  desc: "A simple method to pray and prepare for Mass.",
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
