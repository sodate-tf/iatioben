// app/(pt)/layout.tsx
import type { Metadata } from "next";
import React from "react";
import PageTransition from "@/components/pageTransiction";
import Cabecalho from "@/components/cabecalho";
import Footer from "@/components/Footer";
import HtmlLangClient from "@/components/HtmlLangClient";

export const metadata: Metadata = {
  title: {
    default: "IA Tio Ben | Liturgia Diária",
    template: "%s | IA Tio Ben",
  },
  description:
    "Liturgia diária completa, Evangelho e reflexões para rezar e se preparar para a Santa Missa.",
};

export default function PtLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* garante lang correto no client também */}
      <HtmlLangClient />

      <Cabecalho />

      <main className="pb-20">
        <PageTransition>{children}</PageTransition>
      </main>

      <Footer />
    </>
  );
}
