'use client';
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Post } from '@/app/adminTioBen/types';
import Image from 'next/image';
import AdSensePro from './adsensePro';

const FALLBACK_IMAGE = '/images/santo-do-dia-ia-tio-ben.png';
const SITE_URL = 'https://www.iatioben.com.br';

interface BlogPostDetailProps {
  post: Post;
}

export default function BlogPostDetail({ post }: BlogPostDetailProps) {
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(16);

  const handleShare = useCallback(async () => {
    if (!post) return;
    const shareText = `🔥 Leia: ${post.title} no Blog do Tio Ben!\n\n${post.metaDescription || post.title}\n\n`;
    const shareUrl = window.location.href;

    if (!shareUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro desconhecido ao compartilhar.';
        setError(msg);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText + shareUrl);
        alert('Link e resumo do post copiados para a área de transferência!');
      } catch (err) {
        console.error('Erro ao copiar:', err);
      }
    }
  }, [post]);

  const dataFormatada = post.publishDate
    ? new Date(post.publishDate).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const hasCover = !!post.coverImageUrl && post.coverImageUrl.trim() !== '';
  const imageUrl = hasCover ? post.coverImageUrl : FALLBACK_IMAGE;

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-amber-400 relative w-full overflow-x-hidden">
        
        <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-4xl mx-auto w-full">
          <p className="text-red-600 text-lg text-center">{error}</p>
        </div>
        
      </div>
    );
  }

  // ---------------------------------------------------------------------------
// 📌 JSON-LD (Schema.org)
// ---------------------------------------------------------------------------
const schemaData = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "description": post.metaDescription || post.title,
  "image": post.coverImageUrl
    ? `${post.coverImageUrl}`
    : "https://www.iatioben.com.br/images/default-cover.png",
  "author": {
    "@type": "Organization",
    "name": "IA Tio Ben",
    "url": "https://www.iatioben.com.br"
  },
  "publisher": {
    "@type": "Organization",
    "name": "IA Tio Ben",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.iatioben.com.br/images/ben-transparente.png"
    }
  },
  "url": `https://www.iatioben.com.br/blog/${post.slug}`,
  "mainEntityOfPage": `https://www.iatioben.com.br/blog/${post.slug}`,
  "datePublished": post.publishDate,
  "dateModified": post.updatedAt ?? post.publishDate,
  // Extra para SEO de "Santos"
  "about": {
    "@type": "Person",
    "name": post.title,
    "description": post.metaDescription || ""
  }
};



  return (
    <div className="flex flex-col min-h-screen bg-amber-400 relative w-full overflow-x-hidden">
     

      <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-4xl mx-auto w-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full"
        >
          {/* Cabeçalho com botão de voltar e compartilhar */}
          <div className="flex justify-between items-center mb-6 border-b pb-3 border-amber-200">
            <Link
              href="/blog"
              className="flex items-center text-sm md:text-base text-gray-700 hover:text-amber-700 transition-colors font-medium"
            >
              <span className="text-xl mr-1">&larr;</span> Voltar
            </Link>

            <button
              onClick={handleShare}
              className="px-3 py-1 text-xs md:px-4 md:py-2 rounded-full bg-amber-600 text-white md:text-sm font-semibold shadow-md hover:bg-amber-700 transition-colors flex items-center gap-1"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
              >
                <path
                  d="M11 6C12.66 6 14 4.66 14 3C14 1.34 12.66 0 11 0C9.34 0 8 1.34 8 3C8 3.22 8.02 3.44 8.07 3.65L4.87 5.65C4.36 5.24 3.71 5 3 5C1.34 5 0 6.34 0 8C0 9.66 1.34 11 3 11C3.71 11 4.36 10.76 4.87 10.35L8.07 12.35C8.02 12.56 8 12.78 8 13C8 14.66 9.34 16 11 16C12.66 16 14 14.66 14 13C14 11.34 12.66 10 11 10C10.29 10 9.64 10.24 9.13 10.65L5.93 8.65C5.98 8.44 6 8.22 6 8C6 7.78 5.98 7.56 5.93 7.35L9.13 5.35C9.64 5.76 10.29 6 11 6Z"
                  fill="white"
                />
              </svg>
              Compartilhar
            </button>
          </div>

          {/* Imagem de capa ou fallback com título sobreposto */}
          <div className="mb-6 relative w-full aspect-[16/9] overflow-hidden rounded-lg shadow-xl">
            <Image
              src={imageUrl || FALLBACK_IMAGE}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className={`object-cover object-center ${hasCover ? '' : 'brightness-50'}`}
            />
            {!hasCover && (
              <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                <h2
                  className="font-extrabold uppercase text-[#FFD119] leading-tight break-words"
                  style={{
                    fontSize: 'clamp(1.2rem, 6vw, 3.8rem)',
                    width: '66%',
                    textShadow: '2px 2px 6px rgba(0,0,0,0.8)',
                    wordWrap: 'break-word',
                    lineHeight: '1.1',
                  }}
                >
                  {post.title}
                </h2>
              </div>
            )}
          </div>

          {/* Título e informações */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4 leading-snug font-reading">
              {post.title}
            </h1>
            <p className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              {post.categoryName ?? 'Sem categoria'}
            </p>
            <p className="text-sm text-gray-600 font-reading">
              Publicado em {dataFormatada}
            </p>
          </div>
          <AdSensePro slot="3041346283" height={180} />
          {/* Conteúdo */}
          <div
            className="
              mt-6
              p-6
              bg-[#fffaf1]
              rounded-xl
              border border-amber-200
              shadow-sm
              max-w-3xl
              mx-auto
              text-gray-900
              prose
              prose-amber
              font-reading
            "
            style={{ fontSize: `${fontSize}px`, lineHeight: "1.9" }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.div>
      </div>
      <AdSensePro slot="2672028232" height={140} />
    </div>
  );
}
