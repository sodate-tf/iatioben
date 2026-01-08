// app/blog/page.tsx
//
// - Adiciona Aside no desktop (sem “últimos posts”)
// - generateMetadata dinâmico para:
//   - busca (?q=): noindex,follow + canonical /blog
//   - paginação (?page=2): index,follow + canonical /blog?page=2
// - Corrige layout para aside ficar AO LADO (minmax(0,1fr) + min-w-0)

import type { Metadata } from "next";
import BlogGrid from "@/components/BlogGrid";
import { getPostsAction } from "@/app/adminTioBen/actions/postAction";
import type { Post } from "../adminTioBen/types";
import AdSensePro from "@/components/adsensePro";
import BlogAside from "@/components/aside/PostAside";

const SITE_URL = "https://www.iatioben.com.br";
const POSTS_PER_PAGE = 10;

function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}


export async function generateMetadata({
  searchParams,
}: {
  searchParams: { page?: string; q?: string } | Promise<{ page?: string; q?: string }>;
}): Promise<Metadata> {
  const params = await Promise.resolve(searchParams);
  const page = Math.max(1, Number(params.page || 1));
  const q = (params.q || "").trim();

  const baseTitle = "Blog Tio Ben";
  const baseDesc =
    "Acesse o Blog Tio Ben e aprenda mais sobre a fé católica: santos, liturgia e reflexões para viver o Evangelho no dia a dia.";

  const canonicalBase = `${SITE_URL}/blog`;

  // ✅ WhatsApp-friendly (rota limpa .png)
  const ogImageBase = `${SITE_URL}/og/blog.png`;

  // Busca interna: NÃO indexar
  if (q) {
    const title = `Buscar: ${q} | ${baseTitle}`;
    const description = baseDesc;

    return {
      title,
      description,
      alternates: { canonical: canonicalBase },
      robots: { index: false, follow: true },

      openGraph: {
        type: "website",
        url: canonicalBase,
        siteName: baseTitle,
        locale: "pt_BR",
        title,
        description,
        images: [
          {
            url: ogImageBase,
            width: 1200,
            height: 630,
            alt: baseTitle,
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImageBase],
      },
    };
  }

  // Paginação: indexar com canonical específico
  if (page > 1) {
    const title = `${baseTitle} — Página ${page}`;
    const description = baseDesc;
    const canonical = `${canonicalBase}?page=${page}`;

    // ✅ Mantém a mesma imagem estática (melhor para cache/crawlers)
    const ogImage = ogImageBase;

    return {
      title,
      description,
      alternates: { canonical },
      robots: { index: true, follow: true },

      openGraph: {
        type: "website",
        url: canonical,
        siteName: baseTitle,
        locale: "pt_BR",
        title,
        description,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
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

  // Página principal
  return {
    title: baseTitle,
    description: baseDesc,
    alternates: { canonical: canonicalBase },
    robots: { index: true, follow: true },

    openGraph: {
      type: "website",
      url: canonicalBase,
      siteName: baseTitle,
      locale: "pt_BR",
      title: baseTitle,
      description: baseDesc,
      images: [
        {
          url: ogImageBase,
          width: 1200,
          height: 630,
          alt: baseTitle,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: baseTitle,
      description: baseDesc,
      images: [ogImageBase],
    },
  };
}




export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page || 1));
  const search = (params.q || "").trim();

  const allPosts: Post[] = await getPostsAction();

  const now = new Date();
  const activePosts = allPosts.filter((post) => {
    const publishDate = new Date(post.publishDate);
    const expiryDate = post.expiryDate ? new Date(post.expiryDate) : null;

    return post.isActive && publishDate <= now && (!expiryDate || expiryDate > now);
  });

  const filtered = search
    ? activePosts.filter((post) => {
        const term = normalize(search);
        return (
          normalize(post.title).includes(term) ||
          normalize(post.metaDescription || "").includes(term)
        );
      })
    : activePosts;

  filtered.sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  const paginatedPosts = filtered.slice(start, end);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));

  return (
    <>
      {/* Texto SEO */}
      <section className="bg-amber-100 py-10 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-amber-900 mb-4">
            Blog do Tio Ben
          </h1>

          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            Aqui você encontra reflexões católicas, comentários da Liturgia Diária,
            santos do dia, Evangelho e conteúdos de espiritualidade.
          </p>
        </div>
      </section>

      <AdSensePro slot="6026602273" height={140} />

      {/* Grid + Aside (desktop) */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
          <div className="min-w-0">
            <BlogGrid
              posts={paginatedPosts}
              totalPages={totalPages}
              currentPage={page}
              search={search}
            />
          </div>

          <div className="hidden lg:block min-w-0">
            <BlogAside
              variant="desktop"
              adsSlotDesktop300x250="8534838745"
              hideLatestPosts
            />
          </div>
        </div>
      </div>
    </>
  );
}
