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
    images: [
      {
        url: "https://www.iatioben.com.br/images/default-cover.png",
        width: 1200,
        height: 630,
        alt: "Blog IA Tio Ben",
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
