// app/blog/page.tsx
import { Metadata } from "next";
import BlogGrid from "@/components/BlogGrid";
import { getPostsAction } from "@/app/adminTioBen/actions/postAction";

import Cabecalho from "@/components/cabecalho";
import Footer from "@/components/Footer";
import { Post } from "../adminTioBen/types";

const POSTS_PER_PAGE = 10;

/* ================= SEO ================= */
export const metadata: Metadata = {
  title: "Blog IA Tio Ben | Santos, Liturgia e Espiritualidade Católica",
  description:
    "Reflexões católicas, liturgia diária, santos do dia, Evangelho e espiritualidade para fortalecer sua fé.",
  alternates: {
    canonical: "https://www.iatioben.com.br/blog",
  },
};

/* ================= NORMALIZADOR ================= */
function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/* ================= PAGE SSR CORRIGIDO ================= */

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  // 👉 Agora correto!
  const params = await searchParams;

  const page = Number(params.page || 1);
  const search = params.q || "";

  // Busca real no DB
  const allPosts: Post[] = await getPostsAction();

  // Filtrar posts ativos
  const now = new Date();
  const activePosts = allPosts.filter((post) => {
    const publishDate = new Date(post.publishDate);
    const expiryDate = post.expiryDate ? new Date(post.expiryDate) : null;

    return (
      post.isActive &&
      publishDate <= now &&
      (!expiryDate || expiryDate > now)
    );
  });

  // Busca com normalização
  const filtered = search
    ? activePosts.filter((post) => {
        const term = normalize(search);
        return (
          normalize(post.title).includes(term) ||
          normalize(post.metaDescription || "").includes(term)
        );
      })
    : activePosts;

  // Ordenação
  filtered.sort(
    (a, b) =>
      new Date(b.publishDate).getTime() -
      new Date(a.publishDate).getTime()
  );

  // Paginação
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  const paginatedPosts = filtered.slice(start, end);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / POSTS_PER_PAGE)
  );

  return (
    <>
    <Cabecalho />
      {/* Texto SEO */}
      <section className="bg-amber-100 py-10 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-amber-900 mb-4">
            Blog do Tio Ben 📖
          </h1>

          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            Aqui você encontra reflexões católicas, comentários da Liturgia
            Diária, santos do dia, Evangelho e conteúdos de espiritualidade.
            Publicamos novos textos diariamente para enriquecer sua fé!
          </p>
        </div>
      </section>

      {/* Grid + Busca + Paginação */}
      <BlogGrid
        posts={paginatedPosts}
        totalPages={totalPages}
        currentPage={page}
        search={search}
      />
      <Footer />
    </>
  );
}
