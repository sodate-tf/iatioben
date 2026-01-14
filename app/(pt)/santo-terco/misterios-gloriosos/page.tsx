import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { RosaryMysteriesAside } from "@/components/terco/RosaryMysteriAside";

export const dynamic = "force-static";

const SITE_URL = "https://www.iatioben.com.br";
const PAGE_PATH = "/santo-terco/misterios-gloriosos";
const CANONICAL_URL = `${SITE_URL}${PAGE_PATH}`;

const ADS_CLIENT = "ca-pub-8819996017476509";
const ADS_SLOT_BODY_TOP = "7474884427";
const ADS_SLOT_IN_ARTICLE = "6161802751";
const ADS_SLOT_SIDEBAR_DESKTOP = "8534838745";
const ADS_SLOT_SIDEBAR_MOBILE = "1573844576";



export const metadata: Metadata = {
  title: "Santo Terço: Mistérios Gloriosos — passagens bíblicas e reflexões",
  description:
    "Reze e medite os Mistérios Gloriosos (quarta e domingo) com passagens bíblicas e reflexões para contemplar a Ressurreição e a glória do Céu.",
  alternates: { canonical: CANONICAL_URL },

  openGraph: {
    title: "Santo Terço: Mistérios Gloriosos",
    description:
      "Quarta e domingo: contemple a Ressurreição e a esperança cristã. Clique e reze com Bíblia e meditações em cada dezena.",
    url: CANONICAL_URL,
    type: "article",
    locale: "pt_BR",
    siteName: "IA Tio Ben",
    images: [
      {
        url: `${SITE_URL}/og/terco/misterios-gloriosos.png?v=1`,
        width: 1200,
        height: 630,
        alt: "Santo Terço: Mistérios Gloriosos — IA Tio Ben",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Santo Terço: Mistérios Gloriosos",
    description:
      "Quarta e domingo: reze com sentido. Bíblia + reflexões para meditar a glória de Cristo e de Maria em cada dezena.",
    images: [`${SITE_URL}/og/terco/misterios-gloriosos.png?v=1`],
  },
};


type Mystery = {
  id: string;
  title: string;
  subtitle: string;
  passageRef: string;
  passageQuote: string;
  reflection: string[];
  points: string[]; // [0]=Pergunta..., [1]=Fruto...
};

const mysteries: Mystery[] = [
  {
    id: "ressurreicao",
    title: "1º Mistério Glorioso",
    subtitle: "A Ressurreição de Jesus",
    passageRef: "Lc 24,1–12 (cf. Jo 20,1–18)",
    passageQuote: "“Por que procurais entre os mortos aquele que está vivo?”",
    reflection: [
      "A Ressurreição não é um ‘final feliz’ apenas: é o começo de uma nova criação. Deus não devolve Jesus ao passado; Ele inaugura um futuro.",
      "O túmulo vazio ensina que a esperança cristã não é otimismo: é certeza fundada na ação de Deus, mesmo quando a realidade parece fechada.",
      "Ressuscitar, para nós, começa por dentro: quando a graça reabre portas que a tristeza fechou, quando o perdão interrompe ciclos, quando o coração volta a crer.",
      "Rezar este mistério é pedir que Deus ressuscite em nós aquilo que morreu por desânimo, medo ou pecado. O Senhor não apenas consola: Ele recria.",
    ],
    points: ["Pergunta: onde eu preciso voltar a esperar?", "Fruto: fé viva e alegria espiritual."],
  },
  {
    id: "ascensao",
    title: "2º Mistério Glorioso",
    subtitle: "A Ascensão do Senhor",
    passageRef: "At 1,6–11",
    passageQuote: "“Este Jesus… virá do mesmo modo como o vistes partir.”",
    reflection: [
      "A Ascensão não é ausência: é presença de outro modo. Jesus sobe para o Pai e, ao mesmo tempo, abre para nós o caminho do céu.",
      "Os discípulos são chamados a não ficar olhando para cima indefinidamente. A fé não é fuga do mundo, mas missão no mundo — com o coração voltado para Deus.",
      "A Ascensão cura um vício espiritual comum: querer segurar Deus do nosso jeito. Cristo nos educa a confiar, caminhar e testemunhar.",
      "Rezar este mistério é alinhar prioridades: viver com os pés no chão e o coração no alto — sem perder a esperança do encontro definitivo.",
    ],
    points: ["Pergunta: o que me distrai da missão concreta de hoje?", "Fruto: esperança e desejo do céu."],
  },
  {
    id: "pentecostes",
    title: "3º Mistério Glorioso",
    subtitle: "A Vinda do Espírito Santo",
    passageRef: "At 2,1–13",
    passageQuote: "“Todos ficaram cheios do Espírito Santo.”",
    reflection: [
      "Pentecostes é a cura do medo. O Espírito não muda apenas circunstâncias; Ele muda pessoas: dá coragem, clareza, constância e fogo interior.",
      "O mesmo grupo que antes se escondia agora anuncia. A fé não é temperamento; é graça recebida e correspondida.",
      "O Espírito também unifica: onde há Babel, Ele cria comunhão. Onde há confusão, Ele dá discernimento.",
      "Rezar este mistério é pedir dons concretos: sabedoria para decidir, fortaleza para perseverar, caridade para amar, e humildade para obedecer a Deus.",
    ],
    points: ["Pergunta: qual dom eu preciso pedir hoje com insistência?", "Fruto: zelo apostólico e coragem."],
  },
  {
    id: "assuncao",
    title: "4º Mistério Glorioso",
    subtitle: "A Assunção de Maria",
    passageRef: "Ap 12,1 (tradição da Igreja)",
    passageQuote: "“Apareceu no céu um grande sinal: uma Mulher revestida de sol.”",
    reflection: [
      "A Assunção revela o destino prometido: Deus não salva ‘pela metade’. Ele quer o ser humano inteiro, e a vida inteira transfigurada.",
      "Em Maria, a Igreja contempla aquilo que espera para si: não a fuga do corpo, mas a vitória da graça sobre a morte.",
      "Este mistério alimenta uma esperança concreta: a história não termina em desgaste. Em Deus, a fidelidade tem futuro.",
      "Rezar a Assunção é aprender a olhar a vida com horizonte eterno — e a viver o presente com mais pureza, coragem e confiança.",
    ],
    points: ["Pergunta: estou vivendo com horizonte eterno ou só reagindo ao imediato?", "Fruto: esperança e pureza."],
  },
  {
    id: "coroacao",
    title: "5º Mistério Glorioso",
    subtitle: "A Coroação de Maria no Céu",
    passageRef: "Ap 12,1 (símbolo) / tradição",
    passageQuote: "“Uma Mulher… e uma coroa de doze estrelas.”",
    reflection: [
      "A Coroação de Maria não é ‘competição’ de grandezas: é a exaltação da humildade. Deus coroa quem aprende a servir.",
      "Maria é imagem da Igreja glorificada: aquilo que Deus começou na fé, Ele leva à plenitude. A história da salvação tem coroamento.",
      "Este mistério educa nosso desejo: não buscar glória humana, mas a glória de Deus — que é amar e permanecer fiel.",
      "Rezar este mistério é pedir que nossa vida termine bem: com fidelidade, perseverança e amor até o fim.",
    ],
    points: ["Pergunta: que ‘glória’ eu tenho buscado — e o que Deus quer purificar em mim?", "Fruto: confiança filial e perseverança."],
  },
];

function buildJsonLd() {
  const today = new Date().toISOString().slice(0, 10);

  const faq = [
    { q: "Em quais dias se rezam os Mistérios Gloriosos?", a: "Tradicionalmente às quartas-feiras e aos domingos." },
    {
      q: "Quais são os cinco Mistérios Gloriosos?",
      a: "Ressurreição, Ascensão, Pentecostes, Assunção de Maria e Coroação de Maria.",
    },
    {
      q: "Como meditar os Mistérios Gloriosos?",
      a: "Anuncie o mistério, faça um breve silêncio e reze cada Ave-Maria como um ato de esperança. Contemple a vitória de Deus e peça a graça de viver com horizonte eterno.",
    },
    { q: "Posso rezar em outro dia?", a: "Sim. A divisão por dias é uma tradição devocional." },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": CANONICAL_URL },
    headline: "Mistérios Gloriosos do Terço: passagens bíblicas e reflexões",
    description:
      "Guia completo dos Mistérios Gloriosos do Terço com referências bíblicas, reflexões e orientações para rezar com sentido.",
    inLanguage: "pt-BR",
    author: { "@type": "Organization", name: "IA Tio Ben", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "IA Tio Ben",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/ben-transparente.png` },
    },
    datePublished: today,
    dateModified: today,
    image: `${SITE_URL}/images/santo-do-dia-ia-tio-ben.png`,
    about: [
      { "@type": "Thing", name: "Mistérios Gloriosos" },
      { "@type": "Thing", name: "Ressurreição" },
      { "@type": "Thing", name: "Pentecostes" },
      { "@type": "Thing", name: "Terço" },
    ],
    keywords: ["mistérios gloriosos", "terço quarta e domingo", "ressurreição", "pentecostes", "como meditar o terço"],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Santo Terço", item: `${SITE_URL}/santo-terco` },
      { "@type": "ListItem", position: 3, name: "Mistérios Gloriosos", item: CANONICAL_URL },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "pt-BR",
    mainEntity: faq.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a },
    })),
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Mistérios Gloriosos do Terço",
    itemListElement: mysteries.map((m, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: `${m.title} — ${m.subtitle}`,
      url: `${CANONICAL_URL}#${m.id}`,
      description: `${m.passageRef}.`,
    })),
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": CANONICAL_URL,
    url: CANONICAL_URL,
    name: "Mistérios Gloriosos do Terço: passagens bíblicas e reflexões",
    inLanguage: "pt-BR",
    isPartOf: { "@type": "WebSite", name: "IA Tio Ben", url: SITE_URL },
    mainEntity: [itemListSchema, faqSchema],
  };

  return { articleSchema, breadcrumbSchema, faqSchema, itemListSchema, webPageSchema };
}

