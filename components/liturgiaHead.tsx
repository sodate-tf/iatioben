// components/LiturgiaHead.tsx
import Head from 'next/head';

interface Props {
  data?: string;
  liturgia?: string;
}

export default function LiturgiaHead({ data, liturgia }: Props) {
  return (
    <Head>
      <title>Liturgia Diária - Tio Ben</title>
      <meta
        name="description"
        content="Acompanhe a liturgia diária e mantenha-se em unidade com a Igreja, meditando as mesmas leituras proclamadas em todo o mundo."
      />
      <meta property="og:title" content="Liturgia Diária - Tio Ben" />
      <meta
        property="og:description"
        content="Acompanhe a liturgia diária e mantenha-se em unidade com a Igreja, meditando as mesmas leituras proclamadas em todo o mundo."
      />
      <meta property="og:image" content="https://www.iatioben.com.br/og_image_liturgia.png" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.iatioben.com.br/liturgia-diaria" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Liturgia Diária - Tio Ben" />
      <meta
        name="twitter:description"
        content="Acompanhe a liturgia diária e mantenha-se em unidade com a Igreja, meditando as mesmas leituras proclamadas em todo o mundo."
      />
      <meta name="twitter:image" content="https://www.iatioben.com.br/og_image_liturgia.png" />
    </Head>
  );
}
