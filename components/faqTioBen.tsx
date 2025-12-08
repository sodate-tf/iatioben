"use client";

import { useState } from "react";
import TestBanner from "./testBanner";

const FAQS = [
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

export default function FaqTioBen() {
  const [aberto, setAberto] = useState<number | null>(null);

  return (
    <section
      className="max-w-5xl mx-auto px-4 py-14"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <h2 className="text-3xl font-bold text-center text-amber-900 mb-3">
        Central de Ajuda da IA Tio Ben
      </h2>

      <p className="text-center text-gray-700 mb-10 text-sm">
        Tire suas dúvidas sobre como usar o Tio Ben, a Liturgia Diária e a proposta do projeto.
      </p>

      <div className="flex flex-col gap-4">
        {FAQS.map((item, index) => (
          <div
            key={index}
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
            className="bg-white rounded-xl shadow-md border border-amber-200 overflow-hidden"
          >
            <button
              itemProp="name"
              onClick={() => setAberto(aberto === index ? null : index)}
              className="w-full text-left px-5 py-4 flex justify-between items-center font-semibold text-amber-900 hover:bg-amber-50 transition"
            >
              {item.pergunta}
              <span className="text-xl">{aberto === index ? "−" : "+"}</span>
            </button>

            {aberto === index && (
              <div
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
                className="px-5 pb-5 pt-2 text-gray-700 text-sm leading-relaxed bg-amber-50"
              >
                <p itemProp="text">{item.resposta}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10">
        <TestBanner />
      </div>

      {/* BLOCO EDITORIAL FORTE PARA SEO + ADS */}
      <div className="mt-10 bg-amber-100 border border-amber-200 rounded-xl p-6 text-sm text-gray-800 leading-relaxed">
        A IA Tio Ben é um projeto de evangelização digital que une tecnologia e fé. Todos os dias, você pode acompanhar a Liturgia Diária, refletir sobre o Evangelho do Dia e fortalecer sua vida espiritual com orientações cristãs seguras, simples e acessíveis.
      </div>
    </section>
  );
}
