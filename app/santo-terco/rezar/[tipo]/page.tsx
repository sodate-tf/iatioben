import RosaryClient from "@/components/terco/RosaryClient";
import RosarySEO from "@/components/terco/RosarySEO";
import { notFound } from "next/navigation";
import { TIPOS, type TipoSlug, labelFromSlug, mapSlugToSetKey } from "./tipos";
import { Metadata } from "next";

export const dynamic = "force-static";

type PageParams = { tipo: string };

type PageProps = {
  params: Promise<PageParams> | PageParams;
};

export function generateStaticParams() {
  return TIPOS.map((tipo) => ({ tipo }));
}
const SITE_URL = "https://www.iatioben.com.br";

/** Normaliza e remove acentos para mapear com segurança */
function norm(s: string) {
  return (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/** Retorna texto curto com os dias (linha acima do título na imagem OG) */
function daysLineFromTipo(tipo: TipoSlug) {
  const t = norm(tipo);

  if (t.includes("gozosos")) return "Segunda e Sábado";
  if (t.includes("dolorosos")) return "Terça e Sexta";
  if (t.includes("gloriosos")) return "Quarta e Domingo";
  if (t.includes("luminosos")) return "Quinta-feira";

  return ""; // fallback
}

/**
 * Mapeia o "tipo" para a rota OG estática (rota limpa .png).
 * IMPORTANTE: estes caminhos devem existir no app router:
 * - /app/og/terco/misterios-gozosos.png/route.tsx
 * - /app/og/terco/misterios-dolorosos.png/route.tsx
 * - /app/og/terco/misterios-gloriosos.png/route.tsx
 * - /app/og/terco/misterios-luminosos.png/route.tsx
 */
function ogFromTipo(tipo: TipoSlug) {
  const t = norm(tipo);

  if (t.includes("gozosos")) return `${SITE_URL}/og/terco/misterios-gozosos.png?v=1`;
  if (t.includes("dolorosos")) return `${SITE_URL}/og/terco/misterios-dolorosos.png?v=1`;
  if (t.includes("gloriosos")) return `${SITE_URL}/og/terco/misterios-gloriosos.png?v=1`;
  if (t.includes("luminosos")) return `${SITE_URL}/og/terco/misterios-luminosos.png?v=1`;

  // fallback genérico do terço (caso exista)
  return `${SITE_URL}/og/terco.png?v=1`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tipo: string }> | { tipo: string };
}): Promise<Metadata> {
  const resolved = await Promise.resolve(params);
  const tipo = resolved.tipo as TipoSlug;

  if (!TIPOS.includes(tipo)) return {};

  const label = labelFromSlug(tipo);

  // Canonical conforme sua rota real (ajuste se necessário)
  const canonical = `${SITE_URL}/santo-terco/${tipo}`;

  const daysLine = daysLineFromTipo(tipo);
  const title = `${label} — Santo Terço passo a passo | IA Tio Ben`;

  // descrição “incentivo a clique”, com dias e promessa objetiva
  const description =
    `${daysLine ? `${daysLine}: ` : ""}` +
    `Reze os ${label.toLowerCase()} passo a passo no celular com orações completas, ` +
    `reflexões bíblicas em cada dezena e progresso guiado. Clique para começar agora.`;

  // OG estático por tipo (o que você pediu)
  const ogImage = ogFromTipo(tipo);

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
          alt: `${label} — Santo Terço | IA Tio Ben`,
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
