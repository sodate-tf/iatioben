import RosaryClient from "@/components/terco/RosaryClient";
import RosarySEO from "@/components/terco/RosarySEO";
import { notFound } from "next/navigation";
import { TIPOS, type TipoSlug, labelFromSlug, mapSlugToSetKey } from "./tipos";

export const dynamic = "force-static";

type PageParams = { tipo: string };

type PageProps = {
  params: Promise<PageParams> | PageParams;
};

export function generateStaticParams() {
  return TIPOS.map((tipo) => ({ tipo }));
}
const SITE_URL = "https://www.iatioben.com.br";
export async function generateMetadata({ params }: PageProps) {
  const resolved = await params;
  const tipo = resolved.tipo as TipoSlug;

  if (!TIPOS.includes(tipo)) return {};

  const label = labelFromSlug(tipo);
  const canonical = `https://www.iatioben.com.br/santo-terco/${tipo}`;

  const title = `${label}: Santo Terço Passo a Passo | IA Tio Ben`;
  const description =
    `Reze os ${label.toLowerCase()} passo a passo no celular: ` +
    `mistérios do dia, reflexões bíblicas, orações completas e acesso à Liturgia de hoje.`;

  const ogImage = `${SITE_URL}/og?title=${encodeURIComponent(
    label
  )}&description=${encodeURIComponent(
    "Santo Terço passo a passo com reflexões bíblicas"
  )}`;

  return {
    title,
    description,
    alternates: { canonical },

    openGraph: {
      type: "website",
      url: canonical,
      siteName: "IA Tio Ben",
      locale: "pt_BR",
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${label} – Santo Terço | IA Tio Ben`,
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


export default async function MisteriosTipoPage({ params }: PageProps) {
  const resolved = await params;
  const tipo = resolved.tipo as TipoSlug;

  if (!TIPOS.includes(tipo)) notFound();

  const setKey = mapSlugToSetKey(tipo);
  const label = labelFromSlug(tipo);

  return (
    <>
      <RosarySEO />

      {/* SSR indexável */}
      <main className="mx-auto w-full max-w-4xl px-4 pt-6">
        <div className="bg-white/80 rounded-2xl border border-amber-200 p-5">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            {label} – Santo Terço passo a passo
          </h1>
          <p className="mt-2 text-gray-700 leading-relaxed">
            Aqui você reza os {label.toLowerCase()} com orações visíveis, progresso e
            reflexão bíblica em cada dezena. Você também pode alterar o conjunto no seletor.
          </p>
        </div>
      </main>

      {/* Interativo já no conjunto certo */}
      <RosaryClient defaultSetKey={setKey} />
    </>
  );
}
