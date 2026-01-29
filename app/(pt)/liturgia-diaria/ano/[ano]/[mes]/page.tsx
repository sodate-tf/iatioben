// app/liturgia-diaria/ano/[ano]/[mes]/page.tsx

import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { daysInMonth, monthLabelPT, pad2 } from "@/lib/liturgia/date";
import LiturgiaAside from "@/components/liturgia/LiturgiaAside";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";

export const dynamic = "force-static";
export const revalidate = 86400; // mantém "Hoje" atualizado

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

  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return new Date();
  return new Date(y, m - 1, d);
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

function isSameYMD(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getPrevMonth(year: number, month: number) {
  return month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
}

function getNextMonth(year: number, month: number) {
  return month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };
}

function getSundaysInMonth(year: number, month: number) {
  const totalDays = daysInMonth(year, month);
  const sundays: Array<{ day: number; slug: string; href: string }> = [];

  for (let day = 1; day <= totalDays; day++) {
    const d = new Date(year, month - 1, day);
    if (d.getDay() === 0) {
      const slug = `${pad2(day)}-${pad2(month)}-${year}`;
      sundays.push({ day, slug, href: `/liturgia-diaria/${slug}` });
    }
  }
  return sundays;
}

function absoluteUrl(pathname: string) {
  return `${SITE_URL}${pathname}`;
}

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
  const canonicalPath = `/liturgia-diaria/ano/${year}/${pad2(month)}`;
  const canonicalUrl = absoluteUrl(canonicalPath);

  // ✅ Mês atual? incluir "Hoje" no snippet (melhora CTR e relevância)
  const today = getTodayInSaoPaulo();
  const isMonthOfToday = today.getFullYear() === year && today.getMonth() + 1 === month;

  const titleBase = `Liturgia Diária ${monthName} ${year}: Leituras, Salmo e Evangelho (Calendário Completo)`;
  const title = isMonthOfToday
    ? `Liturgia Diária ${monthName} ${year} — Hoje, Leituras, Salmo e Evangelho (Calendário)`
    : titleBase;

  const descriptionBase =
    `Calendário da Liturgia Diária de ${monthName} ${year}. ` +
    `Leituras da Missa, salmo responsorial e evangelho completos por dia, com navegação por datas.`;

  const description = isMonthOfToday
    ? `Liturgia Diária de ${monthName} ${year}: acesse a liturgia de hoje e navegue pelo calendário mensal. ` +
      `Leituras, salmo e evangelho completos por dia.`
    : descriptionBase;

  // ✅ WhatsApp-friendly (rota limpa .png)
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
      locale: "pt_BR",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `Liturgia Diária — ${monthName} ${year} — IA Tio Ben`,
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
   SCHEMA BUILDERS
   ========================= */
function buildBreadcrumbSchema(year: number, month: number, monthName: string, canonicalUrl: string) {
  const yearUrl = absoluteUrl(`/liturgia-diaria/ano/${year}`);
  const monthUrl = canonicalUrl;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Liturgia Diária",
        item: absoluteUrl("/liturgia-diaria"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: String(year),
        item: yearUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: monthName,
        item: monthUrl,
      },
    ],
  };
}

