import HomeClient from "@/components/HomeClientNew";

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
    "Evangelho do dia, liturgia diária e reflexões católicas com o IA Tio Ben — fé, oração e Palavra de Deus todos os dias.",
  url: "https://www.iatioben.com.br/",
  siteName: "IA Tio Ben",
  type: "website",
  locale: "pt_BR",
  images: [
    {
      url: "https://www.iatioben.com.br/og?title=IA%20Tio%20Ben&description=Evangelho%20do%20dia%2C%20liturgia%20di%C3%A1ria%20e%20reflex%C3%B5es%20cat%C3%B3licas",
      width: 1200,
      height: 630,
      alt: "IA Tio Ben – Evangelho e Liturgia Diária",
    },
  ],
},
  twitter: {
    card: "summary_large_image",
  },
};

export default function Page() {
  return <HomeClient />;
}
