"use client";

import Head from "next/head";

interface CreateMetaDataProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  date?: string; // dd-mm-yyyy opcional
}

export default function CreateMetaData({ title, description, url, image, date }: CreateMetaDataProps) {
  let pageTitle = title;
  let pageDescription = description;
  let canonicalUrl = url;
  const defaultImage = image || "https://www.iatioben.com.br/og_image_liturgia.png";

  if (date) {
    const [dd, mm, yyyy] = date.split("-");
    const d = new Date(`${yyyy}-${mm}-${dd}`);

    const day = d.getDate();
    const month = d.toLocaleString("pt-BR", { month: "long" });
    const year = d.getFullYear();
    const weekday = d.toLocaleString("pt-BR", { weekday: "long" });

    const formattedDate = `${weekday}, ${day} de ${month} de ${year}`;
    pageTitle = `Liturgia Diária de ${formattedDate} - Tio Ben`;
    pageDescription = `Acompanhe a Liturgia Diária Católica de ${formattedDate} com o Tio Ben. Tenha acesso ao Evangelho do dia, leituras e reflexões para meditar a Palavra de Deus e fortalecer sua fé.`;
    canonicalUrl = `https://www.iatioben.com.br/liturgia-diaria/${date}`;
  }

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Tio Ben" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:image" content={defaultImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={defaultImage} />
    </Head>
  );
}
