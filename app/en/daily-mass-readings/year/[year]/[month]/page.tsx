// app/en/daily-mass-readings/year/[year]/[month]/page.tsx
//
// English monthly calendar page.
// - EN slugs: MM-DD-YYYY (matches your corrected EN day page).
// - English month labels and weekday headers.
// - Internal linking (prev/next month, today, year hub, and crawlable day list).
// - Uses LiturgiaAsideEN.
//
// IMPORTANT: This page now links to EN day pages using MM-DD-YYYY.
// Example day URL: /en/daily-mass-readings/01-10-2026 (Jan 10, 2026)

import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { daysInMonth, pad2 } from "@/lib/liturgia/date";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import LiturgiaAsideEN from "@/components/liturgia/LiturgiaAsideEN";

export const dynamic = "force-static";
export const revalidate = 86400; // keep "Today" updated

const SITE_URL = "https://www.iatioben.com.br";

type RouteParams = { year: string; month: string };
type ParamsInput = RouteParams | Promise<RouteParams>;

/* =========================
   SAFE PARAMS
   ========================= */
async function resolveParams(params: ParamsInput): Promise<RouteParams> {
  return await params;
}

function parseYearMonth(p: RouteParams) {
  const year = Number(p.year);
  const month = Number(p.month);

  if (!Number.isFinite(year) || !Number.isFinite(month)) return null;
  if (!Number.isInteger(year) || !Number.isInteger(month)) return null;
  if (month < 1 || month > 12) return null;
  if (year < 1900 || year > 2100) return null;

  return { year, month };
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
  const ym = parseYearMonth(raw);
  if (!ym) return {};

  const { year, month } = ym;

  const monthName = monthLabelEN(year, month);

  const title = `Daily Mass Readings for ${monthName} – Readings, Psalm and Gospel`;
  const description =
    `Monthly calendar for the Daily Mass Readings in ${monthName}. ` +
    `Access the Mass readings, responsorial psalm and Gospel for each day.`;

  const canonicalPath = `/en/daily-mass-readings/year/${year}/${pad2(month)}`;
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
          alt: `Daily Mass Readings – ${monthName} – IA Tio Ben`,
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
   HELPERS
   ========================= */
function getPrevMonth(year: number, month: number) {
  return month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
}

function getNextMonth(year: number, month: number) {
  return month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };
}

function weekdayIndexMondayFirst(date: Date) {
  return (date.getDay() + 6) % 7; // Mon=0..Sun=6
}

/**
 * EN day slugs: MM-DD-YYYY
 */
function slugFromDateUS(d: Date) {
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  const yyyy = d.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
}

/**
 * EN label: MM/DD/YYYY from US slug
 */
function labelFromSlugUS(slug: string) {
  const [mm, dd, yyyy] = slug.split("-");
  if (!mm || !dd || !yyyy) return slug.replaceAll("-", "/");
  return `${mm}/${dd}/${yyyy}`;
}

/**
 * Today in Sao Paulo time (stable regardless of server TZ)
 */
function getTodayInSaoPaulo(): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const y = Number(parts.find((p) => p.type === "year")?.value);
  const m = Number(parts.find((p) => p.type === "month")?.value);
  const d = Number(parts.find((p) => p.type === "day")?.value);

  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return new Date();
  return new Date(y, m - 1, d);
}

