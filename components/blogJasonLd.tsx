// components/BlogJsonLd.tsx
import React from "react";
import { getPostBySlug } from "@/app/adminTioBen/actions/postAction";
import type { Post } from "@/app/adminTioBen/types";

interface BlogJsonLdProps {
  slug: string;
}

export default async function BlogJsonLd({ slug }: BlogJsonLdProps) {
  // Busca o post pelo slug
  const post: Post | null = await getPostBySlug(slug);

  if (!post) return <></>;

  const title = post.title;
  const description = post.metaDescription || post.metaDescription || "";
  const canonicalUrl = `https://www.iatioben.com.br/blog/${slug}`;
  const imageUrl = post.coverImageUrl || "https://www.iatioben.com.br/images/default-cover.png";

  const publishedDate = post.publishDate ? new Date(post.publishDate) : new Date();
  const modifiedDate = post.updatedAt ? new Date(post.updatedAt) : publishedDate;

  const publishedIso = publishedDate.toISOString();
  const modifiedIso = modifiedDate.toISOString();

  const articleJsonLd = {
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
      logo: { "@type": "ImageObject", url: "https://www.iatioben.com.br/logo.png", width: 600, height: 60 },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.iatioben.com.br/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.iatioben.com.br/blog" },
      { "@type": "ListItem", position: 3, name: title, item: canonicalUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd, null, 2) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd, null, 2) }}
      />
    </>
  );
}
