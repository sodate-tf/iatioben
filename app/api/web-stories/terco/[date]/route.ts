// app/api/web-stories/terco/[date]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { buildTercoStoryJson } from "@/app/lib/web-stories/terco-story-builder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { date: string };

export async function GET(_req: NextRequest, ctx: { params: Promise<Params> }) {
  try {
    const { date } = await ctx.params;

    const isoDate = date;
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.iatioben.com.br").replace(/\/$/, "");

    const canonicalUrl = `${siteUrl}/terco/${isoDate}`; // ajuste se sua rota for outra
    const storyUrl = `${siteUrl}/web-stories/terco-${isoDate.split("-").reverse().join("-")}/`;

    const publisherName = process.env.STORY_PUBLISHER_NAME || "Tio Ben IA";
    const publisherLogoSrc =
      process.env.STORY_PUBLISHER_LOGO || `${siteUrl}/images/logo-amp.png`;

    const posterSrc =
      process.env.STORY_TERCO_POSTER || `${siteUrl}/images/stories/terco-misterio.jpg`;

    const bgDarkSrc =
      process.env.STORY_TERCO_BG_DARK || `${siteUrl}/images/stories/terco-bg-dark.jpg`;

    const bgLightSrc =
      process.env.STORY_TERCO_BG_LIGHT || `${siteUrl}/images/stories/terco-bg-light.jpg`;

    const storyJson = buildTercoStoryJson({
      isoDate,
      siteUrl,
      canonicalUrl,
      storyUrl,
      publisherName,
      publisherLogoSrc,
      posterSrc,
      bgDarkSrc,
      bgLightSrc,
      lang: "pt-BR",
    });

    return NextResponse.json(storyJson, { status: 200 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