function isSameYMD(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/* =========================
   PAGE
   ========================= */
export default async function DailyMassReadingsMonthPage({
  params,
}: {
  params: ParamsInput;
}) {
  const raw = await resolveParams(params);
  const ym = parseYearMonth(raw);
  if (!ym) notFound();

  const { year, month } = ym;

  const totalDays = daysInMonth(year, month);
  const monthName = monthLabelEN(year, month);

  // Day links (IMPORTANT: point to EN day pages with MM-DD-YYYY)
  const days = Array.from({ length: totalDays }, (_, i) => {
    const day = i + 1;
    const slug = `${pad2(month)}-${pad2(day)}-${year}`; // MM-DD-YYYY
    return { day, slug, href: `/en/daily-mass-readings/${slug}` };
  });

  // Calendar grid
  const firstDate = new Date(year, month - 1, 1);
  const startOffset = weekdayIndexMondayFirst(firstDate);

  const cells: Array<null | { day: number; slug: string; href: string }> = [
    ...Array.from({ length: startOffset }, () => null),
    ...days,
  ];

  const remainder = cells.length % 7;
  if (remainder !== 0) {
    cells.push(...Array.from({ length: 7 - remainder }, () => null));
  }

  const prevMonth = getPrevMonth(year, month);
  const nextMonth = getNextMonth(year, month);

  // Aside props
  const today = getTodayInSaoPaulo();
  const todaySlug = slugFromDateUS(today);
  const todayLabel = labelFromSlugUS(todaySlug);

  const isMonthOfToday = today.getFullYear() === year && today.getMonth() + 1 === month;
  const baseDate = isMonthOfToday ? today : new Date(year, month - 1, 1);

  const prevDate = new Date(baseDate);
  prevDate.setDate(baseDate.getDate() - 1);

  const nextDate = new Date(baseDate);
  nextDate.setDate(baseDate.getDate() + 1);

  const prevSlug = slugFromDateUS(prevDate);
  const nextSlug = slugFromDateUS(nextDate);

  // Weekday headers (Mon-first)
  const dow = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const yearHref = `/en/daily-mass-readings/year/${year}`;
  const ADS_SLOT_ASIDE_300x250 = "8534838745";

  return (
    <main className="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
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
              <li>
                <Link href={yearHref} className="hover:underline">
                  {year}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-900 font-semibold">{monthName}</li>
            </ol>
          </nav>

          <header className="mb-6">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                Daily Mass Readings Calendar for {monthName}
              </h1>

              <div className="shrink-0">
                <LanguageSwitcher />
              </div>
            </div>

            <p className="mt-2 text-sm text-gray-700 max-w-3xl">
              Browse the <strong>Daily Mass Readings</strong> for any date in{" "}
              <strong>{monthName}</strong>. Each day includes the <strong>Mass readings</strong>, the{" "}
              <strong>responsorial psalm</strong>, and the <strong>Gospel of the day</strong>, organized for
              study, prayer and preparation for Mass.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Link
                href={`/en/daily-mass-readings/year/${prevMonth.year}/${pad2(prevMonth.month)}`}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                ← {monthLabelEN(prevMonth.year, prevMonth.month)}
              </Link>

              <Link
                href={`/en/daily-mass-readings/year/${nextMonth.year}/${pad2(nextMonth.month)}`}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                {monthLabelEN(nextMonth.year, nextMonth.month)} →
              </Link>

              <Link
                href={`/en/daily-mass-readings/${todaySlug}`}
                className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold hover:bg-amber-100 text-amber-900"
              >
                Today’s readings ({todayLabel})
              </Link>
            </div>
          </header>

          {/* Visual calendar */}
          <section
            aria-label={`Monthly calendar for ${monthName}`}
            className="rounded-2xl border border-gray-200 overflow-hidden bg-white"
          >
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
              {dow.map((x) => (
                <div key={x} className="px-3 py-2 text-xs font-semibold text-gray-700">
                  {x}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {cells.map((cell, idx) => {
                if (!cell) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="h-20 sm:h-24 border-b border-gray-100 border-r border-gray-100"
                    />
                  );
                }

                const cellDate = new Date(year, month - 1, cell.day);
                const isToday = isSameYMD(cellDate, today);

                return (
                  <Link
                    key={cell.slug}
                    href={cell.href}
                    className={[
                      "h-20 sm:h-24 border-b border-gray-100 border-r border-gray-100 bg-white",
                      "p-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300",
                      "flex flex-col justify-between",
                      isToday ? "ring-1 ring-amber-300 bg-amber-50/40" : "",
                    ].join(" ")}
                    aria-label={`Open the Mass readings for ${pad2(month)}/${pad2(cell.day)}/${year}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-extrabold text-gray-900">{cell.day}</span>
                      {isToday ? (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                          Today
                        </span>
                      ) : null}
                    </div>

                    <time
                      className="text-[11px] text-gray-500"
                      dateTime={`${year}-${pad2(month)}-${pad2(cell.day)}`}
                    >
                      {pad2(month)}/{year}
                    </time>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* SEO day list (crawl) */}
          <section className="mt-10">
            <h2 className="text-xl font-extrabold tracking-tight text-gray-900">
              Daily Mass Readings for each day in {monthName}
            </h2>
            <p className="mt-2 text-sm text-gray-700 max-w-3xl">
              Direct links for each date. Every page includes the complete readings, psalm and Gospel.
            </p>

            <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {days.map((x) => (
                <li key={`list-${x.slug}`}>
                  <Link
                    href={x.href}
                    className="block rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold hover:bg-gray-50"
                  >
                    {pad2(month)}/{pad2(x.day)}/{year}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-2">
              <Link
                href={yearHref}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                View the {year} yearly calendar
              </Link>
              <Link
                href="/en/daily-mass-readings"
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                Back
              </Link>
            </div>
          </section>
        </article>

        {/* ASIDE (desktop) */}
        <aside className="hidden lg:block">
          <LiturgiaAsideEN
            year={year}
            month={month}
            todaySlug={todaySlug}
            todayLabel={todayLabel}
            prevSlug={prevSlug}
            nextSlug={nextSlug}
            adsSlotDesktop300x250={ADS_SLOT_ASIDE_300x250}
          />
        </aside>
      </div>

      {/* ASIDE (mobile): no adsSlotDesktop300x250 to avoid duplicated ads */}
      <div className="mt-8 lg:hidden">
        <LiturgiaAsideEN
          year={year}
          month={month}
          todaySlug={todaySlug}
          todayLabel={todayLabel}
          prevSlug={prevSlug}
          nextSlug={nextSlug}
        />
      </div>
    </main>
  );
}