function buildCollectionSchema(args: {
  year: number;
  month: number;
  monthName: string;
  canonicalUrl: string;
  days: Array<{ day: number; href: string }>;
}) {
  const { year, monthName, canonicalUrl, days } = args;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Calendário da Liturgia Diária de ${monthName} ${year}`,
    url: canonicalUrl,
    inLanguage: "pt-BR",
    isPartOf: {
      "@type": "WebSite",
      name: "IA Tio Ben",
      url: SITE_URL,
    },
    about: [
      { "@type": "Thing", name: "Liturgia Diária" },
      { "@type": "Thing", name: "Leituras da Missa" },
      { "@type": "Thing", name: "Evangelho do dia" },
      { "@type": "Thing", name: "Salmo responsorial" },
    ],
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: days.length,
      itemListElement: days.map((d, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: `Liturgia Diária ${pad2(d.day)}/${pad2(args.month)}/${args.year}`,
        url: absoluteUrl(d.href),
      })),
    },
  };
}

function buildFaqSchema(year: number, month: number, monthName: string, todaySlug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Como acessar a liturgia de hoje?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Use o botão “Liturgia de hoje” no topo do calendário ou acesse diretamente /liturgia-diaria/${todaySlug}.`,
        },
      },
      {
        "@type": "Question",
        name: `Esta página contém a liturgia completa de cada dia de ${monthName} ${year}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Sim. Este é um calendário mensal com links diretos para cada data. Em cada dia você encontra leituras, salmo e evangelho completos.`,
        },
      },
      {
        "@type": "Question",
        name: "Posso navegar para outros meses e anos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim. Você pode usar os botões de mês anterior/próximo e também acessar o calendário anual do mesmo ano.",
        },
      },
    ],
  };
}

/* =========================
   PAGE
   ========================= */
