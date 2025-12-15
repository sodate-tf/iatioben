import Link from "next/link";
import RosaryClient from "@/components/terco/RosaryClient";
import RosarySEO from "@/components/terco/RosarySEO";

export const dynamic = "force-static";

export async function generateMetadata() {
  const title =
    "Santo Terço Diário: Mistérios de Hoje e Reflexões Bíblicas | Tio Ben IA";
  const description =
    "Reze o Santo Terço passo a passo no celular: contas interativas, mistérios do dia, reflexões profundas com referências bíblicas, manual de orações e link para a Liturgia de hoje.";
  const canonical = "https://www.iatioben.com.br/santo-terco";

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "website" },
    twitter: { card: "summary_large_image", title, description },
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
