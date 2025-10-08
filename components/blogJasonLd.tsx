// components/BlogJsonLd.tsx (Novo nome mais claro para sua função)
import React from "react";
import { getPostBySlug } from "@/app/adminTioBen/actions/postAction";
import type { Post } from "@/app/adminTioBen/types";

interface BlogJsonLdProps {
 slug: string;
}

// Este componente DEVE ser um Server Component (padrão, sem 'use client')
export default async function BlogJsonLd({ slug }: BlogJsonLdProps) {
 
  // O ideal é passar o 'post' como prop para não buscar duas vezes no page.tsx, 
  // mas mantendo a busca aqui por consistência com seu código:
 const post: Post | null = await getPostBySlug(slug);

 if (!post) return <></>;

 const title = `${post.title} - Blog IA Tio Ben`;
 const description = post.metaDescription || post.title || "";
 const canonicalUrl = `https://www.iatioben.com.br/blog/${slug}`;
 const imageUrl = post.coverImageUrl || "https://www.iatioben.com.br/images/default-cover.png";

 const publishedDate = post.publishDate ? new Date(post.publishDate) : new Date();
 const modifiedDate = post.updatedAt ? new Date(post.updatedAt) : publishedDate;

 const publishedIso = publishedDate.toISOString();
 const modifiedIso = modifiedDate.toISOString();

 // JSON-LD Article
 const jsonLdArticle = {
  "@context": "https://schema.org",
  "@type": "Article",
  mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  headline: title,
  description,
  image: { "@type": "ImageObject", url: imageUrl, width: 1200, height: 630 },
  datePublished: publishedIso,
  dateModified: modifiedIso,
  author: { "@type": "Person", name: "Tio Ben" },
  publisher: {
   "@type": "Organization",
   name: "Tio Ben",
   // ✅ CORREÇÃO: Usando HTTPS
   logo: { "@type": "ImageObject", url: "https://www.iatioben.com.br/images/ben-transparente.png", width: 600, height: 60 },
  },
 };

 // JSON-LD Breadcrumb
 const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
   { "@type": "ListItem", position: 1, name: "Home", item: "https://www.iatioben.com.br/" },
   { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.iatioben.com.br/blog" },
   { "@type": "ListItem", position: 3, name: post.title, item: canonicalUrl },
  ],
 };

 return (
  <>
      {/* ⚠️ REMOÇÃO DE TODAS AS TAGS <title>, <meta> E <link> */}

   {/* JSON-LD - Renderizado no <body> */}
   <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
   <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
  </>
 );
}