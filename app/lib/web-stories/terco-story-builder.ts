// app/lib/web-stories/terco-story-builder.ts
import type { StoryPage } from "@/app/lib/web-stories/story-types";

export type TercoStoryJson = {
  type: "rosary";
  lang: string; // pt-BR
  date: string; // yyyy-mm-dd
  slug: string;

  title: string;
  description: string;

  canonicalUrl: string;
  storyUrl: string;

  publisherName: string;
  publisherLogoSrc: string;

  poster: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };

  pages: StoryPage[];
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatDatePtBR(iso: string) {
  const [y, m, d] = iso.split("-").map((x) => Number(x));
  const dt = new Date(y, (m || 1) - 1, d || 1, 12, 0, 0);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dt);
}

// ✅ validação real da data (evita 2026-02-31 etc.)
export function isValidIsoDate(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d, 12, 0, 0);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

function isoToSlugBR(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

type MisterioPack = {
  tipo: "Gozoso" | "Doloroso" | "Glorioso" | "Luminoso";
  titulo: string; // "Terço Glorioso"
  subtitulo: string; // convite curto
  misterios: string[]; // 5 itens
};

function misterioDoDia(iso: string): MisterioPack {
  // getDay(): 0 dom, 1 seg, 2 ter, 3 qua, 4 qui, 5 sex, 6 sáb
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d, 12, 0, 0);
  const dow = dt.getDay();

  const gozosos: MisterioPack = {
    tipo: "Gozoso",
    titulo: "Terço Gozoso",
    subtitulo: "Hoje contemplamos os Mistérios da alegria de Cristo e de Maria.",
    misterios: [
      "1º Mistério: A Anunciação do Anjo a Maria",
      "2º Mistério: A Visitação de Maria a Isabel",
      "3º Mistério: O Nascimento de Jesus",
      "4º Mistério: A Apresentação do Menino Jesus no Templo",
      "5º Mistério: O Encontro de Jesus no Templo",
    ],
  };

  const dolorosos: MisterioPack = {
    tipo: "Doloroso",
    titulo: "Terço Doloroso",
    subtitulo: "Hoje meditamos a Paixão do Senhor e aprendemos a perseverar na fé.",
    misterios: [
      "1º Mistério: A Agonia de Jesus no Horto",
      "2º Mistério: A Flagelação de Jesus",
      "3º Mistério: A Coroação de espinhos",
      "4º Mistério: Jesus carrega a Cruz",
      "5º Mistério: A Crucificação e Morte de Jesus",
    ],
  };

  const gloriosos: MisterioPack = {
    tipo: "Glorioso",
    titulo: "Terço Glorioso",
    subtitulo: "Hoje celebramos a vitória de Cristo e a glória de Maria na Igreja.",
    misterios: [
      "1º Mistério: A Ressurreição de Jesus",
      "2º Mistério: A Ascensão de Jesus ao Céu",
      "3º Mistério: A Vinda do Espírito Santo",
      "4º Mistério: A Assunção de Maria ao Céu",
      "5º Mistério: A Coroação de Maria como Rainha do Céu e da Terra",
    ],
  };

  const luminosos: MisterioPack = {
    tipo: "Luminoso",
    titulo: "Terço Luminoso",
    subtitulo: "Hoje contemplamos a vida pública de Jesus e sua luz para o mundo.",
    misterios: [
      "1º Mistério: O Batismo de Jesus no Jordão",
      "2º Mistério: As Bodas de Caná",
      "3º Mistério: O Anúncio do Reino de Deus",
      "4º Mistério: A Transfiguração do Senhor",
      "5º Mistério: A Instituição da Eucaristia",
    ],
  };

  // Padrão tradicional:
  // Seg e Sáb: Gozosos
  // Ter e Sex: Dolorosos
  // Qua e Dom: Gloriosos
  // Qui: Luminosos
  if (dow === 1 || dow === 6) return gozosos;
  if (dow === 2 || dow === 5) return dolorosos;
  if (dow === 4) return luminosos;
  return gloriosos; // dow 0 (dom) ou 3 (qua)
}

