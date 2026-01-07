import Link from "next/link";
import RosaryClient from "@/components/terco/RosaryClient";
import RosarySEO from "@/components/terco/RosarySEO";

export const dynamic = "force-static";
const SITE_URL = "https://www.iatioben.com.br";
export async function generateMetadata() {
  const title =
    "Santo Terço Diário: Mistérios de Hoje e Reflexões Bíblicas | Tio Ben IA";

  const description =
    "Reze o Santo Terço passo a passo no celular: mistérios do dia, reflexões bíblicas, orações completas e acesso direto à Liturgia de hoje.";

  const canonical = "https://www.iatioben.com.br/santo-terco";

  const ogImage = `${SITE_URL}/og?title=${encodeURIComponent(
    "Santo Terço Diário"
  )}&description=${encodeURIComponent(
    "Mistérios do dia, reflexões bíblicas e oração passo a passo"
  )}`;

  return {
    title,
    description,
    alternates: { canonical },

    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName: "IA Tio Ben",
      locale: "pt_BR",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Santo Terço Diário – IA Tio Ben",
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
