// app/lib/web-stories/liturgia-story-builder.ts

import type { LiturgiaPayload, LiturgiaLeiturasBlock, LiturgiaSection } from "./liturgia-source";
import type { LiturgyStoryJson, StoryPage, StoryBackground } from "./story-types";

function compact(s?: string | null) {
  return String(s ?? "").replace(/\s+/g, " ").trim();
}

function limitChars(s: string, max = 220) {
  const t = compact(s);
  if (!t) return "";
  if (t.length <= max) return t;
  return t.slice(0, max).replace(/[ ,.;:!?]+$/g, "") + "…";
}

function pickQuote(text: string) {
  const t = compact(text);
  if (!t) return "";
  const parts = t.split(/[.?!]\s+/).map((x) => compact(x)).filter(Boolean);
  const candidate = parts.find((x) => x.length >= 60 && x.length <= 160) || parts[0] || "";
  return candidate ? `“${candidate}”` : "";
}

function getCelebration(l: LiturgiaPayload): string {
  const v = (typeof l.liturgia === "string" ? l.liturgia : "") || (typeof l.celebration === "string" ? l.celebration : "");
  return compact(v);
}

function formatDatePtBR(iso: string) {
  const [y, m, d] = iso.split("-").map((x) => Number(x));
  const dt = new Date(y, (m || 1) - 1, d || 1, 12, 0, 0);
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(dt);
}

function bg(name: "Capa" | "Claro" | "Escuro"): StoryBackground {
  if (name === "Capa") {
    return { type: "image", src: "/images/liturgia-default.jpg", alt: "Liturgia" };
  }
  if (name === "Claro") {
    return {
      type: "image",
      src: "/images/Stories Instagram agenda semanal religioso moderno amarelo e preto.jpg",
      alt: "Liturgia clara",
    };
  }
  return {
    type: "image",
    src: "/images/Stories Instagram agenda semanal religioso moderno amarelo e preto (1).jpg",
    alt: "Liturgia escura",
  };
}

type LeituraKey = keyof LiturgiaLeiturasBlock;

/**
 * Normaliza o acesso às leituras em 3 camadas:
 * 1) leiturasFull (normalizado)
 * 2) leituras (raw da API)
 * 3) campos soltos (primeiraLeitura, salmo, etc.)
 */
function pickLeiturasBlock(l: LiturgiaPayload): LiturgiaLeiturasBlock {
  if (l.leiturasFull) return l.leiturasFull;
  if (l.leituras) return l.leituras;

  // fallback “solto”
  return {
    primeiraLeitura: l.primeiraLeitura,
    segundaLeitura: l.segundaLeitura,
    salmo: l.salmo,
    evangelho: l.evangelho,
  };
}

function firstOf(block: LiturgiaLeiturasBlock, key: LeituraKey): LiturgiaSection | null {
  const arr = block[key];
  return Array.isArray(arr) && arr.length ? arr[0] : null;
}

function toSlugFromIso(isoDate: string) {
  // ISO yyyy-mm-dd -> dd-mm-yyyy
  const [y, m, d] = isoDate.split("-");
  return `${d}-${m}-${y}`;
}

