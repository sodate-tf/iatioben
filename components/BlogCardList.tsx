'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Spinner from './SpinnerLoading';
import Cabecalho from './cabecalho';
import Footer from './Footer';
import { useData } from '@/app/adminTioBen/contexts/DataContext';

const FALLBACK_IMAGE = '/images/santo-do-dia-ia-tio-ben.png';

export default function BlogCardList() {
  const { activePosts } = useData();
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
            {activePosts.map((post) => {
              const hasCover = !!post.coverImageUrl && post.coverImageUrl.trim() !== '';
              const imageSrc = hasCover ? post.coverImageUrl : FALLBACK_IMAGE;

              return (
                <Link href={`/blog/${post.slug}`} key={post.id} className="block">
                  <article className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-amber-200">
                    <div className="relative w-full aspect-[16/9] overflow-hidden">
                      <Image
                        src={imageSrc || FALLBACK_IMAGE}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className={`object-cover object-center ${
                          hasCover ? '' : 'brightness-50'
                        }`}
                        loading="lazy"
                      />

                      {/* Exibe o título sobre a imagem fallback */}
                      {!hasCover && (
                        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                          <h2
                            className="font-extrabold uppercase text-[#FFD119] leading-tight break-words text-balance"
                            style={{
                              fontSize: 'clamp(0.9rem, 3vw, 2rem)',
                              width: '66%',
                              maxHeight: '90%',
                              lineHeight: '1.1',
                              textShadow: '2px 2px 6px rgba(0,0,0,0.8)',
                              overflowWrap: 'break-word',
                              wordBreak: 'break-word',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textAlign: 'center',
                            }}
                          >
                            {post.title}
                          </h2>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-xl font-bold text-amber-900 mb-2 leading-snug line-clamp-2">
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
        )}
      </div>

      <Footer />
    </div>
  );
}
