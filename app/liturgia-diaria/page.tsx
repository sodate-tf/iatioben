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

// helper: gera ISO com timezone -03:00 (sem depender do servidor estar em BRT)
function isoWithBRTimezone(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');

  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  const ss = pad(date.getSeconds());

  return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}-03:00`;
}

export default async function Page() {
  const hoje = new Date();

  const dd = String(hoje.getDate()).padStart(2, '0');
  const mm = String(hoje.getMonth() + 1).padStart(2, '0');
  const yyyy = hoje.getFullYear();

  const weekday = hoje.toLocaleString('pt-BR', { weekday: 'long' });
  const monthFull = hoje.toLocaleString('pt-BR', { month: 'long' });
  const formattedDate = `${weekday}, ${dd} de ${monthFull} de ${yyyy}`;

  const res = await fetch(
    `https://liturgia.up.railway.app/v2/?dia=${dd}&mes=${mm}&ano=${yyyy}`,
    { next: { revalidate: 3600 } }
  );

  const data = await res.json();

  const canonicalUrl = 'https://www.iatioben.com.br/liturgia-diaria';

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "headline": `Liturgia Diária de Hoje - ${dd}/${mm}/${yyyy}`,
    "description": `Acompanhe a Liturgia Diária Católica de hoje, ${formattedDate}.`,
    "image": "https://www.iatioben.com.br/og_image_liturgia.png",
    "url": canonicalUrl,
    "inLanguage": "pt-BR",

    // ✅ agora é datetime válido com fuso horário
    "datePublished": isoWithBRTimezone(hoje),
    "dateModified": isoWithBRTimezone(hoje),

    // ✅ adiciona url (remove aviso opcional)
    "author": {
      "@type": "Person",
      "name": "Tio Ben",
      "url": "https://www.iatioben.com.br"
    },

    // ✅ publisher mais consistente (marca do site)
    "publisher": {
      "@type": "Organization",
      "name": "IA Tio Ben",
      "url": "https://www.iatioben.com.br",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.iatioben.com.br/logo.png"
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

      <LiturgiaFAQSchema
        dateFormatted={formattedDate}
        liturgiaTitulo={data.liturgia}
      />

      <LiturgiaClient data={data} />
    </>
  );
}
