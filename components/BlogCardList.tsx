"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Spinner from "./SpinnerLoading";
import Cabecalho from "./cabecalho";
import Footer from "./Footer";
import { useData } from "@/app/adminTioBen/contexts/DataContext";
import type { Post } from "@/app/adminTioBen/types";

const FALLBACK_IMAGE = "/images/santo-do-dia-ia-tio-ben.png";

// Normaliza strings (remove acentos e deixa minúsculo)
function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function BlogCardList() {
  const { activePosts } = useData();
  const isLoading = !activePosts.length;

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Debounce da busca
  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  // Filtragem com busca
  const filteredPosts: Post[] = useMemo(() => {
    if (!search.trim()) return activePosts;

    const term = normalize(search);

    return activePosts.filter((post: Post) => {
      const titleNorm = normalize(post.title || "");
      const descNorm = normalize(post.metaDescription || "");

      return (
        titleNorm.includes(term) ||
        descNorm.includes(term)
      );
    });
  }, [activePosts, search]);

  // Reset de página quando muda o filtro
  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / pageSize)
  );

  const start = (page - 1) * pageSize;
  const paginatedPosts = filteredPosts.slice(start, start + pageSize);

  // JSON-LD ItemList para SEO
  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: paginatedPosts.map((post: Post, index: number) => ({
      "@type": "ListItem",
      position: start + index + 1,
      url: `https://www.iatioben.com.br/blog/${post.slug}`,
      name: post.title,
      description: post.metaDescription || "",
    })),
  };

  const handlePrev = () => {
    setPage((p) => Math.max(1, p - 1));
  };

  const handleNext = () => {
    setPage((p) => Math.min(totalPages, p + 1));
  };

  return (
    <div className="flex flex-col min-h-screen bg-amber-400 relative">
      <Cabecalho />

      {/* JSON-LD para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }}
      />

      <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-4xl mx-auto w-full">
        {/* TÍTULO + TEXTO INTRODUTÓRIO */}
        <motion.div
          className="w-full max-w-3xl text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">
            Blog do Tio Ben 📜
          </h1>
          <p className="text-gray-800 text-sm md:text-base leading-relaxed">
            Aqui você encontra{" "}
            <strong>reflexões diárias</strong>,{" "}
            <strong>comentários da liturgia</strong>, santos do dia,
            espiritualidade católica e conteúdos pensados para ajudar
            você a rezar melhor com a Palavra de Deus. Navegue pelos
            artigos, busque temas específicos ou procure pelo nome de
            um santo que você ama conhecer mais. 🙏✨
          </p>
        </motion.div>

        {/* BUSCA */}
        <div className="w-full max-w-3xl mb-6">
          <label
            htmlFor="blog-search"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Buscar por santo, tema ou palavra-chave:
          </label>
          <div className="flex items-center gap-2">
            <input
              id="blog-search"
              type="text"
              className="flex-1 px-3 py-2 rounded-lg border border-amber-300 shadow-sm text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
              placeholder="Ex: São Francisco, Ano Litúrgico, Evangelho do dia..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <p className="mt-1 text-xs text-gray-700">
            {filteredPosts.length === 0
              ? "Nenhum artigo encontrado para a sua busca."
              : `Mostrando ${paginatedPosts.length} de ${filteredPosts.length} artigo(s).`}
          </p>
        </div>

        {/* LISTA / GRID */}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {filteredPosts.length === 0 ? (
              <div className="w-full max-w-3xl bg-amber-100 border border-amber-300 rounded-xl p-4 text-sm md:text-base text-gray-800 shadow">
                Não encontramos nenhum artigo com esse termo de busca.
                Tente palavras mais simples ou confira os últimos posts
                na página inicial do blog.
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {paginatedPosts.map((post: Post) => {
                    const hasCover =
                      !!post.coverImageUrl &&
                      post.coverImageUrl.trim() !== "";
                    const imageSrc = hasCover
                      ? post.coverImageUrl
                      : FALLBACK_IMAGE;

                    return (
                      <Link
                        href={`/blog/${post.slug}`}
                        key={post.id}
                        className="block"
                      >
                        <article className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-amber-200 h-full flex flex-col">
                          <div className="relative w-full aspect-[16/9] overflow-hidden">
                            <Image
                              src={imageSrc || FALLBACK_IMAGE}
                              alt={post.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className={`object-cover object-center ${
                                hasCover ? "" : "brightness-50"
                              }`}
                              loading="lazy"
                            />

                            {/* Título sobre a imagem fallback */}
                            {!hasCover && (
                              <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                                <h2
                                  className="font-extrabold uppercase text-[#FFD119] leading-tight break-words text-balance"
                                  style={{
                                    fontSize: "clamp(0.9rem, 3vw, 2rem)",
                                    width: "66%",
                                    maxHeight: "90%",
                                    lineHeight: "1.1",
                                    textShadow:
                                      "2px 2px 6px rgba(0,0,0,0.8)",
                                    overflowWrap: "break-word",
                                    wordBreak: "break-word",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                  }}
                                >
                                  {post.title}
                                </h2>
                              </div>
                            )}
                          </div>

                          <div className="p-4 flex-1 flex flex-col">
                            <h3 className="text-lg md:text-xl font-bold text-amber-900 mb-2 leading-snug line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                              {post.metaDescription}
                            </p>
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </motion.div>

                {/* PAGINAÇÃO */}
                <div className="w-full max-w-3xl mt-8 flex items-center justify-between text-sm md:text-base gap-3 flex-wrap">
                  <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    className="px-3 py-2 rounded-lg border border-amber-300 bg-white text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-50 transition"
                  >
                    ‹ Anterior
                  </button>

                  <div className="flex-1 text-center text-gray-800">
                    Página <strong>{page}</strong> de{" "}
                    <strong>{totalPages}</strong>
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={page === totalPages}
                    className="px-3 py-2 rounded-lg border border-amber-300 bg-white text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-50 transition"
                  >
                    Próxima ›
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
