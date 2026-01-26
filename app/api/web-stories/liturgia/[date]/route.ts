// app/api/web-stories/liturgia/[date]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchLiturgiaByIsoDate } from "@/lib/liturgia/api"; // ajuste o path conforme seu projeto
import { buildLiturgiaStoryJson } from "@/app/lib/web-stories/liturgia-story-builder";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { date: string };

export async function GET(_req: NextRequest, ctx: { params: Promise<Params> }) {
  try {
    const { date } = await ctx.params;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ ok: false, error: "date inválido (use YYYY-MM-DD)" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.iatioben.com.br";
    const isoDate = date;

    // Canonical da liturgia no seu site (ajuste se sua rota for outra)
    const canonicalUrl = `${siteUrl.replace(/\/$/, "")}/liturgia/${isoDate}`;

    // Fundos (você já tem o poster default)
    const posterSrc =
      process.env.STORY_LITURGIA_POSTER_DEFAULT ||
      `${siteUrl.replace(/\/$/, "")}/images/stories/liturgia-default.jpg`;

    const bgDarkSrc =
      process.env.STORY_BG_DARK ||
      `${siteUrl.replace(/\/$/, "")}/images/stories/story-dark.jpg`;

    const bgLightSrc =
      process.env.STORY_BG_LIGHT ||
      `${siteUrl.replace(/\/$/, "")}/images/stories/story-light.jpg`;

    const publisherName = process.env.STORY_PUBLISHER_NAME || "Tio Ben IA";
    const publisherLogoSrc =
      process.env.STORY_PUBLISHER_LOGO ||
      `${siteUrl.replace(/\/$/, "")}/images/logo-amp.png`;

    const liturgia = await fetchLiturgiaByIsoDate(isoDate);

    const storyJson = buildLiturgiaStoryJson({
      isoDate,
      siteUrl,
      canonicalUrl,
      publisherName,
      publisherLogoSrc,
      posterSrc,
      bgDarkSrc,
      bgLightSrc,
      liturgia: liturgia as any,
    });

    return NextResponse.json(storyJson, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? e }, { status: 500 });
  }
}
