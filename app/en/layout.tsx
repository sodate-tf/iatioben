// app/en/layout.tsx
import type { Metadata } from "next";

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
    <div lang="en-US">
      <main className="pb-20">{children}</main>
    </div>
  );
}
