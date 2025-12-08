import LiturgiaClient, { LiturgyData } from "@/components/liturgiaClient";
import LiturgiaFAQSchema from "@/components/LiturgiaFAQSchema";
import Script from "next/script";

interface PageParams {
  data?: string;
}

interface PageProps {
  params: Promise<PageParams> | PageParams;
}

/* ================= SEO DINÂMICO BLINDADO ================= */

export async function generateMetadata({ params }: PageProps) {
  const resolved = await params; // ⭐ CORREÇÃO PRINCIPAL
  const date = resolved?.data;

  if (!date || !date.includes("-")) {
    return {
      title: "Liturgia Diária de Hoje | Evangelho do Dia com o Tio Ben",
      description:
        "Acompanhe a Liturgia Diária Católica de hoje. Evangelho, leituras, salmo e orações para fortalecer sua fé.",
      alternates: {
        canonical: "https://www.iatioben.com.br/liturgia-diaria",
      },
    };
  }

  const [dd, mm, yyyy] = date.split("-");
  const d = new Date(`${yyyy}-${mm}-${dd}`);

  const day = d.getDate();
  const month = d.toLocaleString("pt-BR", { month: "long" });
  const year = d.getFullYear();
  const weekday = d.toLocaleString("pt-BR", { weekday: "long" });

  const formattedDate = `${weekday}, ${day} de ${month} de ${year}`;

  const title = `Liturgia Diária de ${formattedDate} | Evangelho do Dia com o Tio Ben`;
  const description = `Acompanhe a Liturgia Diária Católica de ${formattedDate}. Evangelho, leituras, salmo e orações para meditar a Palavra de Deus.`;
  const canonical = `https://www.iatioben.com.br/liturgia-diaria/${date}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Tio Ben",
      locale: "pt_BR",
      type: "article",
      images: [
        {
          url: "https://www.iatioben.com.br/og_image_liturgia.png",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.iatioben.com.br/og_image_liturgia.png"],
    },
  };
}

/* ================= PAGE SSR ================= */

export default async function Page({ params }: PageProps) {
  const resolved = await params; // ⭐ CORREÇÃO PRINCIPAL
  let date = resolved?.data;

  if (!date || !date.includes("-")) {
    const hoje = new Date();
    const dd = String(hoje.getDate()).padStart(2, "0");
    const mm = String(hoje.getMonth() + 1).padStart(2, "0");
    const yyyy = hoje.getFullYear();
    date = `${dd}-${mm}-${yyyy}`;
  }

  const [dd, mm, yyyy] = date.split("-");

  let data: LiturgyData;

  try {
    const res = await fetch(
      `https://liturgia.up.railway.app/v2/?dia=${dd}&mes=${mm}&ano=${yyyy}`,
      { next: { revalidate: 3600 } }
    );

    data = await res.json();
  } catch {
    data = {
      data: `${dd}/${mm}/${yyyy}`,
      liturgia: "Liturgia Diária",
      cor: "Verde",
      oracoes: { coleta: "", oferendas: "", comunhao: "", extras: [] },
      leituras: {
        primeiraLeitura: [],
        salmo: [],
        segundaLeitura: [],
        evangelho: [],
      },
      antifonas: { entrada: "", comunhao: "" },
    };
  }

  /* ========== JSON-LD ARTICLE ========== */

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Liturgia Diária ${dd}/${mm}/${yyyy}`,
    description: "Evangelho do dia com o Tio Ben",
    image: "https://www.iatioben.com.br/og_image_liturgia.png",
    datePublished: `${yyyy}-${mm}-${dd}`,
    author: { "@type": "Person", name: "Tio Ben" },
    publisher: {
      "@type": "Organization",
      name: "Tio Ben",
      logo: {
        "@type": "ImageObject",
        url: "https://www.iatioben.com.br/logo.png",
      },
    },
  };

  const d = new Date(`${yyyy}-${mm}-${dd}`);
  const weekday = d.toLocaleString("pt-BR", { weekday: "long" });
  const monthFull = d.toLocaleString("pt-BR", { month: "long" });
  const formattedDate = `${weekday}, ${dd} de ${monthFull} de ${yyyy}`;

  return (
    <>
      <Script
        id="jsonld-liturgia"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />

      <LiturgiaClient data={data} />

      <LiturgiaFAQSchema
        dateFormatted={formattedDate}
        liturgiaTitulo={data.liturgia}
      />
    </>
  );
}
