import { buildLiturgiaStoryJson } from "@/app/lib/web-stories/liturgia-story-builder";
import { fetchLiturgiaByDate, fetchLiturgiaByIsoDate } from "@/lib/liturgia/api";
import { NextRequest, NextResponse } from "next/server";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function assertIsoDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Parâmetro 'date' inválido. Use YYYY-MM-DD.");
  }
}

function toSlugBR(isoDate: string) {
  const [y, m, d] = isoDate.split("-");
  return `${d}-${m}-${y}`;
}

/**
 * Next.js 16 (tipagem atual) pode tipar `params` como Promise.
 * Por isso fazemos: const { date } = await params;
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { date: isoDate } = await params;
    assertIsoDate(isoDate);

    const siteUrl = process.env.SITE_URL ?? "https://www.iatioben.com.br";

    const posterSrc =
      process.env.STORY_LITURGIA_POSTER_DEFAULT ??
      `${siteUrl.replace(/\/$/, "")}/images/stories/liturgia-default.jpg`;

    const publisherName = process.env.STORY_PUBLISHER_NAME ?? "Tio Ben IA";

    const publisherLogoSrc =
      process.env.STORY_PUBLISHER_LOGO ??
      `${siteUrl.replace(/\/$/, "")}/images/logo-amp.png`;

    const canonicalUrl = `${siteUrl.replace(/\/$/, "")}/liturgia-diaria/${toSlugBR(
      isoDate
    )}`;

    const liturgia = await fetchLiturgiaByIsoDate(isoDate);

    const storyJson = buildLiturgiaStoryJson({
      isoDate,
      siteUrl,
      canonicalUrl,
      posterSrc,
      publisherName,
      publisherLogoSrc,
      liturgia,
    });

    return NextResponse.json(storyJson, {
      headers: {
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erro desconhecido";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
