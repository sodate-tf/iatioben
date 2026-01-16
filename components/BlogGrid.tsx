// components/BlogGrid.tsx
//
// Refactor aplicado:
// - ✅ basePath (funciona em /blog e /blog/categoria/[slug])
// - ✅ busca opcional (desliga na categoria, se quiser)
// - ✅ debounce sem redirecionar para /blog (usa basePath)
// - ✅ cards alinhados ao portal: capa por /og quando não há coverImageUrl
// - ✅ semântica melhor: <section>, <nav>, <ul>/<li>, <article>, <h3>, <time>
// - ✅ paginação com Link (crawl-friendly) mantendo querystring quando existe
// - ✅ mantém JSON-LD ItemList

"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Script from "next/script";
import type { Post } from "@/app/adminTioBen/types";
import AdSensePro from "./adsensePro";

const SITE_URL = "https://www.iatioben.com.br";
const FALLBACK_IMAGE = "/images/santo-do-dia-ia-tio-ben.png";

interface BlogGridProps {
  posts: Post[];
  totalPages: number;
  currentPage: number;
  search: string;

  /** ✅ Base da rota para paginação/busca (ex.: "/blog" ou "/blog/categoria/liturgia") */
  basePath?: string;

  /** ✅ Liga/desliga a UI de busca (recomendado desligar nas categorias) */
  enableSearch?: boolean;

  /** Slot opcional para in-feed dentro do grid */
  adsSlotInFeed?: string;
}

/** Gera URL preservando basePath, page e q */
function buildListUrl(opts: { basePath: string; page: number; q: string }) {
  const { basePath, page, q } = opts;

  const qp = new URLSearchParams();
  if (q) qp.set("q", q);
  if (page > 1) qp.set("page", String(page));

  const qs = qp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

function formatDatePtBr(d: string | Date) {
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleDateString("pt-BR");
}
function dateTimeIso(d: string | Date) {
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toISOString();
}

/** Se você já tem /og com mockups, use isso como “capa automática” */
function getAutoCover(post: Post) {
  // Se o post tem imagem, usa ela
  const cover = post.coverImageUrl?.trim();
  if (cover) return cover;

  // Senão, usa /og com título (mockup)
  // Você pode evoluir depois para m=1..6, tint por categoria, etc.
  const title = encodeURIComponent(post.title || "Post");
  return `${SITE_URL}/og?type=post&m=1&tint=slate&title=${title}&v=grid`;
}

export default function BlogGrid({
  posts,
  totalPages,
  currentPage,
  search,
  basePath = "/blog",
  enableSearch = true,
  adsSlotInFeed = "2887650656",
}: BlogGridProps) {
  const router = useRouter();

  // input controlado + debounce (somente se enableSearch = true)
  const [query, setQuery] = useState(search);

  useEffect(() => {
    setQuery(search);
  }, [search]);

  useEffect(() => {
    if (!enableSearch) return;

    const t = setTimeout(() => {
      const url = buildListUrl({
        basePath,
        page: 1,
        q: query.trim(),
      });
      router.push(url);
    }, 450);

    return () => clearTimeout(t);
  }, [query, router, basePath, enableSearch]);

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/blog/${post.slug}`,
        name: post.title,
      })),
    }),
    [posts]
  );

  const prevUrl = buildListUrl({
    basePath,
    page: Math.max(1, currentPage - 1),
    q: enableSearch ? search : "",
  });

  const nextUrl = buildListUrl({
    basePath,
    page: Math.min(totalPages, currentPage + 1),
    q: enableSearch ? search : "",
  });

  return (
    <section className="max-w-6xl mx-auto" aria-label="Lista de posts">
      <Script
        id="blog-itemlist"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Busca (opcional) */}
      {enableSearch ? (
        <div className="mb-8">
          <label htmlFor="blog-search" className="sr-only">
            Buscar posts
          </label>
          <input
            id="blog-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por santo, evangelho ou tema..."
            className="w-full p-4 rounded-2xl border shadow-sm focus:ring-2 bg-amber-50 focus:ring-amber-600 text-gray-800"
            inputMode="search"
          />
          <p className="mt-2 text-xs text-slate-600">
            Dica: use termos como “São José”, “Evangelho”, “Liturgia”, “Terço”.
          </p>
        </div>
      ) : null}

      {/* Grid (semântico) */}
      <motion.ul
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        role="list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {posts.map((post) => {
          const imageSrc = getAutoCover(post) || FALLBACK_IMAGE;
          const href = `/blog/${post.slug}`;

          return (
            <li key={(post as any).id ?? post.slug}>
              <article className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden border border-slate-200">
                <Link href={href} className="block" aria-label={post.title}>
                  <div className="relative w-full aspect-[16/9] bg-slate-100">
                    {/* Se for URL externa do /og, Image precisa permitir remotePatterns.
                        Se não quiser mexer nisso agora, substitua por <img>.
                    */}
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
                    <time
                      className="text-xs text-slate-500"
                      dateTime={dateTimeIso(post.publishDate)}
                    >
                      {formatDatePtBr(post.publishDate)}
                    </time>

                    <h3 className="mt-2 text-lg font-extrabold text-slate-900 leading-snug line-clamp-2">
                      {post.title}
                    </h3>

                    {post.metaDescription ? (
                      <p className="mt-2 text-slate-700 text-sm leading-relaxed line-clamp-3">
                        {post.metaDescription}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </article>
            </li>
          );
        })}
      </motion.ul>

      {/* In-feed ad (sem quebrar layout) */}
      {adsSlotInFeed ? (
        <div className="mt-8" style={{ minHeight: 140 }}>
          <AdSensePro slot={adsSlotInFeed} height={140} />
        </div>
      ) : null}

      {/* Paginação */}
      <nav
        className="flex justify-center gap-3 mt-10 flex-wrap"
        aria-label="Paginação"
      >
        <Link
          href={prevUrl}
          aria-disabled={currentPage <= 1}
          className={`px-4 py-2 bg-white border rounded-xl ${
            currentPage <= 1 ? "pointer-events-none opacity-40" : ""
          }`}
        >
          ◀ Voltar
        </Link>

        <span className="px-4 py-2 bg-amber-100 text-amber-900 rounded-xl font-semibold border border-amber-200">
          Página {currentPage} de {totalPages}
        </span>

        <Link
          href={nextUrl}
          aria-disabled={currentPage >= totalPages}
          className={`px-4 py-2 bg-white border rounded-xl ${
            currentPage >= totalPages ? "pointer-events-none opacity-40" : ""
          }`}
        >
          Avançar ▶
        </Link>
      </nav>
    </section>
  );
}
