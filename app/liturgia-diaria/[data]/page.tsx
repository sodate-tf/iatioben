import LiturgiaClient, { LiturgyData } from "@/components/liturgiaClient";
import LiturgiaFAQSchema from "@/components/LiturgiaFAQSchema";
import Script from "next/script";

interface PageParams {
  data?: string; // "dd-mm-yyyy"
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
  return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}-03:00`;
}

function safeDateParts(dateParam?: string) {
  if (!dateParam || !dateParam.includes("-")) return null;
  const [dd, mm, yyyy] = dateParam.split("-");
  if (!dd || !mm || !yyyy) return null;
  if (dd.length !== 2 || mm.length !== 2 || yyyy.length !== 4) return null;

  const d = Number(dd);
  const m = Number(mm);
  const y = Number(yyyy);
  if (!d || !m || !y) return null;
  if (m < 1 || m > 12) return null;
  if (d < 1 || d > 31) return null;

  return { dd, mm, yyyy };
}

function toText(v: unknown) {
  return typeof v === "string" ? v : "";
}

function toArray<T = any>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

/**
 * Normaliza o JSON da API para garantir que TODAS as chaves esperadas existam,
 * evitando crash no client caso algum campo venha ausente.
 */
function normalizeApiToLiturgyData(raw: any, dd: string, mm: string, yyyy: number): LiturgyData {
  const fallback: LiturgyData = {
    data: `${dd}/${mm}/${yyyy}`,
    liturgia: "Liturgia Diária",
    cor: "Verde",
    oracoes: { coleta: "", oferendas: "", comunhao: "", extras: [] },
    leituras: {
      primeiraLeitura: [],
      salmo: [],
      segundaLeitura: [],
      evangelho: [],
      extras: [],
    },
    antifonas: { entrada: "", comunhao: "" },
  };

  if (!raw || typeof raw !== "object") return fallback;

  return {
    data: toText(raw?.data) || fallback.data,
    liturgia: toText(raw?.liturgia) || fallback.liturgia,
    cor: toText(raw?.cor) || fallback.cor,
    oracoes: {
      coleta: toText(raw?.oracoes?.coleta),
      oferendas: toText(raw?.oracoes?.oferendas),
      comunhao: toText(raw?.oracoes?.comunhao),
      extras: toArray<string>(raw?.oracoes?.extras),
    },
    leituras: {
      primeiraLeitura: toArray(raw?.leituras?.primeiraLeitura),
      salmo: toArray(raw?.leituras?.salmo),
      segundaLeitura: toArray(raw?.leituras?.segundaLeitura),
      evangelho: toArray(raw?.leituras?.evangelho),
      extras: toArray(raw?.leituras?.extras),
    },
    antifonas: {
      entrada: toText(raw?.antifonas?.entrada),
      comunhao: toText(raw?.antifonas?.comunhao),
    },
  };
}

/* ================= SEO (OTIMIZADO E CURTO) ================= */

export async function generateMetadata({ params }: PageProps) {
  const resolved = await params;
  const dateParam = resolved?.data;

  const parts = safeDateParts(dateParam);

  // Página "Hoje" (sem data na URL) — canonical SEM DATA (evita duplicidade)
  if (!parts) {
    const title = "Liturgia Diária de Hoje – Evangelho do Dia | Tio Ben";
    const description =
      "Acompanhe a Liturgia Diária de hoje com o Evangelho do Dia, leituras, salmo, orações e reflexão para fortalecer sua fé.";

    return {
      title,
      description,
      alternates: { canonical: "https://www.iatioben.com.br/liturgia-diaria" },
      openGraph: {
        title,
        description,
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
        title,
        description,
        images: ["https://www.iatioben.com.br/og_image_liturgia.png"],
      },
    };
  }

  const { dd, mm, yyyy } = parts;
  const d = new Date(`${yyyy}-${mm}-${dd}T12:00:00-03:00`); // meio-dia para evitar edge cases

  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("pt-BR", { month: "long" });
  const weekday = d.toLocaleString("pt-BR", { weekday: "long" });

  const formattedDate = `${weekday}, ${day} de ${month} de ${yyyy}`;

  // título curto (evita truncamento)
  const title = `Liturgia Diária ${day} de ${month} – Evangelho do Dia | Tio Ben`;
  const description = `Acompanhe a Liturgia Diária de ${formattedDate} com Evangelho do Dia, leituras, salmo, orações e reflexão.`;
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

  // Sem data na rota: mostra HOJE, mas mantém canonical sem data (feito no metadata)
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

  // Data base (meio-dia) para textos/JSON-LD
  const d = new Date(`${yyyy}-${mm}-${dd}T12:00:00-03:00`);
  const weekday = d.toLocaleString("pt-BR", { weekday: "long" });
  const monthFull = d.toLocaleString("pt-BR", { month: "long" });
  const formattedDate = `${weekday}, ${dd} de ${monthFull} de ${yyyy}`;

  let data: LiturgyData;

  try {
    const res = await fetch(
      `https://liturgia.up.railway.app/v2/?dia=${dd}&mes=${mm}&ano=${yyyy}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      data = normalizeApiToLiturgyData(null, dd, mm, yyyy);
    } else {
      const raw = await res.json();
      data = normalizeApiToLiturgyData(raw, dd, mm, yyyy);
    }
  } catch {
    data = normalizeApiToLiturgyData(null, dd, mm, yyyy);
  }

  // Canonical por data (quando rota tem data) ou "hoje" (quando rota sem data)
  const canonicalUrl = parts
    ? `https://www.iatioben.com.br/liturgia-diaria/${dd}-${mm}-${yyyy}`
    : `https://www.iatioben.com.br/liturgia-diaria`;

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    headline: `Liturgia Diária ${dd}/${mm}/${yyyy}`,
    description: `Acompanhe a Liturgia Diária de ${formattedDate}. Evangelho, leituras, salmo e orações para meditar a Palavra de Deus.`,
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

      <LiturgiaFAQSchema dateFormatted={formattedDate} liturgiaTitulo={data.liturgia} />
    </>
  );
}
