import LiturgiaClient, { type LiturgyData } from "@/components/liturgiaClient";
import LiturgiaFAQSchema from "@/components/LiturgiaFAQSchema";
import Script from "next/script";

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

/* ================= SEO ================= */

export async function generateMetadata() {
  // Observação: em SSR, o "hoje" depende do timezone do servidor.
  // Mantive como está (sua abordagem atual), mas o conteúdo exibido também é de "hoje" no client.
  const hoje = new Date();

  const dd = String(hoje.getDate()).padStart(2, "0");
  const mm = String(hoje.getMonth() + 1).padStart(2, "0");
  const yyyy = hoje.getFullYear();

  const weekday = hoje.toLocaleString("pt-BR", { weekday: "long" });
  const month = hoje.toLocaleString("pt-BR", { month: "long" });

  // Título mais curto para evitar truncamento
  const title = `Liturgia de Hoje (${dd}/${mm}/${yyyy}) – Evangelho do Dia | Tio Ben`;
  const description = `Acompanhe a Liturgia Diária de hoje, ${weekday}, ${dd} de ${month} de ${yyyy}, com Evangelho, leituras, salmo e orações.`;

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

/* ================= PAGE SSR ================= */

export default async function Page() {
  const hoje = new Date();

  const dd = String(hoje.getDate()).padStart(2, "0");
  const mm = String(hoje.getMonth() + 1).padStart(2, "0");
  const yyyy = hoje.getFullYear();

  const weekday = hoje.toLocaleString("pt-BR", { weekday: "long" });
  const monthFull = hoje.toLocaleString("pt-BR", { month: "long" });
  const formattedDate = `${weekday}, ${dd} de ${monthFull} de ${yyyy}`;

  // Meio-dia para evitar edge cases de timezone/virada
  const baseDate = new Date(`${yyyy}-${mm}-${dd}T12:00:00-03:00`);

  let data: LiturgyData;

  try {
    const res = await fetch(`https://liturgia.up.railway.app/v2/?dia=${dd}&mes=${mm}&ano=${yyyy}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      data = normalizeApiToLiturgyData(null, dd, mm, yyyy);
    } else {
      const raw = await res.json();
      data = normalizeApiToLiturgyData(raw, dd, mm, yyyy);
    }
  } catch {
    data = normalizeApiToLiturgyData(null, dd, mm, yyyy);
  }

  const canonicalUrl = "https://www.iatioben.com.br/liturgia-diaria";

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    headline: `Liturgia Diária de Hoje - ${dd}/${mm}/${yyyy}`,
    description: `Acompanhe a Liturgia Diária Católica de hoje, ${formattedDate}.`,
    image: "https://www.iatioben.com.br/og_image_liturgia.png",
    url: canonicalUrl,
    inLanguage: "pt-BR",
    datePublished: isoWithBRTimezone(baseDate),
    dateModified: isoWithBRTimezone(baseDate),
    author: { "@type": "Person", name: "Tio Ben", url: "https://www.iatioben.com.br" },
    publisher: {
      "@type": "Organization",
      name: "IA Tio Ben",
      url: "https://www.iatioben.com.br",
      logo: { "@type": "ImageObject", url: "https://www.iatioben.com.br/logo.png" },
    },
  };

  return (
    <>
      <Script
        id="jsonld-liturgia-hoje"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />

      <LiturgiaFAQSchema dateFormatted={formattedDate} liturgiaTitulo={data.liturgia} />

      <LiturgiaClient data={data} />
    </>
  );
}
