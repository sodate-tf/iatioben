// app/en/layout.tsx
import type { Metadata } from "next";
import Cabecalho from "@/components/cabecalho";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "IA Tio Ben | Daily Mass Readings",
    template: "%s | IA Tio Ben",
  },
  description:
    "Daily Mass Readings, Gospel and reflections to pray and prepare for Mass.",
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <body>
        <Cabecalho />
        <main className="pb-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