export function buildLiturgiaStory(params: {
  liturgia: LiturgiaPayload;
  isoDate: string; // YYYY-MM-DD
  canonicalUrl: string; // URL da liturgia completa no seu site (ou do story landing)
  storyUrl: string; // URL pública do web story
  lang?: string; // default pt-BR
}) {
  const { liturgia, isoDate, canonicalUrl, storyUrl, lang = "pt-BR" } = params;

  const dateLabel = formatDatePtBR(isoDate);
  const slug = `liturgia-${toSlugFromIso(isoDate)}`;

  const leiturasBlock = pickLeiturasBlock(liturgia);

  const reading1 = firstOf(leiturasBlock, "primeiraLeitura");
  const reading2 = firstOf(leiturasBlock, "segundaLeitura");
  const psalm = firstOf(leiturasBlock, "salmo");
  const gospel = firstOf(leiturasBlock, "evangelho");

  const gospelText = compact(gospel?.texto || "");
  const themeText = "A Palavra de hoje nos convida a acolher a graça de Deus e viver com fidelidade.";

  const pages: StoryPage[] = [];

  // 1) CAPA (escura)
  pages.push({
    id: "cover",
    background: bg("Capa"),
    heading: "Liturgia de Hoje",
    subheading: dateLabel,
    text: "Leituras • Salmo • Evangelho",
    cta: { label: "Começar agora", url: canonicalUrl },
  });

  // 2) HOJE NA IGREJA (escuro) — mostra o campo liturgia/celebration
  pages.push({
    id: "theme",
    background: bg("Escuro"),
    heading: "Hoje na Igreja",
    subheading: getCelebration(liturgia) || dateLabel,
    text: limitChars(themeText, 200),
    quote: pickQuote(gospelText) || undefined,
    cta: { label: "Rezar no site (completo)", url: canonicalUrl },
  });

  // 3) 1ª Leitura (escuro) — sem trecho, só referência
  pages.push({
    id: "reading1",
    background: bg("Escuro"),
    heading: "1ª Leitura",
    reference: compact(reading1?.referencia) || "1ª Leitura",
    text: "Leia a passagem completa e reze com calma no Tio Ben IA.",
    cta: { label: "Abrir a 1ª leitura no site", url: canonicalUrl },
  });

  // 4) (opcional) 2ª Leitura — sem trecho
  if (compact(reading2?.referencia)) {
    pages.push({
      id: "reading2",
      background: bg("Escuro"),
      heading: "2ª Leitura",
      reference: compact(reading2?.referencia) || "2ª Leitura",
      text: "Leia a passagem completa e reze com calma no Tio Ben IA.",
      cta: { label: "Abrir a 2ª leitura no site", url: canonicalUrl },
    });
  }

  // 5) Salmo (escuro) — refrão destacado
  pages.push({
    id: "psalm",
    background: bg("Escuro"),
    heading: "Salmo",
    reference: compact(psalm?.referencia) || "Salmo",
    refrain: limitChars(compact(psalm?.refrao || ""), 140) || "Refrão do salmo",
    text: "Reze o salmo completo no Tio Ben IA.",
    cta: { label: "Rezar o Salmo no site", url: canonicalUrl },
  });

  // 6) Evangelho (escuro) — sem trecho, só referência
  pages.push({
    id: "gospel",
    background: bg("Escuro"),
    heading: "Evangelho",
    reference: compact(gospel?.referencia) || "Evangelho",
    text: "Abra o Evangelho completo e medite com calma.",
    cta: { label: "Ler o Evangelho no site", url: canonicalUrl },
  });

  // 7) Para viver hoje (claro)
  pages.push({
    id: "apply",
    background: bg("Claro"),
    heading: "Para viver hoje",
    bullets: [
      "Reserve 5 minutos de silêncio e oração antes de começar o dia.",
      "Releia o Evangelho e escolha uma atitude concreta para praticar.",
      "Faça um gesto de caridade ou reconciliação ainda hoje.",
    ],
    prayer: "Senhor, ajuda-me a viver tua Palavra hoje.",
    cta: { label: "Ver a Liturgia Completa", url: canonicalUrl },
  });

  // 8) CTA final (claro)
  pages.push({
    id: "cta",
    background: bg("Claro"),
    heading: "Reze a liturgia completa",
    text: "Leituras, salmo, Evangelho, orações e antífonas — tudo em um só lugar.",
    cta: { label: "Abrir a Liturgia Completa", url: canonicalUrl },
  });

  const json: LiturgyStoryJson = {
    type: "liturgy",
    lang,
    date: isoDate,
    slug,

    title: `Liturgia — ${dateLabel}`,
    description: `Liturgia do dia ${dateLabel} no Tio Ben IA.`,

    canonicalUrl,
    storyUrl,

    publisherName: "Tio Ben IA",
    publisherLogoSrc: "/images/logo.png",

    poster: {
      src: "/images/liturgia-default.jpg",
      width: 720,
      height: 1280,
      alt: "Liturgia",
    },

    pages,
  };

  return json;
}
