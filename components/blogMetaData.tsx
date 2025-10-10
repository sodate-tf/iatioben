// utils/metadata.ts (ou onde você preferir)

import type { Metadata } from "next";
import type { Post } from "@/app/adminTioBen/types";

/**
 * Função utilitária que gera o objeto Metadata do Next.js
 * a partir dos dados do post.
 * * @param postData - Os dados do post.
 * @returns Um objeto no formato de Metadata do Next.js.
 */
export function generatePostMetadata(postData: Post): Metadata {
  
  // Se o postData for nulo ou indefinido, retorna metadados padrões ou vazios.
  // Como esta função será usada dentro de generateMetadata,
  // idealmente o dado já deve estar validado (e a página não renderizada se não houver post).
  if (!postData) {
    return {
      title: "Blog IA Tio Ben",
      description: "Conteúdo sobre Inteligência Artificial e tecnologia.",
    };
  }

  // Lógica de cálculo dos metadados (mantendo o que você já fez)
  const baseDomain = "http://www.iatioben.com.br"; // Use HTTPS em produção!
  const siteName = "Blog IA Tio Ben";

  const title = `${postData.title} - ${siteName}`;
  // Prioriza a metaDescription, se não existir, usa um fallback vazio
  const description = postData.metaDescription || ""; 
  const canonicalUrl = `${baseDomain}/blog/${postData.slug}`;
  const imageUrl = postData.coverImageUrl || `${baseDomain}/images/default-cover.png`;

  // Retorna o objeto Metadata no formato Next.js (Server Side)
  return {
    // Título Principal
    title: title,
    // Meta Descrição e URL Canônica
    description: description,
    alternates: {
      canonical: canonicalUrl,
    },
    
    // Open Graph
    openGraph: {
      title: title,
      description: description,
      url: canonicalUrl,
      type: "article",
      siteName: siteName,
      locale: "pt_BR",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: postData.title, // Adiciona alt-text para acessibilidade
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [imageUrl],
    },

    // Viewport para Mobile First (boa prática)
    viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  };
}