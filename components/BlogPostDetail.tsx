'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Head from 'next/head'; // Importação essencial para Meta Tags em Client Components
import Spinner from './SpinnerLoading';
import Cabecalho from './cabecalho';
import AdSense from './Adsense';
import { useData } from '@/app/adminTioBen/contexts/DataContext';
import type { Post } from '@/app/adminTioBen/types';
import Image from 'next/image';

interface BlogPostDetailProps {
  slug: string; // recebido da rota dinâmica
}

// URL de fallback para quando o post não tiver imagem de capa
const FALLBACK_IMAGE_URL = "/images/default-cover.png"; 

// Informações gerais do site/branding (Ajuste estas variáveis!)
const SITE_TITLE = "Blog IA Tio Ben";
const SITE_URL = "http://www.iatioben.com.br";
const SITE_LOCALE = "pt_BR";
const SITE_AUTHOR = "IA Tio Ben"; 

export default function BlogPostDetail({ slug }: BlogPostDetailProps) {
  const { activePosts } = useData();
  const [postData, setPostData] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(16);

  // 🔍 Busca o post pelo slug
  useEffect(() => {
    setIsLoading(true);
    const post = activePosts.find((p) => p.slug === slug);
    if (post) {
      setPostData(post);
      setError(null);
    } else {
      setPostData(null);
      setError(`Post com slug '${slug}' não encontrado.`);
    }
    setIsLoading(false);
  }, [slug, activePosts]);

  // 📤 Compartilhar post
  const handleShare = useCallback(async () => {
    if (!postData) return;

    // Use o metaDescription para o texto de compartilhamento
    const shareText = `🔥 Leia: ${postData.title} no Blog do Tio Ben!\n\n${postData.metaDescription}\n\n`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: postData.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err: unknown) {
        console.error('Erro ao compartilhar:', err);
        setError(
          err instanceof Error ? err.message : 'Erro desconhecido ao compartilhar.'
        );
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText + shareUrl);
        alert('Link e resumo do post copiados para a área de transferência!');
      } catch (err) {
        console.error('Erro ao copiar:', err);
      }
    }
  }, [postData]);

  // 📅 Data formatada
  const dataFormatada = postData?.publishDate
    ? new Date(postData.publishDate).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  // URL da imagem a ser usada, com fallback
  const imageUrl = postData?.coverImageUrl || FALLBACK_IMAGE_URL;

  // URL canônica completa para o post
  const canonicalUrl = `${SITE_URL}/blog/${slug}`;

  // Se o postData ainda não carregou, renderiza apenas o loader/erro e sai.
  if (isLoading || error || !postData) {
      // Retorna o JSX original sem as meta tags dinâmicas
      return (
          <div className="flex flex-col min-h-screen bg-amber-400 relative">
              <Cabecalho />
              <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-4xl mx-auto w-full">
                  {isLoading ? <Spinner /> : (
                      <div className="w-full text-center">
                          <Link href="/blog" className="text-amber-900 hover:underline mb-4 inline-block font-semibold">
                              &larr; Voltar para o Blog
                          </Link>
                          <p className="text-red-600 text-lg">{error}</p>
                      </div>
                  )}
              </div>
              <AdSense adSlot="5858882948" adFormat="autorelaxed" />
              <footer className="bg-amber-100 text-center py-4 mt-auto">
                  {/* ... (footer content) */}
              </footer>
          </div>
      );
  }
  
  // =========================================================================
  // GERAÇÃO DOS METADADOS AVANÇADOS AQUI
  // =========================================================================
  const { title, metaDescription, categoryName, keywords } = postData;
  const keywordsArray = keywords ? keywords.split(',').map(k => k.trim()) : [];
  const publishedTime = postData.publishDate ? new Date(postData.publishDate).toISOString() : '';
  const modifiedTime = postData.publishDate ? new Date(postData.publishDate).toISOString() : publishedTime;

  return (
    <div className="flex flex-col min-h-screen bg-amber-400 relative">
      <head>
        {/* ==================================== */}
        {/* 1. METADADOS BÁSICOS (SEO e Geral) */}
        {/* ==================================== */}
        <title>{title} | {SITE_TITLE}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="keywords" content={keywordsArray.join(', ')} />
        <meta name="author" content={SITE_AUTHOR} />
        
        {/* ==================================== */}
        {/* 2. OPEN GRAPH (Redes Sociais: Facebook, LinkedIn, WhatsApp) */}
        {/* ==================================== */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={SITE_TITLE} />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content={SITE_LOCALE} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:alt" content={title} />
        
        {/* ==================================== */}
        {/* 3. OPEN GRAPH - ARTIGO (Meta Dados Avançados) */}
        {/* ==================================== */}
        <meta property="article:published_time" content={publishedTime} />
        <meta property="article:modified_time" content={modifiedTime} />
        <meta property="article:author" content={SITE_AUTHOR} /> 
        <meta property="article:section" content={categoryName} />
        {keywordsArray.map((keyword, index) => (
            <meta key={`tag-${index}`} property="article:tag" content={keyword} />
        ))}
        
        {/* ==================================== */}
        {/* 4. TWITTER CARD (Meta Dados Específicos para X/Twitter) */}
        {/* ==================================== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={imageUrl} />
        {/* Opcional: <meta name="twitter:site" content="@SeuHandleTwitter" /> */}
        
      </head>

      <Cabecalho />

      <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-4 md:p-8 w-full"
        >
          {/* Cabeçalho do Post */}
          <div className="flex justify-between items-center mb-6 border-b pb-3 border-amber-200">
            <Link
              href="/blog"
              className="flex items-center text-sm md:text-base text-gray-700 hover:text-amber-700 transition-colors font-medium"
            >
              <span className="text-xl mr-1">&larr;</span> Voltar
            </Link>

            <button
              onClick={handleShare}
              className="px-3 py-1 md:px-4 md:py-2 rounded-full bg-amber-600 text-white text-sm font-semibold shadow-md hover:bg-amber-700 transition-colors flex items-center gap-1"
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

          {/* Imagem de capa */}
          <div className="mb-6 relative w-full" style={{ height: '24rem' }}>
            <Image
              src={imageUrl} 
              alt={postData.title}
              fill 
              sizes="(max-width: 768px) 100vw, 800px" 
              className="object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Título e Metadados */}
          <div className="text-center mb-6">
            {/* O <h1> principal está nas metadatas, mas aqui mantemos uma tag para o visual */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-amber-900 mb-3 leading-tight">
              {postData.title}
            </h1>

            {/* Badge da Categoria */}
            <p className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              {postData.categoryName ?? 'Sem categoria'}
            </p>

            <p className="text-sm text-gray-500">Publicado em {dataFormatada}</p>
          </div>

          {/* Conteúdo */}
          <div
            className="text-gray-700 leading-relaxed" 
            style={{ fontSize: `${fontSize}px` }}
            dangerouslySetInnerHTML={{ __html: postData.content }}
          /> 
        </motion.div>
      </div>

      {/* Anúncios e Rodapé */}
      <AdSense adSlot="5858882948" adFormat="autorelaxed" />
      <footer className="bg-amber-100 text-center py-4 mt-auto">
        <div id="ezoic-pub-ad-placeholder-103"></div>
        <Link href="http://www.iatioben.com.br/termo-de-responsabilidade" className="hover:underline text-gray-700 text-sm">
          Termo de responsabilidade
        </Link>
        <p className="text-gray-600 text-sm mt-1">
          Desenvolvido por{' '}
          <Link href="http://4udevelops.com.br" className="hover:underline">
            4U Develops
          </Link>{' '}
          - Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}