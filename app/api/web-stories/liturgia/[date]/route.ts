// app/api/web-stories/liturgia/[date]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchLiturgiaByIsoDate } from "@/lib/liturgia/api";
import { buildLiturgiaStoryJson } from "@/app/lib/web-stories/liturgia-story-builder";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function assertIsoDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Parâmetro 'date' inválido. Use YYYY-MM-DD.");
  }
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await ctx.params;
    assertIsoDate(date);

    const isoDate = date;

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.SITE_URL ||
      "https://www.iatioben.com.br";

    const canonicalUrl = `${siteUrl.replace(/\/$/, "")}/liturgia/${isoDate}/`;

    const publisherName = process.env.STORY_PUBLISHER_NAME || "Tio Ben IA";
    const publisherLogoSrc =
      process.env.STORY_PUBLISHER_LOGO ||
      `${siteUrl.replace(/\/$/, "")}/images/logo-amp.png`;

    const posterSrc =
      process.env.STORY_LITURGIA_POSTER_DEFAULT ||
      `${siteUrl.replace(/\/$/, "")}/images/stories/liturgia-default.jpg`;

    const bgDarkSrc =
      process.env.STORY_LITURGIA_BG_DARK ||
      `${siteUrl.replace(/\/$/, "")}/images/stories/liturgia-bg-dark.jpg`;

    const bgLightSrc =
      process.env.STORY_LITURGIA_BG_LIGHT ||
      `${siteUrl.replace(/\/$/, "")}/images/stories/liturgia-bg-light.jpg`;

    const liturgia = await fetchLiturgiaByIsoDate(isoDate);

    const storyJson = buildLiturgiaStoryJson({
      isoDate,
      siteUrl,
      canonicalUrl,
      posterSrc,
      bgDarkSrc,
      bgLightSrc,
      publisherName,
      publisherLogoSrc,
      liturgia,
    });

    return NextResponse.json(storyJson, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erro desconhecido";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
