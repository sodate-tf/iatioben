// components/liturgia/DailyParagraph.tsx
import React from "react";
import { getDailyParagraph, type LocaleKey } from "@/lib/liturgia/liturgicalParagraphs";

export default function DailyParagraph({
  date,
  locale,
}: {
  date: string;      // "13/01/2026" (API) ou "13-01-2026" (slug)
  locale: LocaleKey; // "pt" | "en"
}) {
    console.log(date)
    const text = getDailyParagraph(date, locale);

  return (
    <section aria-label={locale === "pt" ? "Contexto litúrgico do dia" : "Daily liturgical context"}>
      <p className="mt-3 text-[15px] leading-7 text-neutral-800">{text}</p>
    </section>
  );
}
