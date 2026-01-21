// app/en/daily-mass-readings/[data]/page.tsx
//
// English day page (parallel to PT) using US date slug pattern MM-DD-YYYY.
// - Route slug format: MM-DD-YYYY (e.g., /en/daily-mass-readings/01-13-2026)
// - SEO: “Daily Mass Readings — <weekday, month day, year>” (America/Sao_Paulo-safe)
// - Fetches PT liturgy data, but swaps texts with English (NET Bible) when available.
// - Canonical ALWAYS normalized to MM-DD-YYYY; legacy DD-MM-YYYY gets redirected.
//
// FIX: Prevent weekday/day shift in title/OG/FAQ by formatting from ISO with a safe midday anchor.

import type { Metadata } from "next";
import Script from "next/script";
import { redirect } from "next/navigation";

import { fetchLiturgiaByDate, toReadableHtml } from "@/lib/liturgia/api";
import { pad2 } from "@/lib/liturgia/date";
import { fetchNetBibleHtml } from "@/lib/liturgia/bible-en";

import { AdsenseSidebarMobile300x250 } from "@/components/ads/AdsenseBlocks";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
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
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d))
    return false;
  if (y < 1900 || y > 2100) return false;
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;

  const dt = new Date(y, m - 1, d);
  return (
    dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
  );
}

/**
 * Primary EN route slug format: MM-DD-YYYY
 */
function parseSlugUS(slug: string): Date | null {
  const s = safeSlug(slug);
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(s);
  if (!m) return null;

  const mm = Number(m[1]);
  const dd = Number(m[2]);
  const yyyy = Number(m[3]);

  if (!isValidDateParts(yyyy, mm, dd)) return null;
  return new Date(yyyy, mm - 1, dd);
}

/**
 * Legacy fallback: DD-MM-YYYY (if someone pasted PT slug in EN route)
 */
function parseSlugLegacyDMY(slug: string): Date | null {
  const s = safeSlug(slug);
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(s);
  if (!m) return null;

  const dd = Number(m[1]);
  const mm = Number(m[2]);
  const yyyy = Number(m[3]);

  if (!isValidDateParts(yyyy, mm, dd)) return null;
  return new Date(yyyy, mm - 1, dd);
}

function slugFromDateUS(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
}

/**
 * Normalize incoming slug:
 * - If already MM-DD-YYYY -> ok
 * - If it looks like DD-MM-YYYY -> redirect to normalized MM-DD-YYYY
 * - Else invalid -> null
 */
function normalizeUSSlugOrNull(inputSlug: string): {
  dt: Date | null;
  normalizedSlug: string | null;
  needsRedirect: boolean;
} {
  const s = safeSlug(inputSlug);
  const dtUS = parseSlugUS(s);
  if (dtUS) {
    return {
      dt: dtUS,
      normalizedSlug: slugFromDateUS(dtUS),
      needsRedirect: false,
    };
  }

  const dtLegacy = parseSlugLegacyDMY(s);
  if (dtLegacy) {
    const normalized = slugFromDateUS(dtLegacy);
    return { dt: dtLegacy, normalizedSlug: normalized, needsRedirect: true };
  }

  return { dt: null, normalizedSlug: null, needsRedirect: false };
}

function todayInSaoPaulo(): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const yyyy = Number(parts.find((p) => p.type === "year")?.value);
  const mm = Number(parts.find((p) => p.type === "month")?.value);
  const dd = Number(parts.find((p) => p.type === "day")?.value);

  return new Date(yyyy, mm - 1, dd);
}

