// components/liturgia/LiturgiaAside.tsx

import Link from "next/link";
import { monthLabelPT, pad2 } from "@/lib/liturgia/date";
import { AdsenseSidebarDesktop300x250 } from "@/components/ads/AdsenseBlocks";

type BlogLink = {
  href: string;
  title: string;
  desc?: string;
};

type Props = {
  year: number;
  month: number; // 1-12
  todaySlug: string; // dd-mm-aaaa
  todayLabel: string; // dd/mm/aaaa
  prevSlug: string; // dd-mm-aaaa
  nextSlug: string; // dd-mm-aaaa
  adsSlotDesktop300x250?: string;
  blogLinks?: BlogLink[];
  className?: string;

  /**
   * Use isso para evitar duplicações quando você renderiza o aside 2x (desktop+mobile).
   * - desktop: mostra anúncio e “layout completo”
   * - mobile: remove anúncio e compacta
   */
  variant?: "desktop" | "mobile";

  /**
   * Opcional: quando você estiver em uma data histórica (ex.: 02-06-2026),
   * passe o slug da página atual para que o aside explique que “Hoje” é a data atual.
   */
  pageSlug?: string; // dd-mm-aaaa
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-wide text-amber-700 uppercase">
      {children}
    </p>
  );
}

function QuickLink({
  href,
  k,
  v,
  hint,
}: {
  href: string;
  k: string;
  v: string;
  hint?: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition"
    >
      <p className="text-xs text-slate-500 font-semibold">{k}</p>
      <p className="text-sm font-bold text-slate-900">{v}</p>
      {hint ? <p className="mt-1 text-[11px] text-slate-600">{hint}</p> : null}
    </Link>
  );
}

export default function LiturgiaAside({
  year,
  month,
  todaySlug,
  todayLabel,
  prevSlug,
  nextSlug,
  adsSlotDesktop300x250,
  blogLinks,
  className,
  variant = "desktop",
  pageSlug,
}: Props) {
  const monthHref = `/liturgia-diaria/ano/${year}/${pad2(month)}`;
  const yearHref = `/liturgia-diaria/ano/${year}`;

  // Links padrão do blog (páginas “pilar”)
  const defaultBlogLinks: BlogLink[] = [
    {
      href: "/blog/como-usar-a-liturgia",
      title: "Como usar a Liturgia no dia a dia",
      desc: "Um jeito simples de rezar e se preparar para a Missa.",
    },
    {
      href: "/blog/ano-liturgico",
      title: "Ano litúrgico: tempos, cores e calendário",
      desc: "Entenda o que muda ao longo do ano e como acompanhar.",
    },
    {
      href: "/blog/leituras-da-missa",
      title: "Guia das leituras da Missa",
      desc: "Primeira leitura, salmo, evangelho e como acompanhar.",
    },
    {
      href: "/blog/como-rezar-com-a-liturgia-em-5-minutos",
      title: "Como rezar com a Liturgia em 5 minutos",
      desc: "Um passo a passo prático para criar rotina e constância.",
    },
    {
      href: "/blog/liturgia-diaria-ou-evangelho-do-dia",
      title: "Liturgia diária x Evangelho do dia: qual a diferença?",
      desc: "Entenda o que cada um inclui e quando usar.",
    },
  ];

  const effectiveBlogLinks = (blogLinks?.length ? blogLinks : defaultBlogLinks).slice(
    0,
    5
  );

  const isHistoricalContext = Boolean(pageSlug) && pageSlug !== todaySlug;

  return (
    <aside className={cx("min-w-0", className)}>
      <div className="sticky top-4 space-y-4">
        {/* Anúncio (somente desktop) */}
        {variant === "desktop" && adsSlotDesktop300x250 ? (
          <AdsenseSidebarDesktop300x250 slot={adsSlotDesktop300x250} />
        ) : null}

        {/* Acesso rápido */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <CardTitle>Acesso rápido</CardTitle>

          <div className="mt-3 space-y-2">
            <QuickLink
              href={`/liturgia-diaria/${todaySlug}`}
              k={isHistoricalContext ? "Hoje (data atual)" : "Hoje"}
              v={todayLabel}
              hint={isHistoricalContext ? `Você está em ${pageSlug?.replaceAll("-", "/")}` : undefined}
            />

            <QuickLink
              href={`/liturgia-diaria/${prevSlug}`}
              k="Dia anterior"
              v={prevSlug.replaceAll("-", "/")}
            />

            <QuickLink
              href={`/liturgia-diaria/${nextSlug}`}
              k="Próximo dia"
              v={nextSlug.replaceAll("-", "/")}
            />

            <QuickLink href={monthHref} k="Calendário do mês" v={monthLabelPT(year, month)} />
            <QuickLink href={yearHref} k="Calendário do ano" v={String(year)} />
          </div>
        </div>

        {/* Explorar (para SEO interno) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <CardTitle>Explorar</CardTitle>

          <div className="mt-3 space-y-2">
            <Link
              href="/blog/como-usar-a-liturgia"
              className="block rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition"
            >
              <p className="text-sm font-bold text-slate-900">
                Como usar a Liturgia no dia a dia
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Um jeito simples de rezar e se preparar para a Missa.
              </p>
            </Link>

            <Link
              href="/blog/ano-liturgico"
              className="block rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition"
            >
              <p className="text-sm font-bold text-slate-900">Ano litúrgico</p>
              <p className="mt-1 text-xs text-slate-600">
                Tempos, cores e calendário: entenda o que muda no ano.
              </p>
            </Link>

            <Link
              href="/blog/leituras-da-missa"
              className="block rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition"
            >
              <p className="text-sm font-bold text-slate-900">Guia das leituras</p>
              <p className="mt-1 text-xs text-slate-600">
                Primeira leitura, salmo, evangelho e como acompanhar.
              </p>
            </Link>

            <Link
              href="/blog/como-rezar-com-a-liturgia-em-5-minutos"
              className="block rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition"
            >
              <p className="text-sm font-bold text-slate-900">
                Como rezar com a Liturgia em 5 minutos
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Um passo a passo prático para criar constância.
              </p>
            </Link>

            <Link
              href="/blog/liturgia-diaria-ou-evangelho-do-dia"
              className="block rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition"
            >
              <p className="text-sm font-bold text-slate-900">
                Liturgia diária x Evangelho do dia
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Diferenças, vantagens e quando usar cada um.
              </p>
            </Link>
          </div>
        </div>

        {/* Do blog (desktop: mostra; mobile: opcional — fica mais leve) */}
        {variant === "desktop" && effectiveBlogLinks.length ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <CardTitle>Do blog</CardTitle>

            <div className="mt-3 space-y-2">
              {effectiveBlogLinks.slice(0, 4).map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="block rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition"
                >
                  <p className="text-sm font-bold text-slate-900">{p.title}</p>
                  {p.desc ? <p className="mt-1 text-xs text-slate-600">{p.desc}</p> : null}
                </Link>
              ))}

              <Link
                href="/blog"
                className="block rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition"
              >
                <p className="text-sm font-bold text-slate-900">Ver todos os artigos</p>
                <p className="mt-1 text-xs text-slate-600">
                  Conteúdos sobre Liturgia e oração.
                </p>
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
