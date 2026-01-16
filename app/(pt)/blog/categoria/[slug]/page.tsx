// app/blog/categoria/[slug]/page.tsx
import type { Metadata } from "next";
import BlogGrid from "@/components/BlogGrid";
import { getPostsAction } from "@/app/adminTioBen/actions/postAction";
import { Post } from "@/app/adminTioBen/types";
import { notFound } from "next/navigation";

const SITE_URL = "https://www.iatioben.com.br";
const POSTS_PER_PAGE = 12;

/* =======================
   HELPERS
======================= */

function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function toCategorySlug(name: string) {
  return normalize(name).replace(/\s+/g, "-");
}

/* =======================
   MAPA REAL (UUID → NOME)
   (igual ao da home)
======================= */

const CATEGORY_BY_ID: Record<string, string> = {
  "388b79e9-4a3a-4f9a-968c-2737cff74cce": "Liturgia",
  "7e0577dc-36c8-4f9d-b476-97af9dc1a077": "Homilia",
  "81f79787-be83-420f-b214-6b243da21cda": "Notícias",
  "ae6cd3b7-dbc9-4df2-bf7c-c372d6b7fe5a": "Cotidiano",
  "ba7adc02-de35-4405-b3f3-7391947d6281": "Santos",
  "da37f657-b94e-485f-be57-468815d712bd": "Terço",
};

/* Slug → Nome da categoria */
const CATEGORY_BY_SLUG: Record<string, string> = Object.fromEntries(
  Object.values(CATEGORY_BY_ID).map((name) => [toCategorySlug(name), name])
);

/* =======================
   METADATA
======================= */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = CATEGORY_BY_SLUG[slug];

  if (!categoryName) {
    return {
      title: "Categoria não encontrada | Blog Tio Ben",
      robots: { index: false, follow: false },
    };
  }

  const title = `${categoryName} | Blog Tio Ben`;
  const description = `Confira todos os conteúdos sobre ${categoryName} no Blog do Tio Ben: reflexões, artigos e publicações católicas.`;
  const canonical = `${SITE_URL}/blog/categoria/${slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
    },
  };
}

/* =======================
   PAGE
======================= */

export default async function BlogCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page || 1));

  const categoryName = CATEGORY_BY_SLUG[slug];

  /* ❌ Slug inválido → 404 real */
  if (!categoryName) {
    notFound();
  }

  const allPosts: Post[] = await getPostsAction();
  const now = new Date();

  const activePosts = allPosts
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

  /* ✅ FILTRO CORRETO (UUID → nome → slug) */
  const filtered = activePosts.filter((post) => {
    const name = CATEGORY_BY_ID[(post as any).categoryId];
    return name && toCategorySlug(name) === slug;
  });

  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  const paginated = filtered.slice(start, end);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* ✅ H1 forte */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-amber-900">
          {categoryName}
        </h1>
        <p className="text-gray-700 mt-2 max-w-3xl">
          Explore todos os conteúdos sobre <strong>{categoryName}</strong> no
          Blog do Tio Ben: artigos, reflexões e materiais católicos organizados
          por tema.
        </p>
      </header>

      {/* ✅ Lista semântica de posts */}
      <BlogGrid
        posts={paginated}
        totalPages={totalPages}
        currentPage={page}
        search={""}
        basePath={`/blog/categoria/${slug}`}
        enableSearch={false}
        />
    </div>
  );
}
