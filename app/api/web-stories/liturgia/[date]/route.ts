import { fetchLiturgiaByDate } from "@/app/lib/web-stories/liturgia-source";
import { buildLiturgiaStoryJson } from "@/app/lib/web-stories/liturgia-story-builder";
import { NextResponse } from "next/server";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function assertIsoDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Parâmetro 'date' inválido. Use YYYY-MM-DD.");
  }
}

export async function GET(_: Request, ctx: { params: { date: string } }) {
  try {
    const isoDate = ctx.params.date;
    assertIsoDate(isoDate);

    const siteUrl = process.env.SITE_URL ?? "https://www.iatioben.com.br";
    const posterSrc =
      process.env.STORY_LITURGIA_POSTER_DEFAULT ??
      `${siteUrl.replace(/\/$/, "")}/images/stories/liturgia-default.jpg`;

    const publisherName = process.env.STORY_PUBLISHER_NAME ?? "Tio Ben IA";
    const publisherLogoSrc =
      process.env.STORY_PUBLISHER_LOGO ??
      `${siteUrl.replace(/\/$/, "")}/images/logo-amp.png`;

    const canonicalUrl = `${siteUrl.replace(/\/$/, "")}/liturgia-diaria/${toSlugBR(isoDate)}`;

    const liturgia = await fetchLiturgiaByDate(isoDate);

    const storyJson = buildLiturgiaStoryJson({
      isoDate,
      siteUrl,
      canonicalUrl,
      posterSrc,
      publisherName,
      publisherLogoSrc,
      liturgia
    });

    return NextResponse.json(storyJson, {
      headers: {
        "Cache-Control": "public, max-age=60" // ajuste conforme sua estratégia
      }
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Erro desconhecido" },
      { status: 400 }
    );
  }
}

function toSlugBR(isoDate: string) {
  const [y, m, d] = isoDate.split("-");
  return `${d}-${m}-${y}`;
}
