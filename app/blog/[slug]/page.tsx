// app/blog/[slug]/page.tsx

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogPostDetail from "../../../components/BlogPostDetail";


import { getPostBySlug } from "@/app/adminTioBen/actions/postAction";
import type { Post } from "@/app/adminTioBen/types";
import BlogAside from "@/components/aside/PostAside";

const SITE_URL = "https://www.iatioben.com.br";

async function getPostDataBySlug(slug: string): Promise<Post | null> {
  if (!slug) return null;

  try {
    const postData = await getPostBySlug(slug);
    if (postData && postData.slug === slug) return postData;
    return null;
  } catch (error) {
    console.error("Erro ao buscar post pelo slug:", (error as Error).message);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolved = await Promise.resolve(params);
  const slug = (resolved.slug || "").trim();

  const postData = await getPostDataBySlug(slug);

  if (!postData) {
    return {
      title: "Página Não Encontrada - Blog Tio Ben",
      robots: { index: false, follow: false },
    };
  }

  const canonical = `${SITE_URL}/blog/${postData.slug}`;
  const title = postData.title || "Blog Tio Ben";
  const description = (postData.metaDescription || postData.title || "").trim();

  // ✅ WhatsApp-friendly:
  // 1) se coverImageUrl for absoluta, usa ela
  // 2) senão, usa rota limpa .png (sem query)
  const ogImage =
    postData.coverImageUrl?.startsWith("http")
      ? postData.coverImageUrl
      : `${SITE_URL}/og/blog/${postData.slug}.png`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },

    openGraph: {
      title,
      description,
      type: "article",
      url: canonical,
      siteName: "Blog Tio Ben",
      locale: "pt_BR",
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



export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const postData = await getPostDataBySlug(slug);

  if (!postData) notFound();

  return (
  <div className="flex flex-col min-h-screen bg-amber-400 relative w-full overflow-x-hidden">
    <div className="flex-1 px-4 py-8 max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
        {/* Conteúdo do post (Client Component) */}
        <div className="min-w-0">
          <BlogPostDetail post={postData} />
        </div>

        {/* Aside padrão Liturgia (Server Component) */}
        <div className="hidden lg:block min-w-0">
          <BlogAside
            variant="desktop"
            currentSlug={postData.slug}
            adsSlotDesktop300x250="8534838745"
          />
        </div>
      </div>
    </div>
  </div>
);

}
