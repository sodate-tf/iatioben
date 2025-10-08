'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Spinner from './SpinnerLoading';
import Cabecalho from './cabecalho';
import AdSense from './Adsense';
import { useData } from '@/app/adminTioBen/contexts/DataContext';
import Image from 'next/image';

export default function BlogCardList() {
  const { activePosts } = useData();

  // Simulando loading rápido para efeito visual
  const isLoading = !activePosts.length;

  return (
    <div className="flex flex-col min-h-screen bg-amber-400 relative">
      <Cabecalho />

      <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-4xl mx-auto w-full">
        <motion.h1
          className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Blog do Tio Ben 📜
        </motion.h1>

        {isLoading ? (
          <Spinner />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {activePosts.map((post) => (
              <Link
                href={`/blog/${post.slug}`}
                key={post.id}
                className="block"
              >
                <article className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-amber-200">
                  {post.coverImageUrl && (
                    <Image
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="w-full h-48 object-cover object-center"
                      loading="lazy"
                    />
                  )}
                  <div className="p-4">
                    <h2 className="text-xl font-bold text-amber-900 mb-2 leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {post.content
                        ? post.content.replace(/<[^>]+>/g, '').slice(0, 120) + '...'
                        : ''}
                    </p>                    
                  </div>
                </article>
              </Link>
            ))}
          </motion.div>
        )}
      </div>

      <AdSense adSlot="5858882948" adFormat="autorelaxed" />

      <footer className="bg-amber-100 text-center py-4 mt-auto">
        <div id="ezoic-pub-ad-placeholder-103"></div>
        <Link href="http://www.iatioben.com.br/termo-de-responsabilidade">
          Termo de responsabilidade
        </Link>
        <p className="text-gray-600 text-sm">
          Desenvolvido por <Link href="http://4udevelops.com.br">4U Develops</Link> - Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}
