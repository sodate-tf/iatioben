// app/blog/posts/page.tsx
import type { Metadata } from "next";
import BlogGrid from "@/components/BlogGrid";
import { getPostsAction } from "@/app/adminTioBen/actions/postAction";
import AdSensePro from "@/components/adsensePro";
import BlogAside from "@/components/aside/PostAside";
import { Post } from "@/app/adminTioBen/types";

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
  searchParams:
    | { page?: string; q?: string }
    | Promise<{ page?: string; q?: string }>;
}): Promise<Metadata> {
  const params = await Promise.resolve(searchParams);
  const page = Math.max(1, Number(params.page || 1));
  const q = (params.q || "").trim();

  const baseTitle = "Posts do Blog Tio Ben";
  const baseDesc =
    "Explore todos os posts do Blog Tio Ben: santos, liturgia e reflexões católicas.";
  const canonicalBase = `${SITE_URL}/blog/posts`;

  if (q) {
    return {
      title: `Buscar: ${q} | ${baseTitle}`,
      description: baseDesc,
      alternates: { canonical: canonicalBase },
      robots: { index: false, follow: true },
    };
  }

  if (page > 1) {
    return {
      title: `${baseTitle} — Página ${page}`,
      description: baseDesc,
      alternates: { canonical: `${canonicalBase}?page=${page}` },
      robots: { index: true, follow: true },
    };
  }

  return {
    title: baseTitle,
    description: baseDesc,
    alternates: { canonical: canonicalBase },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPostsPage({
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
      <section className="bg-amber-100 py-10 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-amber-900 mb-4">
            Todos os Posts
          </h1>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            Busque e explore todas as publicações do Blog do Tio Ben.
          </p>
        </div>
      </section>

      <AdSensePro slot="6026602273" height={140} />

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
