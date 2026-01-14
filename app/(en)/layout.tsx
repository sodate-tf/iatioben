// app/(en)/layout.tsx
import type { Metadata } from "next";
import React from "react";
import PageTransition from "@/components/pageTransiction";
import Cabecalho from "@/components/cabecalho";
import Footer from "@/components/Footer";
import HtmlLangClient from "@/components/HtmlLangClient";

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
    <>
      <HtmlLangClient />
      <Cabecalho />

      <main className="pb-20">
        <PageTransition>{children}</PageTransition>
      </main>

      <Footer />
    </>
  );
}
