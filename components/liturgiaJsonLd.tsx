"use client";

import React from "react";

interface LiturgiaJsonLdProps {
  date: string; // dd-mm-yyyy
  image?: string; // OG default
  // 🔗 opcional: vincular artigo do blog (Liturgia ↔ Blog)
  blog?: {
    title: string; // sem data
    slug: string;  // slug do título
    description?: string; // opcional (use seu paragraph)
  } | null;
}

function safeDateParts(date: string) {
  const [dd, mm, yyyy] = String(date || "").split("-");
  const d = Number(dd);
  const m = Number(mm);
  const y = Number(yyyy);

  // validação simples
  if (!d || !m || !y) return null;
  if (d < 1 || d > 31) return null;
  if (m < 1 || m > 12) return null;
  if (y < 2000 || y > 2100) return null;

  return { dd: String(dd).padStart(2, "0"), mm: String(mm).padStart(2, "0"), yyyy: String(yyyy) };
}

function toIsoDate(date: string) {
  const parts = safeDateParts(date);
  if (!parts) return null;
  return `${parts.yyyy}-${parts.mm}-${parts.dd}`; // yyyy-mm-dd
}

function formatPtLong(iso: string) {
  const [yyyy, mm, dd] = iso.split("-");
  const dateObj = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  // sem timezone: ok para exibição
  return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" }).format(dateObj);
}

export default function LiturgiaJsonLd({
  date,
  image = "https://www.iatioben.com.br/og/liturgia.png",
  blog = null,
}: LiturgiaJsonLdProps) {
  const isoDate = toIsoDate(date);
  if (!isoDate) return null;

  const dateLong = formatPtLong(isoDate);

  const canonical = `https://www.iatioben.com.br/liturgia-diaria/${date}`;
  const title = `Liturgia Diária ${date.replaceAll("-", "/")} – Evangelho, Leituras e Salmo | IA Tio Ben`;
  const description =
    `Liturgia do dia ${date.replaceAll("-", "/")} com Evangelho, leituras e salmo. ` +
    `Acesse e reze com a Liturgia Diária no IA Tio Ben.`;

  // ISO com offset BR (-03:00). (Melhor que +00:00 para “dataPublished” local.)
  const publishedAt = `${isoDate}T06:00:00-03:00`;
  const modifiedAt = publishedAt;

  const blogUrl = blog?.slug ? `https://www.iatioben.com.br/blog/${blog.slug}` : null;

  const articleJsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: canonical,
    headline: title,
    description,
    image: {
      "@type": "ImageObject",
      url: image,
      width: 1200,
      height: 630,
    },
    datePublished: publishedAt,
    dateModified: modifiedAt,
    author: {
      "@type": "Organization",
      name: "IA Tio Ben",
      url: "https://www.iatioben.com.br",
    },
    publisher: {
      "@type": "Organization",
      name: "IA Tio Ben",
      url: "https://www.iatioben.com.br",
      logo: {
        "@type": "ImageObject",
        url: "https://www.iatioben.com.br/logo.png",
        width: 600,
        height: 60,
      },
    },
  };

  // 🔗 Liturgia ↔ Blog (subjectOf + relatedLink)
  if (blogUrl) {
    articleJsonLd.relatedLink = [blogUrl];
    articleJsonLd.subjectOf = {
      "@type": "Article",
      "@id": blogUrl,
      url: blogUrl,
      headline: blog?.title,
      description: blog?.description || undefined,
      isPartOf: {
        "@type": "Blog",
        name: "Blog IA Tio Ben",
        url: "https://www.iatioben.com.br/blog",
      },
    };
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.iatioben.com.br/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Liturgia Diária",
        item: "https://www.iatioben.com.br/liturgia-diaria",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Liturgia de ${dateLong}`,
        item: canonical,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
