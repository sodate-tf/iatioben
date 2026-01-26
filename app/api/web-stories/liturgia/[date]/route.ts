// app/api/web-stories/liturgia/[date]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchLiturgiaByIsoDate } from "@/lib/liturgia/api";
import { buildLiturgiaStory } from "@/app/lib/web-stories/liturgia-story-builder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { date: string };

export async function GET(_req: NextRequest, ctx: { params: Promise<Params> }) {
  try {
    const { date } = await ctx.params;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { ok: false, error: "date inválido (use YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.iatioben.com.br").replace(/\/$/, "");
    const isoDate = date;

    // Canonical da liturgia no seu site (ajuste se sua rota for outra)
    const canonicalUrl = `${siteUrl}/liturgia/${isoDate}`;

    // URL do Web Story (público)
    // Se sua rota pública do AMP story for outra, ajuste aqui.
    const storyUrl = `${siteUrl}/web-stories/liturgia-${isoDate.split("-").reverse().join("-")}/`;

    const liturgia = await fetchLiturgiaByIsoDate(isoDate);

    const storyJson = buildLiturgiaStory({
      liturgia,
      isoDate,
      canonicalUrl,
      storyUrl,
      lang: "pt-BR",
    });

    return NextResponse.json(storyJson, { status: 200 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
