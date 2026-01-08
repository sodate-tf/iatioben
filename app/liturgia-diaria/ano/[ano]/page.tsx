// app/liturgia-diaria/ano/[ano]/page.tsx

import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { monthLabelPT, pad2 } from "@/lib/liturgia/date";

export const dynamic = "force-static";
export const revalidate = 86400;

const SITE_URL = "https://www.iatioben.com.br";

type RouteParams = { ano: string };
type ParamsInput = RouteParams | Promise<RouteParams>;

async function resolveParams(params: ParamsInput): Promise<RouteParams> {
  return await params;
}

function parseYear(p: RouteParams) {
  const year = Number(p.ano);
  if (!Number.isFinite(year) || !Number.isInteger(year)) return null;
  if (year < 1900 || year > 2100) return null;
  return year;
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

  const title = `Liturgia diária – Calendário do ano ${year} (leituras, salmo e evangelho)`;
  const description =
    `Calendário anual da Liturgia Diária de ${year}. ` +
    `Escolha um mês para acessar as leituras da Missa, salmo responsorial e evangelho de cada dia.`;

  const canonicalPath = `/liturgia-diaria/ano/${year}`;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

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
          alt: `Liturgia Diária ${year} – IA Tio Ben`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage], // ✅ importante
    },
  };
}



/* =========================
   PAGE
   ========================= */
export default async function LiturgiaAnoPage({ params }: { params: ParamsInput }) {
  const raw = await resolveParams(params);
  const year = parseYear(raw);
  if (!year) notFound();

  const months = Array.from({ length: 12 }, (_, i) => i + 1).map((m) => ({
    m,
    href: `/liturgia-diaria/ano/${year}/${pad2(m)}`,
    label: monthLabelPT(year, m),
  }));

  // Navegação ano anterior/próximo (cluster interno)
  const prevYear = year - 1;
  const nextYear = year + 1;

  return (
    <main className="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6 py-6">
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
            <li className="text-gray-900 font-semibold">{year}</li>
          </ol>
        </nav>

        <header className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Calendário da Liturgia Diária – Ano {year}
          </h1>

          <p className="mt-2 text-sm text-gray-700 max-w-3xl">
            Este é o calendário anual da <strong>Liturgia Diária</strong> em <strong>{year}</strong>.
            Escolha um mês para acessar a liturgia completa de cada dia, com{" "}
            <strong>leituras da Missa</strong>, <strong>salmo responsorial</strong> e{" "}
            <strong>evangelho do dia</strong>. Ideal para acompanhar o calendário litúrgico, preparar-se
            para a Missa e aprofundar a meditação da Palavra.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/liturgia-diaria/ano/${prevYear}`}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              ← Ano {prevYear}
            </Link>

            <Link
              href={`/liturgia-diaria/ano/${nextYear}`}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              Ano {nextYear} →
            </Link>

            <Link
              href="/liturgia-diaria"
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              Voltar para a Liturgia Diária
            </Link>
          </div>
        </header>

        {/* Grid de meses */}
        <section aria-label={`Meses do ano ${year}`}>
          <h2 className="sr-only">Escolha um mês</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {months.map((x) => (
              <Link
                key={x.m}
                href={x.href}
                className="rounded-2xl border border-gray-200 bg-white p-4 hover:bg-gray-50 transition"
                aria-label={`Abrir calendário da Liturgia Diária de ${x.label}`}
              >
                <p className="text-sm font-extrabold text-gray-900">{x.label}</p>
                <p className="mt-1 text-xs text-gray-700">
                  Abrir calendário do mês e acessar qualquer dia
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Reforço SEO: links em lista (crawl) */}
        <section className="mt-10">
          <h2 className="text-xl font-extrabold tracking-tight text-gray-900">
            Meses da Liturgia Diária em {year}
          </h2>
          <p className="mt-2 text-sm text-gray-700 max-w-3xl">
            Links diretos para o calendário mensal. Cada mês leva ao calendário completo com acesso à liturgia de cada dia.
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
