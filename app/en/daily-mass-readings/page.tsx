// app/en/daily-mass-readings/page.tsx
//
// English hub page (under /en/*)
// Notes:
// - Uses “Daily Mass Readings” for SEO/user expectation.
// - EN day slugs are US-style: MM-DD-YYYY (consistent with your corrected EN day page).
// - Visible dates are formatted in English (en-US).

import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";
import { fetchLiturgiaByDate, LiturgiaNormalized } from "@/lib/liturgia/api";
import { pad2 } from "@/lib/liturgia/date";
import AutoScrollTo from "@/components/liturgia/AutoScrollTo";
import {
  AdsenseInArticle,
  AdsenseSidebarMobile300x250,
} from "@/components/ads/AdsenseBlocks";
import LiturgiaAsideEN from "@/components/liturgia/LiturgiaAsideEN";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";

const SITE_URL = "https://www.iatioben.com.br";
const HUB_PATH = "/en/daily-mass-readings";
const CANONICAL_URL = `${SITE_URL}${HUB_PATH}`;

const ADS_SLOT_BODY_TOP = "7474884427";
const ADS_SLOT_SIDEBAR_DESKTOP = "8534838745";
const ADS_SLOT_SIDEBAR_MOBILE = "1573844576";

export const dynamic = "force-static";
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Daily Mass Readings – Gospel, Readings & Psalm of the Day",
  description:
    "Follow the Daily Mass Readings with the Gospel, readings and responsorial psalm. Pray, reflect, and browse any date using the monthly and yearly calendar.",

  alternates: { canonical: CANONICAL_URL },

  openGraph: {
    type: "website",
    url: CANONICAL_URL,
    siteName: "IA Tio Ben",
    locale: "en_US",

    title: "Daily Mass Readings – Pray with the Word every day",

    description:
      "Gospel, readings and psalm of the day—organized for prayer and reflection. Open today’s liturgy and browse the complete calendar.",

    images: [
      {
        url: `${SITE_URL}/og/liturgia.png`,
        width: 1200,
        height: 630,
        alt: "Daily Mass Readings – IA Tio Ben",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Daily Mass Readings – Pray with the Word every day",

    description:
      "Gospel, readings and the psalm of the day to pray and reflect. Access the complete Daily Mass Readings on IA Tio Ben.",

    images: [`${SITE_URL}/og/liturgia.png`],
  },
};

/* =========================
   HELPERS
   ========================= */

/**
 * EN day slugs: MM-DD-YYYY
 */
function buildSlugUS(mm: number, dd: number, yyyy: number) {
  const m = String(mm).padStart(2, "0");
  const d = String(dd).padStart(2, "0");
  return `${m}-${d}-${yyyy}`;
}

function getTodayInSaoPauloParts() {
  const parts = new Intl.DateTimeFormat("en-US", {
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

function formatDateLabelEN(year: number, month: number, day: number) {
  const dt = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(dt);
}

function monthLabelEN(year: number, month: number) {
  const dt = new Date(Date.UTC(year, month - 1, 1));
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    month: "long",
    year: "numeric",
  }).format(dt);
}

/* =========================
   PAGE
   ========================= */
export default async function DailyMassReadingsHubPage() {
  const { year, month, day } = getTodayInSaoPauloParts();

  const today: LiturgiaNormalized = await fetchLiturgiaByDate(day, month, year);

  // Ensure EN day links use the US slug, independent of today.dateSlug (PT dd-mm-yyyy)
  const todaySlugUS = buildSlugUS(month, day, year);

  const base = new Date(year, month - 1, day);
  const prev = new Date(base);
  prev.setDate(base.getDate() - 1);
  const next = new Date(base);
  next.setDate(base.getDate() + 1);

  const prevSlug = buildSlugUS(prev.getMonth() + 1, prev.getDate(), prev.getFullYear());
  const nextSlug = buildSlugUS(next.getMonth() + 1, next.getDate(), next.getFullYear());

  const todayLabelEN = formatDateLabelEN(year, month, day);

  const months = Array.from({ length: 12 }, (_, i) => i + 1).map((m) => ({
    label: monthLabelEN(year, m),
    href: `/en/daily-mass-readings/year/${year}/${pad2(m)}`,
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
        name: "Where can I read today’s Mass readings?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "In the “Today” section, you’ll find the references for the day and can open the full page with the readings, responsorial psalm and Gospel.",
        },
      },
      {
        "@type": "Question",
        name: "What is included in the Daily Mass Readings?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "It typically includes the First Reading, Responsorial Psalm and the Gospel of the day—and when applicable, the Second Reading—along with details proper to the day’s celebration.",
        },
      },
      {
        "@type": "Question",
        name: "How do I access the readings for another date?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Use the yearly and monthly calendar. Each day has its own URL in the format /en/daily-mass-readings/mm-dd-yyyy.",
        },
      },
    ],
  };

  const hubJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Daily Mass Readings",
    description: "Gospel, readings and responsorial psalm of the day, with monthly and yearly calendar.",
    url: CANONICAL_URL,
    isPartOf: { "@type": "WebSite", name: "IA Tio Ben", url: SITE_URL },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "IA Tio Ben", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Daily Mass Readings", item: CANONICAL_URL },
    ],
  };

  return (
    <>
      <Script
        id="jsonld-dmr-hub"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hubJsonLd) }}
      />
      <Script
        id="jsonld-dmr-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="jsonld-dmr-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <AutoScrollTo targetId="today" desktopHeaderPx={80} extraOffsetPx={12} behavior="smooth" />

      <main className="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6 py-6 bg-white text-slate-900 leading-relaxed min-h-screen">
        <article className="min-w-0">
          <header className="mb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-wide text-amber-700 uppercase">
                  IA Tio Ben • Liturgy
                </p>

                <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Daily Mass Readings – Gospel, Readings &amp; Psalm of the Day
                </h1>
              </div>

              <div className="shrink-0">
                <LanguageSwitcher />
              </div>
            </div>

            <p className="mt-3 text-base text-slate-600 max-w-3xl">
              Here you’ll find the <strong>Daily Mass Readings</strong> for each day of the year, including the{" "}
              <strong>Mass readings</strong>, <strong>responsorial psalm</strong>, and the{" "}
              <strong>Gospel of the day</strong>. Use the monthly and yearly calendars to browse any date and
              prepare your prayer and participation at Mass.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/en/daily-mass-readings/${todaySlugUS}`}
                className="rounded-xl bg-amber-500 text-white px-4 py-2 text-sm font-semibold hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                Today’s Mass Readings • {todayLabelEN}
              </Link>

              <Link
                href={`/en/daily-mass-readings/${prevSlug}`}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                Yesterday
              </Link>

              <Link
                href={`/en/daily-mass-readings/${nextSlug}`}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                Tomorrow
              </Link>

              <Link
                href={`/en/daily-mass-readings/year/${year}`}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                Yearly calendar
              </Link>
            </div>
          </header>

          <section className="mb-6">
            <AdsenseInArticle slot={ADS_SLOT_BODY_TOP} />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6">
            <section className="min-w-0">
              {/* TODAY */}
              <section
                id="today"
                className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm scroll-mt-24"
              >
                <h2 className="text-xl font-bold">Today • {todayLabelEN}</h2>

                <p className="mt-1 text-sm text-slate-600">
                  {today.celebration || ""}
                  {today.color ? ` • Liturgical color: ${today.color}` : ""}
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">First Reading</p>
                    <p className="mt-1 text-sm font-bold">{today.primeiraRef || "—"}</p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">Responsorial Psalm</p>
                    <p className="mt-1 text-sm font-bold">{today.salmoRef || "—"}</p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">Second Reading</p>
                    <p className="mt-1 text-sm font-bold">{today.segundaRef || "—"}</p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">Gospel</p>
                    <p className="mt-1 text-sm font-bold">{today.evangelhoRef || "—"}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/en/daily-mass-readings/${todaySlugUS}`}
                    className="inline-flex rounded-xl bg-amber-500 text-white px-4 py-2 text-sm font-semibold hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  >
                    Open full readings
                  </Link>

                  <Link
                    href="#faq"
                    className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                  >
                    Frequently asked questions
                  </Link>
                </div>
              </section>

              <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-bold">What are the Daily Mass Readings?</h2>
                <p className="mt-2 text-sm text-slate-600">
                  The Daily Mass Readings gather the Scripture readings and the elements proposed by the Church
                  for each day of the year. They help you follow the journey of the Word throughout the liturgical
                  year, in communion with the Mass and the spirituality of each celebration.
                </p>
              </section>

              <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-bold">Browse by month</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Select a month to open the full calendar and access any day.
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {months.map((x) => (
                    <Link
                      key={x.href}
                      href={x.href}
                      className="rounded-xl border border-slate-200 p-4 hover:bg-slate-50"
                    >
                      <p className="text-sm font-bold">{x.label}</p>
                      <p className="mt-1 text-xs text-slate-600">Open monthly calendar</p>
                    </Link>
                  ))}
                </div>

                <div className="mt-4">
                  <Link
                    href={`/en/daily-mass-readings/year/${year}`}
                    className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                  >
                    View the {year} yearly calendar
                  </Link>
                </div>
              </section>

              <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" id="faq">
                <h2 className="text-xl font-bold">Frequently asked questions</h2>

                <div className="mt-4 space-y-4">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <h3 className="font-bold">Are the Daily Mass Readings official?</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      They follow the liturgical calendar and the lectionary assigned for each day. Here we present
                      the references and an organized layout to make it easier to follow and prepare for Mass.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <h3 className="font-bold">How do I access the readings for another date?</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Use the yearly and monthly calendar. Each day opens at{" "}
                      <strong>/en/daily-mass-readings/mm-dd-yyyy</strong>.
                    </p>
                  </div>
                </div>
              </section>

              {/* Ads mobile: keep here, and the aside should NOT render an ad on mobile to avoid duplication */}
              <div className="mt-6 lg:hidden">
                <AdsenseSidebarMobile300x250 slot={ADS_SLOT_SIDEBAR_MOBILE} />
              </div>
            </section>

            {/* ASIDE: desktop with 300x250 ad; mobile without ad to avoid duplication */}
            <aside className="min-w-0">
              {/* Desktop */}
              <div className="hidden lg:block">
                <LiturgiaAsideEN
                  year={year}
                  month={month}
                  todaySlug={todaySlugUS}
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

              {/* Mobile */}
              <div className="mt-6 lg:hidden">
                <LiturgiaAsideEN
                  year={year}
                  month={month}
                  todaySlug={todaySlugUS}
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
            </aside>
          </div>
        </article>
      </main>
    </>
  );
}