function formatSlashDateUS(dt: Date) {
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  const yyyy = dt.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

/**
 * FIX: Use ISO + midday anchor to avoid weekday shifting across environments.
 */
function dateISOFromDate(dt: Date) {
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
}

function formatEnglishLongFromISO(dateISO: string) {
  // dateISO: YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateISO)) return "";

  const [y, m, d] = dateISO.split("-").map(Number);

  // Midday local anchor avoids any timezone boundary issues
  const anchor = new Date(y, m - 1, d, 12, 0, 0);

  return anchor.toLocaleDateString("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildTitleFromISO(dateISO: string) {
  const pretty = formatEnglishLongFromISO(dateISO);
  return `Daily Mass Readings — ${pretty}`;
}

function buildDescriptionFromISO(dateISO: string) {
  // Keep your previous compact format stable in description
  const [y, m, d] = dateISO.split("-"); // YYYY MM DD
  const compact = `${m}/${d}/${y}`;
  return `Mass readings for ${compact}: Gospel, readings and responsorial psalm. Browse the calendar and navigate by date, month and year.`;
}

/**
 * Defensive refs extraction (supports multiple possible shapes).
 */
function pickRef(data: any, keys: string[]) {
  for (const k of keys) {
    const v = data?.[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

function buildRefsDescriptionFromData(data: any) {
  const first = pickRef(data, [
    "primeiraRef",
    "primeiraLeituraRef",
    "primeiraLeitura",
  ]);
  const psalm = pickRef(data, ["salmoRef", "salmoResponsorialRef", "salmo"]);
  const second = pickRef(data, ["segundaRef", "segundaLeituraRef", "segundaLeitura"]);
  const gospel = pickRef(data, ["evangelhoRef", "evangelho"]);

  const parts: string[] = [];
  if (first) parts.push(`First Reading: ${first}`);
  if (psalm) parts.push(`Responsorial Psalm: ${psalm}`);
  if (second) parts.push(`Second Reading: ${second}`);
  if (gospel) parts.push(`Gospel: ${gospel}`);

  parts.push("Open and pray with the Daily Mass Readings on IA Tio Ben.");
  return parts.join(" • ");
}

function pickText(data: any, keys: string[]) {
  for (const k of keys) {
    const v = data?.[k];
    if (typeof v === "string" && v.trim()) return v;
  }
  return "";
}

/**
 * Simple concurrency-limited async mapper to avoid hammering remote bible endpoints
 * on special liturgies with many readings (e.g., Easter Vigil).
 */
async function mapWithLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const out: R[] = new Array(items.length) as any;
  let i = 0;

  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }

  const workers = Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, () => worker());
  await Promise.all(workers);
  return out;
}

/**
 * Build EN render fields:
 * - Attempts NET bible html by reference
 * - Falls back to PT text rendered via toReadableHtml
 */

/**
 * Build EN render fields:
 * - Attempts NET bible html by reference (when possible)
 * - Falls back to PT text rendered via toReadableHtml
 * - Preserves/extends leiturasFull/oracoesFull/antifonasFull
 */
async function buildDataEN(dataPT: any) {
  const t = (v: any) => (typeof v === "string" ? v.trim() : "");

  // Compatibility refs (single)
  const primeiraRef = pickRef(dataPT, [
    "primeiraRef",
    "primeiraLeituraRef",
    "primeiraLeituraRefTxt",
    "primeiraLeitura",
  ]);
  const salmoRef = pickRef(dataPT, ["salmoRef", "salmoResponsorialRef", "salmo"]);
  const segundaRef = pickRef(dataPT, ["segundaRef", "segundaLeituraRef", "segundaLeitura"]);
  const evangelhoRef = pickRef(dataPT, ["evangelhoRef", "evangelho"]);

  // Compatibility plain text (single)
  const primeiraTexto = pickText(dataPT, ["primeiraTexto", "primeiraLeituraTexto", "primeiraLeitura"]);
  const salmoTexto = pickText(dataPT, ["salmoTexto", "salmoResponsorialTexto", "salmo"]);
  const segundaTexto = pickText(dataPT, ["segundaTexto", "segundaLeituraTexto", "segundaLeitura"]);
  const evangelhoTexto = pickText(dataPT, ["evangelhoTexto", "evangelho"]);

  const full = dataPT?.leiturasFull ?? null;

  // Build arrays from full payload when present; otherwise fall back to the classic single fields.
  const primeiraArr: any[] =
    Array.isArray(full?.primeiraLeitura) && full.primeiraLeitura.length
      ? full.primeiraLeitura
      : primeiraRef || primeiraTexto
        ? [{ referencia: primeiraRef, texto: primeiraTexto, textoHtml: dataPT?.primeiraHtml }]
        : [];

  const segundaArr: any[] =
    Array.isArray(full?.segundaLeitura) && full.segundaLeitura.length
      ? full.segundaLeitura
      : segundaRef || segundaTexto
        ? [{ referencia: segundaRef, texto: segundaTexto, textoHtml: dataPT?.segundaHtml }]
        : [];

  const salmoArr: any[] =
    Array.isArray(full?.salmo) && full.salmo.length
      ? full.salmo
      : salmoRef || salmoTexto
        ? [{ referencia: salmoRef, refrao: "", texto: salmoTexto, textoHtml: dataPT?.salmoHtml }]
        : [];

  const evangelhoArr: any[] =
    Array.isArray(full?.evangelho) && full.evangelho.length
      ? full.evangelho
      : evangelhoRef || evangelhoTexto
        ? [{ referencia: evangelhoRef, texto: evangelhoTexto, textoHtml: dataPT?.evangelhoHtml }]
        : [];

  const extrasArr: any[] = Array.isArray(full?.extras) ? full.extras : [];

  // For each item, try EN bible HTML by reference; otherwise keep existing textoHtml or render from texto.
  async function fillItemHtml(it: any) {
    const referencia = t(it?.referencia);
    const texto = t(it?.texto);
    const existingHtml = t(it?.textoHtml);

    let html: string | null = null;
    if (referencia) {
      html = await fetchNetBibleHtml(referencia).catch(() => null);
    }

    const textoHtml = html ?? existingHtml ?? (texto ? toReadableHtml(texto) : "");
    return { ...it, referencia, texto, textoHtml };
  }

  async function fillPsalmHtml(it: any) {
    const referencia = t(it?.referencia);
    const refrao = t(it?.refrao);
    const texto = t(it?.texto);
    const existingHtml = t(it?.textoHtml);

    let html: string | null = null;
    if (referencia) {
      html = await fetchNetBibleHtml(referencia).catch(() => null);
    }

    const textoHtml = html ?? existingHtml ?? (texto ? toReadableHtml(texto) : "");
    return { ...it, referencia, refrao, texto, textoHtml };
  }

  const [primeiraFilled, segundaFilled, salmoFilled, evangelhoFilled, extrasFilled] = await Promise.all([
    mapWithLimit(primeiraArr, 6, fillItemHtml),
    mapWithLimit(segundaArr, 6, fillItemHtml),
    mapWithLimit(salmoArr, 6, fillPsalmHtml),
    mapWithLimit(evangelhoArr, 6, fillItemHtml),
    mapWithLimit(extrasArr, 6, fillItemHtml),
  ]);

  // “Primary” compatibility fields from first items
  const primeira0 = primeiraFilled[0] ?? null;
  const segunda0 = segundaFilled[0] ?? null;
  const salmo0 = salmoFilled[0] ?? null;
  const evangelho0 = evangelhoFilled[0] ?? null;

  const outPrimeiraRef = t(primeira0?.referencia) || primeiraRef;
  const outSegundaRef = t(segunda0?.referencia) || segundaRef;
  const outSalmoRef = t(salmo0?.referencia) || salmoRef;
  const outEvangelhoRef = t(evangelho0?.referencia) || evangelhoRef;

  const outPrimeiraTexto = t(primeira0?.texto) || primeiraTexto;
  const outSegundaTexto = t(segunda0?.texto) || segundaTexto;
  const outSalmoTexto = t(salmo0?.texto) || salmoTexto;
  const outEvangelhoTexto = t(evangelho0?.texto) || evangelhoTexto;

  return {
    ...dataPT,

    // Keep original text fields for fallback, if your components still expect them:
    primeiraTexto: outPrimeiraTexto,
    salmoTexto: outSalmoTexto,
    segundaTexto: outSegundaTexto,
    evangelhoTexto: outEvangelhoTexto,

    // Keep refs updated
    primeiraRef: outPrimeiraRef,
    salmoRef: outSalmoRef,
    segundaRef: outSegundaRef,
    evangelhoRef: outEvangelhoRef,

    // Inject HTML fields used by EN components:
    primeiraHtml: t(primeira0?.textoHtml) || toReadableHtml(outPrimeiraTexto),
    salmoHtml: t(salmo0?.textoHtml) || toReadableHtml(outSalmoTexto),
    segundaHtml: t(segunda0?.textoHtml) || (outSegundaTexto ? toReadableHtml(outSegundaTexto) : ""),
    evangelhoHtml: t(evangelho0?.textoHtml) || toReadableHtml(outEvangelhoTexto),

    // ✅ Full payload with HTML for multi-readings
    leiturasFull: {
      primeiraLeitura: primeiraFilled,
      segundaLeitura: segundaFilled,
      salmo: salmoFilled,
      evangelho: evangelhoFilled,
      extras: extrasFilled,
    },
  };
}

/**
 * Today slug/label in Sao Paulo TZ (for "Today" button).
 */
function getTodaySlugLabelUS() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const yyyy = Number(parts.find((p) => p.type === "year")?.value);
  const mm = Number(parts.find((p) => p.type === "month")?.value);
  const dd = Number(parts.find((p) => p.type === "day")?.value);

  const todaySlug = `${pad2(mm)}-${pad2(dd)}-${yyyy}`;
  const todayLabelEN = `${pad2(mm)}/${pad2(dd)}/${yyyy}`;
  return { todaySlug, todayLabelEN };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await Promise.resolve(params);
  const inputSlug = safeSlug(resolved.data);

  const { dt, normalizedSlug } = normalizeUSSlugOrNull(inputSlug);

  // Invalid route: noindex and canonical to hub root
  if (!dt || !normalizedSlug) {
    const canonical = `${SITE_URL}${HUB_CANONICAL_PATH}`;
    const title = "Daily Mass Readings — IA Tio Ben";
    const description =
      "Gospel, readings and responsorial psalm of the day. Open and pray with the Daily Mass Readings on IA Tio Ben.";

    const ogImage = `${SITE_URL}/og?title=${encodeURIComponent(
      "Daily Mass Readings"
    )}&description=${encodeURIComponent(description)}`;

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

  const dateISO = dateISOFromDate(dt);
  const title = buildTitleFromISO(dateISO);

  let description =
    "Gospel, readings and responsorial psalm of the day. Open and pray with the Daily Mass Readings on IA Tio Ben.";

  // Best-effort to include refs; keep SEO stable if fetch fails
  try {
    const day = dt.getDate();
    const month = dt.getMonth() + 1;
    const year = dt.getFullYear();

    const dataPT = await fetchLiturgiaByDate(day, month, year);
    const dataEN = await buildDataEN(dataPT);
    description = buildRefsDescriptionFromData(dataEN);
  } catch {
    // keep fallback
  }

  const canonical = `${SITE_URL}${HUB_CANONICAL_PATH}/${normalizedSlug}`;

  // NOTE: This assumes you actually generate and store that PNG.
  // If you don't, switch to /og?title=... style to avoid broken OG.
  const ogImage = `${SITE_URL}/og/liturgia/${normalizedSlug}.png`;

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
  const inputSlug = safeSlug(resolved.data);

  const { dt, normalizedSlug, needsRedirect } = normalizeUSSlugOrNull(inputSlug);

  // Invalid slug: redirect to TODAY (Sao Paulo time)
  if (!dt || !normalizedSlug) {
    const today = todayInSaoPaulo();
    redirect(`${HUB_CANONICAL_PATH}/${slugFromDateUS(today)}`);
  }

  // If user used legacy DD-MM-YYYY, redirect to normalized US slug
  if (needsRedirect) {
    redirect(`${HUB_CANONICAL_PATH}/${normalizedSlug}`);
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

  const canonical = `${SITE_URL}${HUB_CANONICAL_PATH}/${normalizedSlug}`;

  // Prefer ISO from data if present, else derive from dt
  const dateISO =
    (typeof dataEN?.dateISO === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dataEN.dateISO) && dataEN.dateISO) ||
    dateISOFromDate(dt);

  const prettyDateEN = formatEnglishLongFromISO(dateISO);

  const dateLabel =
    (typeof dataEN?.dateLabel === "string" && dataEN.dateLabel) ||
    formatSlashDateUS(dt);

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
      { "@type": "ListItem", position: 3, name: dateLabel, item: canonical },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: buildTitleFromISO(dateISO),
    description: buildDescriptionFromISO(dateISO),
    mainEntityOfPage: canonical,
    datePublished: `${dateISO}T06:00:00-03:00`,
    dateModified: `${dateISO}T06:00:00-03:00`,
    author: { "@type": "Organization", name: "IA Tio Ben" },
    publisher: { "@type": "Organization", name: "IA Tio Ben" },
  };

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
          text: "Use the Daily Mass Readings hub and navigate by month/year to open any date at /en/daily-mass-readings/mm-dd-yyyy.",
        },
      },
    ],
  };

  const { todaySlug, todayLabelEN } = getTodaySlugLabelUS();

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
              hubCanonicalPath={HUB_CANONICAL_PATH} // IMPORTANT: hub root only
              dateSlug={normalizedSlug}
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
                  desc: "Understand what changes throughout the year and how to follow them.",
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

        {/* Do NOT add manual canonical tag here.
            Next metadata already emits it.
            If you still see duplicated canonicals, the second one is coming from a parent layout/head or an HTTP header. */}
      </article>
    </>
  );
}
