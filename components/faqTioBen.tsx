"use client";

import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import TestBanner from "./testBanner";

export default function FaqTioBen() {
  const blocos = [
    {
      titulo: "Quem é o Tio Ben? 👨‍🏫",
      texto: [
        "Oi! Eu sou o Tio Ben, seu catequista virtual! 😊 Estou aqui para te ajudar na caminhada de fé e responder suas dúvidas sobre a liturgia diária, o Evangelho do dia e as leituras da missa.",
        "Baseio todas as minhas respostas nos ensinamentos da Igreja Católica, na Bíblia Sagrada, no Catecismo da Igreja e na Tradição Apostólica.",
        "Além das respostas, convido você a visitar o Blog IA Tio Ben, onde publico reflexões católicas, comentários sobre a liturgia do dia e conteúdos que fortalecem a vida espiritual. 🙏✨",
      ],
    },
    {
      titulo: "Como você responde às perguntas? 🤔",
      texto: [
        "Minhas respostas são inspiradas na Palavra de Deus e na doutrina católica. Uso a Bíblia, o Catecismo e documentos da Igreja como base. 📖",
        "Procuro unir o conhecimento da fé com o amor e a simplicidade da catequese. Quando a dúvida envolve o Evangelho ou a Liturgia do Dia, busco sempre explicar o contexto das leituras e ajudar na aplicação prática do ensinamento.",
      ],
    },
    {
      titulo: "O que posso encontrar na Liturgia Diária? 📅",
      texto: [
        "Na página de Liturgia Diária do site, você encontra as leituras do dia, o salmo, o Evangelho e uma breve reflexão para viver melhor o Evangelho de Jesus no cotidiano.",
        "Cada dia traz uma nova oportunidade de meditar a Palavra de Deus e crescer na fé. Você pode acessar em: https://www.iatioben.com.br/liturgia-diaria",
      ],
    },
    {
      titulo: "O Blog IA Tio Ben fala sobre o quê? 📰",
      texto: [
        "O Blog IA Tio Ben é um espaço de partilha de fé, onde publico artigos, orações, reflexões católicas e temas ligados à Liturgia, vida dos santos e espiritualidade cristã.",
        "Os textos são simples, acessíveis e inspiradores, ideais para quem quer entender melhor a Bíblia e o Evangelho do dia. Cada postagem é uma forma de continuar o diálogo iniciado aqui na IA Tio Ben!",
      ],
    },
    {
      titulo: "Posso fazer perguntas sobre o Evangelho ou temas pessoais? 🙏",
      texto: [
        "Sim! Você pode me perguntar sobre o Evangelho, as leituras litúrgicas, vida dos santos, oração e até temas do cotidiano vistos com olhar cristão. ✨",
        "Também acolho perguntas sobre família, trabalho, relacionamentos e fé. Sempre com respeito, carinho e base na doutrina da Igreja Católica.",
      ],
    },
    {
      titulo: "Como aproveitar melhor o Blog e a IA Tio Ben juntos? 🌱",
      texto: [
        "O ideal é usar a IA Tio Ben para tirar dúvidas e receber orientações diretas, e depois visitar o Blog IA Tio Ben e a página de Liturgia Diária para se aprofundar.",
        "Dessa forma, você une a inteligência artificial à vivência da fé católica — estudando, meditando e rezando com a Liturgia do Dia. ❤️",
      ],
    },
  ];

  return (
    <section
      className="max-w-6xl mx-auto px-4 py-12"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center text-amber-900 mb-10">
        Perguntas Frequentes sobre o Tio Ben, o Blog e a Liturgia Diária 🙋‍♂️
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {blocos.map((bloco, index) => (
          <div key={index} itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <Card className="border border-amber-300 bg-amber-50 shadow-lg hover:shadow-xl transition rounded-2xl">
              <CardContent className="p-6">
                <h3
                  className="text-xl font-semibold text-amber-800 mb-3"
                  itemProp="name"
                >
                  {bloco.titulo}
                </h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  {bloco.texto.map((par, i) => (
                    <p
                      key={i}
                      className="text-amber-900 mb-3 leading-relaxed"
                      itemProp="text"
                    >
                      {par}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {(index + 1) % 2 === 0 && <TestBanner />}
          </div>
        ))}
      </div>
    </section>
  );
}
