import LiturgiaClient, { LiturgyData } from "@/components/liturgiaClient";
import LiturgiaFAQSchema from "@/components/LiturgiaFAQSchema";
import Script from "next/script";

interface PageParams {
  data?: string;
}

interface PageProps {
  params: Promise<PageParams> | PageParams;
}

/* ================= HELPERS ================= */

function isoWithBRTimezone(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");

  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  const ss = pad(date.getSeconds());

  // ISO 8601 com timezone fixo do Brasil (-03:00)
  return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}-03:00`;
}

function safeDateParts(dateParam?: string) {
  if (!dateParam || !dateParam.includes("-")) return null;
  const [dd, mm, yyyy] = dateParam.split("-");
  if (!dd || !mm || !yyyy) return null;
  if (dd.length !== 2 || mm.length !== 2 || yyyy.length !== 4) return null;
  return { dd, mm, yyyy };
}

/* ================= SEO DINÂMICO BLINDADO ================= */

export async function generateMetadata({ params }: PageProps) {
  const resolved = await params;
  const dateParam = resolved?.data;

  const parts = safeDateParts(dateParam);

  if (!parts) {
    return {
      title: "Liturgia Diária de Hoje | Evangelho do Dia com o Tio Ben",
      description:
        "Acompanhe a Liturgia Diária Católica de hoje. Evangelho, leituras, salmo e orações para fortalecer sua fé.",
      alternates: {
        canonical: "https://www.iatioben.com.br/liturgia-diaria",
      },
      openGraph: {
        title: "Liturgia Diária de Hoje | Evangelho do Dia com o Tio Ben",
        description:
          "Acompanhe a Liturgia Diária Católica de hoje. Evangelho, leituras, salmo e orações para fortalecer sua fé.",
        url: "https://www.iatioben.com.br/liturgia-diaria",
        siteName: "IA Tio Ben",
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
        title: "Liturgia Diária de Hoje | Evangelho do Dia com o Tio Ben",
        description:
          "Acompanhe a Liturgia Diária Católica de hoje. Evangelho, leituras, salmo e orações para fortalecer sua fé.",
        images: ["https://www.iatioben.com.br/og_image_liturgia.png"],
      },
    };
  }

  const { dd, mm, yyyy } = parts;
  const d = new Date(`${yyyy}-${mm}-${dd}T00:00:00-03:00`);

  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("pt-BR", { month: "long" });
  const year = d.getFullYear();
  const weekday = d.toLocaleString("pt-BR", { weekday: "long" });

  const formattedDate = `${weekday}, ${day} de ${month} de ${year}`;

  const title = `Liturgia Diária de ${formattedDate} | Evangelho do Dia com o Tio Ben`;
  const description = `Acompanhe a Liturgia Diária Católica de ${formattedDate}. Evangelho, leituras, salmo e orações para meditar a Palavra de Deus.`;
  const canonical = `https://www.iatioben.com.br/liturgia-diaria/${dd}-${mm}-${yyyy}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "IA Tio Ben",
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
  const resolved = await params;
  let dateParam = resolved?.data;

  let dd: string, mm: string, yyyy: number;

  const parts = safeDateParts(dateParam);

  if (!parts) {
    const hoje = new Date();
    dd = String(hoje.getDate()).padStart(2, "0");
    mm = String(hoje.getMonth() + 1).padStart(2, "0");
    yyyy = hoje.getFullYear();
    dateParam = `${dd}-${mm}-${yyyy}`;
  } else {
    dd = parts.dd;
    mm = parts.mm;
    yyyy = Number(parts.yyyy);
  }

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

  const d = new Date(`${yyyy}-${mm}-${dd}T00:00:00-03:00`);
  const weekday = d.toLocaleString("pt-BR", { weekday: "long" });
  const monthFull = d.toLocaleString("pt-BR", { month: "long" });
  const formattedDate = `${weekday}, ${dd} de ${monthFull} de ${yyyy}`;

  /* ========== JSON-LD ARTICLE (CORRIGIDO) ========== */

  const canonicalUrl = `https://www.iatioben.com.br/liturgia-diaria/${dateParam}`;

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    headline: `Liturgia Diária ${dd}/${mm}/${yyyy}`,
    description: `Acompanhe a Liturgia Diária Católica de ${formattedDate}. Evangelho, leituras, salmo e orações para meditar a Palavra de Deus.`,
    image: "https://www.iatioben.com.br/og_image_liturgia.png",
    url: canonicalUrl,
    inLanguage: "pt-BR",
    datePublished: isoWithBRTimezone(d),
    dateModified: isoWithBRTimezone(d),
    author: {
      "@type": "Person",
      name: "Tio Ben",
      url: "https://www.iatioben.com.br",
    },
    publisher: {
      "@type": "Organization",
      name: "IA Tio Ben",
      url: "https://www.iatioben.com.br",
      logo: {
        "@type": "ImageObject",
        url: "https://www.iatioben.com.br/logo.png",
      },
    },
  };

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
