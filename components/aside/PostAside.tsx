// components/blog/BlogAside.tsx
//
// - Padrão Liturgia
// - Liturgia abre direto na data de HOJE (/liturgia-diaria/dd-mm-aaaa)
// - Prop hideLatestPosts para usar na página /blog (sem “últimos posts”)
// - Mantém anúncio desktop 300x250
// - Busca últimos posts no server via action (quando hideLatestPosts=false)

import Link from "next/link";
import Image from "next/image";
import { BookOpen, CircleDashed, Bot } from "lucide-react";
import { AdsenseSidebarDesktop300x250 } from "@/components/ads/AdsenseBlocks";
import { getLatestPostsForAsideAction } from "@/app/adminTioBen/actions/postAction";

type LatestPostLink = {
  href: string;
  title: string;
  desc?: string;
};

type BlogLink = {
  href: string;
  title: string;
  desc?: string;
};

type Props = {
  currentSlug?: string;
  adsSlotDesktop300x250?: string;
  className?: string;
  variant?: "desktop" | "mobile";
  blogLinks?: BlogLink[];
  latestPosts?: LatestPostLink[];

  /** Para usar no /blog (listagem) sem a seção "Últimos posts" */
  hideLatestPosts?: boolean;
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

function BlockLink({
  href,
  title,
  desc,
  icon,
}: {
  href: string;
  title: string;
  desc?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition"
    >
      <div className="flex items-start gap-2">
        {icon ? <div className="mt-[2px] text-slate-700">{icon}</div> : null}
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900">{title}</p>
          {desc ? <p className="mt-1 text-xs text-slate-600">{desc}</p> : null}
        </div>
      </div>
    </Link>
  );
}

export default async function BlogAside({
  currentSlug,
  adsSlotDesktop300x250,
  className,
  variant = "desktop",
  blogLinks,
  latestPosts,
  hideLatestPosts = false,
}: Props) {
  // Data atual (dd-mm-aaaa) para abrir Liturgia direto no dia
  const today = new Date();
  const todaySlug = [
    String(today.getDate()).padStart(2, "0"),
    String(today.getMonth() + 1).padStart(2, "0"),
    today.getFullYear(),
  ].join("-");

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

  // Só busca “últimos posts” quando realmente vai renderizar essa seção
  const fetched =
    hideLatestPosts
      ? []
      : latestPosts?.length
        ? latestPosts
        : (await getLatestPostsForAsideAction(6)).map((p) => ({
            href: `/blog/${p.slug}`,
            title: p.title,
            desc: p.metaDescription ?? undefined,
          }));

  const latest = (fetched || [])
    .filter((p) => p?.href && p?.title)
    .filter((p) => (currentSlug ? !p.href.endsWith(`/blog/${currentSlug}`) : true))
    .slice(0, 5);

  return (
    <aside className={cx("min-w-0", className)}>
      <div className="sticky top-4 space-y-4">
        {/* Anúncio (somente desktop) */}
        {variant === "desktop" && adsSlotDesktop300x250 ? (
          <AdsenseSidebarDesktop300x250 slot={adsSlotDesktop300x250} />
        ) : null}

        {/* Acesso rápido (CTA principais) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <CardTitle>Acesso rápido</CardTitle>

          <div className="mt-3 space-y-2">
            <BlockLink
              href={`/liturgia-diaria/${todaySlug}`}
              title="Ler a Liturgia de Hoje"
              desc={`Leituras, salmo e evangelho • ${todaySlug.replaceAll("-", "/")}`}
              icon={<BookOpen size={16} />}
            />

            <BlockLink
              href="/santo-terco/como-rezar-o-terco"
              title="Rezar o Terço"
              desc="Aprenda, medite os mistérios e crie constância."
              icon={<CircleDashed size={16} />}
            />

            <Link
              href="/ia"
              className="block rounded-xl border border-amber-200 bg-amber-50 p-3 hover:bg-amber-100 transition"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-amber-100">
                  <Image
                    src="/images/ben-transparente.png"
                    alt="Tio Ben"
                    width={56}
                    height={56}
                    priority={variant === "desktop"}
                    className="h-7 w-7 object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-amber-900">IA do Tio Ben</p>
                  <p className="mt-1 text-xs text-amber-800">
                    Pergunte, reflita o Evangelho e reze com ajuda guiada.
                  </p>

                  <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-amber-900">
                    <Bot size={14} />
                    Conversar agora
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Explorar (páginas pilar / SEO interno) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <CardTitle>Explorar</CardTitle>

          <div className="mt-3 space-y-2">
            {effectiveBlogLinks.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="block rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition"
              >
                <p className="text-sm font-bold text-slate-900">{p.title}</p>
                {p.desc ? <p className="mt-1 text-xs text-slate-600">{p.desc}</p> : null}
              </Link>
            ))}
          </div>
        </div>

        {/* Últimos 5 posts (desktop only) — desligável para /blog */}
        {variant === "desktop" && !hideLatestPosts ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <CardTitle>Últimos posts</CardTitle>

            <div className="mt-3 space-y-2">
              {latest.length ? (
                latest.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className="block rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition"
                  >
                    <p className="text-sm font-bold text-slate-900">{p.title}</p>
                    {p.desc ? <p className="mt-1 text-xs text-slate-600">{p.desc}</p> : null}
                  </Link>
                ))
              ) : (
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-sm font-semibold text-slate-900">Sem posts recentes</p>
                  <p className="mt-1 text-xs text-slate-600">Volte em breve para novos conteúdos.</p>
                </div>
              )}

              <Link
                href="/blog"
                className="block rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition"
              >
                <p className="text-sm font-bold text-slate-900">Ver todos os artigos</p>
                <p className="mt-1 text-xs text-slate-600">
                  Mais conteúdos do Tio Ben para fortalecer sua rotina.
                </p>
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
