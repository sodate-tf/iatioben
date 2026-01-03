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

export async function generateMetadata({ params }: PageProps) {
  const resolved = await params;
  const tipo = resolved.tipo as TipoSlug;

  if (!TIPOS.includes(tipo)) return {};

  const label = labelFromSlug(tipo);
  const canonical = `https://www.iatioben.com.br/santo-terco/${tipo}`;

  const title = `${label}: Santo Terço Passo a Passo | Tio Ben IA`;
  const description =
    `Reze os ${label.toLowerCase()} passo a passo no celular: contas interativas, ` +
    `reflexões bíblicas, manual de orações e link para a Liturgia de hoje.`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
