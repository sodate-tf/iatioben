import HomeClient from "@/components/HomeClient";

export const metadata = {
  title: "IA Tio Ben | Liturgia Diária, Evangelho do Dia e Reflexões Católicas",
  description:
    "Converse com o Tio Ben, sua inteligência artificial católica. Descubra a liturgia diária, o evangelho do dia, salmos e reflexões cristãs em um só lugar.",
  keywords: [
    "IA Tio Ben",
    "liturgia diária",
    "evangelho do dia",
    "salmo de hoje",
    "reflexão católica",
    "inteligência artificial católica",
  ],
  openGraph: {
    title: "IA Tio Ben | Evangelho e Liturgia Diária com Inteligência Artificial",
    description:
      "Receba o Evangelho do dia e reflexões católicas com o Tio Ben — sua inteligência artificial para a fé.",
    url: "https://www.iatioben.com.br/",
    siteName: "IA Tio Ben",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function Page() {
  return <HomeClient />;
}
