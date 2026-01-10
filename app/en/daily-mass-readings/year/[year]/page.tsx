// app/en/daily-mass-readings/year/[year]/page.tsx
//
// English year hub (EN slugs align with US pattern used by EN day pages).
// - Uses “Daily Mass Readings” as the standard term.
// - Strong internal linking (prev/next year + months grid + crawlable list).
// - Month routing stays: /en/daily-mass-readings/year/YYYY/MM
// - Month labels in English (America/Sao_Paulo for consistency).

import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pad2 } from "@/lib/liturgia/date";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";

export const dynamic = "force-static";
export const revalidate = 86400;

const SITE_URL = "https://www.iatioben.com.br";

type RouteParams = { year: string };
type ParamsInput = RouteParams | Promise<RouteParams>;

async function resolveParams(params: ParamsInput): Promise<RouteParams> {
  return await params;
}

function parseYear(p: RouteParams) {
  const yyyy = Number(p.year);
  if (!Number.isFinite(yyyy) || !Number.isInteger(yyyy)) return null;
  if (yyyy < 1900 || yyyy > 2100) return null;
  return yyyy;
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
   SEO METADATA
   ========================= */
export async function generateMetadata({
  params,
}: {
  params: ParamsInput;
}): Promise<Metadata> {
  const raw = await resolveParams(params);
  const year = parseYear(raw);
  if (!year) return {};

  const title = `Daily Mass Readings – ${year} Calendar (readings, psalm and Gospel)`;
  const description =
    `Yearly calendar for the Daily Mass Readings in ${year}. ` +
    `Choose a month to access the Mass readings, responsorial psalm and Gospel for each day.`;

  const canonicalPath = `/en/daily-mass-readings/year/${year}`;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  const ogImage = `${SITE_URL}/og/liturgia.png`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },

    openGraph: {
      type: "website",
      url: canonicalUrl,
      title,
      description,
      siteName: "IA Tio Ben",
      locale: "en_US",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `Daily Mass Readings ${year} – IA Tio Ben`,
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

/* =========================
   PAGE
   ========================= */
export default async function DailyMassReadingsYearPage({
  params,
}: {
  params: ParamsInput;
}) {
  const raw = await resolveParams(params);
  const year = parseYear(raw);
  if (!year) notFound();

  const months = Array.from({ length: 12 }, (_, i) => i + 1).map((m) => ({
    m,
    href: `/en/daily-mass-readings/year/${year}/${pad2(m)}`,
    label: monthLabelEN(year, m),
  }));

  const prevYear = year - 1;
  const nextYear = year + 1;

  return (
    <main className="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6 py-6">
      <article className="min-w-0">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-600">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/en/daily-mass-readings" className="hover:underline">
                Daily Mass Readings
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900 font-semibold">{year}</li>
          </ol>
        </nav>

        <header className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Daily Mass Readings Calendar – {year}
            </h1>

            <div className="shrink-0">
              <LanguageSwitcher />
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-700 max-w-3xl">
            This is the yearly <strong>Daily Mass Readings</strong> calendar for <strong>{year}</strong>.
            Choose a month to access the full readings for each day, including the{" "}
            <strong>Mass readings</strong>, <strong>responsorial psalm</strong>, and the{" "}
            <strong>Gospel of the day</strong>. It’s ideal for following the liturgical year, preparing for
            Mass, and deepening your prayer with Scripture.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/en/daily-mass-readings/year/${prevYear}`}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              ← {prevYear}
            </Link>

            <Link
              href={`/en/daily-mass-readings/year/${nextYear}`}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              {nextYear} →
            </Link>

            <Link
              href="/en/daily-mass-readings"
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              Back to Daily Mass Readings
            </Link>
          </div>
        </header>

        {/* Months grid */}
        <section aria-label={`Months of ${year}`}>
          <h2 className="sr-only">Choose a month</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {months.map((x) => (
              <Link
                key={x.m}
                href={x.href}
                className="rounded-2xl border border-gray-200 bg-white p-4 hover:bg-gray-50 transition"
                aria-label={`Open the ${x.label} calendar`}
              >
                <p className="text-sm font-extrabold text-gray-900">{x.label}</p>
                <p className="mt-1 text-xs text-gray-700">
                  Open the monthly calendar and access any day
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO reinforcement: crawl-friendly list */}
        <section className="mt-10">
          <h2 className="text-xl font-extrabold tracking-tight text-gray-900">Months in {year}</h2>
          <p className="mt-2 text-sm text-gray-700 max-w-3xl">
            Direct links to each monthly calendar. Every month leads to a full calendar with access to the
            Mass readings for each day.
          </p>

          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {months.map((x) => (
              <li key={`list-${x.m}`}>
                <Link
                  href={x.href}
                  className="block rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold hover:bg-gray-50"
                >
                  {x.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}
