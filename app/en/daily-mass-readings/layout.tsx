// app/en/daily-mass-readings/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Mass Readings Today | Readings, Psalm and Gospel",
  description:
    "Follow today’s Daily Mass Readings with the First Reading, Psalm and Gospel. Pray, reflect and live God’s Word every day.",
  openGraph: {
    title: "Daily Mass Readings Today | Readings, Psalm and Gospel",
    description:
      "Follow today’s Daily Mass Readings with the First Reading, Psalm and Gospel. Pray, reflect and live God’s Word every day.",
    url: "https://www.iatioben.com.br/en/daily-mass-readings",
    siteName: "IA Tio Ben",
    type: "website",
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
