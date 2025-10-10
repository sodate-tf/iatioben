// components/BlogPostDetail.tsx
'use client';
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Spinner from './SpinnerLoading';
import Cabecalho from './cabecalho';
import AdSense from './Adsense';
import type { Post } from '@/app/adminTioBen/types';
import Image from 'next/image';

interface BlogPostDetailProps {
  // Agora recebe o objeto Post COMPLETO, tipado corretamente.
  post: Post; 
}

const FALLBACK_IMAGE_URL = "/images/default-cover.png"; 
const SITE_URL = "http://www.iatioben.com.br"; // Use HTTPS!

export default function BlogPostDetail({ post }: BlogPostDetailProps) {
  // Os dados já vêm prontos, eliminando o useEffect e busca via Context.
  const postData = post;
  
  // Mantém apenas os estados de interatividade/UI
  const [error, setError] = useState<string | null>(null);
  // Mantém a funcionalidade de acessibilidade de fonte
  const [fontSize, setFontSize] = useState(16); 
    
  // 📤 Compartilhar post
  const handleShare = useCallback(async () => {
    // Validação de dados (embora o Server Component já garanta que postData exista)
    if (!postData) return;

    const shareText = `🔥 Leia: ${postData.title} no Blog do Tio Ben!\n\n${postData.metaDescription || postData.title}\n\n`;
    const shareUrl = window.location.href; // Funciona apenas no lado do cliente
    
    // Validação extra para garantir que window.location.href não seja vazia.
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
  const canonicalUrl = `${SITE_URL}/blog/${postData.slug}`;

  // Se houver erro de compartilhamento ou outros erros de UI
  if (error) {
     return (
        <div className="flex flex-col min-h-screen bg-amber-400 relative">
             <Cabecalho />
             <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-4xl mx-auto w-full">
                 <div className="w-full text-center">
                     <p className="text-red-600 text-lg">{error}</p>
                 </div>
             </div>
        </div>
     );
  }

  // O 'generatePostMetadata' e as tags dinâmicas no <head> foram movidas para o Server Component (page.tsx)
  
  return (
    <div className="flex flex-col min-h-screen bg-amber-400 relative">
      <Cabecalho />

      <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-4 md:p-8 w-full"
        >
          {/* ... restante da estrutura JSX (mantido) ... */}
          
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