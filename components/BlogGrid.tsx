// components/BlogGrid.tsx
//
// Melhorias aplicadas:
// - Busca com debounce (não navega a cada tecla)
// - Paginação com Link (melhor crawl/SEO) + mantém botões se quiser
// - Corrige URLs: mantém q quando existe
// - Mantém seu ItemList JSON-LD, com alguns campos extras

"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Script from "next/script";
import type { Post } from "@/app/adminTioBen/types";
import AdSensePro from "./adsensePro";

const FALLBACK_IMAGE = "/images/santo-do-dia-ia-tio-ben.png";

interface BlogGridProps {
  posts: Post[];
  totalPages: number;
  currentPage: number;
  search: string;
}

function buildBlogUrl(page: number, q: string) {
  const qp = new URLSearchParams();
  if (q) qp.set("q", q);
  if (page > 1) qp.set("page", String(page));
  const qs = qp.toString();
  return qs ? `/blog?${qs}` : `/blog`;
}

export default function BlogGrid({
  posts,
  totalPages,
  currentPage,
  search,
}: BlogGridProps) {
  const router = useRouter();

  // input controlado + debounce
  const [query, setQuery] = useState(search);

  useEffect(() => {
    setQuery(search);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => {
      // sempre volta pra page 1 quando muda o termo
      const url = buildBlogUrl(1, query.trim());
      router.push(url);
    }, 450);

    return () => clearTimeout(t);
  }, [query, router]);

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://www.iatioben.com.br/blog/${post.slug}`,
        name: post.title,
      })),
    }),
    [posts]
  );

  const prevUrl = buildBlogUrl(Math.max(1, currentPage - 1), search);
  const nextUrl = buildBlogUrl(Math.min(totalPages, currentPage + 1), search);

  return (
    <section className="max-w-5xl mx-auto">
      <Script
        id="blog-itemlist"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Busca */}
      <div className="mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Buscar por santo, evangelho ou tema..."
          className="w-full p-4 rounded-xl border shadow-sm focus:ring-2 bg-amber-50 focus:ring-amber-600 text-gray-800"
        />
        <p className="mt-2 text-xs text-slate-600">
          Dica: use termos como “São José”, “Evangelho”, “Liturgia”, “Terço”.
        </p>
      </div>

      {/* Grid */}
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
                  <h2 className="text-xl font-bold text-amber-900 mb-2 line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 text-sm line-clamp-3">
                    {post.metaDescription}
                  </p>
                </div>
              </article>
            </Link>
          );
        })}
      </motion.div>

      <div className="mt-8">
        <AdSensePro slot="2887650656" height={140} />
      </div>

      {/* Paginação (Link = melhor para SEO/crawl) */}
      <nav className="flex justify-center gap-3 mt-10 flex-wrap" aria-label="Paginação do blog">
        <Link
          href={prevUrl}
          aria-disabled={currentPage <= 1}
          className={`px-4 py-2 bg-white border rounded-lg ${
            currentPage <= 1 ? "pointer-events-none opacity-40" : ""
          }`}
        >
          ◀ Voltar
        </Link>

        <span className="px-4 py-2 bg-amber-200 rounded-lg font-semibold">
          Página {currentPage} de {totalPages}
        </span>

        <Link
          href={nextUrl}
          aria-disabled={currentPage >= totalPages}
          className={`px-4 py-2 bg-white border rounded-lg ${
            currentPage >= totalPages ? "pointer-events-none opacity-40" : ""
          }`}
        >
          Avançar ▶
        </Link>
      </nav>
    </section>
  );
}
