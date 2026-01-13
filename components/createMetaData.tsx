// components/MetaDataLiturgiaJsonLd.tsx
"use client";

import Script from "next/script";
import React, { useMemo } from "react";

interface Props {
  date: string; // dd-mm-yyyy
}

function parseSlugDDMMYYYY(slug: string): { dd: number; mm: number; yyyy: number } | null {
  if (!/^\d{2}-\d{2}-\d{4}$/.test(slug)) return null;
  const [ddS, mmS, yyyyS] = slug.split("-");
  const dd = Number(ddS);
  const mm = Number(mmS);
  const yyyy = Number(yyyyS);
  if (!dd || !mm || !yyyy) return null;
  if (mm < 1 || mm > 12) return null;
  if (dd < 1 || dd > 31) return null;

  // valida data real
  const dt = new Date(yyyy, mm - 1, dd, 12, 0, 0); // meio-dia local evita virar o dia
  if (
    dt.getFullYear() !== yyyy ||
    dt.getMonth() !== mm - 1 ||
    dt.getDate() !== dd
  ) return null;

  return { dd, mm, yyyy };
}

export default function MetaDataLiturgiaJsonLd({ date }: Props) {
  const parsed = useMemo(() => parseSlugDDMMYYYY(date), [date]);
  if (!parsed) return null;

  const { dd, mm, yyyy } = parsed;

  // meio-dia local para não oscilar por timezone
  const d = new Date(yyyy, mm - 1, dd, 12, 0, 0);

  const weekday = d.toLocaleDateString("pt-BR", { weekday: "long" });
  const monthLong = d.toLocaleDateString("pt-BR", { month: "long" });
  const formattedDate = `${weekday}, ${dd} de ${monthLong} de ${yyyy}`;

  const canonicalUrl = `https://www.iatioben.com.br/liturgia-diaria/${date}`;
  const title = `Liturgia Diária de ${formattedDate} - Tio Ben`;
  const description =
    `Acompanhe a Liturgia Diária Católica de ${formattedDate} com o Tio Ben. ` +
    `Tenha acesso ao Evangelho do dia, leituras e reflexões para meditar a Palavra de Deus e fortalecer sua fé.`;

  const imageUrl = "https://www.iatioben.com.br/og_image_liturgia.png";

  // Use o offset correto do Brasil (-03:00). Se quiser precisão absoluta, derive do timezone, mas aqui é estável.
  const dateISO = `${String(yyyy).padStart(4, "0")}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
  const published = `${dateISO}T06:00:00-03:00`;

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    headline: title,
    description,
    image: { "@type": "ImageObject", url: imageUrl, width: 1200, height: 630 },
    datePublished: published,
    dateModified: published,
    author: { "@type": "Organization", name: "Tio Ben" },
    publisher: {
      "@type": "Organization",
      name: "Tio Ben",
      logo: {
        "@type": "ImageObject",
        url: "https://www.iatioben.com.br/logo.png",
        width: 600,
        height: 60,
      },
    },
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.iatioben.com.br/" },
      { "@type": "ListItem", position: 2, name: "Liturgia Diária", item: "https://www.iatioben.com.br/liturgia-diaria" },
      { "@type": "ListItem", position: 3, name: `Liturgia de ${dd} de ${monthLong} de ${yyyy}`, item: canonicalUrl },
    ],
  };

  return (
    <>
      <Script
        id={`ld-article-${date}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <Script
        id={`ld-breadcrumb-${date}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
    </>
  );
}
