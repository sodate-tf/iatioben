// lib/web-stories/liturgia-story-builder.ts
import type { LiturgyStoryJson, StoryTheme } from "./story-types";
import type { LiturgiaPayload, LiturgiaSection } from "./liturgia-source";

function stripHtml(s: string) {
  return (s ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function compact(s: string) {
  return (s ?? "").replace(/\s+/g, " ").trim();
}

function limitChars(s: string, max: number) {
  const t = compact(s);
  if (t.length <= max) return t;
  return t.slice(0, Math.max(0, max - 1)).trimEnd() + "…";
}

function formatDatePtBR(isoDate: string) {
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
}

function isoToSlugBR(isoDate: string) {
  const [y, m, d] = isoDate.split("-");
  return `${d}-${m}-${y}`;
}

function pickReading(l: LiturgiaPayload, which: 1 | 2): LiturgiaSection | null {
  if (which === 1) return (l.primeiraLeitura ?? l.leituras?.[0] ?? null) as LiturgiaSection | null;
  if (which === 2) return (l.segundaLeitura ?? l.leituras?.[1] ?? null) as LiturgiaSection | null;
  return null;
}

function bulletize(text: string, maxBullets: number) {
  const plain = stripHtml(text);
  if (!plain) return ["Conteúdo disponível no Tio Ben IA."];

  const sentences = plain
    .split(/(?<=[\.\!\?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const bullets: string[] = [];
  for (const s of sentences) {
    const short = limitChars(s, 110);
    if (short.length >= 25) bullets.push(short);
    if (bullets.length >= maxBullets) break;
  }

  return bullets.length ? bullets : [limitChars(plain, 110)];
}

function summarizeThemeFromGospel(text: string) {
  const plain = stripHtml(text);
  if (!plain) return "";
  const parts = plain.split(/(?<=[\.\!\?])\s+/).filter(Boolean);
  return parts.slice(0, 2).join(" ");
}

function pickQuote(text: string) {
  const plain = stripHtml(text);
  if (!plain) return "";
  const parts = plain.split(/(?<=[\.\!\?])\s+/).filter(Boolean);
  const best = parts.find((p) => p.length >= 40 && p.length <= 140);
  return best ? limitChars(best, 140) : "";
}

function bg(src: string, alt: string) {
  return { type: "image" as const, src, alt };
}

function pageTheme(theme: StoryTheme, src: string, alt: string) {
  return { theme, background: bg(src, alt) };
}

export function buildLiturgiaStoryJson(args: {
  isoDate: string;
  siteUrl: string;
  canonicalUrl: string;

  // CAPA (poster-portrait-src)
  posterSrc: string;

  // Fundos internos
  bgDarkSrc: string;
  bgLightSrc: string;

  publisherName: string;
  publisherLogoSrc: string;

  liturgia: LiturgiaPayload;
}): LiturgyStoryJson {
  const {
    isoDate,
    siteUrl,
    canonicalUrl,
    posterSrc,
    bgDarkSrc,
    bgLightSrc,
    publisherName,
    publisherLogoSrc,
    liturgia,
  } = args;

  const dateLabel = formatDatePtBR(isoDate);
  const slug = `liturgia-${isoToSlugBR(isoDate)}`;
  const storyUrl = `${siteUrl.replace(/\/$/, "")}/web-stories/${slug}/`;

  const reading1 = pickReading(liturgia, 1);
  const reading2 = pickReading(liturgia, 2);
  const psalm = liturgia.salmo ?? null;
  const gospel = liturgia.evangelho ?? null;

  const gospelText = (gospel?.texto ?? gospel?.textoHtml ?? "") as string;
  const themeText =
    summarizeThemeFromGospel(gospelText) ||
    "A Palavra de hoje nos convida a acolher a graça de Deus e viver com fidelidade.";

  const psalmRefrain =
    (psalm as any)?.refrao ??
    (psalm as any)?.refraoSalmo ??
    (psalm as any)?.refrao_salmo ??
    null;

  const pages: LiturgyStoryJson["pages"] = [];

  // 1) CAPA (usa o seu liturgia-default)
  pages.push({
    id: "cover",
    ...pageTheme("dark", posterSrc, `Liturgia do dia ${dateLabel}`),
    heading: "Liturgia de Hoje",
    subheading: dateLabel,
    text: "Leituras • Salmo • Evangelho",
    cta: { label: "Deslize", url: null },
  });

  // 2) TEMA DO DIA (interno escuro)
  pages.push({
    id: "theme",
    ...pageTheme("dark", bgDarkSrc, "Bíblia e oração"),
    heading: "O que Deus nos fala hoje?",
    text: limitChars(themeText, 220),
    quote: pickQuote(gospelText) || undefined,
    cta: { label: "Ler completo", url: canonicalUrl },
  });

  // 3) 1ª Leitura (interno escuro)
  pages.push({
    id: "reading1",
    ...pageTheme("dark", bgDarkSrc, "Primeira leitura"),
    heading: "1ª Leitura",
    reference: (reading1?.referencia ?? "1ª Leitura") as string,
    bullets: bulletize((reading1?.texto ?? reading1?.textoHtml ?? "") as string, 3),
  });

  // 4) Salmo (interno escuro)
  pages.push({
    id: "psalm",
    ...pageTheme("dark", bgDarkSrc, "Salmo"),
    heading: "Salmo",
    reference: (psalm?.referencia ?? "Salmo") as string,
    refrain: psalmRefrain ? limitChars(String(psalmRefrain), 120) : undefined,
    bullets: bulletize((psalm?.texto ?? psalm?.textoHtml ?? "") as string, 1),
  });

  // 5) 2ª Leitura (se existir) + Evangelho (interno escuro)
  if (reading2) {
    pages.push({
      id: "reading2",
      ...pageTheme("dark", bgDarkSrc, "Segunda leitura"),
      heading: "2ª Leitura",
      reference: (reading2.referencia ?? "2ª Leitura") as string,
      bullets: bulletize((reading2.texto ?? reading2.textoHtml ?? "") as string, 3),
    });
  }

  pages.push({
    id: "gospel",
    ...pageTheme("dark", bgDarkSrc, "Evangelho"),
    heading: "Evangelho",
    reference: (gospel?.referencia ?? "Evangelho") as string,
    bullets: bulletize(gospelText, 3),
  });

  // 6) Aplicação prática (interno claro)
  pages.push({
    id: "application",
    ...pageTheme("light", bgLightSrc, "Aplicação prática"),
    heading: "Para viver hoje",
    bullets: [
      "Reserve 5 minutos de silêncio e oração antes de começar o dia.",
      "Releia o Evangelho e escolha uma atitude concreta para praticar.",
      "Faça um gesto de caridade ou reconciliação ainda hoje.",
    ],
    prayer: "Senhor, ajuda-me a viver tua Palavra hoje.",
  });

  // 7) CTA (interno claro)
  pages.push({
    id: "cta",
    ...pageTheme("light", bgLightSrc, "Convite à leitura"),
    heading: "Leia a liturgia completa",
    text: "Acesse todas as leituras e reze com calma no Tio Ben IA.",
    cta: { label: "Abrir liturgia do dia", url: canonicalUrl },
  });

  return {
    type: "liturgy",
    lang: "pt-BR",
    date: isoDate,
    slug,
    title: "Liturgia de Hoje",
    description: `Liturgia do dia ${dateLabel} — Leituras, Salmo e Evangelho.`,
    canonicalUrl,
    storyUrl,
    publisherName,
    publisherLogoSrc,
    poster: { src: posterSrc, width: 1080, height: 1920, alt: `Liturgia do dia ${dateLabel}` },
    pages,
  };
}
