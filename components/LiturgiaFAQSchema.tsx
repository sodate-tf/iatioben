import Script from "next/script";

interface LiturgiaFAQSchemaProps {
  dateFormatted: string; // ex: "terça-feira, 12 de dezembro de 2025"
  liturgiaTitulo: string;
}

function safeText(value: unknown, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  const t = value.trim();
  return t.length ? t : fallback;
}

export default function LiturgiaFAQSchema({
  dateFormatted,
  liturgiaTitulo,
}: LiturgiaFAQSchemaProps) {
  const date = safeText(dateFormatted, "hoje");
  const titulo = safeText(liturgiaTitulo, "Liturgia do Dia");

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Qual é o Evangelho de ${date}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            `O Evangelho de ${date} pertence à liturgia "${titulo}". ` +
            `No IA Tio Ben você encontra a Liturgia Diária completa (Evangelho, Salmo e Leituras), ` +
            `organizada e pronta para acompanhar o calendário litúrgico. Além do texto, você pode usar a IA para entender ` +
            `o contexto, o sentido espiritual e aplicações práticas para a oração e vida cristã, sempre com base na Igreja Católica.`,
        },
      },
      {
        "@type": "Question",
        name: "O que é a IA Tio Ben e por que ela é diferente?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "A IA Tio Ben é uma inteligência artificial católica com respostas orientadas pela fé da Igreja, pensada para ajudar no estudo, " +
            "na oração e no aprofundamento da Palavra. Diferente de buscas abertas na internet, ela prioriza clareza, coerência doutrinal e " +
            "conteúdos organizados, evitando se perder em fontes desencontradas. Isso torna a experiência mais segura e consistente para quem " +
            "quer aprender e crescer na fé, sem ruído e sem confusão.",
        },
      },
      {
        "@type": "Question",
        name: "A IA Tio Ben é boa para crianças e para a fase de curiosidade?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Sim. Ela é muito útil para a fase de curiosidade das crianças, porque responde de forma didática e objetiva, mantendo o foco no essencial " +
            "e sem expor a criança a conteúdos aleatórios da internet. Pais e responsáveis podem usar a IA Tio Ben como apoio para perguntas sobre Deus, " +
            "Bíblia, oração e vida cristã, com linguagem acessível e fidelidade ao que a Igreja ensina.",
        },
      },
      {
        "@type": "Question",
        name: "Como a IA Tio Ben ajuda catequistas e pregadores?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "A IA Tio Ben ajuda catequistas, pregadores e lideranças a preparar encontros, catequeses, roteiros e reflexões com mais rapidez e organização. " +
            "Ela pode sugerir explicações, conexões bíblicas e pontos de aplicação pastoral, sempre procurando manter a resposta alinhada à doutrina católica " +
            "e ao espírito da Igreja. É um apoio prático para estruturar ideias com clareza e evitar interpretações soltas ou confusas.",
        },
      },
      {
        "@type": "Question",
        name: "Por que ler a Liturgia Diária todos os dias é importante?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Ler a Liturgia Diária todos os dias é uma forma simples e poderosa de transformar a Palavra de Deus em devocional, criando constância na oração " +
            "e sintonia com a Igreja no mundo inteiro. A liturgia acompanha o calendário litúrgico e nos educa espiritualmente ao longo do ano, conduzindo " +
            "com equilíbrio entre Evangelho, Salmos e Leituras. Com poucos minutos por dia, você fortalece a fé, amadurece a vida interior e aprende a ler " +
            "a vida à luz do Evangelho.",
        },
      },
      {
        "@type": "Question",
        name: "Onde posso ler a Liturgia Diária completa no IA Tio Ben?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Você pode ler gratuitamente a Liturgia Diária completa no IA Tio Ben, todos os dias, com Evangelho, Salmo e Leituras do calendário litúrgico. " +
            "O conteúdo é apresentado de forma organizada para facilitar sua oração, estudo e meditação. Você também pode usar a IA para tirar dúvidas e " +
            "aprofundar o entendimento do texto, mantendo o foco na fé católica.",
        },
      },
      {
        "@type": "Question",
        name: "O blog do IA Tio Ben fala sobre o quê?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "O blog do IA Tio Ben é um acervo de conteúdo católico para formação e inspiração, com destaque para a vida dos santos, suas histórias, virtudes " +
            "e exemplos práticos de santidade no cotidiano. É um espaço para aprender com a tradição da Igreja, fortalecer a fé e encontrar referências " +
            "espirituais sólidas para viver o Evangelho com mais profundidade.",
        },
      },
    ],
  };

  return (
    <Script
      id="liturgia-faq-schema"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}
