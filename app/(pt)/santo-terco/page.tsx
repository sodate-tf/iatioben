import Link from "next/link";
import RosaryClient from "@/components/terco/RosaryClient";
import RosarySEO from "@/components/terco/RosarySEO";

export const dynamic = "force-static";
const SITE_URL = "https://www.iatioben.com.br";
import type { Metadata } from "next";


const CANONICAL = `${SITE_URL}/santo-terco`;

type TercoSet = "gozosos" | "dolorosos" | "gloriosos" | "luminosos";

function getWeekdayInSaoPaulo(): number {
  // 0=domingo, 1=segunda, ... 6=sábado
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
  }).format(new Date());

  // en-US short: Sun Mon Tue Wed Thu Fri Sat
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return map[parts] ?? new Date().getDay();
}

function setFromWeekday(dow: number): TercoSet {
  // Regra tradicional:
  // Seg/Sáb: Gozosos | Ter/Sex: Dolorosos | Qua/Dom: Gloriosos | Qui: Luminosos
  if (dow === 1 || dow === 6) return "gozosos";
  if (dow === 2 || dow === 5) return "dolorosos";
  if (dow === 3 || dow === 0) return "gloriosos";
  return "luminosos"; // dow === 4 (quinta) ou fallback
}

function labelFromSet(set: TercoSet) {
  switch (set) {
    case "gozosos":
      return "Mistérios Gozosos";
    case "dolorosos":
      return "Mistérios Dolorosos";
    case "gloriosos":
      return "Mistérios Gloriosos";
    case "luminosos":
      return "Mistérios Luminosos";
  }
}

function daysLineFromSet(set: TercoSet) {
  switch (set) {
    case "gozosos":
      return "Segunda e Sábado";
    case "dolorosos":
      return "Terça e Sexta";
    case "gloriosos":
      return "Quarta e Domingo";
    case "luminosos":
      return "Quinta-feira";
  }
}

function ogFromSet(set: TercoSet) {
  // Rotas OG que você já criou:
  // /og/terco/misterios-<set>.png
  return `${SITE_URL}/og/terco/misterios-${set}.png?v=1`;
}

export async function generateMetadata(): Promise<Metadata> {
  const dow = getWeekdayInSaoPaulo();
  const set = setFromWeekday(dow);

  const misterioLabel = labelFromSet(set);
  const daysLine = daysLineFromSet(set);

  const title = `Santo Terço de Hoje: ${misterioLabel} (passo a passo) | IA Tio Ben`;

  const description =
    `${daysLine}: reze o Santo Terço no celular com orações completas, ` +
    `reflexões bíblicas em cada dezena e progresso guiado. Clique e comece agora.`;

  const ogImage = ogFromSet(set);

  return {
    title,
    description,
    alternates: { canonical: CANONICAL },

    openGraph: {
      type: "website",
      url: CANONICAL,
      title,
      description,
      siteName: "IA Tio Ben",
      locale: "pt_BR",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `Santo Terço de Hoje — ${misterioLabel}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}


export default function SantoTercoPage() {
  return (
    <>
      <RosarySEO />      
      <RosaryClient />
    </>
  );
}
