"use client";

import { useMemo, useState } from "react";

type FaqItem = {
  pergunta: string;
  resposta: string;
};

const FAQS: FaqItem[] = [
  {
    pergunta: "O que é a IA Tio Ben?",
    resposta:
      "A IA Tio Ben é uma inteligência artificial católica criada para ajudar fiéis a compreender melhor a Liturgia Diária, o Evangelho do Dia, a Bíblia, a fé cristã e os ensinamentos da Igreja Católica de forma acessível, respeitosa e fiel à doutrina.",
  },
  {
    pergunta: "Como funciona a conversa com o Tio Ben?",
    resposta:
      "Você faz sua pergunta no campo inferior da tela e a resposta aparece logo acima, dentro da própria conversa, como em um aplicativo de inteligência artificial. Você pode continuar perguntando e lendo as respostas em sequência, como um diálogo.",
  },
  {
    pergunta: "Minhas perguntas ficam salvas?",
    resposta:
      "Não. Para garantir sua privacidade, toda a conversa é apagada automaticamente ao sair da página ou ao atualizá-la. Nenhuma resposta fica armazenada no seu celular ou navegador.",
  },
  {
    pergunta: "Posso perguntar sobre problemas pessoais?",
    resposta:
      "Sim. Você pode perguntar sobre família, ansiedade, trabalho, decisões importantes, relacionamentos, dificuldades espirituais e fé. As respostas são dadas com base cristã, bíblica e pastoral.",
  },
  {
    pergunta: "O Tio Ben é um padre ou líder religioso?",
    resposta:
      "Não. O Tio Ben não é um sacerdote humano. Ele é uma inteligência artificial criada para ensinar, orientar e evangelizar com base na fé católica, na Bíblia, no Catecismo da Igreja e na Tradição Apostólica.",
  },
  {
    pergunta: "As respostas do Tio Ben são baseadas na Igreja Católica?",
    resposta:
      "Sim. As respostas são inspiradas na Sagrada Escritura, no Catecismo da Igreja Católica, nos documentos da Igreja e na tradição cristã.",
  },
  {
    pergunta: "O que eu encontro na página de Liturgia Diária?",
    resposta:
      "Na Liturgia Diária você encontra as leituras completas da Missa de cada dia: Primeira Leitura, Salmo, Segunda Leitura (quando houver), Evangelho e as orações litúrgicas.",
  },
  {
    pergunta: "A Liturgia do Dia é atualizada automaticamente?",
    resposta:
      "Sim. O sistema atualiza automaticamente a Liturgia todos os dias, garantindo que você sempre tenha acesso ao conteúdo correto e atualizado.",
  },
  {
    pergunta: "O Tio Ben substitui um padre ou diretor espiritual?",
    resposta:
      "Não. A IA é uma ferramenta de apoio à fé. Ela não substitui a direção espiritual, a confissão, os sacramentos nem o acompanhamento pastoral.",
  },
  {
    pergunta: "Posso acessar o Tio Ben pelo celular?",
    resposta:
      "Sim. O site funciona perfeitamente em celulares, tablets e computadores, com layout adaptado para cada tipo de tela.",
  },
  {
    pergunta: "O Tio Ben pode errar alguma resposta?",
    resposta:
      "Como toda inteligência artificial, o Tio Ben pode apresentar limitações. Sempre que houver dúvidas, o mais seguro é confirmar com um sacerdote ou líder pastoral.",
  },
  {
    pergunta: "O site possui anúncios?",
    resposta:
      "Sim. O site pode exibir anúncios para ajudar na manutenção do projeto. Eles não interferem no conteúdo da fé e não influenciam as respostas da IA.",
  },
  {
    pergunta: "Quem desenvolveu a IA Tio Ben?",
    resposta:
      "O projeto Tio Ben foi desenvolvido pela 4U Develops, com foco em tecnologia, automação e projetos digitais cristãos.",
  },
  {
    pergunta: "Como usar melhor a IA Tio Ben no dia a dia?",
    resposta:
      "Você pode usá-la diariamente para refletir sobre o Evangelho, tirar dúvidas sobre a fé, fortalecer a espiritualidade e se preparar para a Missa.",
  },
];

function normalizeText(v: unknown): string {
  if (typeof v !== "string") return "";
  return v.replace(/\s+/g, " ").trim();
}

