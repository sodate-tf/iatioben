import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { RosaryMysteriesAside } from "@/components/terco/RosaryMysteriAside";

export const dynamic = "force-static";

const SITE_URL = "https://www.iatioben.com.br";
const PAGE_PATH = "/santo-terco/misterios-dolorosos";
const CANONICAL_URL = `${SITE_URL}${PAGE_PATH}`;

const ADS_CLIENT = "ca-pub-8819996017476509";
const ADS_SLOT_BODY_TOP = "7474884427";
const ADS_SLOT_IN_ARTICLE = "6161802751";
const ADS_SLOT_SIDEBAR_DESKTOP = "8534838745";
const ADS_SLOT_SIDEBAR_MOBILE = "1573844576";

export const metadata: Metadata = {
  title: "Mistérios Dolorosos do Terço: passagens bíblicas e reflexões",
  description:
    "Conheça os Mistérios Dolorosos do Terço (terça e sexta): passagens bíblicas, reflexões profundas, como rezar e como meditar cada dezena.",
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: "Mistérios Dolorosos do Terço: passagens bíblicas e reflexões",
    description:
      "Os 5 Mistérios Dolorosos com Bíblia e meditação: Agonia, Flagelação, Coroação de espinhos, Cruz, Crucifixão.",
    url: CANONICAL_URL,
    type: "article",
    locale: "pt_BR",
    siteName: "IA Tio Ben",
    images: [
      {
        url: `${SITE_URL}/images/santo-do-dia-ia-tio-ben.png`,
        width: 1200,
        height: 630,
        alt: "Mistérios Dolorosos do Terço - IA Tio Ben",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mistérios Dolorosos do Terço (com Bíblia e reflexão)",
    description:
      "Medite os 5 Mistérios Dolorosos com passagens bíblicas e reflexões para rezar com sentido.",
    images: [`${SITE_URL}/images/santo-do-dia-ia-tio-ben.png`],
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
    id: "agonia",
    title: "1º Mistério Doloroso",
    subtitle: "A Agonia de Jesus no Horto",
    passageRef: "Mt 26,36–46 (cf. Lc 22,39–46)",
    passageQuote:
      "“Meu Pai, se é possível, afasta de mim este cálice… contudo, não como eu quero, mas como tu queres.”",
    reflection: [
      "Este mistério nos coloca diante de um ponto decisivo: quando a vontade de Deus e a nossa vontade parecem se chocar. Jesus não finge serenidade; Ele reza a partir da dor real.",
      "A agonia do Horto revela que a oração não elimina a luta interior — ela transforma a luta em entrega. Em vez de fugir, Jesus permanece; em vez de endurecer, Ele se abre ao Pai.",
      "Há momentos em que o coração quer atalhos: anestesiar a angústia, evitar o confronto, adiar decisões. Aqui aprendemos a fazer o contrário: nomear o medo diante de Deus e escolher a fidelidade.",
      "Rezar este mistério é apresentar ao Senhor o seu ‘cálice’: aquilo que você não controla, o que pesa, o que exige coragem. E pedir a graça de atravessar sem se perder de Deus.",
    ],
    points: [
      "Pergunta para meditar: qual é o ‘cálice’ que eu tenho evitado encarar com Deus?",
      "Fruto espiritual tradicional: conformidade com a vontade de Deus e vigilância.",
    ],
  },
  {
    id: "flagelacao",
    title: "2º Mistério Doloroso",
    subtitle: "A Flagelação de Jesus",
    passageRef: "Jo 19,1 (cf. Is 53,5)",
    passageQuote: "“Então Pilatos mandou flagelar Jesus.”",
    reflection: [
      "A Flagelação nos confronta com a injustiça e com a violência que nasce do medo e da covardia. Jesus sofre sem revidar, mostrando que a força do amor não depende de agressividade.",
      "Contemplar este mistério é reconhecer que o mal quer nos desfigurar — e que Cristo assume essa desfiguração para nos devolver dignidade.",
      "Também é um convite a rever o que nos ‘flagela’ por dentro: culpas antigas, vícios, impulsos, palavras duras, hábitos que machucam. Deus não nos humilha; Ele cura.",
      "Rezar aqui é pedir purificação: que o Senhor desfaça em nós aquilo que fere, e nos eduque para a mansidão firme, capaz de resistir sem se tornar cruel.",
    ],
    points: [
      "Pergunta para meditar: que feridas eu preciso entregar para que Deus cure com verdade?",
      "Fruto espiritual tradicional: pureza e mortificação dos sentidos.",
    ],
  },
  {
    id: "espinhos",
    title: "3º Mistério Doloroso",
    subtitle: "A Coroação de Espinhos",
    passageRef: "Mt 27,27–31",
    passageQuote: "“Puseram-lhe uma coroa de espinhos… e zombavam dele.”",
    reflection: [
      "A dor aqui não é só física: é a humilhação. É o ataque à identidade. O mundo tenta ridicularizar a verdade, diminuir a santidade, caricaturar a fé.",
      "Jesus aceita ser coroado ‘às avessas’ para ensinar que a realeza de Deus não se sustenta em aplausos. A dignidade de Cristo não depende da opinião dos outros.",
      "Este mistério toca também nossas inseguranças: a necessidade de aceitação, o medo de parecer fraco, o desejo de controlar a imagem. A santidade amadurece quando deixamos de viver reféns de aprovação.",
      "Rezar a Coroação é pedir liberdade interior: que nenhuma zombaria — externa ou interna — roube o que Deus diz sobre você.",
    ],
    points: [
      "Pergunta para meditar: onde eu busco validação a ponto de perder a verdade do Evangelho?",
      "Fruto espiritual tradicional: coragem e desprezo das vaidades.",
    ],
  },
  {
    id: "cruz",
    title: "4º Mistério Doloroso",
    subtitle: "Jesus Carrega a Cruz",
    passageRef: "Lc 23,26–32",
    passageQuote:
      "“Se alguém quer vir após mim, renuncie a si mesmo, tome a sua cruz e siga-me.”",
    reflection: [
      "Carregar a cruz não é romantizar sofrimento. É aprender que o amor fiel tem peso — e que o peso, quando assumido com Cristo, ganha sentido.",
      "Jesus cai, levanta, continua. O Evangelho não esconde a fraqueza; ele mostra que a perseverança é mais forte do que a perfeição.",
      "Simão de Cirene aparece como graça inesperada: Deus permite ajudas concretas. A cruz não foi feita para ser carregada com orgulho solitário.",
      "Rezar este mistério é perguntar: qual fidelidade eu preciso sustentar hoje? E também: quem eu posso ajudar a carregar um pouco do peso?",
    ],
    points: [
      "Pergunta para meditar: qual ‘cruz’ hoje pode ser vivida como amor — e não como revolta?",
      "Fruto espiritual tradicional: paciência nas provações.",
    ],
  },
  {
    id: "crucifixao",
    title: "5º Mistério Doloroso",
    subtitle: "A Crucifixão e Morte de Jesus",
    passageRef: "Jo 19,17–30 (cf. Lc 23,33–46)",
    passageQuote: "“Tudo está consumado.”",
    reflection: [
      "A cruz é o lugar onde o amor vai até o fim. Jesus não apenas sofre: Ele se entrega. Ele transforma a violência recebida em oferta, e abre um caminho de reconciliação.",
      "‘Tudo está consumado’ não é derrota; é plenitude. É a obra do amor levada à totalidade — mesmo quando, por fora, parece fracasso.",
      "Contemplar a Crucifixão é aprender a medir a vida por outro critério: não pelo controle, nem pelo sucesso imediato, mas pela fidelidade ao bem.",
      "Rezar este mistério é deixar a cruz iluminar suas perdas e dores: Deus não desperdiça lágrimas quando elas são colocadas em Suas mãos. A cruz é passagem.",
    ],
    points: [
      "Pergunta para meditar: o que eu preciso entregar a Deus para que Ele transforme em vida?",
      "Fruto espiritual tradicional: amor a Jesus e espírito de sacrifício.",
    ],
  },
];

function buildJsonLd() {
  const today = new Date().toISOString().slice(0, 10);

  const faq = [
    {
      q: "Em quais dias se rezam os Mistérios Dolorosos?",
      a: "Tradicionalmente, os Mistérios Dolorosos são rezados às terças-feiras e às sextas-feiras.",
    },
    {
      q: "Quais são os cinco Mistérios Dolorosos?",
      a: "Agonia no Horto, Flagelação, Coroação de Espinhos, Jesus Carrega a Cruz, Crucifixão e Morte.",
    },
    {
      q: "Como meditar os Mistérios Dolorosos sem desanimar?",
      a: "Medite olhando para o amor fiel de Cristo: anuncie o mistério, faça um breve silêncio e reze cada Ave-Maria como um ato de confiança e entrega.",
    },
    {
      q: "Posso rezar os Mistérios Dolorosos em outro dia?",
      a: "Sim. A divisão por dias é uma tradição devocional; você pode rezar conforme sua necessidade espiritual.",
    },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": CANONICAL_URL },
    headline: "Mistérios Dolorosos do Terço: passagens bíblicas e reflexões",
    description:
      "Guia completo dos Mistérios Dolorosos do Terço com referências bíblicas, reflexões para meditação e orientações práticas para rezar com sentido.",
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
      { "@type": "Thing", name: "Mistérios Dolorosos" },
      { "@type": "Thing", name: "Paixão de Cristo" },
      { "@type": "Thing", name: "Terço" },
    ],
    keywords: [
      "mistérios dolorosos",
      "terço terça e sexta",
      "paixão de Cristo",
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
      { "@type": "ListItem", position: 3, name: "Mistérios Dolorosos", item: CANONICAL_URL },
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
    name: "Mistérios Dolorosos do Terço",
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
    name: "Mistérios Dolorosos do Terço: passagens bíblicas e reflexões",
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

export default function MisteriosDolorososPage() {
  const { articleSchema, breadcrumbSchema, faqSchema, itemListSchema, webPageSchema } = buildJsonLd();

  // Inter-only: removido "font-reading"
  const readingProse =
    "prose prose-amber max-w-none " +
    "prose-p:leading-[1.9] prose-li:leading-[1.85] " +
    "prose-p:my-4 prose-li:my-2 " +
    "prose-h2:mt-10 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3 " +
    "text-[17px] sm:text-[18px] lg:text-[18.5px] " +
    "text-foreground break-words hyphens-auto";

  // Helper: extrai textos de Pergunta/Fruto do array existente
  function splitPoint(label: "Pergunta" | "Fruto", raw?: string) {
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

      <Script id="ld-webpage-dolorosos" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(webPageSchema)}
      </Script>
      <Script id="ld-article-dolorosos" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(articleSchema)}
      </Script>
      <Script id="ld-breadcrumb-dolorosos" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      <Script id="ld-faq-dolorosos" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(faqSchema)}
      </Script>
      <Script id="ld-itemlist-dolorosos" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(itemListSchema)}
      </Script>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-foreground">
            Santo Terço
          </span>
          <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
            Terça e Sexta
          </span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Mistérios Dolorosos do Terço
        </h1>

        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          Os Mistérios Dolorosos contemplam a Paixão do Senhor. Aqui você encontra as{" "}
          <strong>passagens bíblicas</strong> e reflexões para meditar cada dezena com profundidade e esperança.
        </p>

        <section
          className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm sm:p-5"
          aria-label="Resposta rápida"
        >
          <p className="text-xs font-semibold text-amber-900">Resposta rápida</p>
          <div className="mt-2 space-y-2 text-sm leading-relaxed text-foreground">
            <p>
              Os <strong>Mistérios Dolorosos</strong> são rezados tradicionalmente às{" "}
              <strong>terças</strong> e <strong>sextas</strong>. Eles ajudam a rezar a cruz sem desespero: contemplando o amor fiel de Cristo.
            </p>
            <p className="text-muted-foreground">
              Dica prática: anuncie o mistério e reze cada Ave-Maria como um ato de confiança e entrega.
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
          <nav aria-label="Sumário dos Mistérios Dolorosos" className="rounded-2xl border border-border bg-muted/40 p-4">
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
            <h2 id="o-que-sao">O que são os Mistérios Dolorosos?</h2>
            <p>
              Eles nos colocam diante do caminho da cruz: não como narrativa distante, mas como escola do amor fiel. Ao contemplar a Paixão,
              aprendemos que Deus não abandona a humanidade na dor — Ele a atravessa por dentro.
            </p>
            <p>
              Rezar esses mistérios educa o coração para a compaixão: olhar o sofrimento sem endurecer, e responder com fidelidade e caridade.
            </p>
          </div>

          <div className="mt-8 space-y-7">
            {mysteries.map((m, idx) => {
              const pergunta = splitPoint("Pergunta", m.points?.[0]);
              const fruto = splitPoint("Fruto", m.points?.[1]);

              // opcional: frase-chave de pausa (pegando a 2ª reflexão como âncora)
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

                    {/* ===== MEDITAÇÃO (corrigida para melhor leitura) ===== */}
                    <div className="mt-6">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Meditação
                      </p>

                      {/* largura confortável de leitura + centraliza no card */}
                      <div className="mt-3 max-w-[65ch]">
                        <div className="space-y-4 text-[15px] leading-relaxed text-foreground sm:text-[16px]">
                          {m.reflection.map((p, i) => (
                            <p key={i} className="m-0">
                              {p}
                            </p>
                          ))}
                        </div>

                        {/* “frase-pausa” opcional para dar respiro */}
                        {anchor ? (
                          <div className="my-5 rounded-xl border border-amber-200 bg-white/70 px-4 py-3 text-sm italic text-amber-900">
                            {anchor}
                          </div>
                        ) : null}

                        {/* Pergunta + Fruto em cards separados (mais escaneável) */}
                        <div className="mt-5 space-y-3">
                          <div className="rounded-xl border border-amber-200 bg-white px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                              Pergunta para meditar
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-foreground">
                              {pergunta || "—"}
                            </p>
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
            <h2 id="como-rezar">Como rezar os Mistérios Dolorosos (na prática)</h2>
            <p>
              Anuncie o mistério, reze um Pai-Nosso, dez Ave-Marias e finalize com o Glória. Ao contemplar a Paixão, peça a graça de unir
              suas dores e provações ao amor fiel de Cristo.
            </p>

            <h3 id="como-meditar">Como meditar sem perder a esperança</h3>
            <ul>
              <li>Faça um breve silêncio antes de cada dezena: “Senhor, ensina-me a amar como Tu amas”.</li>
              <li>Reze as Ave-Marias com uma intenção concreta (uma pessoa que sofre, uma família, uma situação difícil).</li>
              <li>Conclua cada dezena com um ato de confiança: “Jesus, eu confio em vós”.</li>
            </ul>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground" id="faq">
              Dúvidas frequentes
            </h2>

            <div className="mt-4 space-y-3">
              {[
                ["Em quais dias se rezam os Mistérios Dolorosos?", "Tradicionalmente às terças e sextas-feiras."],
                ["Posso rezar quando estou desanimado?", "Sim. Reze como quem se apoia em Cristo: sem pressa, com verdade, e sem se cobrar perfeição."],
                ["O que oferecer ao rezar esses mistérios?", "Uma intenção concreta: conversão, cura interior, perseverança, ou por quem sofre."],
                ["E se eu me distrair?", "Retorne com serenidade. O ato de voltar já é oração."],
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

        <RosaryMysteriesAside
          currentLabel="Terça e Sexta"
          quickGuideText="Terça e sexta. Para rezar a cruz com esperança e fidelidade."
          adsSlotDesktop={ADS_SLOT_SIDEBAR_DESKTOP}
          adsSlotMobile={ADS_SLOT_SIDEBAR_MOBILE}
          blogLinks={[
            { title: "Como lidar com a angústia na oração (Horto)", slug: "como-lidar-com-a-angustia-na-oracao" },
            { title: "Feridas e cura interior: o que a Flagelação ensina", slug: "flagelacao-e-cura-interior" },
            { title: "Liberdade interior contra a vaidade (espinhos)", slug: "coroacao-de-espinhos-e-vaidade" },
            { title: "Como carregar a cruz sem endurecer", slug: "como-carregar-a-cruz-sem-endurecer" },
            { title: "O sentido do “tudo está consumado”", slug: "tudo-esta-consumado-significado" },
          ]}
        />
      </div>
    </article>
  );
}
