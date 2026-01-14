// app/santo-terco/misterios-gozosos/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { RosaryMysteriesAside } from "@/components/terco/RosaryMysteriAside";

export const dynamic = "force-static";

const SITE_URL = "https://www.iatioben.com.br";
const PAGE_PATH = "/santo-terco/misterios-gozosos";
const CANONICAL_URL = `${SITE_URL}${PAGE_PATH}`;

// AdSense
const ADS_CLIENT = "ca-pub-8819996017476509";

// Slots (mantidos do seu arquivo)
const ADS_SLOT_BODY_TOP = "3041346283";
const ADS_SLOT_IN_ARTICLE = "2672028232";
const ADS_SLOT_SIDEBAR_DESKTOP = "3041346283";
const ADS_SLOT_SIDEBAR_MOBILE = "3041346283";

export const metadata: Metadata = {
  title: "Santo Terço: Mistérios Gozosos — passagens bíblicas e reflexões",
  description:
    "Reze e medite os Mistérios Gozosos (segunda e sábado) com passagens bíblicas e reflexões para contemplar a infância de Jesus com Maria.",
  alternates: { canonical: CANONICAL_URL },

  openGraph: {
    title: "Santo Terço: Mistérios Gozosos",
    description:
      "Segunda e sábado: contemple a alegria do Evangelho. Clique e reze com Bíblia e meditações em cada dezena.",
    url: CANONICAL_URL,
    type: "article",
    locale: "pt_BR",
    siteName: "IA Tio Ben",
    images: [
      {
        url: `${SITE_URL}/og/terco/misterios-gozosos.png?v=1`,
        width: 1200,
        height: 630,
        alt: "Santo Terço: Mistérios Gozosos — IA Tio Ben",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Santo Terço: Mistérios Gozosos",
    description:
      "Segunda e sábado: reze com sentido. Bíblia + reflexões para meditar a alegria do Evangelho em cada dezena.",
    images: [`${SITE_URL}/og/terco/misterios-gozosos.png?v=1`],
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
    id: "anunciacao",
    title: "1º Mistério Gozoso",
    subtitle: "A Anunciação do Senhor",
    passageRef: "Lc 1,26–38",
    passageQuote:
      "“Eis aqui a serva do Senhor; faça-se em mim segundo a tua palavra.”",
    reflection: [
      "A alegria do Evangelho não começa quando tudo está resolvido. Ela começa quando Deus entra no cotidiano e pede espaço no coração.",
      "Maria não recebe um mapa, mas um chamado. E a primeira reação é humana: ela se inquieta, pergunta, pondera. A fé não é anestesia; é confiança que se constrói em diálogo com Deus.",
      "O “faça-se” de Maria não é passividade. É entrega ativa: ela se coloca inteira à disposição do plano do Senhor. E, quando a vida pede respostas rápidas, este mistério nos lembra que a verdadeira maturidade espiritual nasce de uma decisão interior: confiar.",
      "Rezar este mistério é colocar diante de Deus aquilo que você ainda não entende: uma espera, um medo, uma mudança. E pedir a graça de responder com humildade e coragem, sem endurecer o coração.",
    ],
    points: [
      "Pergunta para meditar: o que Deus está me convidando a acolher hoje?",
      "Fruto espiritual tradicional: humildade e docilidade à vontade de Deus.",
    ],
  },
  {
    id: "visitacao",
    title: "2º Mistério Gozoso",
    subtitle: "A Visitação de Maria a Isabel",
    passageRef: "Lc 1,39–56",
    passageQuote:
      "“Logo que Isabel ouviu a saudação de Maria, a criança pulou em seu ventre.”",
    reflection: [
      "A fé que é só ideia costuma ficar parada. A fé verdadeira se move: ela visita, serve, fortalece.",
      "Maria, recém-chamada por Deus, não se fecha no próprio mistério. Ela caminha ao encontro de alguém que precisa. Há algo profundamente evangélico nessa prontidão: Deus não nos dá dons para nos isolar, mas para amar melhor.",
      "A Visitação também nos ensina que a presença de Cristo em nós transforma o ambiente: onde Maria chega, há alegria, há vida que salta, há bênção que se reconhece.",
      "Rezar este mistério é pedir um coração disponível: capaz de sair de si, de enxergar necessidades reais e de levar consolo sem espetáculo. Às vezes, o maior apostolado é uma visita fiel e discreta.",
    ],
    points: [
      "Pergunta para meditar: quem precisa da minha presença hoje — mesmo que simples?",
      "Fruto espiritual tradicional: caridade concreta e serviço.",
    ],
  },
  {
    id: "nascimento",
    title: "3º Mistério Gozoso",
    subtitle: "O Nascimento de Jesus",
    passageRef: "Lc 2,1–20",
    passageQuote: "“Hoje, na cidade de Davi, nasceu para vós um Salvador.”",
    reflection: [
      "Deus escolhe nascer pequeno. Ele não entra pela imposição, mas pela proximidade. O presépio revela um estilo: o Senhor se aproxima da nossa realidade sem pedir perfeição prévia.",
      "Belém é o anúncio silencioso de que Deus não se envergonha da pobreza humana: das limitações, dos improvisos, das noites difíceis. Pelo contrário, Ele faz morada ali.",
      "Neste mistério, a alegria cristã não é euforia — é esperança. É saber que, mesmo quando as condições parecem desfavoráveis, Deus está presente e agindo com ternura.",
      "Rezar o Nascimento é aprender a acolher Jesus do jeito certo: com simplicidade. Se o coração estiver cansado, comece pequeno. Uma oração breve, um silêncio sincero, um recomeço.",
    ],
    points: [
      "Pergunta para meditar: onde eu preciso acolher Deus com mais simplicidade?",
      "Fruto espiritual tradicional: desprendimento e amor à humildade.",
    ],
  },
  {
    id: "apresentacao",
    title: "4º Mistério Gozoso",
    subtitle: "A Apresentação do Senhor no Templo",
    passageRef: "Lc 2,22–40 (cf. 2,22–35)",
    passageQuote: "“Meus olhos viram a tua salvação.”",
    reflection: [
      "No Templo, Maria e José apresentam Jesus ao Pai. Este gesto é uma catequese viva: tudo o que recebemos é dom confiado, não posse absoluta.",
      "Simeão reconhece a salvação onde muitos veriam apenas um bebê. A fé enxerga além do óbvio: ela percebe o agir de Deus mesmo quando ainda é pequeno, escondido, silencioso.",
      "Mas há também profecia de dor: a luz que salva também contradiz o mundo. A alegria cristã amadurece quando aprende a permanecer fiel sem romantizar a cruz.",
      "Rezar este mistério é colocar no altar aquilo que você ama: família, projetos, futuro. Não para perder, mas para ordenar. Quando Deus é o primeiro, o amor se torna mais puro e mais livre.",
    ],
    points: [
      "Pergunta para meditar: o que eu preciso apresentar a Deus hoje, com confiança?",
      "Fruto espiritual tradicional: pureza de intenção e entrega.",
    ],
  },
  {
    id: "templo",
    title: "5º Mistério Gozoso",
    subtitle: "A Perda e o Encontro do Menino Jesus no Templo",
    passageRef: "Lc 2,41–52",
    passageQuote:
      "“Não sabíeis que devo ocupar-me das coisas de meu Pai?”",
    reflection: [
      "Este mistério toca uma experiência humana delicada: procurar Deus quando parece que Ele se afastou. Maria e José conhecem a angústia de não encontrar Jesus onde esperavam.",
      "O Evangelho mostra que a busca é parte do caminho. Há fases em que a fé é luminosa; em outras, é fidelidade. E é justamente aí que se purifica o amor: quando seguimos procurando, mesmo sem consolações.",
      "Quando Jesus é reencontrado no Templo, Ele revela sua identidade e missão. Não é indiferença com a dor dos pais: é um convite a olhar mais alto, a não reduzir Deus aos nossos esquemas.",
      "Rezar este mistério é aprender a perseverar: voltar ao essencial (a casa do Pai), retomar a oração com humildade, buscar direção segura. Se hoje você se sente em aridez, não conclua que Deus foi embora. Continue procurando — com paciência e firmeza.",
    ],
    points: [
      "Pergunta para meditar: em que lugar eu preciso voltar ao essencial?",
      "Fruto espiritual tradicional: verdadeira sabedoria e perseverança.",
    ],
  },
];

function buildJsonLd() {
  const today = new Date().toISOString().slice(0, 10);

  const faq = [
    {
      q: "Em quais dias se rezam os Mistérios Gozosos?",
      a: "Tradicionalmente, os Mistérios Gozosos são rezados às segundas-feiras e aos sábados.",
    },
    {
      q: "Quais são os cinco Mistérios Gozosos?",
      a: "Anunciação, Visitação, Nascimento de Jesus, Apresentação no Templo e Encontro do Menino Jesus no Templo.",
    },
    {
      q: "Como meditar os Mistérios Gozosos sem rezar no automático?",
      a: "Antes de cada dezena, anuncie o mistério, faça 10–20 segundos de silêncio e reze as Ave-Marias ligando cada conta à cena contemplada; se distrair, retorne com serenidade.",
    },
    {
      q: "Posso rezar os Mistérios Gozosos em outro dia da semana?",
      a: "Sim. A divisão por dias é uma orientação devocional; você pode escolher o mistério conforme a necessidade espiritual do momento.",
    },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": CANONICAL_URL },
    headline: "Mistérios Gozosos do Terço: passagens bíblicas e reflexões",
    description:
      "Guia completo dos Mistérios Gozosos do Terço com referências bíblicas, reflexões para meditação e orientações práticas para rezar com sentido.",
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
      { "@type": "Thing", name: "Mistérios Gozosos" },
      { "@type": "Thing", name: "Rosário" },
      { "@type": "Thing", name: "Terço" },
      { "@type": "Thing", name: "Devoção mariana" },
    ],
    keywords: [
      "mistérios gozosos",
      "mistérios do terço",
      "mistérios do rosário",
      "segunda e sábado",
      "como meditar o terço",
      "passagens bíblicas do terço",
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Santo Terço", item: `${SITE_URL}/santo-terco` },
      { "@type": "ListItem", position: 3, name: "Mistérios Gozosos", item: CANONICAL_URL },
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
    name: "Mistérios Gozosos do Terço",
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
    name: "Mistérios Gozosos do Terço: passagens bíblicas e reflexões",
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

function splitPoint(raw?: string) {
  if (!raw) return "";
  const i = raw.indexOf(":");
  if (i === -1) return raw;
  return raw.slice(i + 1).trim();
}

export default function MisteriosGozososPage() {
  const { articleSchema, breadcrumbSchema, faqSchema, itemListSchema, webPageSchema } = buildJsonLd();

  // Inter-only (sem font-reading). Leitura confortável no mobile.
  const readingProse =
    "prose prose-amber max-w-none " +
    "prose-p:leading-[1.9] prose-li:leading-[1.85] " +
    "prose-p:my-4 prose-li:my-2 " +
    "prose-h2:mt-10 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3 " +
    "text-[17px] sm:text-[18px] lg:text-[18.5px] " +
    "text-foreground break-words hyphens-auto";

  return (
    <article
      className="mx-auto w-full max-w-6xl px-3 pb-16 pt-6 sm:px-6 lg:px-8 text-foreground"
      itemScope
      itemType="https://schema.org/Article"
    >
      <div id="topo" className="h-0 w-0 scroll-mt-24" />

      {/* JSON-LD */}
      <Script id="ld-webpage-gozosos" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(webPageSchema)}
      </Script>
      <Script id="ld-article-gozosos" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(articleSchema)}
      </Script>
      <Script id="ld-breadcrumb-gozosos" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      <Script id="ld-faq-gozosos" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(faqSchema)}
      </Script>
      <Script id="ld-itemlist-gozosos" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(itemListSchema)}
      </Script>

      {/* HERO */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-foreground">
            Santo Terço
          </span>
          <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
            Segunda e Sábado
          </span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Mistérios Gozosos do Terço
        </h1>

        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          Aqui você encontra os 5 Mistérios Gozosos com <strong>passagens bíblicas</strong> e reflexões para rezar com sentido:
          Anunciação, Visitação, Nascimento, Apresentação e Encontro no Templo.
        </p>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm sm:p-5" aria-label="Resposta rápida">
          <p className="text-xs font-semibold text-amber-900">Resposta rápida</p>
          <div className="mt-2 space-y-2 text-sm leading-relaxed text-foreground">
            <p>
              Os <strong>Mistérios Gozosos</strong> são rezados tradicionalmente às <strong>segundas</strong> e aos <strong>sábados</strong>.
              Eles ensinam a alegria da fé que começa no simples: acolher, servir e perseverar.
            </p>
            <p className="text-muted-foreground">
              Dica prática: antes de cada dezena, anuncie o mistério e faça 10–20 segundos de silêncio; depois, reze cada Ave-Maria mantendo a cena no coração.
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
        {/* MAIN */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6 lg:p-8">
          <nav aria-label="Sumário dos Mistérios Gozosos" className="rounded-2xl border border-border bg-muted/40 p-4">
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
            <h2 id="o-que-sao">O que são os Mistérios Gozosos?</h2>
            <p>
              Os Mistérios Gozosos nos colocam diante das primeiras páginas do Evangelho: o sim de Maria, a caridade que se põe a caminho,
              o nascimento do Salvador, a oferta no Templo e a busca perseverante quando parece que Jesus “sumiu” do nosso horizonte.
            </p>
            <p>
              Eles são um caminho de oração especialmente fecundo para recomeços, gratidão e confiança: alegria que não depende de euforia,
              mas de fidelidade e presença de Deus no cotidiano.
            </p>
          </div>

          <div className="mt-8 space-y-7">
            {mysteries.map((m, idx) => {
              const pergunta = splitPoint(m.points?.[0]);
              const fruto = splitPoint(m.points?.[1]);
              const anchor = m.reflection?.[1];

              return (
                <div key={m.id} className="space-y-4">
                  <section id={m.id} className="scroll-mt-24 rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-sm sm:p-6">
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

                    {/* MEDITAÇÃO (padrão unificado) */}
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
            <h2 id="como-rezar">Como rezar os Mistérios Gozosos (na prática)</h2>
            <p>
              Anuncie o mistério, reze um Pai-Nosso, dez Ave-Marias e o Glória. A cada dezena, peça a graça de viver a alegria cristã como confiança
              concreta: acolher Deus, servir com prontidão e perseverar nas buscas do coração.
            </p>

            <h3 id="como-meditar">Como meditar sem rezar no automático</h3>
            <ul>
              <li>Antes de cada dezena, fique 10–20 segundos em silêncio e “coloque a cena diante de Deus”.</li>
              <li>Escolha uma frase curta (ex.: “faça-se”, “servir”, “simplicidade”, “entrega”, “perseverança”) e retorne a ela quando se distrair.</li>
              <li>Finalize agradecendo por um sinal de graça no seu dia, mesmo pequeno.</li>
            </ul>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground" id="faq">
              Dúvidas frequentes
            </h2>

            <div className="mt-4 space-y-3">
              {[
                [
                  "Em quais dias se rezam os Mistérios Gozosos?",
                  "Tradicionalmente às segundas-feiras e aos sábados.",
                ],
                [
                  "Posso rezar os Gozosos em outro dia?",
                  "Sim. A divisão por dias é uma tradição devocional; você pode escolher conforme sua necessidade espiritual.",
                ],
                [
                  "Como escolher uma intenção para este terço?",
                  "Escolha uma intenção simples (uma pessoa, uma situação, um agradecimento) e retome-a ao anunciar cada mistério.",
                ],
                [
                  "O que fazer quando me distraio muito?",
                  "Volte com calma. A distração não anula a oração. O ato de retornar, com humildade, já é uma forma concreta de amor.",
                ],
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
                href="/santo-terco/misterios-dolorosos"
                className="rounded-2xl border border-border bg-card p-4 text-sm shadow-sm transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <p className="font-semibold text-foreground">Mistérios Dolorosos</p>
                <p className="mt-1 text-xs text-muted-foreground">Terça e sexta • Paixão e entrega</p>
              </Link>

              <Link
                href="/santo-terco/misterios-gloriosos"
                className="rounded-2xl border border-border bg-card p-4 text-sm shadow-sm transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <p className="font-semibold text-foreground">Mistérios Gloriosos</p>
                <p className="mt-1 text-xs text-muted-foreground">Quarta e domingo • Ressurreição e esperança</p>
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

        {/* SIDEBAR (padrão unificado) */}
        <RosaryMysteriesAside
          currentLabel="Segunda e Sábado"
          quickGuideText="Segunda e sábado. Ideal para recomeços, gratidão, confiança e serviço."
          adsSlotDesktop={ADS_SLOT_SIDEBAR_DESKTOP}
          adsSlotMobile={ADS_SLOT_SIDEBAR_MOBILE}
          blogLinks={[
            { title: "O sentido do “faça-se” de Maria (Anunciação)", slug: "sentido-do-faca-se-de-maria" },
            { title: "O Magnificat: alegria que nasce da gratidão (Visitação)", slug: "magnificat-explicacao" },
            { title: "Natal e simplicidade: como acolher Jesus no cotidiano", slug: "natal-e-simplicidade" },
            { title: "Simeão e Ana: esperar com fidelidade (Apresentação)", slug: "simeao-e-ana" },
            { title: "Quando parece que perdi Deus: o que fazer? (Templo)", slug: "quando-parece-que-perdi-deus" },
          ]}
        />
      </div>
    </article>
  );
}
