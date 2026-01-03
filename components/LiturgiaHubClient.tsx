"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type LinkItem = { title: string; desc: string; href: string };

function SectionCard({
  id,
  title,
  subtitle,
  children,
  subtle = false,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  subtle?: boolean;
}) {
  return (
    <section
      id={id}
      className={[
        "scroll-mt-24 rounded-2xl border shadow-sm backdrop-blur-sm",
        subtle ? "bg-white/70 border-amber-100" : "bg-white border-amber-200",
      ].join(" ")}
    >
      <header className="px-5 pt-5 pb-3">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-gray-700">{subtitle}</p> : null}
      </header>
      <div className="px-5 pb-5">{children}</div>
    </section>
  );
}

function PillLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-amber-50 transition"
    >
      {children}
    </Link>
  );
}

function CardGrid({ items }: { items: LinkItem[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          className="rounded-2xl border border-amber-200 bg-white hover:bg-amber-50 transition p-4 shadow-sm"
        >
          <div className="font-extrabold text-gray-900">{it.title}</div>
          <p className="mt-1 text-sm text-gray-700">{it.desc}</p>
          <div className="mt-3 text-xs font-semibold text-amber-800">Abrir</div>
        </Link>
      ))}
    </div>
  );
}

function formatTodayBR() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export default function LiturgiaHubClient() {
  const todayLabel = useMemo(() => formatTodayBR(), []);

  // Ajuste estes links conforme suas rotas reais:
  const ROUTES = {
    liturgiaHoje: "/liturgia-diaria",
    terco: "/santo-terco",
    blog: "/blog",

    // Pilares sugeridos (podem ser blog posts inicialmente)
    pilarComoFunciona: "/blog/como-funciona-a-liturgia-da-missa",
    pilarCiclos: "/blog/ciclos-a-b-c-evangelhos-na-liturgia",
    pilarTempos: "/blog/tempos-liturgicos-advento-natal-quaresma-pascoa",
    pilarEstruturaMissa: "/blog/estrutura-da-missa-liturgia-da-palavra-eucaristica",
    pilarComoMeditar: "/blog/como-meditar-as-leituras-sem-rezar-no-automatico",
    pilarSolenidadeFestaMemoria: "/blog/diferenca-entre-solenidade-festa-e-memoria",
  };

  const pillars: LinkItem[] = [
    {
      title: "Como funciona a Liturgia da Missa",
      desc: "O sentido da Liturgia e como ela organiza a vida da Igreja.",
      href: ROUTES.pilarComoFunciona,
    },
    {
      title: "Ciclos A, B e C: como o Evangelho muda",
      desc: "Entenda Mateus, Marcos e Lucas no lecionário dominical.",
      href: ROUTES.pilarCiclos,
    },
    {
      title: "Tempos Litúrgicos (Advento, Quaresma, etc.)",
      desc: "O que muda em cada tempo e como viver melhor a espiritualidade.",
      href: ROUTES.pilarTempos,
    },
    {
      title: "Estrutura da Missa: Palavra e Eucaristia",
      desc: "Um mapa simples para acompanhar a celebração com atenção.",
      href: ROUTES.pilarEstruturaMissa,
    },
  ];

  const deepen: LinkItem[] = [
    {
      title: "Como meditar as leituras (sem rezar no automático)",
      desc: "Método prático para contemplar a Palavra com serenidade.",
      href: ROUTES.pilarComoMeditar,
    },
    {
      title: "Solenidade, Festa e Memória: qual a diferença?",
      desc: "Entenda os graus de celebração no calendário litúrgico.",
      href: ROUTES.pilarSolenidadeFestaMemoria,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 via-amber-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10 space-y-4">
        <motion.header
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center"
        >
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-gray-700">
              <li>
                <Link href="/" className="hover:underline">
                  Início
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-400">
                /
              </li>
              <li className="text-gray-900 font-semibold">Liturgia</li>
            </ol>
          </nav>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Liturgia Católica: Leituras Diárias, Calendário e Como Funciona
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-700 max-w-3xl mx-auto">
            Use esta página como ponto de partida: acesso rápido à Liturgia Diária, explicações para entender a Missa e
            conteúdos para aprofundar a oração.
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <PillLink href={ROUTES.liturgiaHoje}>Ir para a Liturgia de hoje ({todayLabel})</PillLink>
            <PillLink href={ROUTES.terco}>Rezar o Santo Terço</PillLink>
            <PillLink href={ROUTES.blog}>Ver Blog</PillLink>
          </div>
        </motion.header>

        {/* Sumário / Jump links */}
        <nav aria-label="Sumário do hub" className="mt-2">
          <div className="rounded-2xl border border-amber-200 bg-white/80 backdrop-blur-sm shadow-sm px-3 py-2">
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <a
                href="#hoje"
                className="px-3 py-2 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 transition font-semibold text-gray-900"
              >
                Começar por hoje
              </a>
              <a
                href="#entender"
                className="px-3 py-2 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 transition font-semibold text-gray-900"
              >
                Entender a Liturgia
              </a>
              <a
                href="#estrutura"
                className="px-3 py-2 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 transition font-semibold text-gray-900"
              >
                Estrutura da Missa
              </a>
              <a
                href="#aprofundar"
                className="px-3 py-2 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 transition font-semibold text-gray-900"
              >
                Aprofundar
              </a>
              <a
                href="#faq"
                className="px-3 py-2 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 transition font-semibold text-gray-900"
              >
                FAQ
              </a>
            </div>
          </div>
        </nav>

        <motion.main
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-4"
        >
          <SectionCard
            id="hoje"
            title="Comece pela Liturgia de Hoje"
            subtitle="Para acompanhar a celebração do dia, com leituras, Evangelho e orações."
            subtle
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                A Liturgia de hoje é a forma mais simples de manter constância. Você pode ler uma vez ao dia, escolher uma
                frase para meditar e finalizar com uma oração breve.
              </p>
              <div className="flex gap-2">
                <Link
                  href={ROUTES.liturgiaHoje}
                  className="px-4 py-2 rounded-xl bg-amber-200 border border-amber-300 text-gray-900 font-semibold hover:bg-amber-300 transition whitespace-nowrap"
                >
                  Abrir Liturgia de Hoje
                </Link>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            id="entender"
            title="Entender a Liturgia"
            subtitle="Conteúdos pilares para compreender o sentido e a organização das leituras."
          >
            <CardGrid items={pillars} />
          </SectionCard>

          <SectionCard
            id="estrutura"
            title="Estrutura da Missa (mapa rápido)"
            subtitle="Um roteiro simples para acompanhar sem se perder."
            subtle
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-amber-200 bg-white p-4">
                <div className="font-extrabold text-gray-900">Liturgia da Palavra</div>
                <ul className="mt-2 space-y-1 text-sm text-gray-700 list-disc pl-5">
                  <li>1ª Leitura</li>
                  <li>Salmo Responsorial</li>
                  <li>2ª Leitura (quando houver)</li>
                  <li>Evangelho</li>
                  <li>Homilia e oração dos fiéis</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-white p-4">
                <div className="font-extrabold text-gray-900">Liturgia Eucarística</div>
                <ul className="mt-2 space-y-1 text-sm text-gray-700 list-disc pl-5">
                  <li>Apresentação das oferendas</li>
                  <li>Oração Eucarística</li>
                  <li>Rito da Comunhão</li>
                  <li>Oração final e envio</li>
                </ul>
              </div>
            </div>

            <div className="mt-3">
              <Link
                href={ROUTES.pilarEstruturaMissa}
                className="inline-flex items-center rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-amber-50 transition"
              >
                Ler explicação completa
              </Link>
            </div>
          </SectionCard>

          <SectionCard
            id="aprofundar"
            title="Aprofundar (oração e meditação)"
            subtitle="Links para leitura mais profunda e prática diária."
          >
            <CardGrid items={deepen} />

            <div className="mt-3 rounded-2xl border border-amber-200 bg-white p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-sm text-gray-700 leading-relaxed">
                  Se você quiser consolidar uma rotina, uma boa sequência é: <strong>Liturgia</strong> →{" "}
                  <strong>1 frase para guardar</strong> → <strong>Santo Terço</strong>.
                </div>
                <div className="flex gap-2">
                  <Link
                    href={ROUTES.terco}
                    className="px-4 py-2 rounded-xl bg-amber-200 border border-amber-300 text-gray-900 font-semibold hover:bg-amber-300 transition whitespace-nowrap"
                  >
                    Rezar o Terço
                  </Link>
                  <Link
                    href={ROUTES.blog}
                    className="px-4 py-2 rounded-xl bg-white border border-amber-200 text-gray-900 font-semibold hover:bg-amber-50 transition whitespace-nowrap"
                  >
                    Ver Blog
                  </Link>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            id="faq"
            title="Perguntas frequentes"
            subtitle="Respostas rápidas para dúvidas comuns sobre a Liturgia."
            subtle
          >
            <div className="space-y-2">
              <details className="rounded-2xl border border-amber-200 bg-white p-4">
                <summary className="cursor-pointer select-none font-bold text-gray-900">
                  O que é a Liturgia da Missa?
                </summary>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  A Liturgia é a oração pública da Igreja e, na Missa, é a forma como celebramos o Mistério de Cristo. Ela
                  inclui a Liturgia da Palavra e a Liturgia Eucarística.
                </p>
              </details>

              <details className="rounded-2xl border border-amber-200 bg-white p-4">
                <summary className="cursor-pointer select-none font-bold text-gray-900">
                  Por que as leituras mudam todos os dias?
                </summary>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  Elas seguem um lecionário organizado ao longo do ano litúrgico para alimentar a comunidade com a Palavra
                  de Deus de forma ordenada, conforme tempos e ciclos.
                </p>
              </details>

              <details className="rounded-2xl border border-amber-200 bg-white p-4">
                <summary className="cursor-pointer select-none font-bold text-gray-900">
                  O que são os ciclos A, B e C?
                </summary>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  São ciclos dominicais: A (Mateus), B (Marcos) e C (Lucas). Alternam-se a cada ano para garantir variedade e
                  profundidade na proclamação do Evangelho.
                </p>
              </details>

              <details className="rounded-2xl border border-amber-200 bg-white p-4">
                <summary className="cursor-pointer select-none font-bold text-gray-900">
                  Qual a diferença entre solenidade, festa e memória?
                </summary>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  São graus de celebração no calendário litúrgico. Solenidades são as mais importantes, festas vêm em seguida e
                  memórias destacam santos e acontecimentos, podendo ser obrigatórias ou facultativas.
                </p>
              </details>
            </div>
          </SectionCard>
        </motion.main>
      </div>
    </div>
  );
}