function bgFrom(src: string, alt: string) {
  return { type: "image" as const, src, alt };
}

export function buildTercoStoryJson(args: {
  isoDate: string;
  siteUrl: string;
  canonicalUrl: string;
  storyUrl: string;

  publisherName: string;
  publisherLogoSrc: string;

  posterSrc: string; // terco-misterio (capa)
  bgDarkSrc: string;
  bgLightSrc: string;

  lang?: string;
}): TercoStoryJson {
  const {
    isoDate,
    siteUrl,
    canonicalUrl,
    storyUrl,
    publisherName,
    publisherLogoSrc,
    posterSrc,
    bgDarkSrc,
    bgLightSrc,
    lang = "pt-BR",
  } = args;

  if (!isValidIsoDate(isoDate)) {
    throw new Error("isoDate inválido. Use YYYY-MM-DD e uma data existente.");
  }

  const dateLabel = formatDatePtBR(isoDate);
  const slug = `terco-${isoToSlugBR(isoDate)}`;

  const pack = misterioDoDia(isoDate);

  const pages: StoryPage[] = [];

  // 1) CAPA (poster terco-misterio) — aqui “vai escrever qual o terço do dia”
  pages.push({
    id: "cover",
    theme: "dark",
    background: bgFrom(posterSrc, `Capa do ${pack.titulo}`),
    heading: pack.titulo,
    subheading: dateLabel,
    text: "Reze conosco em poucos minutos.",
    cta: { label: "Rezar agora no site", url: canonicalUrl },
  });

  // 2) Convite (dark)
  pages.push({
    id: "invite",
    theme: "dark",
    background: bgFrom(bgDarkSrc, "Fundo escuro do terço"),
    heading: "Hoje é dia de rezar",
    subheading: pack.titulo,
    text: pack.subtitulo,
    cta: { label: "Abrir o Terço completo", url: canonicalUrl },
  });

  // 3) Mistérios do dia (dark)
  pages.push({
    id: "misterios",
    theme: "dark",
    background: bgFrom(bgDarkSrc, "Mistérios do terço"),
    heading: "Mistérios do dia",
    subheading: pack.titulo,
    bullets: pack.misterios,
    cta: { label: "Rezar com guia no site", url: canonicalUrl },
  });

  // 4) Como rezar (light)
  pages.push({
    id: "como-rezar",
    theme: "light",
    background: bgFrom(bgLightSrc, "Como rezar o terço"),
    heading: "Como rezar (resumo)",
    bullets: [
      "Sinal da Cruz e oferecimento.",
      "1 Pai-Nosso, 10 Ave-Marias, 1 Glória em cada mistério.",
      "Medite cada mistério com calma.",
    ],
    prayer: "Jesus, eu confio em Vós.",
    cta: { label: "Ver passo a passo completo", url: canonicalUrl },
  });

  // 5) CTA final (light)
  pages.push({
    id: "cta",
    theme: "light",
    background: bgFrom(bgLightSrc, "Convite final"),
    heading: "Reze hoje com constância",
    text: "Abra o terço completo no Tio Ben IA e reze com foco e paz.",
    cta: { label: "Abrir o Terço de hoje", url: canonicalUrl },
  });

  return {
    type: "rosary",
    lang,
    date: isoDate,
    slug,
    title: `${pack.titulo} — ${dateLabel}`,
    description: `${pack.titulo} do dia ${dateLabel}. Mistérios e convite para rezar no Tio Ben IA.`,
    canonicalUrl,
    storyUrl,
    publisherName,
    publisherLogoSrc,
    poster: { src: posterSrc, width: 1080, height: 1920, alt: `Capa do ${pack.titulo}` },
    pages,
  };
}
