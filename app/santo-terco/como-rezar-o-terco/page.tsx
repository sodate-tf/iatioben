// app/santo-terco/como-rezar-o-terco/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const dynamic = "force-static";

const SITE_URL = "https://www.iatioben.com.br";
const PAGE_PATH = "/santo-terco/como-rezar-o-terco";
const CANONICAL_URL = `${SITE_URL}${PAGE_PATH}`;

/** Adsense */
const ADS_CLIENT = "ca-pub-8819996017476509";
// Reaproveitando os slots que você já vem usando no hub/artigos:
const ADS_SLOT_BODY_TOP = "7474884427";
const ADS_SLOT_IN_ARTICLE = "6161802751";
const ADS_SLOT_SIDEBAR_DESKTOP = "8534838745";
const ADS_SLOT_SIDEBAR_MOBILE = "1573844576";
const ADS_SLOT_IN_ARTICLE_2 = "5469336488";

const misterioLinks = [
  {
    title: "Mistérios Gozosos",
    tipo: "misterios-gozosos",
    desc: "A infância de Jesus contemplada com Maria.",
    day: "Segunda e Sábado",
  },
  {
    title: "Mistérios Dolorosos",
    tipo: "misterios-dolorosos",
    desc: "A Paixão e a Cruz: fé que permanece.",
    day: "Terça e Sexta",
  },
  {
    title: "Mistérios Gloriosos",
    tipo: "misterios-gloriosos",
    desc: "Ressurreição e esperança que não decepciona.",
    day: "Quarta e Domingo",
  },
  {
    title: "Mistérios Luminosos",
    tipo: "misterios-luminosos",
    desc: "A vida pública de Jesus: luz para o caminho.",
    day: "Quinta",
  },
];

const recommendedBlogLinks = [
  {
    title: "Terço passo a passo (bem detalhado)",
    slug: "terco-passo-a-passo",
    desc: "Para quem quer aprender sem pressa, com explicações claras.",
  },
  {
    title: "Diferença entre Terço e Rosário",
    slug: "diferenca-terco-e-rosario",
    desc: "Entenda os termos com simplicidade e precisão.",
  },
  {
    title: "Qual mistério rezar em cada dia?",
    slug: "misterios-do-terco-por-dia-da-semana",
    desc: "Tabela + explicação espiritual para organizar a semana.",
  },
  {
    title: "Como meditar os mistérios (sem “rezar no automático”)",
    slug: "como-meditar-os-misterios-do-terco",
    desc: "Práticas simples para rezar com o coração presente.",
  },
  {
    title: "Terço para iniciantes",
    slug: "terco-para-iniciantes",
    desc: "Um começo leve e possível para quem está retomando a fé.",
  },
  {
    title: "Rezar o terço sozinho: é válido? Como fazer?",
    slug: "rezar-o-terco-sozinho",
    desc: "Um guia pastoral para oração no dia a dia.",
  },
  {
    title: "Rezar o terço online: é válido?",
    slug: "rezar-o-terco-online-e-valido",
    desc: "Como usar recursos digitais sem perder o espírito da oração.",
  },
  {
    title: "Erros comuns ao rezar o terço",
    slug: "erros-comuns-ao-rezar-o-terco",
    desc: "Correções com carinho, sem culpas, com direção.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const title = "Como rezar o Terço: guia completo (com mistérios) | IA Tio Ben";

  const description =
    "Aprenda a rezar o Santo Terço com sentido e constância: passo a passo, ordem das orações, mistérios e dias da semana. Comece hoje e aprofunde sua devoção.";

  // OG dinâmica (rota limpa, boa para WhatsApp)
  const ogImage = `${SITE_URL}/og/terco?v=1`;

  return {
    title,
    description,
    alternates: { canonical: CANONICAL_URL },

    openGraph: {
      title: "Aprenda a rezar o Santo Terço — passo a passo e mistérios",
      description:
        "Um guia prático para aprender tudo sobre o Terço e sua devoção: como começar, como meditar os mistérios e rezar com sentido. Clique e aprenda agora.",
      url: CANONICAL_URL,
      type: "article",
      locale: "pt_BR",
      siteName: "IA Tio Ben",
      images: [{ url: ogImage, width: 1200, height: 630, alt: "Santo Terço – IA Tio Ben" }],
    },

    twitter: {
      card: "summary_large_image",
      title: "Aprenda a rezar o Santo Terço — guia completo",
      description:
        "Passo a passo, ordem das orações, mistérios e dias da semana. Clique e aprenda a rezar o Terço com sentido.",
      images: [ogImage],
    },
  };
}

/* =========================
   ADS COMPONENTS
   (mesmo padrão do seu snippet: <ins> + push)
   ========================= */
function AdsenseScriptOnce() {
  return (
    <Script
      id="adsense-loader"
      strategy="afterInteractive"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}

function AdsenseInArticle({ slot, minHeight = 120 }: { slot: string; minHeight?: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-sm mb-6">
      <p className="px-1 pb-2 text-[11px] font-semibold text-muted-foreground">Publicidade</p>
      <div className="flex justify-center">
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
        id={`adsbygoogle-push-inarticle-${slot}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(adsbygoogle = window.adsbygoogle || []).push({});`,
        }}
      />
    </div>
  );
}

function AdsenseSidebarDesktop300x250({ slot }: { slot: string }) {
  return (
    <div className="hidden lg:block rounded-2xl border border-border bg-card p-3 shadow-sm mb-4">
      <p className="px-1 pb-2 text-[11px] font-semibold text-muted-foreground">Publicidade</p>
      <div className="flex justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: "inline-block", width: 300, height: 250 }}
          data-ad-client={ADS_CLIENT}
          data-ad-slot={slot}
        />
      </div>
      <Script
        id={`adsbygoogle-push-sidebar-desktop-${slot}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: `(adsbygoogle = window.adsbygoogle || []).push({});` }}
      />
    </div>
  );
}

function AdsenseSidebarMobile({ slot }: { slot: string }) {
  return (
    <div className="lg:hidden rounded-2xl border border-border bg-card p-3 shadow-sm mb-6">
      <p className="px-1 pb-2 text-[11px] font-semibold text-muted-foreground">Publicidade</p>
      <div className="flex justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight: 100, width: "100%" }}
          data-ad-client={ADS_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
      <Script
        id={`adsbygoogle-push-sidebar-mobile-${slot}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: `(adsbygoogle = window.adsbygoogle || []).push({});` }}
      />
    </div>
  );
}

