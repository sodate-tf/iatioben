// components/BlogPostDetail.tsx
'use client';
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
// O Spinner foi removido pois os dados já chegam prontos via post: Post
// import Spinner from './SpinnerLoading'; 
import Cabecalho from './cabecalho';
// O AdSense foi mantido no import, mas não estava sendo usado no JSX
// import AdSense from './Adsense'; 
import type { Post } from '@/app/adminTioBen/types';
import Image from 'next/image';
import Footer from './Footer';

interface BlogPostDetailProps {
  // Recebe o objeto Post COMPLETO
  post: Post;
}

// ⚠️ Mude para HTTPS
const FALLBACK_IMAGE_URL = "/images/default-cover.png";
const SITE_URL = "https://www.iatioben.com.br"; // Alterado para HTTPS (melhor prática!)

export default function BlogPostDetail({ post }: BlogPostDetailProps) {
  // Os dados já vêm prontos
  const postData = post;

  // Mantém apenas os estados de interatividade/UI
  const [error, setError] = useState<string | null>(null);
  // Mantém a funcionalidade de acessibilidade de fonte
  const [fontSize, setFontSize] = useState(16);

  // 📤 Compartilhar post
  const handleShare = useCallback(async () => {
    // Validação de dados
    if (!postData) return;

    const shareText = `🔥 Leia: ${postData.title} no Blog do Tio Ben!\n\n${postData.metaDescription || postData.title}\n\n`;
    const shareUrl = window.location.href; // Funciona apenas no lado do cliente

    if (!shareUrl) {
      console.error("URL da página não disponível para compartilhamento.");
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: postData.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // Validação de erro com tipo explícito
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao compartilhar.';
        console.error('Erro ao compartilhar:', errorMessage);
        setError(errorMessage);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText + shareUrl);
        alert('Link e resumo do post copiados para a área de transferência!');
      } catch (err) {
        // Erro de cópia não interrompe a UI principal, apenas loga
        console.error('Erro ao copiar:', err);
      }
    }
  }, [postData]);

  // 📅 Data formatada: Validação de data
  const dataFormatada = postData.publishDate
    ? new Date(postData.publishDate).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
    : '';

  const imageUrl = postData.coverImageUrl || FALLBACK_IMAGE_URL;
  // O canonical URL não precisa ser re-calculado, mas foi mantido
  // const canonicalUrl = `${SITE_URL}/blog/${postData.slug}`; 

  // Se houver erro de compartilhamento ou outros erros de UI
  if (error) {
    return (
      // O contêiner principal 'w-full' e o 'max-w-4xl mx-auto' já ajudam a centralizar e limitar
      <div className="flex flex-col min-h-screen bg-amber-400 relative w-full overflow-x-hidden"> 
        <Cabecalho />
        <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-4xl mx-auto w-full">
          <div className="w-full text-center">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    // 💡 Adicionado 'overflow-x-hidden' para garantir que nada na tela cause rolagem horizontal
    <div className="flex flex-col min-h-screen bg-amber-400 relative w-full overflow-x-hidden">
      <Cabecalho />

      {/* 💡 Ajustado: 'px-4' (mobile) e 'max-w-4xl' garante que o conteúdo não estoure */}
      <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-4xl mx-auto w-full"> 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          // Ajuste de padding: 'p-6' para mobile, 'md:p-8' para desktop
          className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full" 
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
              // Ajustes de tamanho do botão para mobile
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

          {/* Imagem de capa: Ajustado para usar aspect ratio e garantir que a imagem inteira apareça */}
          <div className="mb-6 relative w-full">
            {/* 💡 Novo: Adicionado 'aspect-[16/9]' para forçar a proporção 16:9 (bom para capas) */}
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg shadow-xl"> 
              <Image
                src={imageUrl}
                alt={postData.title}
                fill
                // 💡 Alterado 'object-cover' para 'object-contain' para mostrar a imagem INTEIRA
                // Se o desejo for preencher o espaço (e talvez cortar), volte para 'object-cover'
                // Aqui, 'object-contain' garante que ela não seja cortada.
                className="object-contain" 
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
            {/* 💡 Removido o estilo fixo de altura: style={{ height: '24rem' }} */}
          </div>

          {/* Título e Metadados */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-amber-900 mb-3 leading-tight">
              {postData.title}
            </h1>
            <p className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              {postData.categoryName ?? 'Sem categoria'}
            </p>
            <p className="text-sm text-gray-500">Publicado em {dataFormatada}</p>
          </div>

          {/* Conteúdo */}
          <div
            className="text-gray-700 leading-relaxed prose max-w-none" // Adicionado 'prose max-w-none' para estilizar HTML interno
            style={{ fontSize: `${fontSize}px` }}
            dangerouslySetInnerHTML={{ __html: postData.content }}
          />
        </motion.div>
      </div>

      {/* Anúncios e Rodapé */}
      <Footer />
    </div>
  );
}