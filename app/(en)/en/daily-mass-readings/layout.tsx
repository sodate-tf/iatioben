// app/en/daily-mass-readings/layout.tsx
import type { Metadata } from "next";

/**
 * EN Daily Mass Readings section layout.
 *
 * Key rules applied here:
 * - DO NOT set canonical here (canonical is date-specific and must live in the [data]/page.tsx).
 * - DO NOT set openGraph.url here (page.tsx should set og:url per date).
 * - Provide stable section-level metadata only (title/description/images).
 */
export const metadata: Metadata = {
  title: {
    default: "Daily Mass Readings | Readings, Psalm and Gospel",
    template: "%s | IA Tio Ben",
  },
  description:
    "Daily Mass Readings with the First Reading, Responsorial Psalm, and Gospel. Browse by date, month, and year to pray with the Church.",
  alternates: {
    // IMPORTANT: This is the section root; per-day pages must override in page.tsx.
    canonical: "https://www.iatioben.com.br/en/daily-mass-readings",
  },
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
    // IMPORTANT: do not set url here (page.tsx sets og:url per date)
    images: [
      {
        url: "/og?title=Daily%20Mass%20Readings&description=Readings%2C%20Psalm%20and%20Gospel%20to%20pray%20with%20the%20Church",
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
      "/og?title=Daily%20Mass%20Readings&description=Readings%2C%20Psalm%20and%20Gospel%20to%20pray%20with%20the%20Church",
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
