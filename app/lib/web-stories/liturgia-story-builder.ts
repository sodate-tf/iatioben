import type { LiturgyStoryJson } from "./story-types";
import type { LiturgiaPayload, LiturgiaSection } from "./liturgia-source";

function stripHtml(s: string) {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function compact(s: string) {
  return s.replace(/\s+/g, " ").trim();
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
  if (which === 1) return l.primeiraLeitura ?? l.leituras?.[0] ?? null;
  if (which === 2) return l.segundaLeitura ?? l.leituras?.[1] ?? null;
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

export function buildLiturgiaStoryJson(args: {
  isoDate: string;
  siteUrl: string;
  canonicalUrl: string;
  posterSrc: string;
  publisherName: string;
  publisherLogoSrc: string;
  liturgia: LiturgiaPayload;
}): LiturgyStoryJson {
  const { isoDate, siteUrl, canonicalUrl, posterSrc, publisherName, publisherLogoSrc, liturgia } = args;

  const dateLabel = formatDatePtBR(isoDate);
  const slug = `liturgia-${isoToSlugBR(isoDate)}`;

  const reading1 = pickReading(liturgia, 1);
  const reading2 = pickReading(liturgia, 2);
  const psalm = liturgia.salmo ?? null;
  const gospel = liturgia.evangelho ?? null;

  const gospelText = gospel?.texto ?? gospel?.textoHtml ?? "";
  const themeText =
    summarizeThemeFromGospel(gospelText) ||
    "A Palavra de hoje nos convida a acolher a graça de Deus e viver com fidelidade.";

  const storyUrl = `${siteUrl.replace(/\/$/, "")}/web-stories/${slug}/`;

  const bg = (alt: string) => ({
    type: "image" as const,
    src: posterSrc,
    alt
  });

  const pages: LiturgyStoryJson["pages"] = [];

  pages.push({
    id: "cover",
    background: bg(`Liturgia do dia ${dateLabel}`),
    heading: "Liturgia de Hoje",
    subheading: dateLabel,
    text: "Leituras • Salmo • Evangelho",
    cta: { label: "Deslize", url: null }
  });

  pages.push({
    id: "theme",
    background: bg("Bíblia e oração"),
    heading: "O que Deus nos fala hoje?",
    text: limitChars(themeText, 220),
    quote: pickQuote(gospelText) || undefined,
    cta: { label: "Ler completo", url: canonicalUrl }
  });

  pages.push({
    id: "reading1",
    background: bg("Primeira leitura"),
    heading: "1ª Leitura",
    reference: reading1?.referencia ?? "1ª Leitura",
    bullets: bulletize(reading1?.texto ?? reading1?.textoHtml ?? "", 3)
  });

  pages.push({
    id: "psalm",
    background: bg("Salmo"),
    heading: "Salmo",
    reference: psalm?.referencia ?? "Salmo",
    refrain: limitChars(psalm?.refrao ?? "Refrão do salmo", 120),
    bullets: bulletize(psalm?.texto ?? psalm?.textoHtml ?? "", 1)
  });

  if (reading2) {
    pages.push({
      id: "reading2",
      background: bg("Segunda leitura"),
      heading: "2ª Leitura",
      reference: reading2.referencia ?? "2ª Leitura",
      bullets: bulletize(reading2.texto ?? reading2.textoHtml ?? "", 3)
    });

    pages.push({
      id: "gospel",
      background: bg("Evangelho"),
      heading: "Evangelho",
      reference: gospel?.referencia ?? "Evangelho",
      bullets: bulletize(gospelText, 3)
    });
  } else {
    pages.push({
      id: "gospel1",
      background: bg("Evangelho"),
      heading: "Evangelho",
      reference: gospel?.referencia ?? "Evangelho",
      bullets: bulletize(gospelText, 3)
    });
  }

  pages.push({
    id: "application",
    background: bg("Aplicação prática"),
    heading: "Para viver hoje",
    bullets: [
      "Reserve 5 minutos de silêncio e oração antes de começar o dia.",
      "Releia o Evangelho e escolha uma atitude concreta para praticar.",
      "Faça um gesto de caridade ou reconciliação ainda hoje."
    ],
    prayer: "Senhor, ajuda-me a viver tua Palavra hoje."
  });

  pages.push({
    id: "cta",
    background: bg("Convite à leitura"),
    heading: "Leia a liturgia completa",
    text: "Acesse todas as leituras e reze com calma no Tio Ben IA.",
    cta: { label: "Abrir liturgia do dia", url: canonicalUrl }
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
    pages
  };
}