function AdsenseResponsive({ slot, minHeight = 140 }: { slot: string; minHeight?: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
      <p className="px-1 pb-2 text-[11px] font-semibold text-muted-foreground">Publicidade</p>
      <div className="w-full overflow-hidden rounded-xl bg-muted/30" style={{ minHeight }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight }}
          data-ad-client={ADS_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
      <Script
        id={`adsbygoogle-push-${slot}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: `(adsbygoogle = window.adsbygoogle || []).push({});` }}
      />
    </div>
  );
}

function AdsenseInArticleFluid({ slot }: { slot: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
      <p className="px-1 pb-2 text-[11px] font-semibold text-muted-foreground">Publicidade</p>
      <div className="w-full overflow-hidden rounded-xl bg-muted/30 py-2">
        <ins
          className="adsbygoogle"
          style={{ display: "block", textAlign: "center" as const }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client={ADS_CLIENT}
          data-ad-slot={slot}
        />
      </div>
      <Script
        id={`adsbygoogle-push-inarticle-${slot}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: `(adsbygoogle = window.adsbygoogle || []).push({});` }}
      />
    </div>
  );
}

export default function MisteriosGloriososPage() {
  const { articleSchema, breadcrumbSchema, faqSchema, itemListSchema, webPageSchema } = buildJsonLd();

  // Inter-only: não usa "font-reading"
  const readingProse =
    "prose prose-amber max-w-none " +
    "prose-p:leading-[1.9] prose-li:leading-[1.85] " +
    "prose-p:my-4 prose-li:my-2 " +
    "prose-h2:mt-10 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3 " +
    "text-[17px] sm:text-[18px] lg:text-[18.5px] " +
    "text-foreground break-words hyphens-auto";

  function splitPoint(raw?: string) {
    if (!raw) return "";
    const i = raw.indexOf(":");
    if (i === -1) return raw;
    return raw.slice(i + 1).trim();
  }

  return (
    <article
      className="mx-auto w-full max-w-6xl px-3 pb-16 pt-6 sm:px-6 lg:px-8 text-foreground"
      itemScope
      itemType="https://schema.org/Article"
    >
      <div id="topo" className="h-0 w-0 scroll-mt-24" />

      <Script id="ld-webpage-gloriosos" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(webPageSchema)}
      </Script>
      <Script id="ld-article-gloriosos" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(articleSchema)}
      </Script>
      <Script id="ld-breadcrumb-gloriosos" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      <Script id="ld-faq-gloriosos" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(faqSchema)}
      </Script>
      <Script id="ld-itemlist-gloriosos" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(itemListSchema)}
      </Script>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-foreground">
            Santo Terço
          </span>
          <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
            Quarta e Domingo
          </span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Mistérios Gloriosos do Terço
        </h1>

        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          Os Mistérios Gloriosos contemplam a vitória de Deus: Ressurreição, Ascensão, Pentecostes, Assunção e Coroação de Maria.
          Aqui você encontra <strong>passagens bíblicas</strong> e reflexões para rezar com esperança.
        </p>

        <section
          className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm sm:p-5"
          aria-label="Resposta rápida"
        >
          <p className="text-xs font-semibold text-amber-900">Resposta rápida</p>
          <div className="mt-2 space-y-2 text-sm leading-relaxed text-foreground">
            <p>
              Os <strong>Mistérios Gloriosos</strong> são rezados tradicionalmente às <strong>quartas</strong> e aos <strong>domingos</strong>.
              Eles fortalecem a esperança e lembram que a história termina em Deus.
            </p>
            <p className="text-muted-foreground">
              Dica prática: reze cada dezena como um ato de esperança concreta — “Senhor, faze nova todas as coisas”.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/santo-terco"
              className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              Rezar agora (guiado)
            </Link>
            <Link
              href="/santo-terco/como-rezar-o-terco"
              className="inline-flex items-center justify-center rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-900 shadow-sm hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              Como rezar o terço
            </Link>
          </div>
        </section>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6 lg:p-8">
          <nav
            aria-label="Sumário dos Mistérios Gloriosos"
            className="rounded-2xl border border-border bg-muted/40 p-4"
          >
            <p className="text-sm font-semibold text-foreground">Sumário</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {mysteries.map((m) => (
                <a
                  key={m.id}
                  href={`#${m.id}`}
                  className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground"
                >
                  {m.title}: {m.subtitle}
                </a>
              ))}
            </div>
          </nav>

          <div className="mt-4">
            <AdsenseResponsive slot={ADS_SLOT_BODY_TOP} minHeight={160} />
          </div>

          <div className={`${readingProse} mt-7`}>
            <h2 id="o-que-sao">O que são os Mistérios Gloriosos?</h2>
            <p>
              Eles nos fazem contemplar que a última palavra não é o pecado nem a morte, mas a vida em Deus. A Ressurreição abre um futuro; a Ascensão
              orienta a missão; Pentecostes acende o coração; e em Maria vemos o destino prometido.
            </p>
            <p>
              Rezar estes mistérios educa a esperança: Deus age na história e, ao mesmo tempo, trabalha silenciosamente dentro de nós.
              O que parece fechado pode ser reaberto pela graça.
            </p>
          </div>

          <div className="mt-8 space-y-7">
            {mysteries.map((m, idx) => {
              const pergunta = splitPoint(m.points?.[0]);
              const fruto = splitPoint(m.points?.[1]);

              const anchor = m.reflection?.[1];

              return (
                <div key={m.id} className="space-y-4">
                  <section
                    id={m.id}
                    className="scroll-mt-24 rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-sm sm:p-6"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold text-amber-900">{m.title}</p>
                        <h3 className="mt-1 text-2xl font-bold text-foreground">{m.subtitle}</h3>
                      </div>
                      <span className="inline-flex w-fit items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
                        {m.passageRef}
                      </span>
                    </div>

                    <div className="mt-5 rounded-2xl border border-amber-200 bg-white p-5">
                      <p className="text-xs font-semibold text-amber-900">Passagem bíblica</p>
                      <p className="mt-3 text-[15px] leading-relaxed text-foreground sm:text-[16px]">
                        “{m.passageQuote}”
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">{m.passageRef}</p>
                    </div>

                    {/* ===== MEDITAÇÃO (mesmo padrão da página anexa) ===== */}
                    <div className="mt-6">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Meditação</p>

                      <div className="mt-3 max-w-[65ch]">
                        <div className="space-y-4 text-[15px] leading-relaxed text-foreground sm:text-[16px]">
                          {m.reflection.map((p, i) => (
                            <p key={i} className="m-0">
                              {p}
                            </p>
                          ))}
                        </div>

                        {anchor ? (
                          <div className="my-5 rounded-xl border border-amber-200 bg-white/70 px-4 py-3 text-sm italic text-amber-900">
                            {anchor}
                          </div>
                        ) : null}

                        <div className="mt-5 space-y-3">
                          <div className="rounded-xl border border-amber-200 bg-white px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                              Pergunta para meditar
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-foreground">{pergunta || "—"}</p>
                          </div>

                          <div className="rounded-xl border border-border bg-muted/40 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Fruto espiritual
                            </p>
                            <p className="mt-1 text-sm text-foreground">{fruto || "—"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* ===== /MEDITAÇÃO ===== */}

                    <div className="mt-6 flex flex-wrap gap-2">
                      <Link
                        href="/santo-terco"
                        className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        Rezar agora (mistério do dia)
                      </Link>
                      <a
                        href="#topo"
                        className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm hover:bg-muted focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        Voltar ao topo
                      </a>
                    </div>
                  </section>

                  {idx === 2 && (
                    <div className="pt-1">
                      <AdsenseInArticleFluid slot={ADS_SLOT_IN_ARTICLE} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className={`${readingProse} mt-12`}>
            <h2 id="como-rezar">Como rezar os Mistérios Gloriosos (na prática)</h2>
            <p>
              Anuncie o mistério, reze um Pai-Nosso, dez Ave-Marias e o Glória. Ao rezar, peça a graça de viver com esperança concreta: a vitória de Deus
              não é teoria; ela se traduz em perseverança e caridade.
            </p>

            <h3 id="como-meditar">Como meditar com esperança</h3>
            <ul>
              <li>Antes de cada dezena, repita interiormente: “Senhor, renova minha esperança”.</li>
              <li>Reze cada Ave-Maria ligando a cena ao seu dia: a Ressurreição para recomeçar, Pentecostes para ter coragem, etc.</li>
              <li>Ao final, agradeça por um sinal de vida que Deus já te deu (mesmo pequeno).</li>
            </ul>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground" id="faq">
              Dúvidas frequentes
            </h2>

            <div className="mt-4 space-y-3">
              {[
                ["Em quais dias se rezam os Mistérios Gloriosos?", "Tradicionalmente às quartas-feiras e aos domingos."],
                ["Posso rezar os Gloriosos em outro dia?", "Sim. A divisão por dias é uma tradição devocional; você pode rezar conforme sua necessidade espiritual."],
                ["Como manter a atenção na meditação?", "Escolha uma frase curta por dezena (ex.: “Senhor, renova minha esperança”) e retorne com serenidade quando se distrair."],
                ["O que pedir rezando os Gloriosos?", "Esperança, perseverança, coragem e docilidade ao Espírito Santo para viver a fé no cotidiano."],
              ].map(([q, a]) => (
                <details key={q} className="rounded-xl border border-amber-200 bg-card p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-foreground">{q}</summary>
                  <p className="mt-3 text-sm text-muted-foreground">{a}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-border bg-muted/40 p-5">
            <p className="text-sm font-semibold text-foreground">Continuar no Santo Terço</p>
            <p className="mt-1 text-sm text-muted-foreground">Escolha também os outros tipos de mistério:</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link
                href="/santo-terco/misterios-gozosos"
                className="rounded-2xl border border-border bg-card p-4 text-sm shadow-sm transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <p className="font-semibold text-foreground">Mistérios Gozosos</p>
                <p className="mt-1 text-xs text-muted-foreground">Segunda e sábado • Encarnação e alegria</p>
              </Link>

              <Link
                href="/santo-terco/misterios-dolorosos"
                className="rounded-2xl border border-border bg-card p-4 text-sm shadow-sm transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <p className="font-semibold text-foreground">Mistérios Dolorosos</p>
                <p className="mt-1 text-xs text-muted-foreground">Terça e sexta • Paixão e entrega</p>
              </Link>

              <Link
                href="/santo-terco/misterios-luminosos"
                className="rounded-2xl border border-border bg-card p-4 text-sm shadow-sm transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-amber-500 sm:col-span-2"
              >
                <p className="font-semibold text-foreground">Mistérios Luminosos</p>
                <p className="mt-1 text-xs text-muted-foreground">Quinta • Vida pública de Jesus</p>
              </Link>
            </div>

            <div className="mt-4">
              <Link
                href="/santo-terco"
                className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                Voltar para o Santo Terço (rezar guiado)
              </Link>
            </div>
          </div>
        </section>

        <RosaryMysteriesAside
          currentLabel="Quarta e Domingo"
          quickGuideText="Quarta e domingo. Para fortalecer esperança, perseverança e viver com horizonte eterno."
          adsSlotDesktop={ADS_SLOT_SIDEBAR_DESKTOP}
          adsSlotMobile={ADS_SLOT_SIDEBAR_MOBILE}
          blogLinks={[
            { title: "O que significa ‘ressuscitar’ por dentro?", slug: "ressuscitar-por-dentro" },
            { title: "Ascensão: Deus ausente ou presente de outro modo?", slug: "ascensao-presenca-de-outro-modo" },
            { title: "Dons do Espírito Santo: como pedir e viver", slug: "dons-do-espirito-santo-como-pedir" },
            { title: "Assunção de Maria: o que a Igreja ensina?", slug: "assuncao-de-maria-explicacao" },
            { title: "Coroação de Maria: sentido e espiritualidade", slug: "coroacao-de-maria-sentido" },
          ]}
        />
      </div>
    </article>
  );
}
