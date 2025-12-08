'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Script from "next/script";
import { Post } from "@/app/adminTioBen/types";

const FALLBACK_IMAGE = "/images/santo-do-dia-ia-tio-ben.png";

interface BlogGridProps {
  posts: Post[];
  totalPages: number;
  currentPage: number;
  search: string;
}

export default function BlogGrid({
  posts,
  totalPages,
  currentPage,
  search,
}: BlogGridProps) {
  const router = useRouter();

  /* ✅ BUSCA TIPO GOOGLE */
  function handleSearch(value: string) {
    router.push(`/blog?q=${encodeURIComponent(value)}&page=1`);
  }

  function changePage(page: number) {
    router.push(`/blog?q=${encodeURIComponent(search)}&page=${page}`);
  }

  /* ✅ SCHEMA.ORG ITEMLIST */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://www.iatioben.com.br/blog/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      {/* ✅ SCHEMA SEO */}
      <Script
        id="blog-itemlist"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ✅ CAMPO DE BUSCA */}
      <div className="mb-8">
        <input
          defaultValue={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="🔍 Buscar por santo, evangelho ou tema..."
          className="w-full p-4 rounded-xl border shadow-sm focus:ring-2 bg-amber-50 focus:ring-amber-600 text-gray-800"
        />
      </div>

      {/* ✅ GRID RESPONSIVO */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {posts.map((post) => {
          const imageSrc =
            post.coverImageUrl && post.coverImageUrl.trim() !== ""
              ? post.coverImageUrl
              : FALLBACK_IMAGE;

          return (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block">
              <article className="bg-white rounded-xl shadow-lg hover:shadow-xl transition overflow-hidden border border-amber-200">
                <div className="relative w-full aspect-[16/9]">
                  <Image
                    src={imageSrc}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-bold text-amber-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-3">
                    {post.metaDescription}
                  </p>
                </div>
              </article>
            </Link>
          );
        })}
      </motion.div>

      {/* ✅ PAGINAÇÃO */}
      <div className="flex justify-center gap-3 mt-10 flex-wrap">
        <button
          disabled={currentPage <= 1}
          onClick={() => changePage(currentPage - 1)}
          className="px-4 py-2 bg-white border rounded-lg disabled:opacity-40"
        >
          ◀ Voltar
        </button>

        <span className="px-4 py-2 bg-amber-200 rounded-lg font-semibold">
          Página {currentPage} de {totalPages}
        </span>

        <button
          disabled={currentPage >= totalPages}
          onClick={() => changePage(currentPage + 1)}
          className="px-4 py-2 bg-white border rounded-lg disabled:opacity-40"
        >
          Avançar ▶
        </button>
      </div>
    </section>
  );
}
