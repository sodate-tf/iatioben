// app/en/layout.tsx
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: {
    default: "IA Tio Ben | Daily Mass Readings",
    template: "%s | IA Tio Ben",
  },
  description:
    "Daily Mass Readings, Gospel and reflections to pray and prepare for Mass.",
};

export default function EnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // IMPORTANT:
  // Do NOT set <html> or lang here.
  // <html lang="..."> must live in the ROOT layout (app/layout.tsx).
  // This layout must remain neutral to avoid SEO and hydration issues.
  return <main className="pb-20">{children}</main>;
}
