// app/liturgia-diaria/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liturgia Diária de Hoje | Leituras da Missa e Evangelho",
  description:
    "Acompanhe a Liturgia Diária de hoje com as leituras da Missa, salmo e evangelho. Reze, medite e viva a Palavra todos os dias.",
  openGraph: {
    title: "Liturgia Diária de Hoje | Leituras da Missa e Evangelho",
    description:
      "Acompanhe a Liturgia Diária de hoje com as leituras da Missa, salmo e evangelho. Reze, medite e viva a Palavra todos os dias.",
    url: "https://www.iatioben.com.br/liturgia-diaria",
    siteName: "IA Tio Ben",
    type: "website",
  },
};

export default function LiturgiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#fbfbfb]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6">{children}</div>
    </main>
  );
}