function buildFAQSchemaFromList(list: FaqItem[]) {
  const mainEntity = list
    .map((i) => ({
      q: normalizeText(i.pergunta),
      a: normalizeText(i.resposta),
    }))
    .filter((x) => x.q.length > 0 && x.a.length > 0)
    .map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: x.a,
      },
    }));

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}

export default function FaqTioBen() {
  const [aberto, setAberto] = useState<number | null>(null);

  const expandedFaqs = useMemo(() => {
    // Mantém as MESMAS respostas como base, mas entrega no padrão mais completo (editorial + utilidade).
    return FAQS.map((item) => {
      const p = item.pergunta;
      const r = item.resposta;

      if (p === "O que é a IA Tio Ben?") {
        return {
          ...item,
          resposta:
            r +
            " A proposta é oferecer um ambiente de estudo e orientação mais controlado e consistente do que buscas abertas na internet, reduzindo ruído, contradições e respostas desconexas." +
            " Isso é especialmente útil para a fase de curiosidade de crianças, para famílias e para quem está dando os primeiros passos na fé, mantendo o foco no que a Igreja ensina." +
            " Também é um apoio prático para catequistas e pregadores, ajudando a organizar ideias, estruturar explicações e aprofundar temas com base em referências católicas.",
        };
      }

      if (p === "Como funciona a conversa com o Tio Ben?") {
        return {
          ...item,
          resposta:
            r +
            " Para aproveitar melhor, faça perguntas específicas (por exemplo: “explique o Evangelho do dia em 3 pontos”, “me dê uma aplicação prática para a família”, “me ajude com um roteiro de catequese”)." +
            " Você pode continuar o diálogo pedindo exemplos, aprofundando o tema, ou solicitando uma explicação mais simples, conforme seu público (crianças, jovens, adultos, catequese, grupo de oração).",
        };
      }

      if (p === "Minhas perguntas ficam salvas?") {
        return {
          ...item,
          resposta:
            r +
            " Essa abordagem prioriza privacidade no uso cotidiano, especialmente quando as perguntas envolvem situações pessoais, dúvidas íntimas ou temas familiares." +
            " Se você quiser guardar algum conteúdo, a recomendação é copiar e salvar apenas o trecho necessário (por exemplo, um resumo, um roteiro de encontro ou uma oração).",
        };
      }

      if (p === "Posso perguntar sobre problemas pessoais?") {
        return {
          ...item,
          resposta:
            r +
            " O objetivo é oferecer uma orientação cristã que ajude a organizar pensamentos, fortalecer a esperança e buscar caminhos de paz, sem substituir acompanhamento humano." +
            " Quando o tema exigir discernimento mais profundo, sofrimento intenso ou direção espiritual, o ideal é procurar um sacerdote, confessor, diretor espiritual ou um aconselhamento pastoral na sua paróquia.",
        };
      }

      if (p === "O Tio Ben é um padre ou líder religioso?") {
        return {
          ...item,
          resposta:
            r +
            " Ele serve como ferramenta de apoio para estudo, catequese e oração — ajudando a explicar conceitos, resumir ensinamentos, contextualizar leituras e propor aplicações práticas." +
            " Para decisões pastorais, orientação espiritual pessoal e sacramentos, a referência continua sendo a Igreja e seus ministros.",
        };
      }

      if (p === "As respostas do Tio Ben são baseadas na Igreja Católica?") {
        return {
          ...item,
          resposta:
            r +
            " O foco é manter coerência com a fé católica e oferecer respostas mais consistentes do que conteúdos dispersos em fontes abertas." +
            " Ainda assim, em temas sensíveis ou complexos, é recomendável confirmar com sua paróquia, catequista responsável ou sacerdote, especialmente quando envolver consciência, moral e discernimento.",
        };
      }

      if (p === "O que eu encontro na página de Liturgia Diária?") {
        return {
          ...item,
          resposta:
            r +
            " A Liturgia Diária é um caminho excelente para transformar a Palavra em devocional: ela guia sua oração e seu estudo em comunhão com a Igreja inteira, dia após dia." +
            " Ler a liturgia diariamente ajuda a criar constância espiritual, amadurecer a fé e preparar o coração para viver melhor a Missa e os sacramentos.",
        };
      }

      if (p === "A Liturgia do Dia é atualizada automaticamente?") {
        return {
          ...item,
          resposta:
            r +
            " Isso facilita a rotina: você abre o site e já encontra o conteúdo do dia pronto para oração, meditação e preparação para a Missa." +
            " Para quem faz devocional diário, essa consistência é essencial para manter o hábito sem depender de buscas e fontes diferentes.",
        };
      }

      if (p === "O Tio Ben substitui um padre ou diretor espiritual?") {
        return {
          ...item,
          resposta:
            r +
            " Use a IA como apoio: para esclarecer dúvidas, organizar uma rotina de oração, preparar um encontro, ou refletir sobre a liturgia do dia." +
            " Para confissão, direção espiritual, aconselhamento profundo e acompanhamento pastoral, procure sempre um sacerdote ou uma liderança pastoral de confiança.",
        };
      }

      if (p === "Posso acessar o Tio Ben pelo celular?") {
        return {
          ...item,
          resposta:
            r +
            " Isso permite que você use o IA Tio Ben como um devocional no dia a dia: no caminho para o trabalho, em momentos curtos de oração, ou antes da Missa." +
            " Também é prático para catequistas e pregadores consultarem rapidamente leituras, resumos e roteiros.",
        };
      }

      if (p === "O Tio Ben pode errar alguma resposta?") {
        return {
          ...item,
          resposta:
            r +
            " Em caso de dúvida, peça para a IA explicar a resposta de outra forma, pedir referências, ou resumir em tópicos — e confirme com sua paróquia quando o assunto for delicado." +
            " A IA é um suporte; a autoridade final em fé e prática cristã permanece com a Igreja.",
        };
      }

      if (p === "O site possui anúncios?") {
        return {
          ...item,
          resposta:
            r +
            " Os anúncios existem para sustentar custos de operação, manutenção e evolução do projeto." +
            " O compromisso do IA Tio Ben é manter o conteúdo da fé preservado e a experiência de estudo e oração útil para o dia a dia.",
        };
      }

      if (p === "Quem desenvolveu a IA Tio Ben?") {
        return {
          ...item,
          resposta:
            r +
            " O objetivo é aplicar tecnologia com responsabilidade para servir a evangelização digital, oferecendo uma experiência organizada, simples e confiável." +
            " O projeto também inclui conteúdos editoriais e um acervo de formação, com destaque para inspiração na vida dos santos e tradição da Igreja.",
        };
      }

      if (p === "Como usar melhor a IA Tio Ben no dia a dia?") {
        return {
          ...item,
          resposta:
            r +
            " Uma rotina simples funciona muito bem: (1) leia a Liturgia Diária, (2) peça um resumo em tópicos, (3) faça uma aplicação prática para sua realidade, e (4) finalize com uma oração." +
            " Você também pode usar o blog como fonte de inspiração, especialmente na vida dos santos, fortalecendo a caminhada cristã com exemplos concretos de fé.",
        };
      }

      return item;
    });
  }, []);

  const faqSchema = useMemo(() => buildFAQSchemaFromList(expandedFaqs), [expandedFaqs]);

  return (
    <section className="max-w-5xl mx-auto px-4 py-14">
      {/* JSON-LD (recomendado para o Search Console) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <h2 className="text-3xl font-bold text-center text-amber-900 mb-3">
        Central de Ajuda da IA Tio Ben
      </h2>

      <p className="text-center text-gray-700 mb-10 text-sm">
        Tire suas dúvidas sobre como usar o Tio Ben, a Liturgia Diária e a proposta do projeto.
      </p>

      <div className="flex flex-col gap-4">
        {expandedFaqs.map((item, index) => {
          const isOpen = aberto === index;

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border border-amber-200 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setAberto(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="w-full text-left px-5 py-4 flex justify-between items-center font-semibold text-amber-900 hover:bg-amber-50 transition"
              >
                <span className="pr-4">{item.pergunta}</span>
                <span className="text-xl" aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-2 text-gray-700 text-sm leading-relaxed bg-amber-50">
                  <p>{item.resposta}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10">

      </div>

      {/* BLOCO EDITORIAL FORTE PARA SEO + ADS */}
      <div className="mt-10 bg-amber-100 border border-amber-200 rounded-xl p-6 text-sm text-gray-800 leading-relaxed">
        A IA Tio Ben é um projeto de evangelização digital que une tecnologia e fé. Aqui você acompanha a Liturgia
        Diária, aprofunda o Evangelho do Dia e fortalece sua vida espiritual com um conteúdo organizado e coerente
        com a fé católica. A proposta é oferecer uma experiência mais controlada do que buscas abertas na internet,
        ajudando famílias, catequistas e pregadores a estudarem e ensinarem com mais clareza e segurança.
      </div>
    </section>
  );
}
