// app/en/daily-mass-readings/[data]/page.tsx
//
// English day page (parallel to PT) using US date slug pattern MM-DD-YYYY.
// - Route slug format: MM-DD-YYYY (e.g., /en/daily-mass-readings/01-10-2026)
// - Uses “Daily Mass Readings” / “Mass Readings for <date>” for SEO.
// - Translates visible UI strings and meta descriptions contextually.
// - Fetches PT liturgy data but replaces texts with English (NET Bible) when available.

import type { Metadata } from "next";
import Script from "next/script";
import { fetchLiturgiaByDate } from "@/lib/liturgia/api";
import { pad2 } from "@/lib/liturgia/date";
import { AdsenseSidebarMobile300x250 } from "@/components/ads/AdsenseBlocks";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { fetchNetBibleHtml, fetchNetBibleText } from "@/lib/liturgia/bible-en";
import { toReadableHtml } from "@/lib/liturgia/api"; // helper already exists in your codebase
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

function isValidDateParts(y: number, m: number, d: number) {
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return false;
  if (y < 1900 || y > 2100) return false;
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;

  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

/**
 * EN route slug format: MM-DD-YYYY
 * Example: 01-10-2026 (Jan 10, 2026)
 */
function parseSlugDateUS(slug: string): Date | null {
  const s = safeSlug(slug);
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(s);
  if (!m) return null;

  const mm = Number(m[1]);
  const dd = Number(m[2]);
  const yyyy = Number(m[3]);

  if (!isValidDateParts(yyyy, mm, dd)) return null;
  return new Date(yyyy, mm - 1, dd);
}

function slugFromDateUS(dt: Date) {
  return `${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}-${dt.getFullYear()}`;
}

// Para títulos, breadcrumbs, textos humanos (SEO)
function formatUSDateLong(dt: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dt);
}

// Para datas numéricas (slug visível, labels, UI compacta)
function formatUSDate(dt: Date) {
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  const yyyy = dt.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}


function formatSlashDateUS(dt: Date) {
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  const yyyy = dt.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

/**
 * SEO title for the specific day.
 */
function buildTitle(dt: Date) {
  const pretty = formatUSDateLong(dt);
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
 * Builds meta description including reading references (defensive with field names), plus CTA.
 */
function buildRefsDescriptionFromData(data: any) {
  const first =
    data?.primeiraRef ||
    data?.primeiraLeituraRef ||
    data?.primeiraLeitura ||
    null;

  const psalm =
    data?.salmoRef ||
    data?.salmoResponsorialRef ||
    data?.salmo ||
    null;

  const second =
    data?.segundaRef ||
    data?.segundaLeituraRef ||
    data?.segundaLeitura ||
    null;

  const gospel = data?.evangelhoRef || data?.evangelho || null;

  const parts: string[] = [];
  if (first) parts.push(`First Reading: ${first}`);
  if (psalm) parts.push(`Responsorial Psalm: ${psalm}`);
  if (second) parts.push(`Second Reading: ${second}`);
  if (gospel) parts.push(`Gospel: ${gospel}`);

  parts.push("Open and pray with the Daily Mass Readings on IA Tio Ben.");

  return parts.join(" • ");
}

async function buildDataEN(data: any) {
  const [firstHtml, psalmHtml, secondHtml, gospelHtml] = await Promise.all([
    data?.primeiraRef ? fetchNetBibleHtml(data.primeiraRef) : Promise.resolve(null),
    data?.salmoRef ? fetchNetBibleHtml(data.salmoRef) : Promise.resolve(null),
    data?.segundaRef ? fetchNetBibleHtml(data.segundaRef) : Promise.resolve(null),
    data?.evangelhoRef ? fetchNetBibleHtml(data.evangelhoRef) : Promise.resolve(null),
  ]);

  // Texto: pode manter PT (ou, se você quiser, também pode manter EN como texto sem HTML)
  const primeiraTexto = data.primeiraTexto;
  const salmoTexto = data.salmoTexto;
  const segundaTexto = data.segundaTexto;
  const evangelhoTexto = data.evangelhoTexto;

  return {
    ...data,

    // mantêm os campos texto (não muda PT)
    primeiraTexto,
    salmoTexto,
    segundaTexto,
    evangelhoTexto,

    // HTML: se tiver EN, usa ele; se não, cai no PT via toReadableHtml
    primeiraHtml: firstHtml ?? toReadableHtml(primeiraTexto),
    salmoHtml: psalmHtml ?? toReadableHtml(salmoTexto),
    segundaHtml: secondHtml ?? toReadableHtml(segundaTexto),
    evangelhoHtml: gospelHtml ?? toReadableHtml(evangelhoTexto),
  };
}



/**
 * "Today" based on America/Sao_Paulo regardless of server TZ.
 * Returns { yyyy, mm, dd } numeric parts.
 */
function getTodayPartsInSaoPaulo(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const yyyy = Number(parts.find((p) => p.type === "year")?.value);
  const mm = Number(parts.find((p) => p.type === "month")?.value);
  const dd = Number(parts.find((p) => p.type === "day")?.value);

  return { yyyy, mm, dd };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await Promise.resolve(params);
  const slug = safeSlug(resolved.data);

  const dt = slug ? parseSlugDateUS(slug) : null;

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

  // Keep consistent with your current OG route pattern (ensure your OG generator supports US slugs)
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

  const dt = slug ? parseSlugDateUS(slug) : null;

  if (!dt) {
    return (
      <article className="mx-auto max-w-3xl px-4 py-10 bg-white text-slate-900 min-h-screen">
        <h1 className="text-2xl font-bold">Invalid date</h1>
        <p className="mt-2 text-sm text-slate-600">
          Please use the format <span className="font-semibold">mm-dd-yyyy</span>. Example:{" "}
          <span className="font-semibold">/en/daily-mass-readings/01-10-2026</span>
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

  const prevSlug = slugFromDateUS(prev);
  const nextSlug = slugFromDateUS(next);

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

  const prettyDateEN = formatUSDateLong(dt);

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
          text: "Use the /en/daily-mass-readings page and the month/year calendar to open any date at /en/daily-mass-readings/mm-dd-yyyy.",
        },
      },
    ],
  };

  // Today (Sao Paulo time), for the “Today” button in Hub/Aside
  const { yyyy, mm, dd } = getTodayPartsInSaoPaulo(new Date());
  const todaySlug = `${pad2(mm)}-${pad2(dd)}-${yyyy}`; // MM-DD-YYYY
  const todayLabelEN = `${pad2(mm)}/${pad2(dd)}/${yyyy}`; // MM/DD/YYYY

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

        {/* Avoid duplicating canonical if you already set it via metadata.
            If you have a canonical duplication issue, remove this line. */}
        {/* <link rel="canonical" href={canonical} /> */}
      </article>
    </>
  );
}