/* ================= HELPERS ================= */

function buildJsonLd() {
  const date = new Date().toISOString().slice(0, 10);

  const faq = [
    {
      q: "O terço precisa ser rezado em voz alta?",
      a: "Não. Pode ser em voz alta, em silêncio ou mentalmente. O essencial é manter atenção e fé durante a oração.",
    },
    {
      q: "Posso rezar o terço sem ter um terço nas mãos?",
      a: "Sim. Você pode acompanhar por texto e seguir a sequência com calma. O valor está na oração feita com o coração presente.",
    },
    {
      q: "Qual é a diferença entre terço e rosário?",
      a: "O Rosário é o conjunto completo dos mistérios. O Terço é a forma mais comum do dia a dia, com cinco mistérios.",
    },
    {
      q: "Qual mistério rezar em cada dia da semana?",
      a: "Segunda e sábado: gozosos. Terça e sexta: dolorosos. Quarta e domingo: gloriosos. Quinta: luminosos.",
    },
    {
      q: "Rezar o terço online é válido?",
      a: "Sim. Recursos digitais podem ajudar na constância e na atenção. O importante é rezar com o coração presente, meditando os mistérios.",
    },
    {
      q: "Preciso rezar tudo de uma vez?",
      a: "Não. Se necessário, reze por partes (um mistério por vez). O importante é perseverar e rezar com sentido.",
    },
    {
      q: "Como evitar rezar “no automático”?",
      a: "Antes de cada dezena, anuncie o mistério e faça uma meditação breve (10–20 segundos). Se distrair, retorne com serenidade.",
    },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": CANONICAL_URL },
    headline: "Como rezar o Terço: guia completo (com mistérios)",
    description:
      "Guia completo e pastoral para entender e rezar o Terço Católico com sentido: resposta rápida, passo a passo, mistérios, dias da semana e dúvidas frequentes.",
    inLanguage: "pt-BR",
    author: { "@type": "Organization", name: "IA Tio Ben", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "IA Tio Ben",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/ben-transparente.png` },
    },
    datePublished: date,
    dateModified: date,
    image: `${SITE_URL}/images/santo-do-dia-ia-tio-ben.png`,
    about: [
      { "@type": "Thing", name: "Terço" },
      { "@type": "Thing", name: "Rosário" },
      { "@type": "Thing", name: "Oração" },
      { "@type": "Thing", name: "Devoção mariana" },
      { "@type": "Thing", name: "Mistérios do Rosário" },
    ],
    keywords: [
      "terço católico",
      "como rezar o terço",
      "mistérios do terço",
      "terço online",
      "rosário e terço",
      "oração do terço",
      "como rezar o santo terço",
      "passo a passo do terço",
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Santo Terço", item: `${SITE_URL}/santo-terco` },
      { "@type": "ListItem", position: 3, name: "Como rezar o Terço", item: CANONICAL_URL },
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

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Como rezar o Terço Católico (passo a passo)",
    description:
      "Passo a passo simples para rezar o Terço Católico com calma, meditando os mistérios da vida de Jesus.",
    inLanguage: "pt-BR",
    estimatedCost: { "@type": "MonetaryAmount", currency: "BRL", value: "0" },
    supply: [{ "@type": "HowToSupply", name: "Um terço (opcional)" }],
    tool: [{ "@type": "HowToTool", name: "Texto de acompanhamento (opcional)" }],
    step: [
      { "@type": "HowToStep", position: 1, name: "Sinal da Cruz", text: "Inicie com o Sinal da Cruz, oferecendo a oração a Deus." },
      { "@type": "HowToStep", position: 2, name: "Credo", text: "Reze o Credo, professando a fé." },
      { "@type": "HowToStep", position: 3, name: "Pai-Nosso", text: "Reze um Pai-Nosso." },
      { "@type": "HowToStep", position: 4, name: "Três Ave-Marias", text: "Reze três Ave-Marias, pedindo fé, esperança e caridade." },
      { "@type": "HowToStep", position: 5, name: "Glória", text: "Reze o Glória ao Pai." },
      { "@type": "HowToStep", position: 6, name: "Anunciar o mistério", text: "Anuncie o 1º mistério e faça uma breve meditação." },
      { "@type": "HowToStep", position: 7, name: "Pai-Nosso da dezena", text: "Reze um Pai-Nosso antes da dezena." },
      { "@type": "HowToStep", position: 8, name: "Dez Ave-Marias", text: "Reze dez Ave-Marias, contemplando o mistério." },
      { "@type": "HowToStep", position: 9, name: "Glória", text: "Reze o Glória ao Pai ao final da dezena." },
      { "@type": "HowToStep", position: 10, name: "Repetir até cinco mistérios", text: "Repita a sequência para os cinco mistérios do dia." },
      { "@type": "HowToStep", position: 11, name: "Salve-Rainha e oração final", text: "Finalize com a Salve-Rainha e uma oração final, confiando suas intenções." },
    ],
  };

  // AEO: lista de links principais (mistérios + seções)
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Navegação principal: como rezar o terço e mistérios",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Resposta rápida", url: `${CANONICAL_URL}#resposta-rapida` },
      { "@type": "ListItem", position: 2, name: "Passo a passo", url: `${CANONICAL_URL}#como-rezar` },
      { "@type": "ListItem", position: 3, name: "Mistérios", url: `${CANONICAL_URL}#misterios` },
      { "@type": "ListItem", position: 4, name: "Dias da semana", url: `${CANONICAL_URL}#dias` },
      { "@type": "ListItem", position: 5, name: "Dúvidas frequentes", url: `${CANONICAL_URL}#faq` },
      ...misterioLinks.map((m, i) => ({
        "@type": "ListItem",
        position: 6 + i,
        name: m.title,
        url: `${SITE_URL}/santo-terco/${m.tipo}`,
      })),
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": CANONICAL_URL,
    url: CANONICAL_URL,
    name: "Como rezar o Terço: guia completo (com mistérios)",
    inLanguage: "pt-BR",
    isPartOf: { "@type": "WebSite", name: "IA Tio Ben", url: SITE_URL },
    primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}/images/santo-do-dia-ia-tio-ben.png` },
    mainEntity: [howToSchema, faqSchema],
  };

  return {
    articleSchema,
    breadcrumbSchema,
    faqSchema,
    howToSchema,
    itemListSchema,
    webPageSchema,
  };
}

export default function ComoRezarOTercoPage() {
  const { articleSchema, breadcrumbSchema, faqSchema, howToSchema, itemListSchema, webPageSchema } = buildJsonLd();

  return (
    <article
      className="
        post-santo
        mx-auto w-full
        max-w-6xl
        px-3 pb-16 pt-6
        sm:px-6
        lg:px-8
        text-foreground
      "
      itemScope
      itemType="https://schema.org/Article"
    >
      {/* Adsense loader (garante que a página carrega os anúncios) */}
      <AdsenseScriptOnce />

      {/* JSON-LD (AEO + SEO) */}
      <Script id="ld-webpage" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(webPageSchema)}
      </Script>
      <Script id="ld-article" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(articleSchema)}
      </Script>
      <Script id="ld-breadcrumb" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      <Script id="ld-faq" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(faqSchema)}
      </Script>
      <Script id="ld-howto" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(howToSchema)}
      </Script>
      <Script id="ld-itemlist" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(itemListSchema)}
      </Script>

      {/* HERO */}
      <header className="space-y-4 mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-foreground">
          IA Tio Ben • Hub do Santo Terço
        </div>

        <h1 className="font-reading text-3xl font-extrabold tracking-tight sm:text-4xl">
          Como rezar o Terço: guia completo para rezar com sentido
        </h1>

        <p className="font-reading text-base leading-relaxed text-muted-foreground sm:text-lg">
          Se você quer uma explicação simples e uma forma prática de começar agora, este guia foi feito para você:
          resposta rápida, passo a passo, mistérios e dúvidas comuns — tudo no mesmo lugar.
        </p>

        {/* CTAs */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/santo-terco"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-amber-700/20 transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Rezar agora no Santo Terço
            <span className="text-white/90 transition group-hover:translate-x-0.5">→</span>
          </Link>

          <Link
            href="#resposta-rapida"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold shadow-sm transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Ver resposta rápida (60s)
          </Link>

          <Link
            href="#misterios"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold shadow-sm transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-amber-500 sm:col-span-2 lg:col-span-1"
          >
            Ver os mistérios
          </Link>
        </div>
      </header>

      {/* Layout: conteúdo + sidebar (desktop) */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* MAIN */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6 lg:p-8">
          {/* Anúncio topo do corpo (ótimo CPM/CTR) */}
          <AdsenseInArticle slot={ADS_SLOT_BODY_TOP} minHeight={140} />

          {/* Resposta rápida (AEO) */}
          <section
            id="resposta-rapida"
            className="rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5 mb-6"
            aria-label="Resposta rápida"
          >
            <h2 className="text-base font-semibold text-foreground">
              <strong>Resposta rápida: como rezar o terço</strong>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Se você só quer a sequência sem explicações longas, siga isso:
            </p>

            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-foreground">
              <li>Sinal da Cruz</li>
              <li>Credo</li>
              <li>Pai-Nosso</li>
              <li>3 Ave-Marias</li>
              <li>Glória</li>
              <li>Anuncie 1 mistério + breve meditação (10–20s)</li>
              <li>Pai-Nosso + 10 Ave-Marias + Glória (1 dezena)</li>
              <li>Repita até completar 5 mistérios</li>
              <li>Salve-Rainha + oração final</li>
            </ol>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link
                href="/santo-terco"
                className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                Rezar agora (guiado)
              </Link>
              <Link
                href="#como-rezar"
                className="inline-flex items-center justify-center rounded-xl border border-amber-200 bg-card px-4 py-2.5 text-sm font-semibold text-amber-900 shadow-sm transition hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                Ver passo a passo detalhado
              </Link>
            </div>
          </section>

          {/* Tipografia / hierarquia visual (SEO + leitura) */}
          <div
            className="
              prose prose-amber max-w-none font-reading leading-relaxed
              prose-p:my-4 prose-li:my-1
              prose-h2:mt-10 prose-h2:mb-4 prose-h2:font-extrabold prose-h2:text-2xl prose-h2:text-foreground
              prose-h3:mt-8 prose-h3:mb-3 prose-h3:font-bold prose-h3:text-xl prose-h3:text-foreground
            "
          >
            <h2 id="o-que-e">
              <strong>O que é o Terço Católico?</strong>
            </h2>
            <p>
              O terço é uma oração mariana que nos conduz a Jesus. Enquanto rezamos o Pai-Nosso, a Ave-Maria e o Glória,
              meditamos os <strong>mistérios da vida de Cristo</strong>.
            </p>

            <h2>
              <strong>Para que serve rezar o terço?</strong>
            </h2>
            <ul>
              <li>Silenciar o coração e retomar o foco em Deus</li>
              <li>Meditar o Evangelho com calma</li>
              <li>Confiar intenções pessoais e familiares</li>
              <li>Aprender a perseverar na oração</li>
              <li>Encontrar paz no meio das lutas</li>
            </ul>

            <h2>
              <strong>Terço e Rosário: é a mesma coisa?</strong>
            </h2>
            <p>
              O <strong>Rosário</strong> é o conjunto completo dos mistérios. O <strong>Terço</strong> é a forma mais comum do dia a dia:
              <strong> cinco mistérios</strong>.
            </p>

            <h2 id="como-rezar">
              <strong>Como rezar o terço (passo a passo)</strong>
            </h2>
            <p>
              Rezar o terço não é corrida. É caminho. Se possível, antes de começar, faça uma intenção simples (por alguém, por uma causa,
              por gratidão).
            </p>

            <h3>
              <strong>Checklist rápido (para não se perder)</strong>
            </h3>
            <ol>
              <li>Sinal da Cruz</li>
              <li>Credo</li>
              <li>Pai-Nosso</li>
              <li>Três Ave-Marias</li>
              <li>Glória</li>
              <li>Anunciar o 1º mistério + meditar</li>
              <li>Pai-Nosso</li>
              <li>Dez Ave-Marias</li>
              <li>Glória</li>
              <li>Repetir até cinco mistérios</li>
              <li>Salve-Rainha e oração final</li>
            </ol>

            <p>
              Para evitar rezar “no automático”, faça uma pausa curta antes de cada dezena: anuncie o mistério, respire, e pense no Evangelho.
              Se a mente se distrair, volte com serenidade.
            </p>

            <div className="not-prose mt-6 grid gap-3 sm:grid-cols-2 mb-6">
              <Link
                href="/blog/como-meditar-os-misterios-do-terco"
                className="inline-flex items-center justify-center rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 shadow-sm transition hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                Como meditar os mistérios (blog)
              </Link>
              <Link
                href="/blog/erros-comuns-ao-rezar-o-terco"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold shadow-sm transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                Erros comuns ao rezar (blog)
              </Link>
            </div>

            {/* Anúncio no meio do conteúdo (boa performance) */}
            <div className="not-prose">
              <AdsenseInArticle slot={ADS_SLOT_IN_ARTICLE} minHeight={160} />
            </div>

            <h2 id="misterios">
              <strong>Mistérios do Terço</strong>
            </h2>
            <p>
              Os mistérios são momentos da vida de Jesus contemplados durante a oração. Abra o tipo de mistério do dia e reze com calma.
            </p>
          </div>

          {/* Cards dos mistérios */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 mb-6">
            {misterioLinks.map((m) => (
              <Link
                key={m.tipo}
                href={`/santo-terco/${m.tipo}`}
                className="rounded-2xl border border-amber-200 bg-card p-4 shadow-sm transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{m.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-900">
                    {m.day}
                  </span>
                </div>
                <p className="mt-3 text-xs font-semibold text-amber-900">Abrir página →</p>
              </Link>
            ))}
          </div>

          {/* Mobile ad (quando sidebar some) */}
          <AdsenseSidebarMobile slot={ADS_SLOT_SIDEBAR_MOBILE} />

          {/* Dias da semana */}
          <div className="prose prose-amber max-w-none font-reading leading-relaxed mb-4 prose-h2:font-extrabold prose-h2:text-2xl prose-h2:text-foreground">
            <h2 id="dias">
              <strong>Qual mistério rezar em cada dia?</strong>
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-amber-200 bg-card mb-6">
            <div className="grid grid-cols-1 divide-y divide-amber-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              {[
                ["Segunda-feira", "Mistérios Gozosos"],
                ["Terça-feira", "Mistérios Dolorosos"],
                ["Quarta-feira", "Mistérios Gloriosos"],
                ["Quinta-feira", "Mistérios Luminosos"],
                ["Sexta-feira", "Mistérios Dolorosos"],
                ["Sábado", "Mistérios Gozosos"],
                ["Domingo", "Mistérios Gloriosos"],
              ].map(([dia, misterio], idx) => (
                <div key={dia} className={`p-4 ${idx === 6 ? "sm:col-span-2" : ""}`}>
                  <p className="text-sm font-semibold text-foreground">{dia}</p>
                  <p className="text-sm text-muted-foreground">{misterio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="prose prose-amber max-w-none font-reading leading-relaxed mb-4 prose-h2:font-extrabold prose-h2:text-2xl prose-h2:text-foreground">
            <h2 id="faq">
              <strong>Dúvidas frequentes</strong>
            </h2>
          </div>          
          {/* ✅ Anúncio antes do FAQ (novo slot) */}
          <AdsenseInArticle slot={ADS_SLOT_IN_ARTICLE_2} minHeight={140} />

          <div className="space-y-3 mb-6">
            {[
              ["O terço precisa ser rezado em voz alta?", "Não. Pode ser em voz alta, em silêncio ou mentalmente. O essencial é a atenção e a fé."],
              ["Posso rezar o terço sem ter um terço nas mãos?", "Sim. Você pode acompanhar por texto e seguir a sequência com calma. O valor está na oração."],
              ["Qual a diferença entre terço e rosário?", "O Rosário é o conjunto completo. O Terço é a forma mais comum do dia a dia: cinco mistérios."],
              ["Preciso rezar tudo de uma vez?", "Não. Reze por partes (um mistério por vez) se necessário. O importante é perseverar."],
              ["Rezar o terço online é válido?", "Sim. Pode ajudar na constância e na atenção. O importante é rezar com o coração presente."],
            ].map(([q, a]) => (
              <details key={q} className="rounded-xl border border-amber-200 bg-card p-4">
                <summary className="cursor-pointer text-sm font-semibold text-foreground">{q}</summary>
                <p className="mt-3 text-sm text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>

          {/* CTA final */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
            <div className="space-y-3">
              <p className="text-base font-semibold text-amber-900">
                <strong>Vamos dar um passo hoje?</strong>
              </p>
              <p className="text-sm leading-relaxed text-amber-900/90">
                Se você está cansado ou ansioso, comece por um mistério. Um só. Com calma. Deus já está te ouvindo.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/santo-terco"
                  className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  Rezar agora no Santo Terço
                </Link>
                <Link
                  href="/blog/rezar-o-terco-sozinho"
                  className="inline-flex items-center justify-center rounded-xl border border-amber-200 bg-card px-4 py-3 text-sm font-semibold text-amber-900 shadow-sm transition hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  Rezar sozinho (blog)
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SIDEBAR (desktop sticky) */}
        <aside className="space-y-4 lg:sticky lg:top-6 lg:h-fit">
          {/* Atalhos dos 4 mistérios (no início do menu lateral) */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="text-sm font-semibold text-foreground">Atalhos: Mistérios</p>
            <p className="mt-1 text-xs text-muted-foreground">Abra direto o tipo de mistério do dia.</p>

            <div className="mt-3 grid gap-2">
              {misterioLinks.map((m) => (
                <Link
                  key={m.tipo}
                  href={`/santo-terco/${m.tipo}`}
                  className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {m.title}
                  <span className="ml-2 text-[11px] font-semibold text-amber-900/80">({m.day})</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Anúncio no menu lateral (desktop) */}
          <AdsenseSidebarDesktop300x250 slot={ADS_SLOT_SIDEBAR_DESKTOP} />

          {/* Sumário */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="text-sm font-semibold text-foreground">Sumário</p>
            <nav className="mt-3 grid gap-2 text-sm">
              {[
                ["Resposta rápida", "#resposta-rapida"],
                ["O que é o terço", "#o-que-e"],
                ["Passo a passo", "#como-rezar"],
                ["Mistérios", "#misterios"],
                ["Dias da semana", "#dias"],
                ["Dúvidas", "#faq"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="rounded-lg border border-border bg-card px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Posts recomendados */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="text-sm font-semibold text-foreground">Aprofundar no blog</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Conteúdo complementar para responder dúvidas específicas (ótimo para SEO + IA).
            </p>

            <div className="mt-3 grid gap-2">
              {recommendedBlogLinks.slice(0, 6).map((x) => (
                <Link
                  key={x.slug}
                  href={`/blog/${x.slug}`}
                  className="rounded-xl border border-border bg-card p-3 text-sm shadow-sm transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <p className="font-semibold text-foreground">{x.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{x.desc}</p>
                </Link>
              ))}
            </div>          
          </div>

          {/* Segundo anúncio no menu lateral (desktop) */}
          <AdsenseSidebarDesktop300x250 slot={ADS_SLOT_SIDEBAR_DESKTOP} />
        </aside>
      </div>
    </article>
  );
}
