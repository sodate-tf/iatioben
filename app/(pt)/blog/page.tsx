// app/blog/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getPostsAction } from "@/app/adminTioBen/actions/postAction";
import { Post } from "@/app/adminTioBen/types";

import AdSensePro from "@/components/adsensePro";
import BlogAside from "@/components/aside/PostAside";
import BlogPortalHeroV2 from "@/components/blog/portal/BlogPortalHeroV2";
import BlogPortalSectionV2 from "@/components/blog/portal/BlogPortalSectionV2";
import BlogPortalStrip from "@/components/blog/portal/BlogPortalStrip";
import BlogPortalThreeCols from "@/components/blog/portal/BlogPortalThreeCols";

const SITE_URL = "https://www.iatioben.com.br";

export const metadata: Metadata = {
  title: "Blog Tio Ben",
  description:
    "Santos, liturgia, terço e reflexões para viver o Evangelho no dia a dia.",
  alternates: { canonical: `${SITE_URL}/blog` },
  robots: { index: true, follow: true },
};

function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
function toCategorySlug(name: string) {
  return normalize(name).replace(/\s+/g, "-");
}

function filterActivePosts(allPosts: Post[]) {
  const now = new Date();
  return allPosts
    .filter((post) => {
      const publishDate = new Date(post.publishDate);
      const expiryDate = post.expiryDate ? new Date(post.expiryDate) : null;
      return (
        post.isActive &&
        publishDate <= now &&
        (!expiryDate || expiryDate > now)
      );
    })
    .sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
}

// ✅ Mapa real (UUID -> nome)
const CATEGORY_BY_ID: Record<string, string> = {
  "388b79e9-4a3a-4f9a-968c-2737cff74cce": "Liturgia",
  "7e0577dc-36c8-4f9d-b476-97af9dc1a077": "Homilia",
  "81f79787-be83-420f-b214-6b243da21cda": "Notícias",
  "ae6cd3b7-dbc9-4df2-bf7c-c372d6b7fe5a": "Cotidiano",
  "ba7adc02-de35-4405-b3f3-7391947d6281": "Santos",
  "da37f657-b94e-485f-be57-468815d712bd": "Terço",
};

type ThemeKey =
  | "liturgia"
  | "santos"
  | "terco"
  | "homilia"
  | "cotidiano"
  | "noticias";

const THEMES: Record<
  ThemeKey,
  {
    key: ThemeKey;
    label: string;
    name: string;
    slug: string;
    accentText: string;
    accentBg: string;
    accentBorder: string;
    accentRing: string;
    accentUnderline: string;
    ogTint: string;
  }
> = {
  liturgia: {
    key: "liturgia",
    label: "Liturgia",
    name: "Liturgia",
    slug: "liturgia",
    accentText: "text-amber-900",
    accentBg: "bg-amber-50",
    accentBorder: "border-amber-200",
    accentRing: "ring-amber-200",
    accentUnderline: "bg-amber-500",
    ogTint: "amber",
  },
  santos: {
    key: "santos",
    label: "Santos",
    name: "Santos",
    slug: "santos",
    accentText: "text-rose-900",
    accentBg: "bg-rose-50",
    accentBorder: "border-rose-200",
    accentRing: "ring-rose-200",
    accentUnderline: "bg-rose-500",
    ogTint: "rose",
  },
  terco: {
    key: "terco",
    label: "Terço",
    name: "Terço",
    slug: "terco",
    accentText: "text-emerald-900",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-200",
    accentRing: "ring-emerald-200",
    accentUnderline: "bg-emerald-500",
    ogTint: "emerald",
  },
  homilia: {
    key: "homilia",
    label: "Homilia",
    name: "Homilia",
    slug: "homilia",
    accentText: "text-indigo-900",
    accentBg: "bg-indigo-50",
    accentBorder: "border-indigo-200",
    accentRing: "ring-indigo-200",
    accentUnderline: "bg-indigo-500",
    ogTint: "indigo",
  },
  cotidiano: {
    key: "cotidiano",
    label: "Vida Cristã",
    name: "Cotidiano",
    slug: "cotidiano",
    accentText: "text-sky-900",
    accentBg: "bg-sky-50",
    accentBorder: "border-sky-200",
    accentRing: "ring-sky-200",
    accentUnderline: "bg-sky-500",
    ogTint: "sky",
  },
  noticias: {
    key: "noticias",
    label: "Notícias",
    name: "Notícias",
    slug: "noticias",
    accentText: "text-slate-900",
    accentBg: "bg-slate-50",
    accentBorder: "border-slate-200",
    accentRing: "ring-slate-200",
    accentUnderline: "bg-slate-500",
    ogTint: "slate",
  },
};

function getCategoryNameFromPost(post: Post) {
  const id = (post as any).categoryId as string | undefined;
  if (id && CATEGORY_BY_ID[id]) return CATEGORY_BY_ID[id];
  const n = (post as any).category as string | undefined;
  return (n || "Sem categoria").trim();
}

