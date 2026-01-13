// app/en/daily-mass-readings/layout.tsx
import type { Metadata } from "next";
import React from "react";

const SITE_URL = "https://www.iatioben.com.br";
const HUB_PATH = "/en/daily-mass-readings";

export const metadata: Metadata = {
  // This is a *default* (hub-level) title/description.
  // The day page (/[data]/page.tsx) will override title/description/openGraph as needed.
  title: {
    default: "Daily Mass Readings Today | Readings, Psalm and Gospel",
    template: "%s | IA Tio Ben",
  },
  description:
    "Follow today’s Daily Mass Readings with the First Reading, Psalm and Gospel. Pray, reflect and live God’s Word every day.",

  // Canonical for the hub page. The day page sets its own canonical in generateMetadata.
  alternates: {
    canonical: `${SITE_URL}${HUB_PATH}`,
  },

  openGraph: {
    title: "Daily Mass Readings Today | Readings, Psalm and Gospel",
    description:
      "Follow today’s Daily Mass Readings with the First Reading, Psalm and Gospel. Pray, reflect and live God’s Word every day.",
    url: `${SITE_URL}${HUB_PATH}`,
    siteName: "IA Tio Ben",
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Daily Mass Readings Today | Readings, Psalm and Gospel",
    description:
      "Follow today’s Daily Mass Readings with the First Reading, Psalm and Gospel. Pray, reflect and live God’s Word every day.",
  },
};

export default function DailyMassReadingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // IMPORTANT:
  // Do not wrap with another max-w/padding container here,
  // because your day page already controls layout spacing and widths.
  // Nested containers commonly cause “double padding” and layout drift.
  return <main className="min-h-screen bg-[#fbfbfb]">{children}</main>;
}
