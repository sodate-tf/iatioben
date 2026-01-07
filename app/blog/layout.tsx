// app/blog/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: "Blog IA Tio Ben",
    template: "%s - Blog IA Tio Ben",
  },
  description:
    "Reflexões, liturgias, santos do dia e espiritualidade católica no Blog IA Tio Ben.",
  alternates: {
    canonical: "https://www.iatioben.com.br/blog",
  },
  openGraph: {
  type: "website",
  url: "https://www.iatioben.com.br/blog",
  siteName: "Blog IA Tio Ben",
  locale: "pt_BR",
  title: "Blog IA Tio Ben | Evangelho, Liturgia e Vida Cristã",
  description:
    "Artigos católicos sobre Evangelho do dia, liturgia diária, oração, santos e espiritualidade para viver a fé no cotidiano.",
  images: [
    {
      url: "https://www.iatioben.com.br/og?title=Blog%20IA%20Tio%20Ben&description=Evangelho%2C%20liturgia%20di%C3%A1ria%20e%20espiritualidade%20cat%C3%B3lica",
      width: 1200,
      height: 630,
      alt: "Blog IA Tio Ben – Evangelho e Liturgia Diária",
    },
  ],
},

  twitter: {
    card: "summary_large_image",
    creator: "@ia_tioben",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
