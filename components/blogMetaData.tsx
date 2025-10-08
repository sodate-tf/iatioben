// components/MetaDataBlog.tsx
import React from "react";
import { getPostBySlug } from "@/app/adminTioBen/actions/postAction";
import type { Post } from "@/app/adminTioBen/types";

interface MetaDataBlogProps {
  slug: string;
}

export default async function MetaDataBlog({ slug }: MetaDataBlogProps) {
  // Busca o post pelo slug
  const post: Post | null = await getPostBySlug(slug);

  if (!post) return <></>;

  const title = `${post.title} - Blog IA Tio Ben`;
  const description = post.metaDescription || post.metaDescription || "";
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
      logo: { "@type": "ImageObject", url: "http://www.iatioben.com.br/images/ben-transparente.png", width: 600, height: 60 },
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
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Blog IA Tio Ben" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(jsonLdArticle)}</script>
      <script type="application/ld+json">{JSON.stringify(jsonLdBreadcrumb)}</script>
    </>
  );
}
