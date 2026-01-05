// app/liturgia-diaria/ano/[ano]/[mes]/page.tsx

import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { daysInMonth, monthLabelPT, pad2 } from "@/lib/liturgia/date";
import LiturgiaAside from "@/components/liturgia/LiturgiaAside";

export const dynamic = "force-static";
export const revalidate = 86400; // recomendado (mantém "Hoje" atualizado)

const SITE_URL = "https://www.iatioben.com.br";

type RouteParams = { ano: string; mes: string };
type ParamsInput = RouteParams | Promise<RouteParams>;

/* =========================
   SAFE PARAMS
   ========================= */
async function resolveParams(params: ParamsInput): Promise<RouteParams> {
  return await params;
}

function parseYearMonth(p: RouteParams) {
  const year = Number(p.ano);
  const month = Number(p.mes);

  if (!Number.isFinite(year) || !Number.isFinite(month)) return null;
  if (!Number.isInteger(year) || !Number.isInteger(month)) return null;
  if (month < 1 || month > 12) return null;
  if (year < 1900 || year > 2100) return null;

  return { year, month };
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

  const monthName = monthLabelPT(year, month);
  const title = `Liturgia diária de ${monthName} – Leituras, Salmo e Evangelho do dia`;
  const description =
    `Calendário mensal da Liturgia Diária de ${monthName}. ` +
    `Acesse leituras da Missa, salmo responsorial e evangelho completos de cada dia.`;

  const canonicalPath = `/liturgia-diaria/ano/${year}/${pad2(month)}`;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

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
      locale: "pt_BR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/* =========================
   HELPERS
   ========================= */
function getPrevMonth(year: number, month: number) {
  return month === 1
    ? { year: year - 1, month: 12 }
    : { year, month: month - 1 };
}

function getNextMonth(year: number, month: number) {
  return month === 12
    ? { year: year + 1, month: 1 }
    : { year, month: month + 1 };
}

function weekdayIndexMondayFirst(date: Date) {
  return (date.getDay() + 6) % 7; // seg=0..dom=6
}

function slugFromDate(d: Date) {
  const dd = pad2(d.getDate());
  const mm = pad2(d.getMonth() + 1);
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function labelFromSlug(slug: string) {
  return slug.replaceAll("-", "/");
}

function getTodayInSaoPaulo(): Date {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const y = Number(parts.find((p) => p.type === "year")?.value);
  const m = Number(parts.find((p) => p.type === "month")?.value);
  const d = Number(parts.find((p) => p.type === "day")?.value);

  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) {
    return new Date();
  }

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
export default async function LiturgiaMesPage({
  params,
}: {
  params: ParamsInput;
}) {
  const raw = await resolveParams(params);
  const ym = parseYearMonth(raw);
  if (!ym) notFound();

  const { year, month } = ym;

  const totalDays = daysInMonth(year, month);
  const monthName = monthLabelPT(year, month);

  const days = Array.from({ length: totalDays }, (_, i) => {
    const day = i + 1;
    const slug = `${pad2(day)}-${pad2(month)}-${year}`;
    return { day, slug, href: `/liturgia-diaria/${slug}` };
  });

  // Grid do calendário
  const firstDate = new Date(year, month - 1, 1);
  const startOffset = weekdayIndexMondayFirst(firstDate);

  const cells: Array<null | { day: number; slug: string; href: string }> = [
    ...Array.from({ length: startOffset }, () => null),
    ...days,
  ];

  const remainder = cells.length % 7;
  if (remainder !== 0) cells.push(...Array.from({ length: 7 - remainder }, () => null));

  const prevMonth = getPrevMonth(year, month);
  const nextMonth = getNextMonth(year, month);

  // Aside props
  const today = getTodayInSaoPaulo();
  const todaySlug = slugFromDate(today);
  const todayLabel = labelFromSlug(todaySlug);

  const isMonthOfToday =
    today.getFullYear() === year && today.getMonth() + 1 === month;

  const baseDate = isMonthOfToday ? today : new Date(year, month - 1, 1);

  const prevDate = new Date(baseDate);
  prevDate.setDate(baseDate.getDate() - 1);

  const nextDate = new Date(baseDate);
  nextDate.setDate(baseDate.getDate() + 1);

  const prevSlug = slugFromDate(prevDate);
  const nextSlug = slugFromDate(nextDate);

  const dow = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  const yearHref = `/liturgia-diaria/ano/${year}`;
  const ADS_SLOT_ASIDE_300x250 = "8534838745";

  return (
    <main className="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <article className="min-w-0">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-600">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/liturgia-diaria" className="hover:underline">
                  Liturgia Diária
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
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Calendário da Liturgia Diária de {monthName}
            </h1>

            {/* Copy editorial forte (SEO) */}
            <p className="mt-2 text-sm text-gray-700 max-w-3xl">
              Consulte a <strong>Liturgia Diária</strong> de qualquer data em{" "}
              <strong>{monthName}</strong>. Em cada dia você encontra as{" "}
              <strong>leituras da Missa</strong>, o <strong>salmo responsorial</strong> e o{" "}
              <strong>evangelho do dia</strong>, organizados para estudo, oração e preparação para a Missa.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Link
                href={`/liturgia-diaria/ano/${prevMonth.year}/${pad2(prevMonth.month)}`}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                ← {monthLabelPT(prevMonth.year, prevMonth.month)}
              </Link>

              <Link
                href={`/liturgia-diaria/ano/${nextMonth.year}/${pad2(nextMonth.month)}`}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                {monthLabelPT(nextMonth.year, nextMonth.month)} →
              </Link>

              <Link
                href={`/liturgia-diaria/${todaySlug}`}
                className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold hover:bg-amber-100 text-amber-900"
              >
                Liturgia de hoje ({todayLabel})
              </Link>
            </div>
          </header>

          {/* Calendário visual */}
          <section
            aria-label={`Calendário mensal de ${monthName}`}
            className="rounded-2xl border border-gray-200 overflow-hidden bg-white"
          >
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
              {dow.map((x) => (
                <div
                  key={x}
                  className="px-3 py-2 text-xs font-semibold text-gray-700"
                >
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
                    aria-label={`Abrir liturgia do dia ${pad2(cell.day)}/${pad2(month)}/${year}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-extrabold text-gray-900">
                        {cell.day}
                      </span>
                      {isToday ? (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                          Hoje
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

          {/* Lista SEO (crawl) */}
          <section className="mt-10">
            <h2 className="text-xl font-extrabold tracking-tight text-gray-900">
              Liturgia de cada dia em {monthName}
            </h2>
            <p className="mt-2 text-sm text-gray-700 max-w-3xl">
              Links diretos para cada data. Cada página contém leituras, salmo e evangelho completos.
            </p>

            <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {days.map((x) => (
                <li key={`list-${x.slug}`}>
                  <Link
                    href={x.href}
                    className="block rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold hover:bg-gray-50"
                  >
                    {pad2(x.day)}/{pad2(month)}/{year}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-2">
              <Link
                href={yearHref}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                Ver calendário do ano {year}
              </Link>
              <Link
                href="/liturgia-diaria"
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                Voltar
              </Link>
            </div>
          </section>
        </article>

        {/* ASIDE (desktop) */}
        <aside className="hidden lg:block">
          <LiturgiaAside
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

      {/* ASIDE (mobile) */}
      <div className="mt-8 lg:hidden">
        <LiturgiaAside
          year={year}
          month={month}
          todaySlug={todaySlug}
          todayLabel={todayLabel}
          prevSlug={prevSlug}
          nextSlug={nextSlug}
          adsSlotDesktop300x250={ADS_SLOT_ASIDE_300x250}
        />
      </div>
    </main>
  );
}