function groupByCategoryName(posts: Post[]) {
  const map = new Map<string, Post[]>();
  for (const p of posts) {
    const catName = getCategoryNameFromPost(p);
    if (!map.has(catName)) map.set(catName, []);
    map.get(catName)!.push(p);
  }
  return map;
}

function pickFeatured(posts: Post[]) {
  return posts[0] || null;
}

// ✅ Wrapper de anúncio com altura reservada (evita CLS)
function AdBlock({
  slot,
  height,
  className = "",
}: {
  slot: string;
  height: number;
  className?: string;
}) {
  return (
    <div className={className} style={{ minHeight: height }}>
      <AdSensePro slot={slot} height={height} />
    </div>
  );
}

export default async function BlogPortalPage() {
  const allPosts: Post[] = await getPostsAction();
  const activePosts = filterActivePosts(allPosts);
  const byCategory = groupByCategoryName(activePosts);

  const liturgia = byCategory.get(THEMES.liturgia.name) || [];
  const santos = byCategory.get(THEMES.santos.name) || [];
  const terco = byCategory.get(THEMES.terco.name) || [];
  const homilia = byCategory.get(THEMES.homilia.name) || [];
  const cotidiano = byCategory.get(THEMES.cotidiano.name) || [];
  const noticias = byCategory.get(THEMES.noticias.name) || [];

  const featured = pickFeatured(activePosts);
  const heroSecondary = activePosts.slice(1, 7);

  return (
    <>
      {/* Topo */}
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                Blog do Tio Ben
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                Liturgia diária, santos, terço e reflexões católicas.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/blog/posts"
                className="rounded-full bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:opacity-95"
              >
                Ver todos
              </Link>
              <Link
                href={`/blog/categoria/${toCategorySlug(THEMES.liturgia.name)}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold border ${THEMES.liturgia.accentBorder} ${THEMES.liturgia.accentText} hover:bg-amber-50`}
              >
                Liturgia
              </Link>
              <Link
                href={`/blog/categoria/${toCategorySlug(THEMES.santos.name)}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold border ${THEMES.santos.accentBorder} ${THEMES.santos.accentText} hover:bg-rose-50`}
              >
                Santos
              </Link>
              <Link
                href={`/blog/categoria/${toCategorySlug(THEMES.terco.name)}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold border ${THEMES.terco.accentBorder} ${THEMES.terco.accentText} hover:bg-emerald-50`}
              >
                Terço
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ AD TOPO (já tinha) */}
      <AdSensePro slot="6026602273" height={120} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
          <main className="min-w-0 space-y-10">
            {/* HERO */}
            <BlogPortalHeroV2
              featured={featured}
              secondary={heroSecondary}
              siteUrl={SITE_URL}
            />

            {/* ✅ AD 1: banner horizontal entre HERO e 3 colunas (bom CTR; não polui) */}
            <AdBlock
              slot="4649759585"
              height={120}
              className="my-1"
            />

            {/* 3 colunas */}
            <BlogPortalThreeCols
              a={{
                theme: THEMES.liturgia,
                categorySlug: toCategorySlug(THEMES.liturgia.name),
                posts: liturgia,
              }}
              b={{
                theme: THEMES.santos,
                categorySlug: toCategorySlug(THEMES.santos.name),
                posts: santos,
              }}
              c={{
                theme: THEMES.terco,
                categorySlug: toCategorySlug(THEMES.terco.name),
                posts: terco,
              }}
              siteUrl={SITE_URL}
            />

            {/* ✅ AD 2: in-feed (maior) após 3 colunas */}
            <AdBlock
              slot="4921222321"
              height={250}
              className="my-1"
            />

            {/* HOMILIA */}
            <BlogPortalSectionV2
              theme={THEMES.homilia}
              categorySlug={toCategorySlug(THEMES.homilia.name)}
              posts={homilia}
              siteUrl={SITE_URL}
            />

            {/* ✅ AD 3: mobile-only (não polui desktop) */}
            <div className="block lg:hidden">
              <AdBlock
                slot="9515073457"
                height={250}
                className="my-1"
              />
            </div>

            {/* VIDA CRISTÃ */}
            <BlogPortalSectionV2
              theme={THEMES.cotidiano}
              categorySlug={toCategorySlug(THEMES.cotidiano.name)}
              posts={cotidiano}
              siteUrl={SITE_URL}
            />

            {/* ✅ AD 4: banner antes de Notícias (quebra natural) */}
            <AdBlock
              slot="6552840528"
              height={120}
              className="my-1"
            />

            {/* NOTÍCIAS */}
            <BlogPortalStrip
              theme={THEMES.noticias}
              categorySlug={toCategorySlug(THEMES.noticias.name)}
              posts={noticias}
            />
          </main>

          {/* Aside */}
          <aside className="hidden lg:block min-w-0">
            <BlogAside
              variant="desktop"
              adsSlotDesktop300x250="8534838745"
              hideLatestPosts
            />
          </aside>
        </div>
      </div>
    </>
  );
}
