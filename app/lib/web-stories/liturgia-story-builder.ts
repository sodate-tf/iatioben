// app/lib/web-stories/liturgia-story-builder.ts
import type { LiturgyStoryJson, StoryTheme } from "./story-types";
import type { LiturgiaLike, LiturgiaSection } from "./liturgia-source";

function stripHtml(s: string) {
  return (s || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function compact(s: string) {
  return (s || "").replace(/\s+/g, " ").trim();
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

type LeituraKey = keyof NonNullable<LiturgiaLike["leiturasFull"]>;
type RawLeituras = NonNullable<LiturgiaLike["leituras"]>;

function getArr(l: LiturgiaLike, key: LeituraKey): LiturgiaSection[] {
  // 1) Normalizado
  const fromFull = l.leiturasFull?.[key];
  if (Array.isArray(fromFull) && fromFull.length) return fromFull;

  // 2) RAW (tipado)
  const raw: RawLeituras | undefined = l.leituras;
  const fromRaw = raw?.[key];
  if (Array.isArray(fromRaw) && fromRaw.length) return fromRaw;

  // 3) fallback “solto” (acesso seguro sem any)
  const direct = (l as Record<string, unknown>)[key];
  if (Array.isArray(direct) && direct.length) return direct as LiturgiaSection[];

  return [];
}

function pick0(arr: LiturgiaSection[]) {
  return arr && arr.length ? arr[0] : null;
}

function bulletize(text: string, maxBullets: number) {
  const plain = stripHtml(text);
  if (!plain) {
    return ["Toque em “Rezar no site” para ler o conteúdo completo."];
  }

  // tenta “sentenças” curtas
  const sentences = plain
    .split(/(?<=[\.\!\?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const bullets: string[] = [];
  for (const s of sentences) {
    const short = limitChars(s, 120);
    if (short.length >= 25) bullets.push(short);
    if (bullets.length >= maxBullets) break;
  }

  // fallback: primeira fatia do texto
  if (!bullets.length) bullets.push(limitChars(plain, 140));

  return bullets;
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

  publisherName: string;
  publisherLogoSrc: string;

  // fundos
  posterSrc: string;        // capa (liturgia-default)
  bgDarkSrc: string;        // interno escuro
  bgLightSrc: string;       // interno claro

  liturgia: LiturgiaLike;
}): LiturgyStoryJson {
  const {
    isoDate,
    siteUrl,
    canonicalUrl,
    publisherName,
    publisherLogoSrc,
    posterSrc,
    bgDarkSrc,
    bgLightSrc,
    liturgia,
  } = args;

  const dateLabel = formatDatePtBR(isoDate);
  const slug = `liturgia-${isoToSlugBR(isoDate)}`;
  const storyUrl = `${siteUrl.replace(/\/$/, "")}/web-stories/${slug}/`;

  // seções (suporta normalizado e raw)
const primeira = pick0(getArr(liturgia, "primeiraLeitura"));
const segunda = pick0(getArr(liturgia, "segundaLeitura"));
const salmo = pick0(getArr(liturgia, "salmo"));
const evangelho = pick0(getArr(liturgia, "evangelho"));


  const gospelText = evangelho?.texto ?? evangelho?.textoHtml ?? "";
  const themeText =
    summarizeThemeFromGospel(gospelText) ||
    "A Palavra de hoje nos convida a acolher a graça de Deus e viver com fidelidade.";

  const bg = (src: string, alt: string) => ({ type: "image" as const, src, alt });

  const pages: LiturgyStoryJson["pages"] = [];

  // CAPA (poster)
  pages.push({
    id: "cover",
    theme: "dark",
    background: bg(posterSrc, `Liturgia do dia ${dateLabel}`),
    heading: "Liturgia de Hoje",
    subheading: dateLabel,
    text: "Leituras • Salmo • Evangelho",
    cta: { label: "Começar agora", url: canonicalUrl },
  });

  // TEMA (escuro)
  pages.push({
    id: "theme",
    theme: "dark",
    background: bg(bgDarkSrc, "Reflexão do dia"),
    heading: "O que Deus nos fala hoje?",
    text: limitChars(themeText, 240),
    quote: pickQuote(gospelText) || undefined,
    cta: { label: "Rezar no site (completo)", url: canonicalUrl },
  });

  // 1ª Leitura (escuro)
  pages.push({
    id: "reading1",
    theme: "dark",
    background: bg(bgDarkSrc, "Primeira leitura"),
    heading: "1ª Leitura",
    reference: primeira?.referencia ?? "Leitura do dia",
    bullets: bulletize(primeira?.texto ?? primeira?.textoHtml ?? "", 2),
    cta: { label: "Ler a 1ª leitura completa", url: canonicalUrl },
  });

  // Salmo (escuro)
  pages.push({
    id: "psalm",
    theme: "dark",
    background: bg(bgDarkSrc, "Salmo do dia"),
    heading: "Salmo",
    reference: salmo?.referencia ?? "Salmo",
    refrain: limitChars(salmo?.refrao ?? "Refrão do salmo", 140),
    bullets: bulletize(salmo?.texto ?? salmo?.textoHtml ?? "", 1),
    cta: { label: "Rezar o salmo completo", url: canonicalUrl },
  });

  // 2ª Leitura (se existir) + Evangelho
  if (segunda?.texto || segunda?.textoHtml || segunda?.referencia) {
    pages.push({
      id: "reading2",
      theme: "dark",
      background: bg(bgDarkSrc, "Segunda leitura"),
      heading: "2ª Leitura",
      reference: segunda?.referencia ?? "2ª Leitura",
      bullets: bulletize(segunda?.texto ?? segunda?.textoHtml ?? "", 2),
      cta: { label: "Ler a 2ª leitura completa", url: canonicalUrl },
    });

    pages.push({
      id: "gospel",
      theme: "dark",
      background: bg(bgDarkSrc, "Evangelho do dia"),
      heading: "Evangelho",
      reference: evangelho?.referencia ?? "Evangelho",
      bullets: bulletize(gospelText, 2),
      cta: { label: "Ler o Evangelho completo", url: canonicalUrl },
    });
  } else {
    pages.push({
      id: "gospel1",
      theme: "dark",
      background: bg(bgDarkSrc, "Evangelho do dia"),
      heading: "Evangelho",
      reference: evangelho?.referencia ?? "Evangelho",
      bullets: bulletize(gospelText, 2),
      cta: { label: "Ler o Evangelho completo", url: canonicalUrl },
    });
  }

  // Aplicação prática (claro)
  pages.push({
    id: "application",
    theme: "light",
    background: bg(bgLightSrc, "Aplicação prática"),
    heading: "Para viver hoje",
    bullets: [
      "Separe 3 minutos de silêncio antes de começar o dia.",
      "Releia o Evangelho e escolha uma atitude concreta para praticar.",
      "Faça um gesto simples de caridade ou reconciliação ainda hoje.",
    ],
    prayer: "Senhor, ajuda-me a viver tua Palavra hoje.",
    cta: { label: "Fazer minha oração no site", url: canonicalUrl },
  });

  // CTA final (claro) – mais forte
  pages.push({
    id: "cta",
    theme: "light",
    background: bg(bgLightSrc, "Convite à leitura"),
    heading: "Reze a liturgia completa",
    text: "Acesse todas as leituras, antífonas e orações no Tio Ben IA.",
    cta: { label: "Abrir agora (liturgia do dia)", url: canonicalUrl },
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
    poster: {
      src: posterSrc,
      width: 1080,
      height: 1920,
      alt: `Liturgia do dia ${dateLabel}`,
    },
    pages,
  };
}
