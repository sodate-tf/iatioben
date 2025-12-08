import LiturgiaClient from '@/components/liturgiaClient';
import LiturgiaFAQSchema from '@/components/LiturgiaFAQSchema';
import Script from 'next/script';

export async function generateMetadata() {
  const hoje = new Date();

  const day = hoje.getDate();
  const month = hoje.toLocaleString('pt-BR', { month: 'long' });
  const year = hoje.getFullYear();
  const weekday = hoje.toLocaleString('pt-BR', { weekday: 'long' });

  const formattedDate = `${weekday}, ${day} de ${month} de ${year}`;

  return {
    title: `Liturgia Diária de Hoje – ${formattedDate} | Evangelho do Dia com Tio Ben`,
    description: `Acompanhe a Liturgia Diária Católica de hoje, ${formattedDate}. Evangelho, leituras, salmo e orações para fortalecer sua fé.`,
    alternates: {
      canonical: 'https://www.iatioben.com.br/liturgia-diaria',
    },
  };
}

export default async function Page() {
  const hoje = new Date();

  const dd = String(hoje.getDate()).padStart(2, '0');
  const mm = String(hoje.getMonth() + 1).padStart(2, '0');
  const yyyy = hoje.getFullYear();

  // ✅ AGORA O formattedDate EXISTE AQUI
  const weekday = hoje.toLocaleString('pt-BR', { weekday: 'long' });
  const monthFull = hoje.toLocaleString('pt-BR', { month: 'long' });
  const formattedDate = `${weekday}, ${dd} de ${monthFull} de ${yyyy}`;

  const res = await fetch(
    `https://liturgia.up.railway.app/v2/?dia=${dd}&mes=${mm}&ano=${yyyy}`,
    { next: { revalidate: 3600 } }
  );

  const data = await res.json();

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Liturgia Diária de Hoje - ${dd}/${mm}/${yyyy}`,
    description: "Evangelho do dia com o Tio Ben",
    image: "https://www.iatioben.com.br/og_image_liturgia.png",
    datePublished: `${yyyy}-${mm}-${dd}`,
    dateModified: `${yyyy}-${mm}-${dd}`,
    author: { "@type": "Person", name: "Tio Ben" },
    publisher: {
      "@type": "Organization",
      name: "Tio Ben",
      logo: {
        "@type": "ImageObject",
        url: "https://www.iatioben.com.br/logo.png"
      }
    }
  };

  return (
    <>
      <Script
        id="jsonld-liturgia-hoje"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />

      {/* ✅ AGORA NÃO DÁ MAIS ERRO */}
      <LiturgiaFAQSchema
        dateFormatted={formattedDate}
        liturgiaTitulo={data.liturgia}
      />

      <LiturgiaClient data={data} />
    </>
  );
}
