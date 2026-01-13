// app/en/daily-mass-readings/layout.tsx
import type { Metadata } from "next";

/**
 * EN Daily Mass Readings section layout.
 *
 * Rules:
 * - DO NOT set canonical here (leaf pages must define canonical).
 * - DO NOT set openGraph.url here (leaf pages set og:url).
 * - Provide only stable section-level metadata.
 */
export const metadata: Metadata = {
  title: {
    default: "Daily Mass Readings | Readings, Psalm and Gospel",
    template: "%s | IA Tio Ben",
  },
  description:
    "Daily Mass Readings with the First Reading, Responsorial Psalm, and Gospel. Browse by date, month, and year to pray with the Church.",
  // IMPORTANT: no alternates.canonical at layout level (avoids duplicate canonicals)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Daily Mass Readings | Readings, Psalm and Gospel",
    description:
      "Daily Mass Readings with the First Reading, Responsorial Psalm, and Gospel. Browse by date, month, and year to pray with the Church.",
    siteName: "IA Tio Ben",
    type: "website",
    locale: "en_US",
    // IMPORTANT: do not set url here (leaf page sets og:url)
    images: [
      {
        // Use absolute URL to avoid inconsistencies across crawlers
        url: "https://www.iatioben.com.br/og?title=Daily%20Mass%20Readings&description=Readings%2C%20Psalm%20and%20Gospel%20to%20pray%20with%20the%20Church",
        width: 1200,
        height: 630,
        alt: "Daily Mass Readings on IA Tio Ben",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Mass Readings | Readings, Psalm and Gospel",
    description:
      "Daily Mass Readings with the First Reading, Responsorial Psalm, and Gospel. Browse by date, month, and year.",
    images: [
      "https://www.iatioben.com.br/og?title=Daily%20Mass%20Readings&description=Readings%2C%20Psalm%20and%20Gospel%20to%20pray%20with%20the%20Church",
    ],
  },
};

export default function DailyMassReadingsLayout({
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
