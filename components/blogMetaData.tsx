// components/MetaDataBlog.tsx
import React from "react";
import type { Post } from "@/app/adminTioBen/types";

interface MetaDataBlogProps {
  postData: Post;
}

export default async function MetaDataBlog({ postData }: MetaDataBlogProps) {
  // Busca o post pelo slug
  

  if (!postData) return <></>;

  const title = `${postData.title} - Blog IA Tio Ben`;
  const description = postData.metaDescription || postData.metaDescription || "";
  const canonicalUrl = `https://www.iatioben.com.br/blog/${postData.slug}`;
  const imageUrl = postData.coverImageUrl || "https://www.iatioben.com.br/images/default-cover.png";

  const publishedDate = postData.publishDate ? new Date(postData.publishDate) : new Date();
  const modifiedDate = postData.updatedAt ? new Date(postData.updatedAt) : publishedDate;

  const publishedIso = publishedDate.toISOString();
  const modifiedIso = modifiedDate.toISOString();


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

    </>
  );
}
