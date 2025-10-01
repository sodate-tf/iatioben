"use client";

import React from "react";

interface LiturgiaJsonLdProps {
  date: string; // formato dd-mm-yyyy
  image?: string; // opcional, padrão definido
}

export default function LiturgiaJsonLd({ date, image = "https://www.iatioben.com.br/og_image_liturgia.png" }: LiturgiaJsonLdProps) {
  // Converter dd-mm-yyyy para Date
  const [dd, mm, yyyy] = date.split("-");
  const dateObj = new Date(Number(yyyy), Number(mm) - 1, Number(dd));

  // Formatar data para título e descrição
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("pt-BR", { month: "long" });
  const year = dateObj.getFullYear();

  const title = `Liturgia Diária de ${day} de ${month} de ${year} - Tio Ben`;
  const description = `Acompanhe a Liturgia Diária Católica de ${day} de ${month} de ${year} com o Tio Ben. Tenha acesso ao Evangelho do dia, leituras e reflexões para meditar a Palavra de Deus e fortalecer sua fé.`;

  // Data ISO para JSON-LD
  const isoDate = `${year}-${String(Number(mm)).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const publishedAt = `${isoDate}T06:00:00+00:00`;
  const modifiedAt = publishedAt;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.iatioben.com.br/liturgia-diaria/${date}`,
    },
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
      "@type": "Person",
      name: "Tio Ben",
    },
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
        name: `Liturgia de ${day} de ${month} de ${year}`,
        item: `https://www.iatioben.com.br/liturgia-diaria/${date}`,
      },
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
