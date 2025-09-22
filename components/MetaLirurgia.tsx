import Head from "next/head";

interface MetaProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}

export default function LiturgiaMeta({
  title = "Liturgia Diária Católica - Evangelho do dia, Salmos e  Leituras | Tio Ben",
  description = "Acompanhe a Liturgia Diária completa com Evangelho do dia, Salmo e Leituras. Ore, medite e viva a Palavra de Deus todos os dias.",
  url = "https://iatioben.com.br/liturgia-diaria",
  image = "https://iatioben.com.br/images/liturgia-og.jpg",
  datePublished,
  dateModified,
}: MetaProps) {
  return (
    <Head>
      {/* Básico para SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="IA Tio Ben" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="pt_BR" />

      
      {/* Schema.org - Article (Google Rich Snippets) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description: description,
            image: [image],
            datePublished: datePublished || new Date().toISOString(),
            dateModified: dateModified || new Date().toISOString(),
            author: {
              "@type": "Person",
              name: "Tio Ben",
            },
            publisher: {
              "@type": "Organization",
              name: "IA Tio Ben",
              logo: {
                "@type": "ImageObject",
                url: "https://www.iatioben.com.br/tio-ben-icon-512x512.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": url,
            },
          }),
        }}
      />

      {/* SEO técnico */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="pt-BR" />
      <meta name="author" content="IA Tio Ben" />
      <meta name="copyright" content="IA Tio Ben" />
      <meta name="theme-color" content="#ffffff" />

      {/* Performance e Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
  );
}