export default async function LiturgiaMesPage({ params }: { params: ParamsInput }) {
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
  if (remainder !== 0) {
    cells.push(...Array.from({ length: 7 - remainder }, () => null));
  }

  const prevMonth = getPrevMonth(year, month);
  const nextMonth = getNextMonth(year, month);

  // Aside props
  const today = getTodayInSaoPaulo();
  const todaySlug = slugFromDate(today);
  const todayLabel = labelFromSlug(todaySlug);

  const isMonthOfToday = today.getFullYear() === year && today.getMonth() + 1 === month;
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

  // ✅ Schemas (Breadcrumb + Collection/ItemList + FAQ)
  const canonicalPath = `/liturgia-diaria/ano/${year}/${pad2(month)}`;
  const canonicalUrl = absoluteUrl(canonicalPath);

  const breadcrumbSchema = buildBreadcrumbSchema(year, month, monthName, canonicalUrl);
  const collectionSchema = buildCollectionSchema({ year, month, monthName, canonicalUrl, days });
  const faqSchema = buildFaqSchema(year, month, monthName, todaySlug);

  // ✅ Blocos semânticos úteis
  const sundays = getSundaysInMonth(year, month);

  return (
    <main className="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6 py-6">
      {/* JSON-LD: Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <article className="min-w-0">
          {/* Breadcrumbs (UI) */}
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
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                Calendário da Liturgia Diária de {monthName} {year}
              </h1>

              <div className="shrink-0">
                <LanguageSwitcher />
              </div>
            </div>

            <p className="mt-2 text-sm text-gray-700 max-w-3xl">
              Consulte a <strong>Liturgia Diária</strong> de qualquer data em{" "}
              <strong>{monthName} {year}</strong>. Em cada dia você encontra as{" "}
              <strong>leituras da Missa</strong>, o <strong>salmo responsorial</strong> e o{" "}
              <strong>evangelho do dia</strong>, organizados para estudo, oração e preparação para a Missa.
            </p>

            {/* ✅ “Mais buscados” (UX + sinal de navegação) */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Link
                href={`/liturgia-diaria/ano/${prevMonth.year}/${pad2(prevMonth.month)}`}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                ← {monthLabelPT(prevMonth.year, prevMonth.month)} {prevMonth.year}
              </Link>

              <Link
                href={`/liturgia-diaria/ano/${nextMonth.year}/${pad2(nextMonth.month)}`}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                {monthLabelPT(nextMonth.year, nextMonth.month)} {nextMonth.year} →
              </Link>

              <Link
                href={`/liturgia-diaria/${todaySlug}`}
                className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold hover:bg-amber-100 text-amber-900"
              >
                Liturgia de hoje ({todayLabel})
              </Link>

              <Link
                href={yearHref}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                Calendário anual de {year}
              </Link>
            </div>
          </header>

          {/* ✅ Bloco semântico (NLP / Helpful Content) */}
          <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <h2 className="text-lg font-extrabold tracking-tight text-gray-900">
              Sobre a Liturgia Diária de {monthName} {year}
            </h2>
            <p className="mt-2 text-sm text-gray-700 max-w-3xl">
              Esta página funciona como um <strong>hub mensal</strong> com acesso por data à Liturgia Diária.
              Use o calendário para localizar rapidamente o dia desejado. Cada página diária reúne as{" "}
              <strong>leituras bíblicas</strong>, o <strong>salmo responsorial</strong> e o{" "}
              <strong>evangelho</strong> correspondentes, facilitando o estudo, a oração e a preparação para a Missa.
            </p>

            <div className="mt-3 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">Como usar este calendário</p>
              <ul className="mt-1 list-disc pl-5 space-y-1">
                <li>Para acesso rápido, use o botão <strong>“Liturgia de hoje”</strong> no topo.</li>
                <li>Toque em um dia no calendário para abrir a liturgia daquela data.</li>
                <li>Use a navegação para mês anterior/próximo e o calendário anual para explorar outras datas.</li>
              </ul>
            </div>
          </section>

          {/* ✅ Domingos do mês (linkagem contextual forte) */}
          {sundays.length ? (
            <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
              <h2 className="text-lg font-extrabold tracking-tight text-gray-900">
                Domingos de {monthName} {year}
              </h2>
              <p className="mt-2 text-sm text-gray-700 max-w-3xl">
                Abaixo estão os links diretos para a Liturgia Diária de cada domingo deste mês.
              </p>

              <ul className="mt-3 flex flex-wrap gap-2">
                {sundays.map((x) => (
                  <li key={`sun-${x.slug}`}>
                    <Link
                      href={x.href}
                      className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50"
                    >
                      {pad2(x.day)}/{pad2(month)}/{year}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Calendário visual */}
          <section
            aria-label={`Calendário mensal de ${monthName} ${year}`}
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
                    aria-label={`Abrir liturgia do dia ${pad2(cell.day)}/${pad2(month)}/${year}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-extrabold text-gray-900">{cell.day}</span>
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
              Liturgia de cada dia em {monthName} {year}
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

            <div className="mt-8 space-y-3">
              <p className="text-sm text-gray-700 max-w-3xl">
                Veja também o <strong>calendário anual da Liturgia Diária de {year}</strong>, organizado mês a mês, para
                encontrar datas de qualquer período do ano com rapidez.
              </p>

              <div className="flex flex-wrap gap-2">
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
            </div>
          </section>

          {/* ✅ FAQ visível (coerente com o schema) */}
          <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <h2 className="text-xl font-extrabold tracking-tight text-gray-900">Perguntas frequentes</h2>

            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-gray-900">Como acessar a liturgia de hoje?</h3>
                <p className="mt-1 text-sm text-gray-700">
                  Use o botão <strong>“Liturgia de hoje”</strong> no topo do calendário ou acesse{" "}
                  <Link className="underline hover:no-underline" href={`/liturgia-diaria/${todaySlug}`}>
                    diretamente esta página
                  </Link>
                  .
                </p>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-gray-900">
                  Esta página contém a liturgia completa de cada dia de {monthName} {year}?
                </h3>
                <p className="mt-1 text-sm text-gray-700">
                  Sim. Este é um calendário mensal com links diretos para cada data. Em cada dia você encontra as
                  leituras, o salmo e o evangelho completos.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-gray-900">Posso navegar para outros meses e anos?</h3>
                <p className="mt-1 text-sm text-gray-700">
                  Sim. Use os botões de mês anterior/próximo e o <strong>calendário anual</strong> para localizar outras
                  datas rapidamente.
                </p>
              </div>
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

      {/* ASIDE (mobile): sem adsSlotDesktop300x250 para não duplicar anúncios */}
      <div className="mt-8 lg:hidden">
        <LiturgiaAside
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
