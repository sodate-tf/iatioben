// components/MetaDataLiturgia.tsx
import React from "react";

interface MetaDataLiturgiaProps {
  date?: string; // formato dd-mm-yyyy
}

export default function MetaDataLiturgia({ date }: MetaDataLiturgiaProps) {
  if (!date)
    return(<></>)

  const [dd, mm, yyyy] = date.split("-");
  const d = new Date(`${yyyy}-${mm}-${dd}`);

  const day = d.getDate();
  const month = d.toLocaleString("pt-BR", { month: "long" });
  const year = d.getFullYear();
  const weekday = d.toLocaleString("pt-BR", { weekday: "long" });

  const formattedDate = `${weekday}, ${day} de ${month} de ${year}`;
  const canonicalUrl = `https://www.iatioben.com.br/liturgia-diaria/${date}`;
  const title = `Liturgia Diária de ${formattedDate} - Tio Ben`;
  const description = `Acompanhe a Liturgia Diária Católica de ${formattedDate} com o Tio Ben. Tenha acesso ao Evangelho do dia, leituras e reflexões para meditar a Palavra de Deus e fortalecer sua fé.`;
  const imageUrl = "https://www.iatioben.com.br/og_image_liturgia.png";

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
    headline: title,
    description,
    image: { "@type": "ImageObject", url: imageUrl, width: 1200, height: 630 },
    datePublished: `${yyyy}-${mm}-${dd}T06:00:00+00:00`,
    dateModified: `${yyyy}-${mm}-${dd}T06:00:00+00:00`,
    author: { "@type": "Person", name: "Tio Ben" },
    publisher: {
      "@type": "Organization",
      name: "Tio Ben",
      logo: { "@type": "ImageObject", url: "https://www.iatioben.com.br/logo.png", width: 600, height: 60 }
    }
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.iatioben.com.br/" },
      { "@type": "ListItem", position: 2, name: "Liturgia Diária", item: "https://www.iatioben.com.br/liturgia-diaria" },
      { "@type": "ListItem", position: 3, name: `Liturgia de ${day} de ${month} de ${year}`, item: canonicalUrl }
    ]
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
      <meta property="og:site_name" content="Tio Ben" />
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
