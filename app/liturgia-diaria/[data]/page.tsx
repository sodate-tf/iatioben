"use client"
import { Metadata } from 'next';
import LiturgiaContent from '@/components/liturgiaClient';
import { useParams } from 'next/navigation';
import MetaData from '@/components/createMetaData';
import LiturgiaJsonLd from '@/components/liturgiaJsonLd';
 interface CreateMetaDataOptions {
  date: Date; // Receber a data atual como parâmetro
}

export const createMetaData = ({ date }: CreateMetaDataOptions): Metadata => {
  // Formatação da data para uso no título e descrição
  const day = date.getDate();
  const month = date.toLocaleString('pt-BR', { month: 'long' });
  const year = date.getFullYear();
  const weekday = date.toLocaleString('pt-BR', { weekday: 'long' });

  const formattedDate = `${weekday}, ${day} de ${month} de ${year}`;
  
  // Formato da data para a URL canônica (YYYY-MM-DD é um bom padrão)
  const formattedUrlDate = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
  // URL canônica para a liturgia específica do dia
  const canonicalUrl = `https://www.iatioben.com.br/liturgia-diaria/${formattedUrlDate}`;

  return {
    // 1. Título da Página (SEO e Experiência do Usuário)
    title: `Liturgia Diária de ${formattedDate} - Tio Ben`,
    
    // 2. Meta Descrição (SEO e CTR)
    description: `Acompanhe a Liturgia Diária Católica de ${formattedDate} com o Tio Ben. Tenha acesso ao Evangelho do dia, leituras e reflexões para meditar a Palavra de Deus e fortalecer sua fé.`,
    
    // 3. URL Canônica (CRUCIAL para conteúdo diário)
    // Se a URL 'https://www.iatioben.com.br/liturgia-diaria' sempre mostra o dia atual,
    // ela deve apontar para a URL com a data específica como a versão canônica.
    alternates: {
      canonical: canonicalUrl,
    },

    // 4. Open Graph (OG) Tags para Redes Sociais
    openGraph: {
      title: `Liturgia Diária de ${formattedDate} - Tio Ben`,
      description: `Acompanhe a Liturgia Diária Católica de ${formattedDate} com o Tio Ben. Tenha acesso ao Evangelho do dia, leituras e reflexões para meditar a Palavra de Deus e fortalecer sua fé.`,
      url: canonicalUrl, // A URL do OG deve ser a canônica para evitar confusão
      images: [
        {
          url: 'https://www.iatioben.com.br/og_image_liturgia.png', // Mantenha uma imagem padrão ou crie uma dinâmica
          width: 1200, // Dimensões recomendadas para OG
          height: 630,
          alt: `Liturgia Diária de ${formattedDate} - Tio Ben`,
        },
      ],
      type: 'article', // Indica que é um conteúdo de artigo/blog
      siteName: 'Tio Ben',
      locale: 'pt_BR',
    },
  };
};

export default function Page() {  
   const params = useParams();
  const data = params?.data as string; // dd-mm-yyyy
  return (
    <div className="flex flex-col min-h-screen bg-amber-400">
        <LiturgiaJsonLd date={data} />
       <MetaData date={data} />
      <LiturgiaContent date={data} /> {/* CLIENT COMPONENT */}      
    </div>
  );
}
