// components/BlogMetaData.tsx
import React from "react";

interface BlogMetaDataProps {
  slug: string;
  title: string;
  metaDescription: string;
  categoryName?: string;
  keywords?: string; // string separada por vírgulas
  coverImageUrl?: string;
  publishDate?: string; // string de data/hora (ex: new Date().toISOString())
  lastModified?: string; // string de data/hora
}

// URL e Dados fixos do seu site (Ajuste se necessário!)
const SITE_TITLE = "Blog IA Tio Ben";
const SITE_URL = "https://www.iatioben.com.br";
const SITE_LOCALE = "pt_BR";
const SITE_AUTHOR = "Tio Ben"; 
const FALLBACK_IMAGE_URL = "/images/default-cover.png"; 

export default function BlogMetaData({
  slug,
  title,
  metaDescription,
  categoryName,
  keywords,
  coverImageUrl,
  publishDate,
  lastModified,
}: BlogMetaDataProps) {
  // 1. Dados Processados
  const canonicalUrl = `${SITE_URL}/blog/${slug}`;
  const imageUrl = coverImageUrl || FALLBACK_IMAGE_URL;
  const keywordsArray = keywords ? keywords.split(',').map(k => k.trim()) : [];
  
  // Datas no formato ISO para Schema Markup
  const publishedTime = publishDate ? new Date(publishDate).toISOString() : new Date().toISOString();
  const modifiedTime = lastModified ? new Date(lastModified).toISOString() : publishedTime;

  // 2. Schema Markup (JSON-LD)
  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
    headline: title,
    description: metaDescription,
    image: { "@type": "ImageObject", url: imageUrl, width: 1200, height: 630 },
    datePublished: publishedTime,
    dateModified: modifiedTime,
    author: { "@type": "Person", name: SITE_AUTHOR },
    publisher: {
      "@type": "Organization",
      name: SITE_AUTHOR, // Usando Tio Ben como Publisher
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png`, width: 600, height: 60 }
    }
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: title, item: canonicalUrl }
    ]
  };

  return (
    <>
      {/* ==================================== */}
      {/* 1. METADADOS BÁSICOS (SEO e Geral) */}
      {/* ==================================== */}
      <title>{title} | {SITE_TITLE}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="keywords" content={keywordsArray.join(', ')} />
      <meta name="author" content={SITE_AUTHOR} />
      
      {/* ==================================== */}
      {/* 2. OPEN GRAPH & ARTICLE */}
      {/* ==================================== */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_TITLE} />
      <meta property="og:type" content="article" />
      <meta property="og:locale" content={SITE_LOCALE} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Open Graph - Artigo Detalhado */}
      <meta property="article:published_time" content={publishedTime} />
      <meta property="article:modified_time" content={modifiedTime} />
      <meta property="article:author" content={SITE_AUTHOR} /> 
      {categoryName && <meta property="article:section" content={categoryName} />}
      {keywordsArray.map((keyword, index) => (
          <meta key={`tag-${index}`} property="article:tag" content={keyword} />
      ))}
      
      {/* ==================================== */}
      {/* 3. TWITTER CARD */}
      {/* ==================================== */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageUrl} />

      {/* ==================================== */}
      {/* 4. JSON-LD (Schema Markup) */}
      {/* ==================================== */}
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