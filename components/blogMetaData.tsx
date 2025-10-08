// app/blog/utils/metadata.ts

import type { Metadata } from "next";
import type { Post } from "@/app/adminTioBen/types";

// ====================
// CONFIGURAÇÕES GERAIS
// ====================
const SITE_TITLE = "Blog IA Tio Ben";
const SITE_URL = "https://www.iatioben.com.br";
const FALLBACK_IMAGE_URL = "/images/default-cover.png";
const SITE_LOCALE = "pt_BR";
const SITE_AUTHOR = "Tio Ben";

interface GenerateBlogMetadataParams {
  post: Post | null;
  slug: string;
}

// ==============================
// FUNÇÃO GERADORA DE METADATA SSR
// ==============================
export async function generateBlogMetadata(post: Post, slug: string): Promise<Metadata> {
  if (!post) {
    return {
      title: SITE_TITLE,
      description: "Conteúdos inspiradores do Blog IA Tio Ben.",
      alternates: { canonical: `${SITE_URL}/blog/${slug}` },
      openGraph: {
        title: SITE_TITLE,
        url: `${SITE_URL}/blog/${slug}`,
        siteName: SITE_TITLE,
      },
    };
  }

  const imageUrl = post.coverImageUrl || FALLBACK_IMAGE_URL;
  const canonicalUrl = `${SITE_URL}/blog/${slug}`;
  const keywordsArray = post.keywords
    ? post.keywords.split(",").map((k) => k.trim())
    : [];

  const publishedTime = post.publishDate
    ? new Date(post.publishDate).toISOString()
    : new Date().toISOString();

  const modifiedTime = post.updatedAt
    ? new Date(post.updatedAt).toISOString()
    : publishedTime;

  // ==============================
  // METADATA SSR PARA SEO COMPLETO
  // ==============================
  return {
    title: `${post.title} | ${SITE_TITLE}`,
    description: post.metaDescription || post.metaDescription || "",
    keywords: keywordsArray,
    authors: [{ name: SITE_AUTHOR }],
    alternates: {
      canonical: canonicalUrl,
    },

    // OPEN GRAPH (Facebook / WhatsApp / LinkedIn)
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: canonicalUrl,
      type: "article",
      siteName: SITE_TITLE,
      locale: SITE_LOCALE,
      images: [
        {
          url: imageUrl.startsWith("http")
            ? imageUrl
            : `${SITE_URL}${imageUrl}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime,
      modifiedTime,
      section: post.categoryName,
      tags: keywordsArray,
    },

    // TWITTER CARD
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription,
      images: [imageUrl],
      creator: SITE_AUTHOR,
    },

    // EXTRA
    other: {
      "article:author": SITE_AUTHOR,
      "article:published_time": publishedTime,
      "article:modified_time": modifiedTime,
    },
  };
}
